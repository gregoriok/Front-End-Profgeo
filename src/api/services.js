import api from './axiosClient';

export const authService = {
  // Endpoint definido no caminho: /api/login
  login: async (email, senha) => {
    // O JSON pede um body com schema LoginSchema
    const response = await api.post('/api/login', { email, senha });
    return response.data;
  },
};

export const unidadeService = {
  // 1. Cadastrar Unidade (POST /api/unidade_associada/cadastrar)
  create: async (data) => {
    const response = await api.post('/api/unidade_associada/cadastrar', data);
    return response.data;
  },
  // 2. Listar Unidades (GET /api/unidade_associada)
  getAll: async () => {
    const response = await api.get('/api/unidade_associada');
    return response.data;
  },
  getDetalhes: async (idUnidade) => {
    const response = await api.get(`/api/unidade_associada/${idUnidade}/detalhes`);
    return response.data;
  }
};

export const usuarioService = {
  // 3. Cadastro de Usuário (POST /api/cadastro)
  create: async (data) => {
    const response = await api.post('/api/cadastro', data);
    return response.data;
  },
  updatePerfil: async (data) => {
    const response = await api.put('/api/perfil', data);
    return response.data;
  }
};

export const coordenacaoService = {
  // 4a. Cadastrar Coordenação (POST /api/coordenacao/)
  create: async (data) => {
    const response = await api.post('/api/coordenacao/', data);
    return response.data;
  },
  // 4b. Remover Coordenação (DELETE /api/coordenacao/)
  // Atenção: O axios.delete com body precisa da chave 'data'
  remove: async (data) => {
    const response = await api.delete('/api/coordenacao/', { data: data });
    return response.data;
  }
};

// Atualize o turmaService adicionando o create e o list
export const turmaService = {
  getById: async (id) => {
    const response = await api.get(`/api/turma/${id}`);
    return response.data;
  },
  update: async (id, dadosAtualizados) => {
    const response = await api.put(`/api/turma/${id}`, dadosAtualizados);
    return response.data;
  },
  // 5. Cadastrar Turma
  create: async (data) => {
    const response = await api.post('/api/turma/', data);
    return response.data;
  },
  // 6. Listar Turmas (Assumindo que você criou um GET /api/turma/ ou similar)
  // Se não existir, você precisará criar no backend: router.get("/api/turma/")
  getByAluno: async () => {
    const response = await api.get(`/api/turma/aluno/`);
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/api/turma/');
    return response.data;
  },
  getByProfessor: async () => {
    const response = await api.get('/api/turma/professor/');
    return response.data;
  },

  // 2. Para COORDENADOR LOCAL (Vê turmas da unidade)
  getByUnidade: async (idUnidade) => {
    // Você precisa ter esse endpoint no backend. Ex: /api/turma/unidade/{id}
    const response = await api.get(`/api/turma/unidade/${idUnidade}`);
    return response.data;
  }
};

export const locaisService = {
  // Pega a lista de UFs (ex: ["RS", "SP"])
  getEstados: async () => {
    const response = await api.get('/api/estados');
    return response.data;
  },
  // Pega cidades de um estado
  getMunicipios: async (uf) => {
    const response = await api.get(`/api/municipios/${uf}`);
    return response.data;
  },
  // Busca escolas por UF e Município
  buscarEscolas: async (uf, municipio, termo = "") => {
  // Passamos o 'termo' nos params apenas se ele tiver valor
  const params = { uf, municipio };
  if (termo) {
    params.termo = termo;
  }

  const response = await api.get('/api/escola/buscar', { params });
  return response.data;
}
};

export const professorService = {
  getProfessoresByUnidade: async (idUnidade) => {
    const response = await api.get(`/api/professores/unidade/${idUnidade}`);
    return response.data;
  }
}