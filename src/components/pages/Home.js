import { useState, useEffect, useMemo } from 'react';
import { useColors } from '../layout/ColorContext';
import savings from '../../img/savings.svg';
import LinkButton from '../layout/LinkButton';

function Home() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const colors = useColors();

    useEffect(() => {
        fetch("http://localhost:5000/projects")
            .then((response) => response.json())
            .then((data) => {
                setProjects(data);
                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
                setLoading(false);
            });
    }, []);

    const categories = useMemo(() => {
        const initialCategories = {
            infraestrutura: { color: colors['category-infraestrutura'], total: 0, cost: 0 },
            desenvolvimento: { color: colors['category-desenvolvimento'], total: 0, cost: 0 },
            design: { color: colors['category-design'], total: 0, cost: 0 },
            planejamento: { color: colors['category-planejamento'], total: 0, cost: 0 },
            administração: { color: colors['category-administração'], total: 0, cost: 0 },
        };

        projects.forEach(project => {
            const categoryName = project.category?.name?.toLowerCase();
            if (initialCategories[categoryName]) {
                const projectBudget = Number(project.budget) || 0;
                const serviceCosts = (project.services || []).reduce(
                    (sum, service) => sum + Number(service.cost || 0),
                    0
                );

                initialCategories[categoryName].total += projectBudget;
                initialCategories[categoryName].cost += serviceCosts;
            }
        });

        return initialCategories;
    }, [projects, colors]);

    return (
        <section className="w-full flex flex-col items-center justify-center p-8 md:p-16">
            <h1 className="text-4xl font-semibold text-center mb-4">
                Bem-vindo ao <span className="text-yellow-400 px-1 font-bold">Costs.</span>
            </h1>
            <p className="text-lg text-gray-600 text-center mb-6">
                Comece a gerenciar os seus projetos agora mesmo!
            </p>
            <LinkButton to="/newproject" text="Criar Projeto" className="mb-8" />

            {/* Imagem centralizada e fixa */}
            <img
                src={savings}
                alt="Ilustração de economia"
                className="w-3/4 md:w-2/5 my-8 mx-auto"
                loading="lazy"
            />

            {/* Condicional de Carregamento */}
            {loading ? (
                <p className="text-gray-600 mt-8">Carregando projetos...</p>
            ) : (
                <Dashboard categories={categories} />
            )}
        </section>
    );


}
function Dashboard({ categories }) {
    return (
        <div className="w-full max-w-4xl mt-12">
            <h2 className="text-2xl mb-6">Dashboard de Projetos:</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {Object.entries(categories).map(([key, { color, total, cost }]) => {
                    // Verifica se o valor total e o custo são válidos
                    if (!total || total <= 0) return null; // Não renderiza se não houver total ou se for zero

                    // Calcular o saldo restante
                    const remaining = total - cost;

                    return (
                        <CategoryCard
                            key={key}
                            color={color}
                            category={key}
                            total={total}
                            cost={cost}
                            remaining={remaining} // Passando o saldo restante
                        />
                    );
                })}
            </div>
        </div>
    );
}

function CategoryCard({ color, category, total, cost, remaining }) {
    return (
        <>
            <div className="relative bg-white border border-gray-300 shadow-md rounded-md p-4 pl-5 transition hover:shadow-lg">
                {/* Faixa lateral fina e fixa na esquerda */}
                <span className={`absolute top-0 left-0 h-full w-1.5 rounded-l-md ${color}`}></span>
                <div>
                    <h3 className="text-lg font-semibold capitalize">{category}</h3>

                    <p className="text-gray-600">
                        Total: <span className="text-black whitespace-nowrap">R$ {total ? total.toFixed(2) : "0.00"}</span>
                    </p>

                    <p className="text-gray-600">
                        Gasto: <span className="text-red-600 whitespace-nowrap">R$ {cost ? cost.toFixed(2) : "0.00"}</span>
                    </p>

                    <p className="text-gray-600">
                        Restante: <span className="text-green-600 whitespace-nowrap">R$ {remaining ? remaining.toFixed(2) : "0.00"}</span>
                    </p>
                </div>
            </div>

        </>
    );
}


export default Home;
