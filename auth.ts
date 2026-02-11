import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
  ],
  pages: {
    signIn: '/sign-in',
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAdmin = auth?.user?.userType === 'admin';
      const isSignInPage = nextUrl.pathname === '/sign-in';
      const isDashboardPage =
        nextUrl.pathname.startsWith('/checkins') ||
        nextUrl.pathname.startsWith('/users');

      if (!isLoggedIn && !isSignInPage) {
        return false; // Redirect to sign-in page
      }

      if (isLoggedIn && isSignInPage) {
        return Response.redirect(new URL('/checkins', nextUrl));
      }

      // if (isLoggedIn && isDashboardPage && !isAdmin) {
      //   return Response.redirect(new URL('/403', nextUrl));
      // }

      return true;
    },
    async jwt({ token, account, user }) {
      if (account && user) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/sign-in/google`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken: account.id_token }),
            },
          );

          if (!response.ok) {
            throw new Error('Backend authentication failed');
          }

          const data = await response.json();

          // Fetch user details to get userType
          const meResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/me`,
            {
              headers: { Authorization: `Bearer ${data.accessToken}` },
            },
          );
          const meData = await meResponse.json();

          // Ensure we extract userType correctly (handles potential nesting in .data)
          const actualUser = meData.data || meData;

          return {
            ...token,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            userType: actualUser.userType,
            expiresAt: Math.floor(Date.now() / 1000) + (data.expiresIn || 3600),
          };
        } catch (error) {
          console.error('Error exchanging token:', error);
          return { ...token, error: 'TokenExchangeError' };
        }
      }

      // Token rotation: check if accessToken is expired
      if (Date.now() < (token.expiresAt as number) * 1000) {
        return token;
      }

      // Access token has expired, try to update it using the refreshToken
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/refresh`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: token.refreshToken }),
          },
        );

        if (!response.ok) {
          throw new Error('Failed to refresh token');
        }

        const data = await response.json();

        return {
          ...token,
          accessToken: data.accessToken,
          refreshToken: data.refreshToken ?? token.refreshToken, // Fallback to old refresh token if not provided
          expiresAt: Math.floor(Date.now() / 1000) + (data.expiresIn || 3600),
        };
      } catch (error) {
        console.error('Error refreshing token:', error);
        return { ...token, error: 'RefreshAccessTokenError' };
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      session.refreshToken = token.refreshToken as string;
      session.user.userType = token.userType as 'admin' | 'default';
      session.error = token.error as string | undefined;
      return session;
    },
  },
});
