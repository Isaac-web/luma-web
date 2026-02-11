'use client';

import { useQueryClient } from '@tanstack/react-query';
import { useRealtime } from './realtime-provider';
import { checkinsQueryOptions } from '@/lib/queries/checkins.query';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const RealTimeEventsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { socket } = useRealtime();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!socket) return;

    const handleCheckinCreated = async () => {
      toast.success('New Activity', {
        description: 'A new check-in was recorded.',
        position: 'top-center',
        style: {
          background: 'var(--background)',
          color: 'var(--foreground)',
        },
      });
      await queryClient.invalidateQueries(checkinsQueryOptions());
    };

    socket.on('checkin:signed', handleCheckinCreated);

    return () => {
      socket.off('checkin:signed', handleCheckinCreated);
    };
  }, [socket]);

  return <>{children}</>;
};
