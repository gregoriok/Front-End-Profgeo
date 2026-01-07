import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EditarTurma } from './pages/EditarTurma';
import { Login } from './pages/Login';
import { Home } from './pages/Home'; // <--- Importe a nova página
import { CadastrarUnidade } from './pages/CadastrarUnidade';
import { ListarUnidades } from './pages/ListarUnidades';
import { CadastrarUsuario } from './pages/CadastrarUsuario';
import { Coordenacao } from './pages/Coordenacao';
import { CadastrarTurma } from './pages/CadastrarTurma';
import { ListarTurmas } from './pages/ListarTurmas';
import { GestaoTurmas } from './pages/GestaoTurmas';
import {CadastrarCoordenador} from './pages/CadastrarCoordenador'
// Um componente simples para proteger rotas privadas
function PrivateRoute({ children }) {
  const { user } = useAuth();
  // Se não tiver usuário logado (token), manda pro login
  // Nota: Na primeira carga o 'user' pode ser null até o AuthContext verificar o localStorage. 
  // Em apps reais usamos um estado de 'loading'. Pra esse teste simplificado, pode passar.
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rota Pública: Login agora fica em /login */}
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<CadastrarUsuario />} />
          {/* Rota Privada: Home fica na raiz / */}
          <Route path="/" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />

          {/* Rota Privada: Editar Turma */}
          <Route path="/turma/editar/:id" element={
            <PrivateRoute>
              <EditarTurma />
            </PrivateRoute>
          } />
          <Route path="/unidades" element={<PrivateRoute><ListarUnidades /></PrivateRoute>} />
          <Route path="/unidades/nova" element={<PrivateRoute><CadastrarUnidade /></PrivateRoute>} />

          {/* Usuário (Pode ser pública ou privada dependendo da regra) */}
          <Route path="/usuarios/novo" element={<CadastrarUsuario />} />

          {/* Coordenação */}
          <Route path="/coordenacao" element={<PrivateRoute><Coordenacao /></PrivateRoute>} />
          <Route path="/coordenacao/nova" element={
            <PrivateRoute>
              <CadastrarCoordenador />
            </PrivateRoute>
          } />
          {/* Turmas */}
          <Route path="/turmas" element={<PrivateRoute><ListarTurmas /></PrivateRoute>} />
          <Route path="/turmas/nova" element={<PrivateRoute><CadastrarTurma /></PrivateRoute>} />
          <Route path="/turmas/gestao" element={
            <PrivateRoute>
              <GestaoTurmas />
            </PrivateRoute>
          }/>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;