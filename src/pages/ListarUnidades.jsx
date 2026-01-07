import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // <--- Importe o Auth
import { unidadeService } from '../api/services';

export function ListarUnidades() {
  const [unidades, setUnidades] = useState([]);
  const { user } = useAuth(); // <--- Pegue o usuário

  // Função auxiliar para verificar permissão
  // Ajuste a lógica conforme o que seu backend retorna (ex: user.role === 'admin')
  const isSuperUser = user?.is_admin || user?.is_coordenador_nacional;
  useEffect(() => {
    unidadeService.getAll().then(setUnidades).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-10">
      
      {/* Botão Voltar */}
      <div className="max-w-7xl mx-auto mb-4">
        <Link to="/" className="text-gray-500 hover:text-blue-600 flex items-center gap-1 font-medium transition-colors">
          ← Voltar para Home
        </Link>
      </div>

      <div className="flex justify-between items-center mb-8 max-w-7xl mx-auto">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Unidades Associadas</h2>
          <p className="text-gray-500 text-sm mt-1">Gerenciamento de polos e unidades</p>
        </div>
        
        {/* REGRA DE NEGÓCIO 1: Só mostra o botão se tiver permissão */}
        {isSuperUser && (
          <div className="flex gap-3">
             {/* Botão Novo: Vincular Coordenador */}
             <Link 
              to="/coordenacao/nova" 
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              Vincular Coord.
            </Link>

            {/* Botão Existente: Nova Unidade */}
            <Link 
              to="/unidades/nova" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-medium shadow-md transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nova Unidade
            </Link>
          </div>
        )}
      </div>

      {/* Grid de Cards (Código existente...) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {unidades.map((uni, index) => (
           // ... (seu código dos cards continua igual)
           <div key={index} className="bg-white rounded-xl shadow p-6 h-64 flex flex-col items-center justify-center border border-gray-200">
              <h3 className="font-bold">{uni.nome_unidade}</h3>
              <p className="text-sm text-gray-500">{uni.municipio}/{uni.estado}</p>
           </div>
        ))}
      </div>
    </div>
  );
}