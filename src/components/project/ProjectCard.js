import { Link } from "react-router-dom";
import { BsPencil, BsFillTrashFill } from 'react-icons/bs';
import { useState } from 'react';

function ProjectCard({ id, name, budget, category, cost, handleRemove }) {
    const [deleting, setDeleting] = useState(false);

    const remove = async (e) => {
        e.preventDefault();
        setDeleting(true);
        await handleRemove(id);
        setDeleting(false);
    };

    const remaining = Number(budget) - Number(cost || 0);

    return (
        <div className="relative bg-white border border-gray-300 shadow-sm rounded-md p-4 transition hover:shadow-md w-full md:w-[300px]">
            <span
                className="absolute left-0 top-0 h-full w-1.5 rounded-l-md"
                style={{ backgroundColor: category?.color || '#d1d5db' }}
            ></span>

            <h4 className="text-xl font-semibold text-gray-800 mb-2">{name}</h4>

            <p className="text-gray-600 mb-1">
                <span className="font-medium">Categoria:</span> {category?.name || 'Sem categoria'}
            </p>
            <p className="text-gray-600 mb-1">
                <span className="font-medium">Orçamento:</span> R$ {Number(budget).toFixed(2)}
            </p>
            <p className="text-gray-600 mb-1">
                <span className="font-medium">Gasto:</span> R$ {Number(cost || 0).toFixed(2)}
            </p>
            <p className="text-gray-600 mb-4">
                <span className="font-medium">Restante:</span> R$ {Number(remaining).toFixed(2)}
            </p>

            <div className="flex gap-2 text-sm">
                <Link
                    to={`/project/${id}`}
                    className="flex items-center gap-1 px-3 py-1 border border-gray-700 text-gray-700 rounded hover:bg-gray-700 hover:text-yellow-400 transition"
                >
                    <BsPencil /> Editar
                </Link>
                <button
                    onClick={remove}
                    disabled={deleting}
                    className={`flex items-center gap-1 px-3 py-1 border border-gray-700 text-gray-700 rounded transition
                    ${deleting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-700 hover:text-yellow-400'}`}
                >
                    <BsFillTrashFill /> {deleting ? 'Excluindo...' : 'Excluir'}
                </button>
            </div>
        </div>
    );
}

export default ProjectCard;
