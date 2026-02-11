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
      toast.success('Checkin created successfully');
      await queryClient.invalidateQueries(checkinsQueryOptions());
    };

    const handleCodeScanned = async () => {
      console.log('Code was scanned.');
    };

    const handleCheckinCancelled = async () => {
      console.log('Checkin was cancelled.');
    };

    const handleCheckinConfirmed = async () => {
      console.log('Checkin was confirmed.');
    };

    socket.on('checkin:signed', handleCheckinCreated);
    socket.on('checkin:code-scanned', handleCodeScanned);
    socket.on('checkin:confirmed', handleCheckinConfirmed);
    socket.on('checkin:cancelled', handleCheckinCancelled);

    return () => {
      socket.off('checkin:signed', handleCheckinCreated);
      socket.off('checkin:code-scanned', handleCodeScanned);
      socket.off('checkin:confirmed', handleCheckinConfirmed);
      socket.off('checkin:cancelled', handleCheckinCancelled);
    };
  }, [socket]);

  return <>{children}</>;
};
