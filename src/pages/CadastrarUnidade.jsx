import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { unidadeService } from '../api/services';
import { BackButton } from '../components/BackButton';

export function CadastrarUnidade() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await unidadeService.create(data);
      alert('Unidade cadastrada com sucesso!');
      navigate('/unidades');
    } catch (error) {
      alert('Erro ao cadastrar unidade.');
    }
  };

  return (
    <div className="min-h-screen bg-profgeo-50 p-6">
      <div className="max-w-lg mx-auto">
        
        {/* BOTÃO VOLTAR */}
        <div className="mb-6">
          <BackButton to="/unidades" label="Voltar para Unidades" />
        </div>

        {/* CARTÃO DO FORMULÁRIO */}
        <div className="bg-white p-8 rounded-xl shadow-md border border-profgeo-100">
          <h2 className="text-2xl font-bold mb-6 text-profgeo-900">Nova Instituição Associada</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Unidade</label>
                <input {...register("nome_unidade", { required: true })} className="w-full p-2 border rounded focus:ring-2 focus:ring-profgeo-400 text-gray-900" />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Município</label>
                    <input {...register("municipio", { required: true })} className="w-full p-2 border rounded focus:ring-2 focus:ring-profgeo-400 text-gray-900" />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">UF</label>
                    <input {...register("estado", { required: true, maxLength: 2 })} placeholder="RS" className="w-full p-2 border rounded focus:ring-2 focus:ring-profgeo-400 uppercase" />
                </div>
            </div>
            
            <div className="flex items-center gap-2 pt-2">
                <input type="checkbox" {...register("status")} defaultChecked={true} className="h-4 w-4 text-profgeo-600 rounded" />
                <label className="text-sm text-gray-700">Unidade Ativa</label>
            </div>

            <button type="submit" className="bg-green-600 text-white p-2 rounded w-full font-bold hover:bg-green-700 transition mt-4">
                Cadastrar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}