import { Link, useLocation } from 'react-router-dom';

const breadcrumbMap = {
  '/dashboard': { label: 'Home', icon: '🏠' },
  '/perfil': { label: 'Meu Perfil', icon: '👤' },
  '/turmas': { label: 'Minhas Escolas', icon: '📚' },
  '/turmas/nova': { label: 'Nova Turma', icon: '➕' },
  '/turmas/gestao': { label: 'Gestão de Turmas', icon: '📋' },
  '/unidades': { label: 'Instituições Associadas', icon: '🏫' },
  '/unidades/nova': { label: 'Nova Instituição Associada', icon: '➕' },
  '/coordenacao': { label: 'Coordenação', icon: '👨‍💼' },
};

export function Breadcrumb() {
  const location = useLocation();
  const paths = location.pathname.split('/').filter(Boolean);

  if (paths.length === 0 || location.pathname === '/') return null;

  return (
    <nav className="flex items-center gap-2 text-sm mb-6 bg-white p-3 rounded-lg border border-profgeo-100">
      <Link to="/dashboard" className="flex items-center gap-1 text-profgeo-600 hover:text-profgeo-900">
        <span>🏠</span>
        <span>Home</span>
      </Link>

      {paths.map((path, idx) => {
        const fullPath = '/' + paths.slice(0, idx + 1).join('/');
        const breadcrumb = breadcrumbMap[fullPath];

        if (!breadcrumb) return null;

        const isLast = idx === paths.length - 1;

        return (
          <div key={fullPath} className="flex items-center gap-2">
            <span className="text-gray-400">/</span>
            {isLast ? (
              <span className="flex items-center gap-1 text-gray-600">
                <span>{breadcrumb.icon}</span>
                <span>{breadcrumb.label}</span>
              </span>
            ) : (
              <Link to={fullPath} className="flex items-center gap-1 text-profgeo-600 hover:text-profgeo-900">
                <span>{breadcrumb.icon}</span>
                <span>{breadcrumb.label}</span>
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
