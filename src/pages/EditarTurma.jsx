import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { turmaService } from '../api/services';

export function EditarTurma() {
  const { id } = useParams(); // Pega o ID que veio na URL
  const navigate = useNavigate();
  
  // O 'reset' é a função mágica que preenche o form quando os dados chegam
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  
  const [loading, setLoading] = useState(true);

  // 1. BUSCAR DADOS AO ABRIR A TELA
  useEffect(() => {
    async function carregarDados() {
      try {
        // Chama o endpoint GET /api/turma/{id}
        const dadosTurma = await turmaService.getById(id);
        
        // Preenche o formulário automaticamente. 
        // Importante: Os nomes dos campos no JSON do backend devem bater com os do register()
        reset(dadosTurma); 
        
      } catch (error) {
        console.error("Erro ao carregar turma:", error);
        alert("Erro ao buscar dados da turma.");
        navigate('/turmas'); // Volta se der erro
      } finally {
        setLoading(false);
      }
    }
    
    if (id) {
      carregarDados();
    }
  }, [id, reset, navigate]);

  // 2. ENVIAR ATUALIZAÇÃO
  const onSubmit = async (dados) => {
    try {
      // Conversão de tipos para garantir que números vão como números
      const payload = {
        ...dados,
        n_alunos: Number(dados.n_alunos),
        ano_letivo: Number(dados.ano_letivo)
      };

      await turmaService.update(id, payload);
      alert("Turma atualizada com sucesso!");
      navigate('/turmas'); 
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("ERRO: Você não tem permissão para editar esta turma.");
      } else {
        alert("Erro ao salvar alterações.");
      }
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Carregando dados da turma...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-lg border border-gray-200">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Editar Turma</h2>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Turma</label>
            <input 
              {...register("nome", { required: true, minLength: 2 })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Turno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
            <select {...register("turno")} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500">
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Noturno">Noturno</option>
              <option value="Integral">Integral</option>
            </select>
          </div>

          {/* Nº Alunos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nº Alunos</label>
            <input 
              type="number" 
              {...register("n_alunos", { required: true })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Ano Letivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ano Letivo</label>
            <input 
              type="number" 
              {...register("ano_letivo", { required: true })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button 
              type="button"
              onClick={() => navigate('/turmas')}
              className="w-1/3 bg-gray-200 text-gray-700 font-medium py-2 rounded hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="w-2/3 bg-blue-600 text-white font-bold py-2 rounded hover:bg-blue-700 transition shadow"
            >
              Salvar Alterações
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}