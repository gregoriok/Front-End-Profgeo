import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { turmaService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { SkeletonTable } from '../components/SkeletonLoader';
import { Breadcrumb } from '../components/Breadcrumb';
import { Pagination } from '../components/Pagination';
import { useDebounce } from '../hooks/useDebounce';
import { Tooltip } from '../components/Tooltip';
import { BackButton } from '../components/BackButton';

export function GestaoTurmas() {
  const [turmas, setTurmas] = useState([]);
  const { user } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [termoBusca, setTermoBusca] = useState(() => {
    return localStorage.getItem('gestaoTurmas_busca') || '';
  });
  const [filtroTurno, setFiltroTurno] = useState(() => {
    return localStorage.getItem('gestaoTurmas_turno') || '';
  });

  const debouncedBusca = useDebounce(termoBusca, 300);

  const isSuperUser = user?.is_admin || user?.is_coordenador_nacional;
  const isCoordenadorLocal = user?.is_coordenador;
  const isProfessor = user?.is_professor;

  useEffect(() => {
    localStorage.setItem('gestaoTurmas_busca', termoBusca);
    localStorage.setItem('gestaoTurmas_turno', filtroTurno);
    setCurrentPage(1);
  }, [termoBusca, filtroTurno]);

  useEffect(() => {
    async function carregarTurmas() {
      try {
        let dados = [];
        if (isSuperUser) {
          dados = await turmaService.getAll();
        } else if (isCoordenadorLocal && user?.id_unidade) {
          dados = await turmaService.getByUnidade(user.id_unidade);
        } else if (isProfessor) {
          dados = await turmaService.getByProfessor();
        }
        setTurmas(Array.isArray(dados) ? dados : []);
      } catch (error) {
        console.error("Erro:", error);
        addToast("Erro ao carregar turmas. Tente novamente.", 'error');
      } finally {
        setLoading(false);
      }
    }
    if (user) carregarTurmas();
  }, [user, isSuperUser, isCoordenadorLocal, isProfessor]);

  const turmasFiltradas = useMemo(() => {
    return turmas.filter((turma) => {
      const textoDigitado = debouncedBusca.toLowerCase();
      const nomeTurma = turma.nome?.toLowerCase() || "";
      const nomeEscola = turma.escola?.toLowerCase() || "";
      const nomeProf = turma.professor?.toLowerCase() || "";

      const correspondeTexto =
        nomeTurma.includes(textoDigitado) ||
        nomeEscola.includes(textoDigitado) ||
        nomeProf.includes(textoDigitado);

      const correspondeTurno = filtroTurno ? turma.turno === filtroTurno : true;
      return correspondeTexto && correspondeTurno;
    });
  }, [turmas, debouncedBusca, filtroTurno]);

  const totalPages = Math.ceil(turmasFiltradas.length / itemsPerPage);
  const turmasPaginadas = turmasFiltradas.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    // FIX VISUAL: 'flex justify-center' na raiz ajuda a centralizar em telas ultra-wide
    <div className="min-h-screen bg-profgeo-50 p-6 md:p-10 flex justify-center items-start">

      {/* FIX VISUAL: 'w-full max-w-7xl' garante que use a tela toda mas não exploda */}
      <div className="w-full max-w-7xl">
        <Breadcrumb />
        
        {/* Cabeçalho */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
             <div className="mb-2 w-fit">
               <BackButton to="/dashboard" />
             </div>
             <h2 className="text-3xl font-bold text-profgeo-900">Gestão de Turmas</h2>
             <p className="text-gray-500">
               {isSuperUser ? "Visão Geral do Sistema (Todas as Turmas)" : isCoordenadorLocal ? "Turmas vinculadas aos pesquisadores da sua Unidade." : "Turmas vinculadas aos seus alunos."}
             </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white p-5 rounded-xl shadow-sm border border-profgeo-100 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <label className="block text-xs font-bold text-gray-500 uppercase">Buscar</label>
              <Tooltip text="Pesquise por nome da turma, escola ou professor">
                <span className="text-gray-400 cursor-help">❓</span>
              </Tooltip>
            </div>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Pesquise por turma, escola ou responsável..."
                className="w-full pl-10 p-2.5 border rounded-lg focus:ring-2 focus:ring-profgeo-400 outline-none text-gray-900 bg-white"
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
              />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <label className="block text-xs font-bold text-gray-500 uppercase">Turno</label>
              <Tooltip text="Filtre as turmas por período">
                <span className="text-gray-400 cursor-help">❓</span>
              </Tooltip>
            </div>
            <select
              className="w-full p-2.5 border rounded-lg focus:ring-2 focus:ring-profgeo-400 bg-white text-gray-900"
              value={filtroTurno}
              onChange={(e) => setFiltroTurno(e.target.value)}
            >
              <option value="">Todos</option>
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Noturno">Noturno</option>
              <option value="Integral">Integral</option>
            </select>
          </div>
        </div>

        {/* Tabela */}
        {loading ? (
          <SkeletonTable rows={5} cols={5} />
        ) : (
          <div className="bg-white rounded-xl shadow overflow-hidden border border-profgeo-100 w-full">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-profgeo-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turma / Escola</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Responsável</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Turno</th>
                    <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Alunos</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {turmasPaginadas.length > 0 ? (
                    turmasPaginadas.map((turma) => (
                      <tr key={turma.id_turma || turma.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">{turma.nome}</div>
                          <div className="text-xs text-gray-500 bg-profgeo-50 px-2 py-0.5 rounded border inline-block mt-1">
                            {turma.escola || "Escola não inf."}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                           <div className="flex items-center gap-2">
                              <div className="bg-profgeo-100 text-profgeo-700 h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">
                                {turma.professor ? turma.professor[0] : "?"}
                              </div>
                              <span className="text-sm text-gray-700">{turma.professor}</span>
                           </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <span className="px-2 py-1 rounded-full bg-profgeo-50 text-gray-700 text-xs font-semibold border border-profgeo-100">
                                {turma.turno}
                            </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-center font-bold text-gray-600">
                          {turma.n_alunos}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                          {turma.id_colaborador === user?.id_usuario ? (
                            <Link to={`/turma/editar/${turma.id_turma || turma.id}`} className="text-profgeo-600 hover:text-profgeo-900 font-medium bg-profgeo-50 px-3 py-1 rounded">
                              Editar
                            </Link>
                          ) : (
                            <span className="text-gray-500 cursor-not-allowed opacity-50 px-3 py-1 rounded">
                              Apenas visualização
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                        Nenhuma turma encontrada.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {turmasFiltradas.length > itemsPerPage && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                itemsPerPage={itemsPerPage}
                totalItems={turmasFiltradas.length}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}