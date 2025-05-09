import { v4 as uuidv4 } from 'uuid';
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useColors } from '../layout/ColorContext';

import Loading from '../layout/Loading';
import Container from '../layout/Container';
import ProjectForm from '../project/ProjectForm';
import Message from '../layout/Message';
import ServiceForm from '../service/ServiceForm';
import ServiceCard from '../service/ServiceCard';

function Project() {
    const { id } = useParams();
    const colors = useColors();

    const [project, setProject] = useState([]);
    const [services, setServices] = useState([]);
    const [showProjectForm, setShowProjectForm] = useState(false);
    const [showServiceForm, setShowServiceForm] = useState(false);
    const [message, setMessage] = useState();
    const [type, setType] = useState();
    const [editService, setEditService] = useState(null);
    const [editedServiceData, setEditedServiceData] = useState({ name: '', cost: '', description: '' });

    useEffect(() => {
        setTimeout(() => {
            fetch(`http://localhost:5000/projects/${id}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            })
                .then((resp) => resp.json())
                .then((data) => {
                    setProject(data);
                    setServices(data.services);
                })
                .catch((err) => console.log(err));
        }, 2000);
    }, [id]);

    function editPost(project) {
        setMessage('');

        if (project.budget < project.cost) {
            setMessage('O orçamento não pode ser menor que o custo');
            setType('error');
            return false;
        }

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(data);
                setShowProjectForm(false);
                setMessage('Projeto atualizado com sucesso!');
                setType('success');
            })
            .catch((err) => {
                setMessage('Erro ao atualizar o projeto.');
                setType('error');
                console.log(err);
            });
    }

    function createService(project) {
        setMessage('');

        const lastService = project.services[project.services.length - 1];
        lastService.id = uuidv4();

        const lastServiceCost = lastService.cost;
        const newCost = parseFloat(project.cost) + parseFloat(lastServiceCost);

        if (newCost > parseFloat(project.budget)) {
            setMessage(null);
            setTimeout(() => {
                setMessage('Orçamento ultrapassado, verifique o valor do serviço restante');
                setType('error');
            }, 0);

            project.services.pop();
            return false;
        }

        project.cost = newCost;

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(project),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(data);
                setServices(data.services);
                setShowServiceForm(false);
                setMessage(null);
                setTimeout(() => {
                    setMessage('Serviço adicionado com sucesso!');
                    setType('success');
                }, 0);
            })
            .catch((err) => {
                console.log(err);
                setMessage('Erro ao atualizar o projeto.');
                setType('error');
            });
    }

    function removeService(id, cost) {
        setMessage('');

        const servicesUpdated = project.services.filter(
            (service) => service.id !== id
        );
        const projectUpdated = { ...project, services: servicesUpdated, cost: parseFloat(project.cost) - parseFloat(cost) };

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(projectUpdated),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(data);
                setServices(servicesUpdated);
                setMessage('Serviço removido com sucesso!');
                setType('success');
            })
            .catch((err) => console.log(err));
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

    function updateService(e) {
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
        const updatedProject = { ...project, services: updatedServices, cost: updatedServices.reduce((acc, curr) => acc + parseFloat(curr.cost), 0) };

        fetch(`http://localhost:5000/projects/${project.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedProject),
        })
            .then((resp) => resp.json())
            .then((data) => {
                setProject(data);
                setServices(updatedServices);
                setMessage('Serviço atualizado com sucesso!');
                setType('success');
                setEditService(null);
            })
            .catch((err) => {
                console.log(err);
                setMessage('Erro ao atualizar o serviço.');
                setType('error');
            });
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

    const categoryColorClass = colors[`category-${project.category?.name.toLowerCase()}`] || 'bg-gray-300';

    return (
        <>
            {project.name ? (
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
                                    <span className={`w-3 h-3 rounded-full mr-2 ${categoryColorClass}`}></span>
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
