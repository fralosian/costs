import { Link } from "react-router-dom";
import { BsPencil, BsFillTrashFill } from 'react-icons/bs';
import { useColors } from '../layout/ColorContext';

function ProjectCard({ id, name, budget, category, cost, handleRemove }) {
    const remove = (e) => {
        e.preventDefault();
        handleRemove(id);
    };


    const colors = useColors();
    const categoryClass = colors[`category-${category.toLowerCase()}`] || 'bg-gray-300';

    // Calculando o saldo
    const remaining = budget - cost;

    return (
        <div className="relative bg-white border border-gray-300 shadow-sm rounded-md p-4 transition hover:shadow-md w-full md:w-[300px]">
            {/* Borda lateral colorida */}
            <span className={`absolute left-0 top-0 h-full w-1.5 rounded-l-md ${categoryClass}`}></span>

            <h4 className="text-xl font-semibold text-gray-800 mb-2">{name}</h4>

            <p className="text-gray-600 mb-1">
                <span className="font-medium">Categoria:</span> {category}
            </p>
            <p className="text-gray-600 mb-1">
                <span className="font-medium">Orçamento:</span> R$ {Number(budget).toFixed(2)}
            </p>
            <p className="text-gray-600 mb-1">
                <span className="font-medium">Gasto:</span> R$ {cost ? cost.toFixed(2) : "0.00"}
            </p>
            <p className="text-gray-600 mb-4">
                <span className="font-medium">Restante:</span> R$ {remaining ? remaining.toFixed(2) : "0.00"}
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
                    className="flex items-center gap-1 px-3 py-1 border border-gray-700 text-gray-700 rounded hover:bg-gray-700 hover:text-yellow-400 transition"
                >
                    <BsFillTrashFill /> Excluir
                </button>
            </div>
        </div>
    );
}

export default ProjectCard;
