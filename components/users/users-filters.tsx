'use client';

import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';

export function UsersFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [name, setName] = useState(searchParams.get('name') || '');

  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      if (name) {
        params.set('name', name);
      } else {
        params.delete('name');
      }
      router.push(`${pathname}?${params.toString()}`);
    }, 500);
    return () => clearTimeout(timer);
  }, [name, router, pathname, searchParams]);

  const clearFilters = () => {
    setName('');
    router.push(pathname);
  };

  return (
    <div className="flex items-center gap-4 mb-6">
      <div className="relative w-full max-w-sm">
        <Input
          placeholder="Search users by name..."
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="h-10 pr-10"
        />
        {name && (
          <button
            onClick={clearFilters}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
}
