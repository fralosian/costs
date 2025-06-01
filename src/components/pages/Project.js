import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';  // ajuste o caminho conforme seu projeto

import useCategories from '../../data/useCategories';
import Loading from '../layout/Loading';
import Container from '../layout/Container';
import ProjectForm from '../project/ProjectForm';
import Message from '../layout/Message';
import ServiceForm from '../service/ServiceForm';
import ServiceCard from '../service/ServiceCard';

function Project() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [services, setServices] = useState([]);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [message, setMessage] = useState();
    const [type, setType] = useState();
    const [editService, setEditService] = useState(null);
    const [editedServiceData, setEditedServiceData] = useState({ name: '', cost: '', description: '' });
    const { categories, loading: loadingCategories } = useCategories();


    useEffect(() => {
        async function fetchProject() {
            try {
                const docRef = doc(db, 'projects', id);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();

                    // Aqui pega a categoria com cor do Firebase (dinâmica)
                    const category = categories.find(cat => cat.id === data.category.id);

                    const projectWithCategoryColor = {
                        id: docSnap.id,
                        ...data,
                        category: {
                            ...data.category,
                            color: category ? category.color : '#ccc',
                        }
                    };

                    setProject(projectWithCategoryColor);
                    setServices(data.services || []);
                } else {
                    console.log('No such project!');
                }
            } catch (err) {
                console.log(err);
            }
        }

        if (!loadingCategories) {
            fetchProject();
        }
    }, [id, categories, loadingCategories]);

    async function editPost(projectToUpdate) {
        setMessage('');

        if (projectToUpdate.budget < projectToUpdate.cost) {
            setMessage('O orçamento não pode ser menor que o custo');
            setType('error');
            return false;
        }

        try {
            const docRef = doc(db, 'projects', projectToUpdate.id);
            await updateDoc(docRef, {
                ...projectToUpdate,
            });

            setProject(projectToUpdate);
            setShowProjectForm(false);
            setMessage('Projeto atualizado com sucesso!');
            setType('success');
        } catch (err) {
            setMessage('Erro ao atualizar o projeto.');
            setType('error');
            console.log(err);
        }
    }

    async function createService(projectWithNewService) {
        setMessage('');

        const lastService = projectWithNewService.services[projectWithNewService.services.length - 1];
        lastService.id = uuidv4();

        const lastServiceCost = parseFloat(lastService.cost);
        const newCost = parseFloat(projectWithNewService.cost) + lastServiceCost;

        if (newCost > parseFloat(projectWithNewService.budget)) {
            setMessage(null);
            setTimeout(() => {
                setMessage('Orçamento ultrapassado, verifique o valor do serviço restante');
                setType('error');
            }, 0);

            projectWithNewService.services.pop();
            return false;
        }

        projectWithNewService.cost = newCost;

        try {
            const docRef = doc(db, 'projects', projectWithNewService.id);
            await updateDoc(docRef, {
                ...projectWithNewService,
            });

            setProject(projectWithNewService);
            setServices(projectWithNewService.services);
            setShowServiceForm(false);
            setMessage(null);
            setTimeout(() => {
                setMessage('Serviço adicionado com sucesso!');
                setType('success');
            }, 0);
        } catch (err) {
            console.log(err);
            setMessage('Erro ao atualizar o projeto.');
            setType('error');
        }
    }

    async function removeService(serviceId, cost) {
        setMessage('');

        const servicesUpdated = project.services.filter(service => service.id !== serviceId);
        const projectUpdated = {
            ...project,
            services: servicesUpdated,
            cost: parseFloat(project.cost) - parseFloat(cost)
        };

        try {
            const docRef = doc(db, 'projects', project.id);
            await updateDoc(docRef, {
                ...projectUpdated,
            });

            setProject(projectUpdated);
            setServices(servicesUpdated);
            setMessage('Serviço removido com sucesso!');
            setType('success');
        } catch (err) {
            console.log(err);
        }
    }

    function startEditingService(service) {
        setEditService(service);
        setEditedServiceData({
            name: service.name,
            cost: service.cost,
            description: service.description,
        });
    }

    function cancelEditing() {
        setEditService(null);
    }

    async function updateService(e) {
        e.preventDefault();
        setMessage('');

        const updatedService = {
            ...editService,
            name: editedServiceData.name,
            cost: editedServiceData.cost,
            description: editedServiceData.description,
        };

        const updatedServices = services.map(service =>
            service.id === updatedService.id ? updatedService : service
        );

        const updatedCost = updatedServices.reduce((acc, curr) => acc + parseFloat(curr.cost), 0);
        const updatedProject = { ...project, services: updatedServices, cost: updatedCost };

        try {
            const docRef = doc(db, 'projects', project.id);
            await updateDoc(docRef, {
                ...updatedProject,
            });

            setProject(updatedProject);
            setServices(updatedServices);
            setMessage('Serviço atualizado com sucesso!');
            setType('success');
            setEditService(null);
        } catch (err) {
            console.log(err);
            setMessage('Erro ao atualizar o serviço.');
            setType('error');
        }
    }

    function handleEditInputChange(e) {
        const { name, value } = e.target;
        setEditedServiceData({
            ...editedServiceData,
            [name]: value,
        });
    }

    function toggleProjectForm() {
        setShowProjectForm(!showProjectForm);
    }

    function toggleServiceForm() {
        setShowServiceForm(!showServiceForm);
    }

    return (
        <>
            {project ? (
                <div className="w-full p-8">

                    <div className="bg-gray-900 text-white rounded-lg p-6 shadow-md mb-6">
                        <h1 className="text-3xl font-semibold text-center text-yellow-400 mb-6">
                            Projeto: {project.name}
                        </h1>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center space-x-4">
                                <p className="text-lg">Orçamento:</p>
                                <span className="text-xl font-semibold text-yellow-400">
                                    R$ {parseFloat(project.budget).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <p className="text-lg">Gasto Atual:</p>
                                <span className="text-xl font-semibold text-yellow-400">
                                    R$ {parseFloat(project.cost).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <p className="text-lg">Restante:</p>
                                <span className="text-xl font-semibold text-yellow-400">
                                    R$ {(parseFloat(project.budget) - parseFloat(project.cost)).toFixed(2)}
                                </span>
                            </div>

                            <div className="flex items-center space-x-4">
                                <p className="text-lg">Categoria:</p>
                                <div className="flex items-center">
                                    <span
                                        className="w-3 h-3 rounded-full mr-2"
                                        style={{ backgroundColor: project?.category?.color || '#ccc' }}
                                    ></span>
                                    <span className="text-xl font-semibold">{project.category?.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {message && <Message type={type} msg={message} />}
                    <div className="flex flex-col md:flex-row mb-8 space-y-4 md:space-y-0 md:space-x-4">
                        <div className="flex-1 mb-4">
                            <button
                                className="bg-gray-900 text-white px-4 py-2 rounded-md shadow hover:bg-gray-700 w-full"
                                onClick={toggleProjectForm}
                            >
                                {!showProjectForm ? 'Editar Projeto' : 'Fechar'}
                            </button>
                            {showProjectForm && (
                                <div className="mt-4">
                                    <ProjectForm handleSubmit={editPost} btnText="Concluir edição" projectData={project} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 mb-4">
                            <button
                                className="bg-gray-900 text-white px-4 py-2 rounded-md shadow hover:bg-gray-700 w-full"
                                onClick={toggleServiceForm}
                            >
                                {!showServiceForm ? 'Adicionar Serviço' : 'Fechar'}
                            </button>
                            {showServiceForm && (
                                <div className="mt-4">
                                    <ServiceForm handleSubmit={createService} btnText="Adicionar Serviço" projectData={project} />
                                </div>
                            )}
                        </div>
                    </div>

                    <h2 className="text-2xl font-semibold mb-4">Serviços</h2>
                    <Container customClass="start">
                        {services.length > 0 ? (
                            services.map(service => (
                                editService && editService.id === service.id ? (
                                    <div key={service.id} className="mt-4">
                                        <form onSubmit={updateService} className="bg-white border border-gray-900 mb-4 p-4 rounded-md shadow-lg">
                                            <h3 className="text-xl font-semibold mb-4 text-yellow-400">Editar Serviço</h3>
                                            <div className="mb-4">
                                                <label htmlFor="name" className="block">Nome:</label>
                                                <input
                                                    type="text"
                                                    id="name"
                                                    name="name"
                                                    value={editedServiceData.name}
                                                    onChange={handleEditInputChange}
                                                    className="mt-1 block w-full border border-gray-800 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="cost" className="block">Custo:</label>
                                                <input
                                                    type="number"
                                                    id="cost"
                                                    name="cost"
                                                    value={editedServiceData.cost}
                                                    onChange={handleEditInputChange}
                                                    className="mt-1 block w-full border border-gray-800 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                    required
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label htmlFor="description" className="block">Descrição:</label>
                                                <textarea
                                                    id="description"
                                                    name="description"
                                                    value={editedServiceData.description}
                                                    onChange={handleEditInputChange}
                                                    className="mt-1 block w-full border border-gray-800 rounded-md shadow-sm px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                                    required
                                                ></textarea>
                                            </div>
                                            <button type="submit" className="bg-yellow-400 text-black px-4 py-2 rounded-md shadow hover:bg-yellow-300">
                                                Atualizar Serviço
                                            </button>
                                            <button
                                                type="button"
                                                onClick={cancelEditing}
                                                className="ml-4 bg-red-500 text-white px-4 py-2 rounded-md shadow hover:bg-red-400"
                                            >
                                                Cancelar
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <ServiceCard
                                        key={service.id}
                                        id={service.id}
                                        name={service.name}
                                        cost={service.cost}
                                        description={service.description}
                                        handleRemove={removeService}
                                        handleEdit={startEditingService}
                                    />
                                )
                            ))
                        ) : (
                            <p className="text-center text-gray-500">Nenhum serviço encontrado.</p>
                        )}
                    </Container>
                </div>
            ) : (
                <Loading />
            )}
        </>
    );
}

export default Project;
