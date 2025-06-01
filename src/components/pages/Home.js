import { useState, useEffect, useMemo } from 'react';
import savings from '../../img/savings.svg';
import LinkButton from '../layout/LinkButton';

import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

function Home() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        // Busca categorias do Firebase
        const categoriesSnapshot = await getDocs(collection(db, 'categories'));
        const categoriesList = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Busca projetos do Firebase
        const projectsSnapshot = await getDocs(collection(db, 'projects'));
        const projectsList = projectsSnapshot.docs.map(doc => doc.data());

        setCategories(categoriesList);
        setProjects(projectsList);
      } catch (error) {
        console.error('Erro ao buscar dados:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Agora calcula os totais agrupando por categoria, usando as categorias carregadas
  const categoriesWithTotals = useMemo(() => {
    // Cria um objeto para acumular os valores
    const summary = {};

    // Inicializa as categorias no summary com totais zero
    categories.forEach(cat => {
      summary[cat.name.toLowerCase()] = {
        name: cat.name,
        color: cat.color,
        total: 0,
        cost: 0
      };
    });

    // Acumula orçamento e custos dos projetos por categoria
    projects.forEach(project => {
      const catName = project.category?.name?.toLowerCase();
      if (catName && summary[catName]) {
        const projectBudget = Number(project.budget) || 0;
        const serviceCosts = (project.services || []).reduce(
          (sum, service) => sum + Number(service.cost || 0),
          0
        );

        summary[catName].total += projectBudget;
        summary[catName].cost += serviceCosts;
      }
    });

    return summary;
  }, [projects, categories]);

  return (
    <section className="w-full flex flex-col items-center justify-center p-8 md:p-16">
      <h1 className="text-4xl font-semibold text-center mb-4">
        Bem-vindo ao <span className="text-yellow-400 px-1 font-bold">Costs.</span>
      </h1>
      <p className="text-lg text-gray-600 text-center mb-6">
        Comece a gerenciar os seus projetos agora mesmo!
      </p>
      <LinkButton to="/newproject" text="Criar Projeto" className="mb-8" />

      <img
        src={savings}
        alt="Ilustração de economia"
        className="w-3/4 md:w-2/5 my-8 mx-auto"
        loading="lazy"
      />

      {loading ? (
        <p className="text-gray-600 mt-8">Carregando projetos...</p>
      ) : (
        <Dashboard categories={categoriesWithTotals} />
      )}
    </section>
  );
}

function Dashboard({ categories }) {
  return (
    <div className="w-full max-w-4xl mt-12">
      <h2 className="text-2xl mb-6">Dashboard de Projetos:</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(categories).map(([key, { color, total, cost, name }]) => {
          if (!total || total <= 0) return null;
          const remaining = total - cost;

          return (
            <CategoryCard
              key={key}
              color={color}
              category={name}
              total={total}
              cost={cost}
              remaining={remaining}
            />
          );
        })}
      </div>
    </div>
  );
}

function CategoryCard({ color, category, total, cost, remaining }) {
  return (
    <div className="relative bg-white border border-gray-300 shadow-md rounded-md p-4 pl-5 transition hover:shadow-lg">
      {/* Faixa lateral com cor da categoria (cor em HEX, inline style) */}
      <span
        className="absolute top-0 left-0 h-full w-1.5 rounded-l-md"
        style={{ backgroundColor: color }}
      ></span>
      <div>
        <h3 className="text-lg font-semibold capitalize">{category}</h3>
        <p className="text-gray-600">
          Total: <span className="text-black whitespace-nowrap">R$ {total.toFixed(2)}</span>
        </p>
        <p className="text-gray-600">
          Gasto: <span className="text-red-600 whitespace-nowrap">R$ {cost.toFixed(2)}</span>
        </p>
        <p className="text-gray-600">
          Restante: <span className="text-green-600 whitespace-nowrap">R$ {remaining.toFixed(2)}</span>
        </p>
      </div>
    </div>
  );
}

export default Home;
