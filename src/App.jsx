import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { EditarTurma } from './pages/EditarTurma';
import { Login } from './pages/Login';
import { LandingPage } from './pages/LandingPage';
import { Home } from './pages/Home';
import { Perfil } from './pages/Perfil';
import { CadastrarUnidade } from './pages/CadastrarUnidade';
import { ListarUnidades } from './pages/ListarUnidades';
import { CadastrarUsuario } from './pages/CadastrarUsuario';
import { Coordenacao } from './pages/Coordenacao';
import { CadastrarTurma } from './pages/CadastrarTurma';
import { ListarTurmas } from './pages/ListarTurmas';
import { GestaoTurmas } from './pages/GestaoTurmas';
import {CadastrarCoordenador} from './pages/CadastrarCoordenador'
import { Observatorio } from './pages/Observatorio';

// Um componente simples para proteger rotas privadas
function PrivateRoute({ children }) {
  const { user } = useAuth();
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
}

// Rota que exige ser professor
function ProfessorRoute({ children }) {
  const { user } = useAuth();
  if (!user?.is_professor) return <Navigate to="/dashboard" />;
  return children;
}

// Rota que bloqueia alunos
function NotAlunoRoute({ children }) {
  const { user } = useAuth();
  if (user?.is_aluno && !user?.is_professor && !user?.is_coordenador && !user?.is_admin) return <Navigate to="/dashboard" />;
  return children;
}

// Rota que exige gestor (admin/coord nacional/coord)
function GestorRoute({ children }) {
  const { user } = useAuth();
  if (!user?.is_admin && !user?.is_coordenador_nacional && !user?.is_coordenador) return <Navigate to="/dashboard" />;
  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Rotas Publicas */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/observatorio" element={<Observatorio />} />
          <Route path="/cadastro" element={<CadastrarUsuario />} />

          {/* Rota Privada: Dashboard (antiga Home) */}
          <Route path="/dashboard" element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          } />

          <Route path="/perfil" element={
            <PrivateRoute>
              <Perfil />
            </PrivateRoute>
          } />

          {/* Rota Privada: Editar Turma */}
          <Route path="/turma/editar/:id" element={
            <PrivateRoute>
              <EditarTurma />
            </PrivateRoute>
          } />
          <Route path="/unidades" element={<PrivateRoute><GestorRoute><ListarUnidades /></GestorRoute></PrivateRoute>} />
          <Route path="/unidades/nova" element={<PrivateRoute><GestorRoute><CadastrarUnidade /></GestorRoute></PrivateRoute>} />

          {/* Usuario */}
          <Route path="/usuarios/novo" element={<CadastrarUsuario />} />

          {/* Coordenacao */}
          <Route path="/coordenacao" element={<PrivateRoute><Coordenacao /></PrivateRoute>} />
          <Route path="/coordenacao/nova" element={
            <PrivateRoute>
              <CadastrarCoordenador />
            </PrivateRoute>
          } />

          {/* Turmas */}
          <Route path="/turmas" element={<PrivateRoute><ListarTurmas /></PrivateRoute>} />
          <Route path="/turmas/nova" element={<PrivateRoute><ProfessorRoute><CadastrarTurma /></ProfessorRoute></PrivateRoute>} />
          <Route path="/turmas/gestao" element={
            <PrivateRoute>
              <NotAlunoRoute>
                <GestaoTurmas />
              </NotAlunoRoute>
            </PrivateRoute>
          }/>

        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
