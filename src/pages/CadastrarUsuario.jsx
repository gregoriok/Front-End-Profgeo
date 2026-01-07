import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { usuarioService, unidadeService } from '../api/services';

export function CadastrarUsuario() {
  const { register, handleSubmit, watch, reset } = useForm();
  const navigate = useNavigate();

  // Estados para controle da tela
  const [tipoUsuario, setTipoUsuario] = useState('aluno'); // 'aluno' ou 'professor'
  const [unidades, setUnidades] = useState([]);
  const [loadingUnidades, setLoadingUnidades] = useState(true);

  // 1. Carregar as Unidades para o Select
  useEffect(() => {
    async function carregarUnidades() {
      try {
        const lista = await unidadeService.getAll();
        setUnidades(lista);
      } catch (error) {
        console.error("Erro ao buscar unidades:", error);
        alert("Erro ao carregar lista de unidades.");
      } finally {
        setLoadingUnidades(false);
      }
    }
    carregarUnidades();
  }, []);

  // 2. Lógica de Envio Inteligente
  const onSubmit = async (data) => {
    try {
      // Base comum para ambos
      const payloadBase = {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        telefone: data.telefone,
        cpf: data.cpf,
        formacao: data.formacao,
        id_unidade: data.id_unidade
      };

      let payloadFinal = {};

      if (tipoUsuario === 'professor') {
        // Monta JSON de Professor
        payloadFinal = {
          ...payloadBase,
          is_professor: true,
          is_aluno: false,
          area_atuacao: data.area_atuacao,
          ano_ingresso: data.ano_ingresso, // String conforme seu JSON
          professor_type: data.professor_type // Permanente, Visitante, etc.
        };
      } else {
        // Monta JSON de Aluno
        payloadFinal = {
          ...payloadBase,
          is_professor: false,
          is_aluno: true,
          data_de_ingresso: data.data_de_ingresso,
          data_de_defesa: data.data_de_defesa || null // Pode ser vazio se ainda não defendeu
        };
      }

      // Envia para o serviço
      await usuarioService.create(payloadFinal);
      
      alert('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');

    } catch (error) {
      console.error(error);
      alert('Erro ao criar conta. Verifique os dados e tente novamente.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl border border-gray-200">
        
        <div className="mb-6 text-center">
            <h2 className="text-3xl font-bold text-gray-800">Crie sua Conta</h2>
            <p className="text-gray-500 mt-2">Preencha seus dados para acessar o sistema.</p>
        </div>

        {/* --- SELETOR DE TIPO (Abas) --- */}
        <div className="flex bg-gray-100 p-1 rounded-lg mb-6">
          <button
            type="button"
            onClick={() => setTipoUsuario('aluno')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
              tipoUsuario === 'aluno' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sou Aluno
          </button>
          <button
            type="button"
            onClick={() => setTipoUsuario('professor')}
            className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${
              tipoUsuario === 'professor' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Sou Professor
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            
            {/* --- CAMPOS COMUNS --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                    <input {...register("nome", { required: true })} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                    <input type="email" {...register("email", { required: true })} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
                    <input type="password" {...register("senha", { required: true })} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">CPF (somente números)</label>
                    <input {...register("cpf", { required: true })} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" placeholder="000.000.000-00"/>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                    <input {...register("telefone", { required: true })} className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Formação</label>
                    <select {...register("formacao", { required: true })} className="w-full p-2 border rounded bg-white">
                        <option value="Graduação">Graduação</option>
                        <option value="Especialização">Especialização</option>
                        <option value="Mestrado">Mestrado</option>
                        <option value="Doutorado">Doutorado</option>
                    </select>
                </div>
            </div>

            {/* --- SELEÇÃO DE UNIDADE (Dinâmica) --- */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Unidade Associada</label>
              <select 
                {...register("id_unidade", { required: "Selecione uma unidade" })} 
                className="w-full p-2 border rounded bg-white focus:ring-2 focus:ring-blue-500"
                disabled={loadingUnidades}
              >
                <option value="">{loadingUnidades ? "Carregando..." : "Selecione sua Unidade"}</option>
                {unidades.map(uni => (
                  <option key={uni.id || uni.id_unidade} value={uni.id || uni.id_unidade}>
                    {uni.nome_unidade} - {uni.municipio}/{uni.estado}
                  </option>
                ))}
              </select>
            </div>

            <hr className="border-gray-100 my-4" />

            {/* --- CAMPOS ESPECÍFICOS: PROFESSOR --- */}
            {tipoUsuario === 'professor' && (
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 space-y-4 animate-fade-in">
                <h3 className="text-sm font-bold text-blue-800 uppercase">Dados do Professor</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Área de Atuação</label>
                      <input {...register("area_atuacao", { required: true })} className="w-full p-2 border rounded" placeholder="Ex: Geografia Física"/>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Ano de Ingresso</label>
                      <input type="number" {...register("ano_ingresso", { required: true })} className="w-full p-2 border rounded" placeholder="Ex: 2023"/>
                   </div>
                </div>

                <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Professor</label>
                   <select {...register("professor_type", { required: true })} className="w-full p-2 border rounded bg-white">
                      <option value="Permanente">Permanente</option>
                      <option value="Colaborador">Colaborador</option>
                      <option value="Visitante">Visitante</option>
                   </select>
                </div>
              </div>
            )}

            {/* --- CAMPOS ESPECÍFICOS: ALUNO --- */}
            {tipoUsuario === 'aluno' && (
              <div className="bg-green-50 p-4 rounded-lg border border-green-100 space-y-4 animate-fade-in">
                <h3 className="text-sm font-bold text-green-800 uppercase">Dados do Aluno</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Data de Ingresso</label>
                      <input type="date" {...register("data_de_ingresso", { required: true })} className="w-full p-2 border rounded"/>
                   </div>
                   <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Previsão de Defesa</label>
                      <input type="date" {...register("data_de_defesa")} className="w-full p-2 border rounded"/>
                   </div>
                </div>
              </div>
            )}

            {/* Botão de Cadastro */}
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-md mt-4">
                Confirmar Cadastro ({tipoUsuario === 'professor' ? 'Professor' : 'Aluno'})
            </button>
        </form>

        {/* Botão Voltar */}
        <div className="mt-6 text-center">
            <Link to="/login" className="text-gray-500 hover:text-blue-600 text-sm font-medium">
                ← Voltar para o Login
            </Link>
        </div>

      </div>
    </div>
  );
}