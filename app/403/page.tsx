'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

export default function ForbiddenPage() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center bg-white p-4">
      <div className="flex flex-col items-center max-w-md text-center space-y-6">
        <div className="p-4 rounded-full bg-red-50 border border-red-100">
          <ShieldAlert className="h-12 w-12 text-red-600" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            Access Denied
          </h1>
          <p className="text-sm text-gray-600">
            Sorry, you don't have permission to access this page. This area is
            reserved for administrators only.
          </p>
        </div>
        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/checkins">Back To Home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
