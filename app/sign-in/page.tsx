import SignIn from '@/components/sign-in';
import { LayoutDashboard } from 'lucide-react';

export default function SignInPage() {
  return (
    <main className="min-h-screen grid lg:grid-cols-2 bg-white selection:bg-black selection:text-white">
      {/* Brand Side - Optimized for professional look */}
      <div className="hidden lg:flex flex-col justify-between p-12 bg-black text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500 rounded-full blur-[120px] -mr-48 -mt-48" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-[120px] -ml-48 -mb-48" />
        </div>

        <div className="relative z-10 flex items-center gap-2 group" />

        <div className="relative z-10 space-y-6 max-w-lg">
          <div className="flex items-center gap-2">
            <LayoutDashboard className="text-white" size={42} />
            <span className="text-4xl font-bold tracking-tight">Luma</span>
          </div>
          <p className="text-gray-400 text-lg leading-relaxed">
            Real-time insights and effortless check-ins designed for the next
            generation of learners.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-sm text-gray-500 font-medium">
          <span>ALX Hub Accra</span>
          <span className="w-1 h-1 bg-gray-700 rounded-full" />
          <span>ALX Luma v0.1</span>
        </div>
      </div>

      {/* Login Side */}
      <div className="flex items-center justify-center p-8 bg-gray-50/50 lg:bg-white">
        <div className="w-full max-w-[400px] space-y-8">
          <header className="space-y-3 text-center lg:text-left">
            <div className="lg:hidden inline-flex items-center gap-2 mb-6">
              <div className="p-2 bg-black rounded-lg">
                <LayoutDashboard className="size-5 text-white" />
              </div>
              <span className="text-xl font-bold">Luma</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 text-center">
              Welcome back
            </h1>
            <p className="text-gray-500 text-center">
              Join the future of hub management today.
            </p>
          </header>

          <article className="space-y-6">
            <SignIn />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-100" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-3 text-gray-400 font-semibold tracking-wider">
                  Secure access
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-gray-400 px-8 leading-relaxed">
              By continuing, you agree to our terms and privacy policy. Only
              authorized staff and students.
            </p>
          </article>
        </div>
      </div>
    </main>
  );
}
