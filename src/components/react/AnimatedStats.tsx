import { useRef } from 'react';
import { motion, useInView } from 'motion/react';

interface Stat {
  value: string;
  label: string;
  suffix?: string;
}

const stats: Stat[] = [
  { value: '500', label: 'Global Clients', suffix: '+' },
  { value: '50', label: 'Million Units Shipped', suffix: 'M+' },
  { value: '99.9', label: 'On-Time Delivery', suffix: '%' },
  { value: '15', label: 'Facilities Worldwide', suffix: '+' },
];

export default function AnimatedStats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <div ref={ref} className="grid grid-cols-2 lg:grid-cols-4 gap-8">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={isInView ? { scale: 1 } : { scale: 1 }}
            transition={{ duration: 0.5, delay: index * 0.1 + 0.2, type: 'spring' }}
            className="text-4xl lg:text-5xl font-bold text-white mb-2"
          >
            {stat.value}{stat.suffix}
          </motion.div>
          <div className="text-sm text-slate-300 font-medium">{stat.label}</div>
        </motion.div>
      ))}
    </div>
  );
}

