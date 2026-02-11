import { signIn } from '@/auth';
import { Button } from './ui/button';
import Image from 'next/image';
import googleIcon from '@/public/assets/images/google.png';

export default function SignIn() {
  return (
    <form
      action={async () => {
        'use server';
        await signIn('google');
      }}
      className="w-full"
    >
      <Button
        type="submit"
        className="w-full h-12 rounded-full bg-black hover:bg-black/90 text-white font-medium flex items-center justify-center gap-3 transition-all active:scale-[0.98]"
      >
        <div className="p-1 rounded-full flex items-center justify-center">
          <Image
            src={googleIcon}
            alt="Google"
            width={18}
            height={18}
            className="shrink-0"
          />
        </div>
        <span>Continue with Google</span>
      </Button>
    </form>
  );
}
