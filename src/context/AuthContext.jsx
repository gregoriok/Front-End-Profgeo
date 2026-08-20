import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from "jwt-decode"; // <--- Importante
import { authService } from '../api/services';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Evita piscar a tela de login ao dar F5

  const toBoolean = (value) => {
    if (typeof value === 'boolean') return value;
    if (typeof value === 'number') return value === 1;
    if (typeof value === 'string') {
      const normalized = value.trim().toLowerCase();
      return normalized === 'true' || normalized === '1' || normalized === 'sim';
    }
    return false;
  };

  const isUuid = (value) => (
    typeof value === 'string' &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(value)
  );

  // Função auxiliar para decodificar e salvar no estado
  const processarToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      const idUsuario = decoded.id_usuario || decoded.id || (isUuid(decoded.sub) ? decoded.sub : null);
      
      // Mapeie aqui os campos exatamente como vêm do seu backend (FastAPI)
      // Dica: Dê um console.log(decoded) para ver os nomes exatos das chaves
      setUser({
        id: idUsuario,
        id_usuario: idUsuario,
        sub: decoded.sub,
        email: decoded.email,
        nome: decoded.nome,
        telefone: decoded.telefone,
        cpf: decoded.cpf,
        formacao: decoded.formacao,
        area_atuacao: decoded.area_atuacao,
        ano_ingresso: decoded.ano_ingresso,
        professor_type: decoded.professor_type,
        data_de_ingresso: decoded.data_de_ingresso,
        data_de_defesa: decoded.data_de_defesa,
        url_lattes: decoded.url_lattes,
        
        // Permissões
        is_admin: toBoolean(decoded.is_admin),
        is_coordenador: toBoolean(decoded.is_coordenador),
        is_professor: toBoolean(decoded.is_professor),
        is_coordenador_nacional: toBoolean(decoded.is_coordenador_nacional),
        is_aluno: toBoolean(decoded.is_aluno),
        // Vinculação
        id_unidade: decoded.id_unidade,
        claims: decoded
      });
      
    } catch (error) {
      console.error("Token inválido:", error);
      logout();
    }
  };

  // 1. EFEITO DE CARREGAMENTO (Ao dar F5 na página)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      processarToken(token);
    }
    setLoading(false);
  }, []);

  // 2. LOGIN
  const login = async (email, senha) => {
    try {
      const data = await authService.login(email, senha);
      
      // Salva o token cru no localStorage
      localStorage.setItem('token', data.access_token);
      
      // Decodifica e atualiza o estado do usuário na hora
      processarToken(data.access_token);
      
      return true;
    } catch (error) {
      console.error("Erro ao logar", error);
      throw error; // Lança o erro para a tela de Login exibir o alerta
    }
  };

  // 3. LOGOUT
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    // Opcional: window.location.href = '/login'; para garantir limpeza total
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);