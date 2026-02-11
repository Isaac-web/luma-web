'use client';

import { checkinsQueryOptions } from '@/lib/queries/checkins.query';
import { formatDate, formatTime } from '@/lib/utils/date-utils';
import { User } from '@/types';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import React, { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { CheckInFilters } from './check-in-filters';
import { LiveCheckInStatus } from './live-checkin-status';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const CheckInTable: React.FC = () => {
  const searchParams = useSearchParams();

  const filters = {
    name: searchParams.get('name') || undefined,
    email: searchParams.get('email') || undefined,
    userId: searchParams.get('userId') || undefined,
    startDate: searchParams.get('startDate') || undefined,
    endDate: searchParams.get('endDate') || undefined,
  };

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(checkinsQueryOptions(filters));

  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allRecords = data.pages.flatMap((page) => page.data);

  const getStatus = (user: User) => {
    if (user.activeCourses > 0) {
      return {
        label: 'Active Learner',
        color: 'bg-emerald-50 text-emerald-700 border-emerald-100',
      };
    } else if (user.completedCourses > 0 && user.activeCourses === 0) {
      return {
        label: 'Alumni',
        color: 'bg-blue-50 text-blue-700 border-blue-100',
      };
    } else if (user.numberOfCourses === 0) {
      return {
        label: 'New Student',
        color: 'bg-orange-50 text-orange-700 border-orange-100',
      };
    }
    return {
      label: 'Inactive',
      color: 'bg-gray-50 text-gray-600 border-gray-100',
    };
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <CheckInFilters />
        <LiveCheckInStatus />
      </div>

      {allRecords.length === 0 ? (
        // ...
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-lg border border-gray-100 shadow-sm">
          <p className="text-gray-500 font-medium">No check-ins yet today</p>
        </div>
      ) : (
        <>
          <div className="w-full overflow-hidden bg-white rounded-xl border border-gray-100 shadow-sm relative">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Check-in Time
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Check-in Date
                    </th>
                    {/* <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Learning Status
                    </th> */}
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      Course Progress
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allRecords.map((record) => {
                    const status = getStatus(record.user);
                    return (
                      <tr
                        key={record._id}
                        className="hover:bg-gray-50/50 transition-colors group h-[64px]"
                      >
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-3">
                            <Avatar size="default">
                              <AvatarImage
                                src={
                                  record.user.avatarUrl ||
                                  `https://api.dicebear.com/7.x/avataaars/svg?seed=${record.user.email}`
                                }
                              />
                              <AvatarFallback className="font-bold bg-blue-100 text-blue-700 border border-blue-200 text-[12px]">
                                {getInitials(record.user.name)}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-bold text-gray-900 truncate">
                                {record.user.name}
                              </span>
                              <span className="text-[12px] text-gray-500 truncate max-w-[180px]">
                                {record.user.email}
                              </span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-sm text-gray-700 font-medium">
                            {formatTime(record.createdAt)}
                          </span>
                        </td>
                        <td className="px-6 py-3">
                          <span className="text-sm text-gray-600">
                            {formatDate(record.createdAt)}
                          </span>
                        </td>
                        {/* <td className="px-6 py-3">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </td> */}
                        <td className="px-6 py-3 text-right">
                          <span className="text-sm font-mono text-gray-700 font-medium">
                            {record.user.completedCourses} /{' '}
                            {record.user.numberOfCourses}
                          </span>
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
                <span className="text-sm font-medium">Loading more...</span>
              </div>
            ) : hasNextPage ? (
              <span className="text-sm">Scroll to load more</span>
            ) : (
              <span className="text-sm italic">End of scroll</span>
            )}
          </div>
        </>
      )}

      {/* Sentinel for infinite scroll */}
    </div>
  );
};

export default CheckInTable;
