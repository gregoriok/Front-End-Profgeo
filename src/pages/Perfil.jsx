import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const FIELD_LABELS = {
  nome: 'Nome completo',
  email: 'Email',
  telefone: 'Telefone',
  cpf: 'CPF',
  formacao: 'Formação',
  area_atuacao: 'Área de atuação',
  ano_ingresso: 'Ano de ingresso',
  professor_type: 'Tipo de professor',
  data_de_ingresso: 'Data de ingresso',
  data_de_defesa: 'Data de defesa',
  url_lattes: 'Currículo Lattes',
  id_usuario: 'ID do usuário',
  id_unidade: 'ID da unidade'
};

function formatBoolean(value) {
  if (value === true) return 'Sim';
  if (value === false) return 'Não';
  return 'Não informado';
}

export function Perfil() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="min-h-screen bg-profgeo-50 p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl border border-profgeo-100 p-6">
          <p className="text-gray-600">Usuário não autenticado.</p>
          <Link to="/login" className="text-profgeo-600 hover:text-profgeo-700 font-medium mt-2 inline-block">
            Ir para login
          </Link>
        </div>
      </div>
    );
  }

  const roles = [
    { label: 'Administrador', value: user.is_admin },
    { label: 'Coordenador Nacional', value: user.is_coordenador_nacional },
    { label: 'Coordenador', value: user.is_coordenador },
    { label: 'Professor', value: user.is_professor },
    { label: 'Aluno', value: user.is_aluno }
  ];

  const fieldsToDisplay = Object.keys(FIELD_LABELS).map((key) => ({
    key,
    label: FIELD_LABELS[key],
    value: user[key]
  }));

  return (
    <div className="min-h-screen bg-profgeo-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <Link to="/dashboard" className="text-gray-500 hover:text-profgeo-600 flex items-center gap-1 font-medium transition-colors w-fit">
            ← Voltar para Home
          </Link>
        </div>

        <div className="bg-white rounded-xl border border-profgeo-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h1 className="text-2xl font-bold text-profgeo-900">Meu Perfil</h1>
            <p className="text-sm text-gray-500 mt-1">
              Dados do usuário autenticado conforme informações retornadas pela API no token de acesso.
            </p>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-profgeo-50 rounded-lg border border-profgeo-100 p-4">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Dados Cadastrais</h2>
              <div className="space-y-2">
                {fieldsToDisplay.map((field) => (
                  <div key={field.key} className="flex items-start justify-between gap-3 border-b border-gray-200 pb-2">
                    <span className="text-sm text-gray-500">{field.label}</span>
                    <span className="text-sm font-medium text-gray-800 text-right break-all">
                      {field.value ?? 'Não informado'}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            <section className="bg-profgeo-50 rounded-lg border border-profgeo-100 p-4">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Permissões</h2>
              <div className="space-y-2">
                {roles.map((role) => (
                  <div key={role.label} className="flex items-center justify-between border-b border-gray-200 pb-2">
                    <span className="text-sm text-gray-500">{role.label}</span>
                    <span className="text-sm font-semibold text-gray-800">{formatBoolean(role.value)}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
