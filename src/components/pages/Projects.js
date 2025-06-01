import { useLocation } from "react-router-dom";
import Message from "../layout/Message";
import Container from "../layout/Container";
import Loading from "../layout/Loading";
import LinkButton from "../layout/LinkButton";
import ProjectCard from "../project/ProjectCard";

import { useState, useEffect } from "react";

// FIREBASE
import { db } from '../../firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [removeLoading, setRemoveLoading] = useState(false);
  const [projectMessage, setProjectMessage] = useState('');

  const location = useLocation();
  let message = '';
  if (location.state) {
    message = location.state.message;
  }

  useEffect(() => {
    const fetchProjectsAndCategories = async () => {
      try {
        const projectsSnapshot = await getDocs(collection(db, "projects"));
        const categoriesSnapshot = await getDocs(collection(db, "categories"));

        const categories = categoriesSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        const projects = projectsSnapshot.docs.map(doc => {
          const project = doc.data();
          const matchedCategory = categories.find(cat => cat.id === project.category?.id);

          return {
            id: doc.id,
            ...project,
            category: matchedCategory || { name: 'Sem categoria', color: '#d1d5db' }
          };
        });

        setProjects(projects);
        setRemoveLoading(true);
      } catch (error) {
        console.error("Erro ao buscar projetos e categorias:", error);
      }
    };

    setTimeout(fetchProjectsAndCategories, 1000);
  }, []);

  async function removeProject(id) {
    try {
      await deleteDoc(doc(db, "projects", id));
      setProjects(prev => prev.filter(p => p.id !== id));
      setProjectMessage('Projeto removido com sucesso!');
    } catch (error) {
      console.error("Erro ao remover projeto:", error);
      setProjectMessage('Erro ao remover o projeto.');
    }
  }

  return (
    <div className="w-full p-8">
      <div className="flex justify-between mb-8">
        <h1 className="text-3xl font-bold">Meus Projetos</h1>
        <LinkButton to="/newproject" text="Criar Projeto" />
      </div>
      {message && <Message type="success" msg={message} />}
      {projectMessage && <Message type="success" msg={projectMessage} />}

      <Container customClass="flex flex-wrap gap-4">
        {projects.length > 0 ? (
          projects.map((project) => (
            <ProjectCard
              key={project.id}
              id={project.id}
              name={project.name}
              budget={project.budget}
              cost={project.cost}
              category={project.category}
              handleRemove={removeProject}
            />
          ))
        ) : (
          <p>Nenhum projeto encontrado. Clique em "Criar" para adicionar um novo projeto.</p>
        )}
        {!removeLoading && <Loading />}
      </Container>
    </div>
  );
}

export default Projects;
