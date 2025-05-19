/**
 * v0 by Vercel.
 * @see https://v0.dev/t/ZJriTX4W8Hg
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
// import Link from 'next/link';
import { Link, NavLink } from 'react-router-dom';

export default function LoginPage() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-md space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Welcome back!</h1>
          <p className="mt-2 text-muted-foreground">Sign in to your account to continue.</p>
        </div>
        <form className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="name@example.com" required />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required />
          </div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          <Link to="#" className="font-medium hover:underline" prefetch={false}>
            Don't have an account? Sign up
          </Link>{' '}
          <span className="mx-2">&middot;</span>{' '}
          <Link to="#" className="font-medium hover:underline" prefetch={false}>
            Forgot password?
          </Link>
        </div>
      </div>
    </div>
  );
}
