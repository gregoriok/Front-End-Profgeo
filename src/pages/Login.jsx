import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { useNavigate, Link } from 'react-router-dom';

export function Login() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const { login } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await login(data.email, data.senha);
      addToast('Login realizado com sucesso!', 'success');
      navigate('/dashboard');
    } catch (error) {
      const mensagem = error.response?.data?.detail || "Verifique suas credenciais e tente novamente.";
      addToast(mensagem, 'error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-profgeo-50 p-4">
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-md border border-profgeo-100">
        <div className="flex justify-center mb-6">
          <img src="/Logo.PNG" alt="ObservaPROFGEO" className="h-20" />
        </div>
        <h2 className="text-2xl font-bold mb-6 text-center text-profgeo-900">Acesso ao Sistema</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="w-full p-3 border border-profgeo-200 rounded-lg focus:ring-2 focus:ring-profgeo-400 focus:border-profgeo-400 outline-none transition bg-white text-gray-900"
              placeholder="seu@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input
              type="password"
              {...register("senha", { required: true })}
              className="w-full p-3 border border-profgeo-200 rounded-lg focus:ring-2 focus:ring-profgeo-400 focus:border-profgeo-400 outline-none transition bg-white text-gray-900"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-profgeo-600 text-white font-bold py-3 rounded-lg hover:bg-profgeo-700 transition shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-profgeo-100 text-center">
          <p className="text-gray-500 text-sm mb-3">Ainda nao tem uma conta?</p>
          <Link
            to="/cadastro"
            className="block w-full text-profgeo-600 bg-profgeo-50 hover:bg-profgeo-100 font-bold py-3 rounded-lg transition border border-profgeo-200"
          >
            Cadastre-se Gratuitamente
          </Link>
        </div>

        <div className="mt-4 text-center">
          <Link to="/" className="text-profgeo-400 hover:text-profgeo-600 text-sm transition-colors">
            Voltar para a pagina inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
