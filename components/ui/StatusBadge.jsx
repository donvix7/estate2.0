import React from 'react';

const TONES = {
  green: 'bg-emerald-500/10 text-emerald-600 text-emerald-400 border-none',
  amber: 'bg-amber-500/10 text-amber-600 text-amber-400 border-none',
  red: 'bg-rose-500/10 text-rose-600 text-rose-400 border-none',
  blue: 'bg-blue-500/10 text-blue-600 text-blue-400 border-none',
  slate: 'bg-[#2a2d33]/10 text-white0 border-none',
  purple: 'bg-purple-500/10 text-purple-600 text-purple-400 border-none',
  orange: 'bg-orange-500/10 text-orange-600 text-orange-400 border-none',
};


const STATUS_MAP = {
  active: 'green',
  verified: 'green',
  completed: 'green',
  resolved: 'green',
  paid: 'green',
  success: 'green',
  online: 'green',
  clear: 'green',
  open: 'blue',
  pending: 'amber',
  scheduled: 'blue',
  expired: 'slate',
  inactive: 'slate',
  blacklisted: 'red',
  banned: 'red',
  high: 'red',
  urgent: 'red',
  medium: 'amber',
  low: 'green',
  failed: 'red',
  rejected: 'red',
  cancelled: 'slate',
};

export function StatusBadge({ status = '', tone, className = '', dot = false }) {
  const key = String(status || '').toLowerCase();
  const resolvedTone = tone || STATUS_MAP[key] || 'slate';
  const toneClass = TONES[resolvedTone] || TONES.slate;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${toneClass} ${className}`}
    >
      {dot && <span className={`size-1.5 rounded-full ${dot === true ? 'bg-current' : ''}`} />}
      {status}
    </span>
  );
}
