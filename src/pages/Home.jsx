import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export function Home() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isGestor = user?.is_admin || user?.is_coordenador_nacional || user?.is_coordenador;
  const canSeeTurmas = user?.is_professor || user?.is_aluno;
  const canSeeGestao = !user?.is_aluno; // todos menos aluno
  const canSeeUnidades = isGestor;

  return (
    <div className="min-h-screen bg-profgeo-50 p-6 md:p-10 flex justify-center items-start">
      <div className="w-full max-w-7xl">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-xl shadow-sm border border-profgeo-100 gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <img src="/Logo.PNG" alt="ObservaPROFGEO" className="h-12 hidden md:block" />
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold text-profgeo-900">
                Ola, {user?.nome || "Visitante"}!
              </h1>
              <p className="text-gray-500 text-sm mt-1">
                Bem-vindo ao Sistema ProfGeo. Selecione uma opcao abaixo.
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="text-red-600 hover:text-red-800 font-medium text-sm border border-red-200 hover:bg-red-50 px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sair do Sistema
          </button>
        </div>

        {/* Grid de menus */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          <div
            onClick={() => navigate('/perfil')}
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md border border-profgeo-100 cursor-pointer transition-all hover:-translate-y-1 group flex flex-col items-start h-full"
          >
            <div className="bg-profgeo-100 text-profgeo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-profgeo-600 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-profgeo-900 mb-2">Meu Perfil</h2>
            <p className="text-gray-500 text-sm">Visualize seus dados e permissoes cadastrados no sistema.</p>
          </div>

          {canSeeTurmas && (
            <div
              onClick={() => navigate('/turmas')}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md border border-profgeo-100 cursor-pointer transition-all hover:-translate-y-1 group flex flex-col items-start h-full"
            >
              <div className="bg-profgeo-100 text-profgeo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-profgeo-600 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-profgeo-900 mb-2">Minhas Turmas</h2>
              <p className="text-gray-500 text-sm">Acesse as turmas onde voce esta matriculado ou leciona.</p>
            </div>
          )}

          {canSeeUnidades && (
            <div
              onClick={() => navigate('/unidades')}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md border border-profgeo-100 cursor-pointer transition-all hover:-translate-y-1 group flex flex-col items-start h-full"
            >
              <div className="bg-profgeo-100 text-profgeo-400 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-profgeo-400 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-profgeo-900 mb-2">Unidades Associadas</h2>
              <p className="text-gray-500 text-sm">Visualize as unidades e polos cadastrados no sistema.</p>
            </div>
          )}

          <div
            onClick={() => navigate('/observatorio')}
            className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md border border-profgeo-100 cursor-pointer transition-all hover:-translate-y-1 group flex flex-col items-start h-full"
          >
            <div className="bg-profgeo-100 text-profgeo-400 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-profgeo-400 group-hover:text-white transition-colors">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-profgeo-900 mb-2">Observatorio</h2>
            <p className="text-gray-500 text-sm">Mapa interativo com as escolas do programa ProfGeo.</p>
          </div>

          {canSeeGestao && (
            <div
              onClick={() => navigate('/turmas/gestao')}
              className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md border border-profgeo-200 cursor-pointer transition-all hover:-translate-y-1 group relative overflow-hidden flex flex-col items-start h-full"
            >
              {isGestor && (
                <div className="absolute top-0 right-0 bg-profgeo-900 text-white text-[10px] px-2 py-1 rounded-bl-lg uppercase font-bold tracking-wider">
                  Area Gestor
                </div>
              )}
              <div className="bg-profgeo-100 text-profgeo-900 w-12 h-12 rounded-lg flex items-center justify-center mb-4 group-hover:bg-profgeo-900 group-hover:text-white transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold text-profgeo-900 mb-2">Gestao de Turmas</h2>
              <p className="text-gray-500 text-sm">
                {user?.is_professor && !isGestor ? "Turmas vinculadas aos seus alunos." : "Painel para visualizar turmas da unidade."}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
