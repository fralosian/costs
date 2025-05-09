import { BsFillTrashFill, BsPencil } from 'react-icons/bs';

function ServiceCard({ id, name, cost, description, handleRemove, handleEdit }) {
    const remove = (e) => {
        e.preventDefault();
        handleRemove(id, cost);
    };

    const edit = (e) => {
        e.preventDefault();
        handleEdit({ id, name, cost, description });
    };

    // Garantir que o 'cost' seja um número
    const numericCost = Number(cost); // Isso converte 'cost' para número
    const formattedCost = numericCost ? numericCost.toFixed(2) : "0.00"; // Se 'cost' for válido, formata com 2 casas decimais

    return (
        <div className="w-full p-6 border border-gray-200 rounded-lg mb-4 overflow-hidden shadow-sm transition hover:shadow-md">
            <h4 className="text-xl font-medium text-gray-800 mb-2">{name}</h4>
            <p className="text-sm text-gray-600 mb-1">
                <span className="font-semibold">Custo total:</span> R${formattedCost}
            </p>
            <p className="text-sm text-gray-600 mb-4">
                <span className="font-semibold">Descrição:</span> {description}
            </p>
            <div className="flex justify-end gap-4">
                <button 
                    onClick={edit} 
                    className="flex items-center gap-2 px-4 py-2 border border-gray-600 text-gray-600 rounded-md hover:bg-gray-200 hover:text-gray-900 transition"
                >
                    <BsPencil /> Editar
                </button>
                <button 
                    onClick={remove} 
                    className="flex items-center gap-2 px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-100 hover:text-red-700 transition"
                >
                    <BsFillTrashFill /> Excluir
                </button>
            </div>
        </div>
    );
}

export default ServiceCard;
