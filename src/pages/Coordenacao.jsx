import { useForm } from 'react-hook-form';
import { coordenacaoService } from '../api/services';

export function Coordenacao() {
  const { register: registerAdd, handleSubmit: submitAdd } = useForm();
  const { register: registerDel, handleSubmit: submitDel } = useForm();

  const onAdd = async (data) => {
    try {
      await coordenacaoService.create(data);
      alert('Coordenação vinculada!');
    } catch (e) { alert('Erro ao vincular'); }
  };

  const onRemove = async (data) => {
    try {
      await coordenacaoService.remove(data);
      alert('Coordenação removida!');
    } catch (e) { alert('Erro ao remover'); }
  };

  return (
    <div className="p-8 grid md:grid-cols-2 gap-8">
      {/* Formulário de Adicionar */}
      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-4 text-green-700">Adicionar Coordenação</h3>
        <form onSubmit={submitAdd(onAdd)} className="space-y-3">
            <input {...registerAdd("id_unidade")} placeholder="ID Unidade (UUID)" className="w-full p-2 border rounded text-gray-900 bg-white" />
            <input {...registerAdd("id_usuario")} placeholder="ID Usuário (UUID)" className="w-full p-2 border rounded text-gray-900 bg-white" />
            <input type="number" {...registerAdd("ano_vigencia")} placeholder="Ano Vigência" className="w-full p-2 border rounded text-gray-900 bg-white" />
            <select {...registerAdd("coordenador_type")} className="w-full p-2 border rounded text-gray-900 bg-white">
                <option value="Coordenador">Coordenador</option>
                <option value="Vice_Coordenador">Vice Coordenador</option>
            </select>
            <button className="w-full bg-green-600 text-white p-2 rounded">Vincular</button>
        </form>
      </div>

      {/* Formulário de Remover */}
      <div className="border p-4 rounded shadow">
        <h3 className="text-xl font-bold mb-4 text-red-700">Remover Coordenação</h3>
        <form onSubmit={submitDel(onRemove)} className="space-y-3">
            <input {...registerDel("id_unidade")} placeholder="ID Unidade (UUID)" className="w-full p-2 border rounded text-gray-900 bg-white" />
            <input {...registerDel("id_usuario")} placeholder="ID Usuário (UUID)" className="w-full p-2 border rounded text-gray-900 bg-white" />
            <input type="number" {...registerDel("ano_vigencia")} placeholder="Ano Vigência" className="w-full p-2 border rounded text-gray-900 bg-white" />
            <button className="w-full bg-red-600 text-white p-2 rounded">Remover</button>
        </form>
      </div>
    </div>
  );
}