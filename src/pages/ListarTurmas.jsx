import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // <--- Import Link
import { turmaService } from '../api/services';
import { useAuth } from '../context/AuthContext';

export function ListarTurmas() {
  const [turmas, setTurmas] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    turmaService.getByAluno()
      .then(dados => setTurmas(Array.isArray(dados) ? dados : []))
      .catch(console.error);
  }, [user]);

  return (
    <div className="min-h-screen bg-profgeo-50 p-10">

      {/* Botão de Voltar */}
      <div className="max-w-6xl mx-auto mb-4">
        <Link to="/dashboard" className="text-gray-500 hover:text-profgeo-600 flex items-center gap-1 font-medium transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Voltar para Home
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8 max-w-6xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold text-profgeo-900">Minhas Turmas</h2>
          <p className="text-gray-500 mt-1">Turmas onde você está matriculado</p>
        </div>
        <Link 
          to="/turmas/nova"
          className="bg-profgeo-600 hover:bg-profgeo-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition"
        >
          + Nova Turma
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {turmas.length > 0 ? (
          turmas.map((turma) => (
            <div key={turma.id_turma || turma.id} className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 border border-profgeo-100">
               {/* ... (CONTEÚDO DO CARD IGUAL AO ANTERIOR) ... */}
                <h3 className="text-xl font-bold text-profgeo-900 mb-2">{turma.nome}</h3>
                <div className="text-sm text-gray-600 space-y-1">
                   <p>Turno: {turma.turno}</p>
                   <p>Alunos: {turma.n_alunos}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link to={`/turma/editar/${turma.id_turma || turma.id}`} className="text-profgeo-600 font-semibold">Gerenciar Turma →</Link>
                </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">Nenhuma turma encontrada.</div>
        )}
      </div>
    </div>
  );
}