import React, { useMemo } from 'react';

export default function Button({
  className,
  classNameText,
  children,
  variant='primary',
  outline,
  primary,
  secondary,
  dark,
  light,
  icon,
  withoutLineClamp,
  ...props
}: any) {
  const background = useMemo(() => {
    if (props.disabled) {
      return 'opacity-50 cursor-not-allowed bg-gray-400 shadow-none hover:shadow-none';
    } else {
      if (variant === 'dark') {
        return outline
          ? 'bg-white text-neutral-800 rounded-lg border-2 border-neutral-800 hover:opacity-70'
          : 'bg-neutral-800 text-white rounded-lg border-2 border-neutral-800 hover:opacity-70';
      }
   
      if (variant === 'primary') {
        return outline
          ? 'bg-transparent hover:bg-blue-700 focus:bg-blue-700 text-blue-700 hover:text-white focus:text-white border border-blue-700'
          : 'bg-blue-700 hover:bg-blue-800 focus:bg-blue-800  text-white';
      }
      if (variant == 'danger') {
        return outline
          ? 'bg-transparent hover:bg-red-500 focus:bg-red-500 text-red-500 hover:text-white focus:text-white border border-red-500'
          : 'bg-red-500 hover:bg-red-600 focus:bg-red-600  text-white';
      }

   
      return outline
        ? 'bg-transparent hover:bg-white focus:bg-gray-300 focus:text-white text-slate-700 border border-gray-300 hover:border-white'
        : 'bg-white hover:bg-blue-700 focus:bg-blue-700 text-blue-700 hover:text-white focus:text-white';
    }
  }, [variant, outline, props, primary, secondary]);

  return (
    <button
      className={`flex items-center justify-center px-3  text-sm font-bold leading-10 rounded-lg 
      align-center outline-none focus:ring-0
      hover:shadow-lg focus:shadow-lg active:shadow-lg transition duration-150
      ease-in-out ${background} ${className}`}
      {...props}
    >
      {icon}
      <p
        className={`${classNameText || ''} ${withoutLineClamp ? '' : 'line-clamp-1'}`}
      >
        {children}
      </p>
    </button>
  );
}
