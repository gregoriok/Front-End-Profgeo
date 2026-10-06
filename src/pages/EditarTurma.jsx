import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { turmaService } from '../api/services';
import { useToast } from '../components/Toast';
import { ConfirmModal } from '../components/ConfirmModal';
import { BackButton } from '../components/BackButton';
import { NIVEIS_ENSINO, ETAPAS_POR_NIVEL } from '../utils/niveisEnsino';

export function EditarTurma() {
  const { id } = useParams(); // Pega o ID que veio na URL
  const navigate = useNavigate();
  
  // O 'reset' é a função mágica que preenche o form quando os dados chegam
  const { register, handleSubmit, reset, watch, setValue, formState: { errors, isSubmitting, isDirty } } = useForm();
  const { addToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const nivelSelecionado = watch('nivel_ensino');

  // 1. BUSCAR DADOS AO ABRIR A TELA
  useEffect(() => {
    async function carregarDados() {
      try {
        // Chama o endpoint GET /api/turma/{id}
        const dadosTurma = await turmaService.getById(id);
        
        // Preenche o formulário automaticamente. 
        // Importante: Os nomes dos campos no JSON do backend devem bater com os do register()
        reset({
          ...dadosTurma,
          nivel_ensino: dadosTurma.nivel_ensino || '',
          etapa_ensino: dadosTurma.etapa_ensino || ''
        }); 
        
      } catch (error) {
        console.error("Erro ao carregar turma:", error);
        addToast("Erro ao buscar dados da turma.", 'error');
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
      // ano_letivo não vai no payload: o backend rejeita qualquer tentativa de alterá-lo
      const { ano_letivo: _anoLetivo, ...editaveis } = dados;
      const payload = {
        ...editaveis,
        n_alunos: Number(dados.n_alunos),
        nivel_ensino: dados.nivel_ensino || null,
        etapa_ensino: dados.etapa_ensino || null
      };

      await turmaService.update(id, payload);
      addToast("Turma atualizada com sucesso!", 'success');
      navigate('/turmas');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        addToast("Você não tem permissão para editar esta turma.", 'error');
      } else {
        addToast("Erro ao salvar alterações.", 'error');
      }
    }
  };

  if (loading) {
    return <div className="p-10 text-center text-gray-500">Carregando dados da turma...</div>;
  }

  return (
    <div className="min-h-screen bg-profgeo-50 p-6 flex justify-center items-start">
      <div className="w-full max-w-lg">
        <div className="mb-6 flex items-center gap-4">
          <BackButton to="/turmas/gestao" label="Voltar" />
          <h2 className="text-2xl font-bold text-profgeo-900">Editar Turma</h2>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md border border-profgeo-100">
        
        <ConfirmModal
          isOpen={showConfirm}
          title="Descartar mudanças?"
          message="Você tem alterações não salvas. Tem certeza que deseja sair?"
          onConfirm={() => navigate('/turmas')}
          onCancel={() => setShowConfirm(false)}
          confirmText="Sair sem Salvar"
          cancelText="Continuar Editando"
          isDangerous={true}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Turma</label>
            <input 
              {...register("nome", { required: true, minLength: 2 })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-profgeo-400 text-gray-900"
            />
          </div>

          {/* Turno */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Turno</label>
            <select {...register("turno")} className="w-full p-2 border rounded focus:ring-2 focus:ring-profgeo-400 text-gray-900">
              <option value="Matutino">Matutino</option>
              <option value="Vespertino">Vespertino</option>
              <option value="Noturno">Noturno</option>
              <option value="Integral">Integral</option>
            </select>
          </div>

          {/* Nível e Etapa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Nível de Ensino</label>
              <select
                {...register("nivel_ensino", { onChange: () => setValue('etapa_ensino', '') })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-profgeo-400 text-gray-900"
              >
                <option value="">Selecione</option>
                {NIVEIS_ENSINO.map(nivel => <option key={nivel} value={nivel}>{nivel}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Etapa</label>
              <select
                {...register("etapa_ensino")}
                disabled={!nivelSelecionado}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-profgeo-400 text-gray-900 disabled:bg-gray-100"
              >
                <option value="">Selecione</option>
                {(ETAPAS_POR_NIVEL[nivelSelecionado] || []).map(etapa => <option key={etapa} value={etapa}>{etapa}</option>)}
              </select>
            </div>
          </div>

          {/* Nº Alunos */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nº Alunos</label>
            <input 
              type="number" 
              {...register("n_alunos", { required: true })}
              className="w-full p-2 border rounded focus:ring-2 focus:ring-profgeo-400 text-gray-900"
            />
          </div>

          {/* Ano Letivo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ano Letivo</label>
            <input 
              type="number" 
              readOnly
              {...register("ano_letivo")}
              className="w-full p-2 border rounded bg-gray-100 text-gray-500 cursor-not-allowed"
            />
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={() => isDirty ? setShowConfirm(true) : navigate('/turmas')}
              className="w-1/3 bg-gray-200 text-gray-700 font-medium py-2 rounded hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-2/3 bg-profgeo-600 text-white font-bold py-2 rounded hover:bg-profgeo-700 transition shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin">⏳</span>
                  Salvando...
                </>
              ) : (
                'Salvar Alterações'
              )}
            </button>
          </div>

        </form>
        </div>
      </div>
    </div>
  );
}