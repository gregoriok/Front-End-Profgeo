import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { turmaService, locaisService } from '../api/services';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { BackButton } from '../components/BackButton';
import { NIVEIS_ENSINO, ETAPAS_POR_NIVEL } from '../utils/niveisEnsino';

export function CadastrarTurma() {
  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useToast();

  // Estados
  const [ufs, setUfs] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [sugestoesEscolas, setSugestoesEscolas] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');
  const [escolaSelecionada, setEscolaSelecionada] = useState(false);
  const [buscaSemResultado, setBuscaSemResultado] = useState(false);

  const nivelSelecionado = watch('nivel_ensino');
  const termo = termoBusca.trim();
  // Termo só com dígitos = busca pelo código INEP, que dispensa UF e município
  const buscaPorInep = /^\d+$/.test(termo);

  // 1. Carregar Estados
  useEffect(() => {
    locaisService.getEstados().then(setUfs).catch(console.error);
  }, []);

  // 2. Debounce Busca Escola
  useEffect(() => {
    setBuscaSemResultado(false);
    const temLocal = selectedUf && selectedCidade;
    if (termo.length < 3 || escolaSelecionada || (!buscaPorInep && !temLocal)) {
      setSugestoesEscolas([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setBuscando(true);
      try {
        const resultados = await locaisService.buscarEscolas(selectedUf, selectedCidade, termo);
        setSugestoesEscolas(resultados);
        setMostrarSugestoes(true);
        setBuscaSemResultado(resultados.length === 0);
      } catch (error) { console.error(error); } 
      finally { setBuscando(false); }
    }, 500);
    return () => clearTimeout(delayDebounce);
  }, [termoBusca, selectedUf, selectedCidade]);

  // Handlers
  const handleUfChange = async (e) => {
    const uf = e.target.value;
    setSelectedUf(uf);
    setSelectedCidade('');
    setTermoBusca('');
    setValue('id_escola', '');
    if (uf) setCidades(await locaisService.getMunicipios(uf));
  };

  const handleCidadeChange = (e) => {
    setSelectedCidade(e.target.value);
    setTermoBusca('');
    setValue('id_escola', '');
  };

  const selecionarEscola = (escola) => {
    setEscolaSelecionada(true);
    setTermoBusca(escola.nome);
    setValue('id_escola', escola.id_inep);
    setMostrarSugestoes(false);
  };

  // TODO: enviar e-mail para o time de suporte (funcionalidade ainda não implementada)
  const acionarSuporte = () => {
    addToast('Em breve você poderá acionar o suporte por aqui.', 'info');
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id_colaborador: user?.id_usuario || user?.id || null,
        n_alunos: Number(data.n_alunos),
        ano_letivo: Number(data.ano_letivo),
        id_escola: Number(data.id_escola)
      };

      if (!payload.id_escola) {
        addToast("Selecione uma escola.", 'warning');
        return;
      }

      await turmaService.create(payload);
      addToast('Turma criada com sucesso!', 'success');
      navigate('/turmas');
    } catch (error) {
      console.error(error);
      addToast(error.response?.data?.detail || 'Erro ao criar turma.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-profgeo-50 p-6">
      <div className="max-w-2xl mx-auto">
        
        {/* BOTÃO VOLTAR */}
        <div className="mb-6">
          <BackButton to="/turmas" label="Voltar para Minhas Escolas" />
        </div>

        {/* CARTÃO DO FORMULÁRIO */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-profgeo-100">
          <h2 className="text-2xl font-bold mb-6 text-profgeo-900">Nova Turma</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Bloco Localização */}
            <div className="bg-profgeo-50 p-5 rounded-lg border border-profgeo-100 shadow-sm">
              <h3 className="text-sm font-bold text-profgeo-800 mb-4 uppercase tracking-wide">Localização da Escola</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select className="w-full p-2 border rounded bg-white text-gray-900" value={selectedUf} onChange={handleUfChange}>
                    <option value="">UF</option>
                    {ufs.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Município</label>
                  <select className="w-full p-2 border rounded bg-white text-gray-900 disabled:bg-gray-100" value={selectedCidade} onChange={handleCidadeChange} disabled={!selectedUf}>
                    <option value="">Cidade</option>
                    {cidades.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Autocomplete */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Escola (nome ou código INEP)</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-profgeo-400 text-gray-900"
                  placeholder={selectedCidade ? "Digite o nome ou o código INEP..." : "Digite o código INEP, ou selecione a cidade para buscar por nome"}
                  value={termoBusca}
                  onChange={(e) => {
                    setEscolaSelecionada(false);
                    setTermoBusca(e.target.value);
                    setValue('id_escola', '');
                    if(e.target.value.length < 3) setMostrarSugestoes(false);
                  }}
                />
                <input type="hidden" {...register("id_escola", { required: true })} />
                
                {mostrarSugestoes && sugestoesEscolas.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                    {sugestoesEscolas.map((escola) => (
                      <li key={escola.id_inep} onClick={() => selecionarEscola(escola)} className="p-2 hover:bg-profgeo-50 cursor-pointer text-sm text-gray-900 border-b border-gray-100">
                        <span className="font-bold block">{escola.nome}</span>
                        <span className="text-xs text-gray-500">INEP {escola.id_inep} · {escola.municipio}/{escola.uf}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {buscando && <p className="text-xs text-gray-500 mt-1">Buscando...</p>}

                {termo.length >= 3 && !buscaPorInep && !selectedCidade && (
                  <p className="text-xs text-gray-500 mt-1">Para buscar por nome, selecione o estado e o município.</p>
                )}

                {buscaSemResultado && !buscando && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                    <p className="text-sm text-yellow-800">Nenhuma escola encontrada. Não achou a sua escola?</p>
                    <button
                      type="button"
                      onClick={acionarSuporte}
                      className="px-4 py-2 text-sm font-bold text-white bg-profgeo-600 rounded-lg hover:bg-profgeo-700 transition-colors whitespace-nowrap"
                    >
                      Acionar o suporte
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Inputs Normais */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome da Turma</label>
                <input {...register("nome", { required: true })} className="w-full p-2 border rounded text-gray-900" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nível de Ensino</label>
                  <select
                    {...register("nivel_ensino", { required: true, onChange: () => setValue('etapa_ensino', '') })}
                    className="w-full p-2 border rounded bg-white text-gray-900"
                  >
                    <option value="">Selecione</option>
                    {NIVEIS_ENSINO.map(nivel => <option key={nivel} value={nivel}>{nivel}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Etapa</label>
                  <select
                    {...register("etapa_ensino", { required: true })}
                    disabled={!nivelSelecionado}
                    className="w-full p-2 border rounded bg-white text-gray-900 disabled:bg-gray-100"
                  >
                    <option value="">{nivelSelecionado ? "Selecione" : "Selecione o nível primeiro"}</option>
                    {(ETAPAS_POR_NIVEL[nivelSelecionado] || []).map(etapa => <option key={etapa} value={etapa}>{etapa}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Turno</label>
                  <select {...register("turno")} className="w-full p-2 border rounded bg-white text-gray-900">
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Noturno">Noturno</option>
                    <option value="Integral">Integral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Alunos</label>
                  <input type="number" {...register("n_alunos", { required: true })} className="w-full p-2 border rounded text-gray-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ano</label>
                  <input type="number" defaultValue={new Date().getFullYear()} {...register("ano_letivo", { required: true })} className="w-full p-2 border rounded text-gray-900" />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-profgeo-600 text-white font-bold py-3 rounded-lg hover:bg-profgeo-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block animate-spin">⏳</span>
                  Salvando...
                </>
              ) : (
                'Salvar Turma'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}