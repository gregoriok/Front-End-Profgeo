import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from "jwt-decode"; // <--- Importante
import { authService } from '../api/services';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Evita piscar a tela de login ao dar F5

  // Função auxiliar para decodificar e salvar no estado
  const processarToken = (token) => {
    try {
      const decoded = jwtDecode(token);
      
      // Mapeie aqui os campos exatamente como vêm do seu backend (FastAPI)
      // Dica: Dê um console.log(decoded) para ver os nomes exatos das chaves
      setUser({
        // O campo 'sub' é padrão do JWT para o ID do usuário (ou email, depende do backend)
        id: decoded.sub || decoded.id_usuario, 
        
        email: decoded.email,
        nome: decoded.nome,
        
        // Permissões
        is_admin: decoded.is_admin,
        is_coordenador: decoded.is_coordenador, // Ex: "Coordenador", "Professor"
        is_professor: decoded.is_professor,
        is_coordenador_nacional: decoded.is_coordenador_nacional,
        // Vinculação
        id_unidade: decoded.id_unidade
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