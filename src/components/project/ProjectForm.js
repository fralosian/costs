import { useEffect, useState } from 'react';
import Input from '../form/Input';
import Select from '../form/Select';
import SubmitButton from '../form/SubmitButton';
import CategoryModal from '../form/CategoryModal';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase';

function ProjectForm({ handleSubmit, btnText, projectData }) {
    const [categories, setCategories] = useState([]);
    const [project, setProject] = useState(projectData || {});
    const [errors, setErrors] = useState({});
    const [showCategoryModal, setShowCategoryModal] = useState(false);

    const validate = () => {
        let tempErrors = {};

        if (!project.name) tempErrors.name = "O nome do projeto é obrigatório.";
        if (!project.budget) tempErrors.budget = "O orçamento do projeto é obrigatório.";
        if (!project.category || !project.category.id) tempErrors.category = "A categoria do projeto é obrigatória.";

        setErrors(tempErrors);

        if (Object.keys(tempErrors).length > 0) {
            triggerErrorReset();
        }

        return Object.keys(tempErrors).length === 0;
    };


    const submit = (e) => {
        e.preventDefault();

        if (validate()) {
            handleSubmit(project);
        } else {
            console.log("Formulário contém erros.");
        }
    };

    function handleChange(e) {
        setProject({ ...project, [e.target.name]: e.target.value });
    }

    // --- ALTERAÇÃO AQUI ---
    // Agora busca a categoria completa no array categories para salvar id, name e color
    function handleCategory(e) {
        const selectedCategory = categories.find(cat => cat.id === e.target.value);
        setProject({
            ...project,
            category: selectedCategory,
        });
    }

    function handleCloseError(key) {
        setErrors((prevErrors) => {
            const newErrors = { ...prevErrors };
            delete newErrors[key];
            return newErrors;
        });
    }

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'categories'));
                const data = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    name: doc.data().name,
                    color: doc.data().color, // <== ADICIONADO: pegando a cor da categoria
                }));
                setCategories(data);
            } catch (err) {
                console.error("Erro ao buscar categorias:", err);
            }
        };

        fetchCategories();
    }, []);

    function triggerErrorReset() {
        setTimeout(() => {
            setErrors({});
        }, 3000);
    }

    return (
        <div className="max-w-3xl mx-auto p-4 bg-white shadow-md rounded-lg mt-10">
            {/* Erros */}
            {Object.keys(errors).length > 0 && (
                <div className="mb-6">
                    {['name', 'budget', 'category'].map(key => (
                        errors[key] && (
                            <div key={key} className="flex justify-between items-center text-red-700 bg-red-100 border border-red-300 p-4 mb-4 rounded">
                                <p>{errors[key]}</p>
                                <button
                                    className="bg-transparent border-none text-2xl cursor-pointer ml-auto"
                                    onClick={() => handleCloseError(key)}
                                >
                                    &times;
                                </button>
                            </div>
                        )
                    ))}
                </div>
            )}

            {/* Formulário */}
            <form onSubmit={submit} className="space-y-6">
                <Input
                    type="text"
                    text="Nome do projeto"
                    name="name"
                    placeholder="Insira o nome do projeto"
                    handleOnChange={handleChange}
                    value={project.name || ''}
                />
                <Input
                    type="number"
                    text="Orçamento do projeto"
                    name="budget"
                    placeholder="Insira o orçamento total"
                    handleOnChange={handleChange}
                    value={project.budget || ''}
                />
                <Select
                    name="category_id"
                    text="Selecione a categoria"
                    options={categories}
                    handleOnChange={handleCategory}
                    value={project.category ? project.category.id : ''}
                />
                <button
                    type="button"
                    onClick={() => setShowCategoryModal(true)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Editar Categorias
                </button>

                <SubmitButton text={btnText} />
            </form>
            {showCategoryModal && (
                <CategoryModal
                    categories={categories}
                    setCategories={setCategories}
                    onClose={() => setShowCategoryModal(false)}
                />
            )}

        </div>
    );
}

export default ProjectForm;
