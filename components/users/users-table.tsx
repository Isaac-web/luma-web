'use client';

import React, { useEffect } from 'react';
import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { Loader2, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { usersQueryOptions } from '@/lib/queries/users.query';
import { meQueryOptions } from '@/lib/queries/auth.query';
import { makeAdmin } from '@/lib/api/users.api';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const UsersTable: React.FC = () => {
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const name = searchParams.get('name') || undefined;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery(usersQueryOptions({ name }));

  const { data: me } = useQuery(meQueryOptions);

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const promoteMutation = useMutation({
    mutationFn: makeAdmin,
    onSuccess: () => {
      toast.success('User updated successfully');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      toast.error('Failed to update user');
    },
  });

  const allUsers = data?.pages.flatMap((page) => page.data) || [];
  const isAdmin = me?.userType === 'admin';

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-12">
        <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center p-12 bg-red-50 rounded-xl border border-red-100">
        <p className="text-red-600 font-medium">
          Failed to load users. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      <div className="w-full overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm relative">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allUsers.map((user) => {
                const isSelf = user._id === me?._id;
                const canManage = isAdmin && !isSelf;

                return (
                  <tr
                    key={user._id}
                    className="hover:bg-gray-50/50 transition-colors group h-[64px]"
                  >
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar size="default">
                          <AvatarImage
                            src={
                              user.avatarUrl ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`
                            }
                          />
                          <AvatarFallback>
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-gray-900 truncate">
                            {user.name}{' '}
                            {isSelf && (
                              <span className="text-[10px] text-blue-500">
                                (You)
                              </span>
                            )}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-sm text-gray-600 truncate max-w-[250px]">
                        {user.email}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${
                          user.userType === 'admin'
                            ? 'bg-purple-50 text-purple-700 border-purple-100'
                            : 'bg-gray-50 text-gray-600 border-gray-100'
                        }`}
                      >
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-right">
                      {canManage && (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 p-0"
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {user.userType !== 'admin' && (
                              <DropdownMenuItem
                                onClick={() => promoteMutation.mutate(user._id)}
                                className="flex items-center gap-2"
                              >
                                <ShieldCheck className="h-4 w-4" />
                                Make Admin
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem
                              disabled
                              className="text-gray-400"
                            >
                              No other actions
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div
        ref={ref}
        className="py-8 flex items-center justify-center text-gray-500"
      >
        {isFetchingNextPage ? (
          <div className="flex items-center gap-2 animate-pulse">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm font-medium">Loading more users...</span>
          </div>
        ) : hasNextPage ? (
          <span className="text-sm">Scroll to load more</span>
        ) : (
          <span className="text-sm italic">End of list</span>
        )}
      </div>
    </div>
  );
};

export default UsersTable;
