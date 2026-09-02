import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { unidadeService, professorService, coordenacaoService } from '../api/services';

export function CadastrarCoordenador() {
  const { register, handleSubmit, setValue, watch } = useForm();
  const navigate = useNavigate();

  // Estados
  const [unidades, setUnidades] = useState([]);
  const [professores, setProfessores] = useState([]);
  const [loadingUnidades, setLoadingUnidades] = useState(true);
  const [buscandoProfs, setBuscandoProfs] = useState(false);

  // 1. Carrega apenas as UNIDADES ao abrir a tela
  useEffect(() => {
    async function carregarUnidades() {
      try {
        const lista = await unidadeService.getAll();
        setUnidades(lista);
      } catch (error) {
        console.error("Erro:", error);
        alert("Erro ao carregar unidades.");
      } finally {
        setLoadingUnidades(false);
      }
    }
    carregarUnidades();
  }, []);

  // 2. Função disparada quando seleciona uma Unidade
  const handleUnidadeChange = async (e) => {
    const idUnidade = e.target.value;
    
    // Atualiza o valor no React Hook Form
    setValue("id_unidade", idUnidade);
    setValue("id_usuario", ""); // Limpa o professor selecionado anteriormente
    setProfessores([]); // Limpa a lista visualmente

    if (!idUnidade) return;

    // Busca os professores daquela unidade
    setBuscandoProfs(true);
    try {
      const listaProfs = await professorService.getProfessoresByUnidade(idUnidade);
      setProfessores(listaProfs);
    } catch (error) {
      console.error("Erro ao buscar professores:", error);
      alert("Não foi possível carregar os professores desta unidade.");
    } finally {
      setBuscandoProfs(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        id_unidade: data.id_unidade,
        id_usuario: data.id_usuario,
        ano_vigencia: Number(data.ano_vigencia),
        coordenador_type: data.coordenador_type
      };

      await coordenacaoService.create(payload);
      alert('Coordenador vinculado com sucesso!');
      navigate('/unidades'); 
    } catch (error) {
      console.error(error);
      if (error.response?.status === 409) {
        alert("Este professor já é coordenador nesta vigência.");
      } else {
        alert('Erro ao vincular coordenador.');
      }
    }
  };

  return (
    <div className="min-h-screen bg-profgeo-50 p-6">
      <div className="max-w-xl mx-auto">
        
        <div className="mb-6">
          <Link to="/unidades" className="text-gray-500 hover:text-profgeo-600 flex items-center gap-2 font-medium w-fit">
            ← Voltar para Unidades
          </Link>
        </div>

        <div className="bg-white p-8 rounded-xl shadow-md border border-profgeo-100">
          <h2 className="text-2xl font-bold mb-6 text-profgeo-900">Vincular Coordenador</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            
            {/* 1. Seleção de Unidade (Dispara a busca) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidade Associada</label>
              <select 
                {...register("id_unidade", { required: true })} 
                onChange={handleUnidadeChange} // <--- O Segredo está aqui
                className="w-full p-2 border rounded focus:ring-2 focus:ring-profgeo-400 bg-white text-gray-900"
              >
                <option value="">Selecione a Unidade...</option>
                {unidades.map(uni => (
                  <option key={uni.id_unidade} value={uni.id_unidade}>
                    {uni.nome_unidade} - {uni.municipio}/{uni.estado}
                  </option>
                ))}
              </select>
            </div>

            {/* 2. Seleção de Professor (Depende da Unidade) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professor Responsável
                {buscandoProfs && <span className="text-profgeo-600 ml-2 text-xs">(Buscando...)</span>}
              </label>
              
              <select 
                {...register("id_usuario", { required: true })} 
                className="w-full p-2 border rounded focus:ring-2 focus:ring-profgeo-400 bg-white text-gray-900 disabled:bg-gray-100"
                disabled={professores.length === 0 || buscandoProfs}
              >
                <option value="">
                  {professores.length === 0 ? "Selecione uma unidade primeiro" : "Selecione o Professor..."}
                </option>
                {professores.map(prof => (
                  <option key={prof.id_usuario} value={prof.id_usuario}>
                    {prof.nome} (CPF: {prof.cpf})
                  </option>
                ))}
              </select>
              
              {/* Aviso se a unidade não tiver professores */}
              {!buscandoProfs && watch("id_unidade") && professores.length === 0 && (
                 <p className="text-xs text-red-500 mt-1">Nenhum professor cadastrado nesta unidade.</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ano Vigência</label>
                  <input 
                    type="number" 
                    defaultValue={new Date().getFullYear()}
                    {...register("ano_vigencia", { required: true })} 
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-profgeo-400 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cargo</label>
                  <select {...register("coordenador_type", { required: true })} className="w-full p-2 border rounded bg-white">
                    <option value="Coordenador">Coordenador</option>
                    <option value="Vice_Coordenador">Vice Coordenador</option>
                  </select>
                </div>
            </div>

            <button type="submit" className="w-full bg-purple-600 text-white font-bold py-3 rounded-lg hover:bg-purple-700 transition shadow-md mt-4">
              Vincular Coordenador
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}