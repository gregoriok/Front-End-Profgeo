import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { usuarioService } from '../api/services';
import { BackButton } from '../components/BackButton';

const BASE_FIELDS = {
  nome: 'Nome completo',
  email: 'Email',
  telefone: 'Telefone',
  cpf: 'CPF',
  formacao: 'Formação',
  url_lattes: 'Currículo Lattes'
};

const PROFESSOR_FIELDS = {
  area_atuacao: 'Instituição de vínculo',
  ano_ingresso: 'Ano de ingresso ProfGeo',
  professor_type: 'Tipo de professor'
};

const ALUNO_FIELDS = {
  data_de_ingresso: 'Data de ingresso',
  data_de_defesa: 'Data de defesa ou previsão',
  titulo_dissertacao: 'Título da dissertação'
};

const EDITABLE_FIELDS = ['data_de_defesa', 'titulo_dissertacao', 'url_lattes'];

const INPUT_TYPES = { data_de_defesa: 'date', url_lattes: 'url', titulo_dissertacao: 'text' };

const SENHA_VAZIA = { senha_atual: '', nova_senha: '', confirmar_senha: '' };

function formatBoolean(value) {
  if (value === true) return 'Sim';
  if (value === false) return 'Não';
  return 'Não informado';
}

export function Perfil() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    data_de_defesa: '',
    titulo_dissertacao: '',
    url_lattes: ''
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [trocandoSenha, setTrocandoSenha] = useState(false);
  const [senhaData, setSenhaData] = useState(SENHA_VAZIA);
  const [savingSenha, setSavingSenha] = useState(false);

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

  const fieldLabels = {
    ...BASE_FIELDS,
    ...(user.is_professor ? PROFESSOR_FIELDS : {}),
    ...(user.is_aluno ? ALUNO_FIELDS : {})
  };

  const fieldsToDisplay = Object.keys(fieldLabels).map((key) => ({
    key,
    label: fieldLabels[key],
    value: user[key]
  }));

  const handleStartEdit = () => {
    setFormData({
      data_de_defesa: user.data_de_defesa || '',
      titulo_dissertacao: user.titulo_dissertacao || '',
      url_lattes: user.url_lattes || ''
    });
    setEditing(true);
    setMessage(null);
  };

  const handleCancel = () => {
    setEditing(false);
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const payload = {};
      if (formData.url_lattes) payload.url_lattes = formData.url_lattes;
      if (formData.data_de_defesa) payload.data_de_defesa = formData.data_de_defesa;
      if (formData.titulo_dissertacao) payload.titulo_dissertacao = formData.titulo_dissertacao;

      await usuarioService.updatePerfil(payload);
      setMessage({ type: 'success', text: 'Perfil atualizado! Faça login novamente para ver as alterações.' });
      setEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: 'Erro ao atualizar perfil.' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancelSenha = () => {
    setTrocandoSenha(false);
    setSenhaData(SENHA_VAZIA);
  };

  const handleTrocarSenha = async (e) => {
    e.preventDefault();
    setMessage(null);
    if (senhaData.nova_senha.length < 8) {
      setMessage({ type: 'error', text: 'A nova senha deve ter pelo menos 8 caracteres.' });
      return;
    }
    if (senhaData.nova_senha !== senhaData.confirmar_senha) {
      setMessage({ type: 'error', text: 'A confirmação não confere com a nova senha.' });
      return;
    }
    setSavingSenha(true);
    try {
      await usuarioService.trocarSenha(senhaData.senha_atual, senhaData.nova_senha);
      setMessage({ type: 'success', text: 'Senha alterada com sucesso!' });
      handleCancelSenha();
    } catch (error) {
      const detail = error.response?.data?.detail;
      setMessage({ type: 'error', text: typeof detail === 'string' ? detail : 'Erro ao alterar a senha.' });
    } finally {
      setSavingSenha(false);
    }
  };

  return (
    <div className="min-h-screen bg-profgeo-50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto">
        <div className="mb-4">
          <BackButton to="/dashboard" />
        </div>

        <div className="bg-white rounded-xl border border-profgeo-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-profgeo-900">Meu Perfil</h1>
              <p className="text-sm text-gray-500 mt-1">Seus dados cadastrais e permissões.</p>
            </div>
            <div className="flex gap-2">
              {!trocandoSenha && (
                <button
                  onClick={() => { setTrocandoSenha(true); setMessage(null); }}
                  className="px-4 py-2 text-sm font-medium text-profgeo-700 bg-white border border-profgeo-200 rounded-lg hover:bg-profgeo-50 transition-colors"
                >
                  Trocar senha
                </button>
              )}
              {!editing && (
                <button
                  onClick={handleStartEdit}
                  className="px-4 py-2 bg-profgeo-600 text-white text-sm font-medium rounded-lg hover:bg-profgeo-700 transition-colors"
                >
                  Editar
                </button>
              )}
            </div>
          </div>

          {message && (
            <div className={`mx-6 mt-4 p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
              {message.text}
            </div>
          )}

          {trocandoSenha && (
            <form onSubmit={handleTrocarSenha} className="mx-6 mt-4 bg-profgeo-50 rounded-lg border border-profgeo-100 p-4">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Trocar Senha</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { key: 'senha_atual', label: 'Senha atual', autoComplete: 'current-password' },
                  { key: 'nova_senha', label: 'Nova senha (mín. 8 caracteres)', autoComplete: 'new-password' },
                  { key: 'confirmar_senha', label: 'Confirmar nova senha', autoComplete: 'new-password' }
                ].map((campo) => (
                  <div key={campo.key}>
                    <label className="block text-sm text-gray-500 mb-1">{campo.label}</label>
                    <input
                      type="password"
                      required
                      autoComplete={campo.autoComplete}
                      value={senhaData[campo.key]}
                      onChange={(e) => setSenhaData({ ...senhaData, [campo.key]: e.target.value })}
                      className="w-full text-sm text-gray-800 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-profgeo-500"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-4 justify-end">
                <button
                  type="button"
                  onClick={handleCancelSenha}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingSenha}
                  className="px-4 py-2 text-sm font-medium text-white bg-profgeo-600 rounded-lg hover:bg-profgeo-700 transition-colors disabled:opacity-50"
                >
                  {savingSenha ? 'Salvando...' : 'Salvar nova senha'}
                </button>
              </div>
            </form>
          )}

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="bg-profgeo-50 rounded-lg border border-profgeo-100 p-4">
              <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-3">Dados Cadastrais</h2>
              <div className="space-y-2">
                {fieldsToDisplay.map((field) => (
                  <div key={field.key} className="flex items-start justify-between gap-3 border-b border-gray-200 pb-2">
                    <span className="text-sm text-gray-500">{field.label}</span>
                    {editing && EDITABLE_FIELDS.includes(field.key) ? (
                      <input
                        type={INPUT_TYPES[field.key]}
                        maxLength={field.key === 'titulo_dissertacao' ? 250 : undefined}
                        value={formData[field.key]}
                        onChange={(e) => setFormData({ ...formData, [field.key]: e.target.value })}
                        placeholder={field.key === 'url_lattes' ? 'https://lattes.cnpq.br/...' : ''}
                        className="text-sm font-medium text-gray-800 text-right border border-gray-300 rounded px-2 py-1 w-48 focus:outline-none focus:ring-2 focus:ring-profgeo-500"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-800 text-right break-all">
                        {field.value ?? 'Não informado'}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              {editing && (
                <div className="flex gap-2 mt-4 justify-end">
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-4 py-2 text-sm font-medium text-white bg-profgeo-600 rounded-lg hover:bg-profgeo-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? 'Salvando...' : 'Salvar'}
                  </button>
                </div>
              )}
            </section>

            {(user.is_admin || user.is_coordenador_nacional || user.is_coordenador) && (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
