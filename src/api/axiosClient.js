import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. INTERCEPTADOR DE REQUISIÇÃO (Você já tinha esse)
// Insere o token antes de enviar para o backend
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 2. NOVO: INTERCEPTADOR DE RESPOSTA (O Guardião)
// Verifica se o backend devolveu erro 401
api.interceptors.response.use(
  (response) => {
    // Se deu tudo certo (Status 200, 201), apenas retorna os dados
    return response;
  },
  (error) => {
    // Se houver erro, verificamos o status
    if (error.response && error.response.status === 401) {
      
      // Evita loop infinito se o erro 401 acontecer na própria tela de login (ex: senha errada)
      if (window.location.pathname !== '/login') {
        console.warn("Sessão expirada. Redirecionando para login...");
        
        // A. Limpa o token inválido/expirado
        localStorage.removeItem('token');
        
        // B. Força o redirecionamento para o login
        // Usamos window.location.href em vez de navigate porque o axios não é um componente React
        window.location.href = '/login';
      }
    }
    
    // Retorna o erro para que o catch() das suas páginas ainda funcione (para mostrar avisos vermelhos, etc)
    return Promise.reject(error);
  }
);

export default api;