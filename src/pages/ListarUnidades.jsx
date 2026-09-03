import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { unidadeService } from '../api/services';

export function ListarUnidades() {
  const [unidades, setUnidades] = useState([]);
  const { user } = useAuth();
  const [expandedId, setExpandedId] = useState(null);
  const [detalhes, setDetalhes] = useState({});
  const [loadingDetalhes, setLoadingDetalhes] = useState(null);

  const isSuperUser = user?.is_admin || user?.is_coordenador_nacional;

  useEffect(() => {
    unidadeService.getAll().then(setUnidades).catch(console.error);
  }, []);

  const toggleDetalhes = async (idUnidade) => {
    if (expandedId === idUnidade) {
      setExpandedId(null);
      return;
    }
    setExpandedId(idUnidade);
    if (!detalhes[idUnidade]) {
      setLoadingDetalhes(idUnidade);
      try {
        const data = await unidadeService.getDetalhes(idUnidade);
        setDetalhes((prev) => ({ ...prev, [idUnidade]: data }));
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingDetalhes(null);
      }
    }
  };

  return (
    <div className="min-h-screen bg-profgeo-50 p-10">
      <div className="max-w-7xl mx-auto mb-4">
        <Link to="/dashboard" className="text-gray-500 hover:text-profgeo-600 flex items-center gap-1 font-medium transition-colors">
          ← Voltar para Home
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold text-profgeo-900">Unidades Associadas</h2>
          <p className="text-gray-500 text-sm mt-1">Gerenciamento de polos e unidades</p>
        </div>
        {isSuperUser && (
          <div className="flex gap-3">
            <Link
              to="/coordenacao/nova"
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-colors flex items-center gap-2"
            >
              Vincular Coord.
            </Link>
            <Link
              to="/unidades/nova"
              className="bg-profgeo-600 hover:bg-profgeo-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-colors flex items-center gap-2"
            >
              + Nova Unidade
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {unidades.map((uni) => (
          <div
            key={uni.id_unidade}
            className={`bg-white rounded-xl shadow-sm border cursor-pointer transition-all ${expandedId === uni.id_unidade ? 'border-profgeo-400 shadow-md' : 'border-profgeo-100 hover:shadow-md'}`}
            onClick={() => toggleDetalhes(uni.id_unidade)}
          >
            <div className="p-6">
              <h3 className="font-bold text-profgeo-900">{uni.nome_unidade}</h3>
              <p className="text-sm text-gray-500 mt-1">{uni.municipio}/{uni.estado}</p>
              <p className="text-xs text-profgeo-500 mt-2">
                {expandedId === uni.id_unidade ? 'Clique para recolher' : 'Clique para ver detalhes'}
              </p>
            </div>

            {expandedId === uni.id_unidade && (
              <div className="border-t border-gray-100 p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
                {loadingDetalhes === uni.id_unidade ? (
                  <p className="text-sm text-gray-500">Carregando...</p>
                ) : detalhes[uni.id_unidade] ? (
                  <>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Coordenadores</h4>
                      {detalhes[uni.id_unidade].coordenadores.length > 0 ? (
                        <ul className="space-y-1">
                          {detalhes[uni.id_unidade].coordenadores.map((c, i) => (
                            <li key={i} className="text-sm text-gray-700 flex items-center gap-2">
                              <span className="bg-purple-100 text-purple-700 text-xs px-2 py-0.5 rounded font-medium">{c.tipo || 'Coordenador'}</span>
                              {c.nome}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-400">Nenhum coordenador ativo</p>
                      )}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Professores ({detalhes[uni.id_unidade].professores.length})</h4>
                      {detalhes[uni.id_unidade].professores.length > 0 ? (
                        <ul className="space-y-1 max-h-40 overflow-y-auto">
                          {detalhes[uni.id_unidade].professores.map((p, i) => (
                            <li key={i} className="text-sm text-gray-700 flex justify-between">
                              <span>{p.nome}</span>
                              {p.area_atuacao && <span className="text-xs text-gray-400">{p.area_atuacao}</span>}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-400">Nenhum professor vinculado</p>
                      )}
                    </div>
                  </>
                ) : null}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
