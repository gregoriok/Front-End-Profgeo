import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="w-full bg-white border-b border-profgeo-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src="/Logo.PNG" alt="ObservaPROFGEO" className="h-10" />
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="bg-profgeo-600 hover:bg-profgeo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm"
            >
              Entrar
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="flex-1 flex items-center">
        <div className="max-w-7xl mx-auto px-6 py-16 md:py-24 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-profgeo-900 leading-tight mb-6">
              Observatorio <span className="text-profgeo-400">PROFGEO</span>
            </h1>
            <p className="text-lg text-gray-600 mb-4 leading-relaxed">
              Plataforma de gestao e monitoramento do Programa de Pos-Graduacao em Geografia
              em Rede Nacional - PROFGEO. Acompanhe turmas, unidades associadas e visualize
              dados georreferenciados das escolas participantes do programa.
            </p>
            <p className="text-gray-500 mb-8 leading-relaxed">
              O sistema integra informacoes academicas com ferramentas de geoprocessamento,
              permitindo a visualizacao espacial das instituicoes e o acompanhamento das
              atividades do programa em todo o territorio nacional.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => navigate('/login')}
                className="bg-profgeo-600 hover:bg-profgeo-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors shadow-md text-lg"
              >
                Acessar o Sistema
              </button>
              <button
                onClick={() => navigate('/observatorio')}
                className="border-2 border-profgeo-400 text-profgeo-600 hover:bg-profgeo-50 px-8 py-3 rounded-lg font-semibold transition-colors text-lg"
              >
                Ver Observatorio
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <img src="/Logo.PNG" alt="Logo ObservaPROFGEO" className="w-72 md:w-96 drop-shadow-lg" />
          </div>
        </div>
      </section>

      {/* Info Cards */}
      <section className="bg-profgeo-50 border-t border-profgeo-100">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-bold text-profgeo-900 text-center mb-10">
            Funcionalidades do Sistema
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-profgeo-100">
              <div className="bg-profgeo-100 text-profgeo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-profgeo-900 mb-2">Gestao de Turmas</h3>
              <p className="text-gray-500 text-sm">Cadastre, edite e acompanhe turmas do programa com informacoes detalhadas sobre alunos e professores.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-profgeo-100">
              <div className="bg-profgeo-100 text-profgeo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-profgeo-900 mb-2">Unidades Associadas</h3>
              <p className="text-gray-500 text-sm">Gerencie as unidades e polos vinculados ao PROFGEO em todo o Brasil.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-profgeo-100">
              <div className="bg-profgeo-100 text-profgeo-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-profgeo-900 mb-2">Observatorio Geografico</h3>
              <p className="text-gray-500 text-sm">Mapa interativo com dados georreferenciados das escolas participantes via GeoServer.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-profgeo-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-profgeo-300 text-sm">
            Observatorio PROFGEO - Programa de Pos-Graduacao em Geografia em Rede Nacional
          </p>
          <p className="text-profgeo-400 text-xs mt-2">
            Sistema desenvolvido para gestao e monitoramento do programa PROFGEO
          </p>
        </div>
      </footer>
    </div>
  );
}
