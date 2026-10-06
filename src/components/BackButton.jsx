import { Link } from 'react-router-dom';

export function BackButton({ to = '/dashboard', label = 'Voltar para Home' }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-profgeo-50 border border-profgeo-200 text-profgeo-600 hover:bg-profgeo-100 hover:border-profgeo-400 hover:shadow-md transition-all duration-200 font-medium group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 group-hover:-translate-x-1 transition-transform"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M10 19l-7-7m0 0l7-7m-7 7h18"
        />
      </svg>
      <span>{label}</span>
    </Link>
  );
}
