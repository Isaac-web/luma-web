import { useEffect, useState } from 'react';
import { useRealtime } from './providers/realtime-provider';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Scan, CheckCircle2, XCircle } from 'lucide-react';

export const LiveCheckInStatus = () => {
  const { socket } = useRealtime();
  const [status, setStatus] = useState<
    'idle' | 'scanning' | 'confirmed' | 'cancelled'
  >('idle');

  useEffect(() => {
    if (!socket) return;

    socket.on('checkin:code-scanned', () => setStatus('scanning'));
    socket.on('checkin:confirmed', () => {
      setStatus('confirmed');
      setTimeout(() => setStatus('idle'), 3000);
    });
    socket.on('checkin:cancelled', () => {
      setStatus('cancelled');
      setTimeout(() => setStatus('idle'), 3000);
    });

    return () => {
      socket.off('checkin:code-scanned');
      socket.off('checkin:confirmed');
      socket.off('checkin:cancelled');
    };
  }, [socket]);

  const configs = {
    idle: {
      label: 'QR Code Activity',
      icon: Activity,
      color: 'text-gray-500',
      bg: 'bg-gray-50',
      border: 'border-gray-100',
      animate: {},
    },
    scanning: {
      label: 'Scanning...',
      icon: Scan,
      color: 'text-amber-500',
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      animate: { scale: [1, 1.05, 1], opacity: [1, 0.7, 1] },
    },
    confirmed: {
      label: 'Check-in Confirmed',
      icon: CheckCircle2,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50',
      border: 'border-emerald-100',
      animate: {},
    },
    cancelled: {
      label: 'Action Cancelled',
      icon: XCircle,
      color: 'text-red-500',
      bg: 'bg-red-50',
      border: 'border-red-100',
      animate: {},
    },
  };

  const config = configs[status];

  return (
    <div className="flex items-center">
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border shadow-sm transition-all duration-300 ${config.bg} ${config.border}`}
        >
          <motion.div
            animate={config.animate}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className={config.color}
          >
            <config.icon className="size-3.5" />
          </motion.div>
          <span
            className={`text-[11px] font-bold tracking-tight uppercase ${config.color}`}
          >
            {config.label}
          </span>
          {status !== 'idle' && (
            <motion.div
              layoutId="pulse"
              className={`size-1.5 rounded-full ${config.color.replace('text', 'bg')} animate-pulse`}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
