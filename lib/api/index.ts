import axios from 'axios';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    let session;
    if (typeof window !== 'undefined') {
      // Client-side execution
      const { getSession } = await import('next-auth/react');
      session = await getSession();
    } else {
      // Server-side execution
      const { auth } = await import('@/auth');
      session = await auth();
    }

    const accessToken = session?.accessToken;

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
