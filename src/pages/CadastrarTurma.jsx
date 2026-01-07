import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom'; // <--- Import Link
import { turmaService, locaisService } from '../api/services';
import { useAuth } from '../context/AuthContext';

export function CadastrarTurma() {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Estados
  const [ufs, setUfs] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [termoBusca, setTermoBusca] = useState('');
  const [sugestoesEscolas, setSugestoesEscolas] = useState([]);
  const [mostrarSugestoes, setMostrarSugestoes] = useState(false);
  const [buscando, setBuscando] = useState(false);
  const [selectedUf, setSelectedUf] = useState('');
  const [selectedCidade, setSelectedCidade] = useState('');

  // 1. Carregar Estados
  useEffect(() => {
    locaisService.getEstados().then(setUfs).catch(console.error);
  }, []);

  // 2. Debounce Busca Escola
  useEffect(() => {
    if (!selectedUf || !selectedCidade || termoBusca.length < 3) {
      setSugestoesEscolas([]);
      return;
    }
    const delayDebounce = setTimeout(async () => {
      setBuscando(true);
      try {
        const resultados = await locaisService.buscarEscolas(selectedUf, selectedCidade, termoBusca);
        setSugestoesEscolas(resultados);
        setMostrarSugestoes(true);
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
    setTermoBusca(escola.nome);
    setValue('id_escola', escola.id_inep);
    setMostrarSugestoes(false);
  };

  const onSubmit = async (data) => {
    try {
      const payload = {
        ...data,
        id_colaborador: user?.id || user?.sub, 
        n_alunos: Number(data.n_alunos),
        ano_letivo: Number(data.ano_letivo),
        id_escola: Number(data.id_escola)
      };

      if (!payload.id_escola) return alert("Selecione uma escola.");
      
      await turmaService.create(payload);
      alert('Turma criada com sucesso!');
      navigate('/turmas');
    } catch (error) { console.error(error); alert('Erro ao criar turma.'); }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        
        {/* BOTÃO VOLTAR */}
        <div className="mb-6">
          <Link to="/turmas" className="text-gray-500 hover:text-blue-600 flex items-center gap-2 font-medium transition-colors w-fit">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Voltar para Minhas Turmas
          </Link>
        </div>

        {/* CARTÃO DO FORMULÁRIO */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Nova Turma</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            {/* Bloco Localização */}
            <div className="bg-blue-50 p-5 rounded-lg border border-blue-100 shadow-sm">
              <h3 className="text-sm font-bold text-blue-800 mb-4 uppercase tracking-wide">Localização da Escola</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
                  <select className="w-full p-2 border rounded bg-white" value={selectedUf} onChange={handleUfChange}>
                    <option value="">UF</option>
                    {ufs.map(uf => <option key={uf} value={uf}>{uf}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Município</label>
                  <select className="w-full p-2 border rounded bg-white disabled:bg-gray-100" value={selectedCidade} onChange={handleCidadeChange} disabled={!selectedUf}>
                    <option value="">Cidade</option>
                    {cidades.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Autocomplete */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">Escola</label>
                <input 
                  type="text"
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                  placeholder={selectedCidade ? "Digite o nome..." : "Selecione a cidade"}
                  disabled={!selectedCidade}
                  value={termoBusca}
                  onChange={(e) => {
                    setTermoBusca(e.target.value);
                    if(e.target.value.length < 3) setMostrarSugestoes(false);
                  }}
                />
                <input type="hidden" {...register("id_escola", { required: true })} />
                
                {mostrarSugestoes && sugestoesEscolas.length > 0 && (
                  <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto mt-1">
                    {sugestoesEscolas.map((escola) => (
                      <li key={escola.id_inep} onClick={() => selecionarEscola(escola)} className="p-2 hover:bg-blue-50 cursor-pointer text-sm border-b border-gray-100">
                        <span className="font-bold block">{escola.nome}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Inputs Normais */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Nome da Turma</label>
                <input {...register("nome", { required: true })} className="w-full p-2 border rounded" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Turno</label>
                  <select {...register("turno")} className="w-full p-2 border rounded">
                    <option value="Matutino">Matutino</option>
                    <option value="Vespertino">Vespertino</option>
                    <option value="Noturno">Noturno</option>
                    <option value="Integral">Integral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Alunos</label>
                  <input type="number" {...register("n_alunos", { required: true })} className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Ano</label>
                  <input type="number" defaultValue={new Date().getFullYear()} {...register("ano_letivo", { required: true })} className="w-full p-2 border rounded" />
                </div>
              </div>
            </div>

            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition">
              Salvar Turma
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}