import { useState } from 'react';

export function Tooltip({ text, children, position = 'top' }) {
  const [show, setShow] = useState(false);

  const positionClasses = {
    top: 'bottom-full mb-2 left-1/2 -translate-x-1/2',
    right: 'left-full ml-2 top-1/2 -translate-y-1/2',
    bottom: 'top-full mt-2 left-1/2 -translate-x-1/2',
    left: 'right-full mr-2 top-1/2 -translate-y-1/2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-profgeo-900',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-profgeo-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-profgeo-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-profgeo-900',
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}

      {show && (
        <div className={`absolute ${positionClasses[position]} z-50 whitespace-nowrap bg-profgeo-900 text-white text-xs py-2 px-3 rounded-lg animate-in fade-in`}>
          {text}
          <div className={`absolute w-2 h-2 bg-profgeo-900 ${arrowClasses[position]}`}></div>
        </div>
      )}
    </div>
  );
}
