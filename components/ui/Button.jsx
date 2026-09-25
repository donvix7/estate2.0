import React from 'react';

const VARIANTS = {
  primary: 'bg-[#1241a1] text-white hover:bg-[#1241a1]/90',
  secondary: 'border border-[#343740] bg-[#1a1d23] text-[#e4e5e8] hover:bg-[#242730]',
  ghost: 'text-[#a4a7af] hover:bg-[#1a1d23] hover:text-white',
  danger: 'bg-red-600 text-white hover:bg-red-700',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700',
  amber: 'bg-amber-600 hover:bg-amber-700 text-white',
  indigo: 'bg-indigo-600 hover:bg-indigo-700 text-white',
};

const SIZES = {
  sm: 'px-3 py-2 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-5 py-3 text-sm gap-2',
};

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  href,
  className = '',
  ...props
}) {
  const classes = [
    'inline-flex items-center justify-center rounded-xl font-semibold transition-colors active:scale-[0.98] cursor-pointer whitespace-nowrap',
    VARIANTS[variant] || VARIANTS.primary,
    SIZES[size] || SIZES.md,
    props.disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
    className,
  ].filter(Boolean).join(' ');

  const content = (
    <>
      {Icon && <Icon className="size-4" />}
      {children}
    </>
  );

  if (href) {
    return (
      <a href={href} className={classes}>
        {content}
      </a>
    );
  }

  return (
    <button className={classes} {...props}>
      {content}
    </button>
  );
}
