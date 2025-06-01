import ProjectForm from '../project/ProjectForm';
import { useNavigate } from 'react-router-dom';

// FIREBASE
import { db } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';

function NewProject() {
  const navigate = useNavigate();

  async function createPost(project) {
    project.cost = 0;
    project.services = [];

    try {
      // Adiciona o projeto à coleção "projects" no Firestore
      await addDoc(collection(db, 'projects'), project);

      // Redireciona para a lista de projetos com uma mensagem de sucesso
      navigate('/projects', { state: { message: 'Projeto criado com sucesso!' } });
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-2xl font-bold mb-2">Criar Projeto</h1>
      <p className="text-gray-600 mb-6">Crie seu projeto para depois adicionar os serviços</p>
      <ProjectForm handleSubmit={createPost} btnText="Criar Projeto" />
    </div>
  );
}

export default NewProject;
