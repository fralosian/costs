import { useState, useRef, useEffect } from 'react';
import { doc, updateDoc, deleteDoc, collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { HexColorPicker } from "react-colorful";
import { isNameDuplicate } from '../../data/isNameDuplicate';
function CategoryModal({ categories, setCategories, onClose }) {
    const [editingCategory, setEditingCategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [newCategoryColor, setNewCategoryColor] = useState('#f87171');
    const [isColorPickerVisible, setIsColorPickerVisible] = useState(false);
    const [error, setError] = useState('');

    const handleUpdateCategory = async (category) => {
        try {
            const categoryRef = doc(db, 'categories', category.id);
            await updateDoc(categoryRef, { name: category.name, color: category.color });

            setCategories(prev =>
                prev.map(cat => (cat.id === category.id ? { ...cat, name: category.name, color: category.color } : cat))
            );
            setEditingCategory(null);
            alert('Categoria atualizada');
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteCategory = async (id) => {
        if (window.confirm("Deseja realmente excluir esta categoria?")) {
            try {
                const categoryRef = doc(db, 'categories', id);
                await deleteDoc(categoryRef);
                setCategories(prev => prev.filter(cat => cat.id !== id));
                alert('Categoria excluída');
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) {
            setError("O nome da categoria é obrigatório.");
            return;
        }

        const nameExists = isNameDuplicate(categories, newCategoryName);
        if (nameExists) {
            setError("Já existe uma categoria com esse nome.");
            return;
        }

        try {
            const docRef = await addDoc(collection(db, 'categories'), {
                name: newCategoryName.trim(),
                color: newCategoryColor
            });

            const newCategory = {
                id: docRef.id,
                name: newCategoryName.trim(),
                color: newCategoryColor
            };

            setCategories(prev => [...prev, newCategory]);
            setNewCategoryName('');
            setNewCategoryColor('#f87171');
            setIsColorPickerVisible(false);
            setError('');
        } catch (err) {
            console.error("Erro ao adicionar categoria:", err);
        }
    };

    const ColorSelector = ({ selectedColor, onChange }) => {
        const [showPicker, setShowPicker] = useState(false);
        const [tempColor, setTempColor] = useState(selectedColor);
        const pickerRef = useRef(null);

        useEffect(() => {
            const handleClickOutside = (e) => {
                if (pickerRef.current && !pickerRef.current.contains(e.target)) {
                    e.stopPropagation();
                    setShowPicker(false);
                }
            };

            if (showPicker) {
                document.addEventListener('mousedown', handleClickOutside);
            } else {
                document.removeEventListener('mousedown', handleClickOutside);
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
            };
        }, [showPicker]);

        const openPicker = () => {
            setTempColor(selectedColor);
            setShowPicker(true);
        };

        const handleOk = () => {
            onChange(tempColor);
            setShowPicker(false);
        };

        const handleCancel = () => {
            setTempColor(selectedColor);
            setShowPicker(false);
        };

        return (
            <div ref={pickerRef} className="flex flex-col gap-1 relative w-full max-w-xs">
                <label className="text-sm text-gray-700 font-medium">Cor:</label>
                <button
                    type="button"
                    onClick={openPicker}
                    className="w-10 h-10 rounded-md border border-gray-300"
                    style={{ backgroundColor: selectedColor }}
                    aria-label="Selecionar cor"
                />
                {showPicker && (
                    <div className="absolute z-20 top-12 left-0 shadow-lg rounded-lg bg-white p-4">
                        <HexColorPicker color={tempColor} onChange={setTempColor} />
                        <div className="flex justify-end gap-3 mt-2">
                            <button
                                onClick={handleCancel}
                                className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 transition"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleOk}
                                className="px-3 py-1 rounded bg-yellow-400 text-white hover:bg-yellow-500 transition"
                            >
                                OK
                            </button>
                        </div>
                        <div className="text-xs text-gray-600 mt-1 select-text">{tempColor}</div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-3xl border border-blue-100 space-y-8 max-h-[80vh] overflow-y-auto">
                <h2 className="text-2xl font-semibold text-blue-800">Gerenciar Categorias</h2>

                {error && (
                    <div className="text-red-600 bg-red-100 px-4 py-2 rounded border border-red-300">
                        {error}
                    </div>
                )}

                <ul className="space-y-4">
                    {categories.map((cat) => (
                        <li
                            key={cat.id}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 rounded-xl border border-gray-200"
                            style={{ backgroundColor: '#fff', borderLeft: `6px solid ${cat.color || '#ccc'}` }}
                        >
                            {editingCategory?.id === cat.id ? (
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
                                    <input
                                        type="text"
                                        value={editingCategory.name}
                                        onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                        className="border rounded-lg px-3 py-2 flex-1"
                                        placeholder="Nome da categoria"
                                    />
                                    <ColorSelector
                                        selectedColor={editingCategory.color || '#f87171'}
                                        onChange={(color) => setEditingCategory({ ...editingCategory, color })}
                                    />
                                    <div className="flex gap-3 mt-2 sm:mt-0">
                                        <button
                                            className="text-green-700 hover:text-green-900 font-medium"
                                            onClick={() => handleUpdateCategory(editingCategory)}
                                        >
                                            Salvar
                                        </button>
                                        <button
                                            className="text-gray-600 hover:text-gray-800 font-medium"
                                            onClick={() => setEditingCategory(null)}
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <span className="text-gray-900 font-medium text-lg">{cat.name}</span>
                                    <div className="flex gap-4">
                                        <button
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                            onClick={() => setEditingCategory(cat)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="text-red-600 hover:text-red-800 font-medium"
                                            onClick={() => handleDeleteCategory(cat.id)}
                                        >
                                            Excluir
                                        </button>
                                    </div>
                                </>
                            )}
                        </li>
                    ))}
                </ul>

                <div className="flex flex-col gap-4">
                    <input
                        type="text"
                        placeholder="Nova categoria"
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onFocus={() => setIsColorPickerVisible(true)}
                        className="border border-yellow-400 rounded-lg px-4 py-3 text-lg focus:outline-none focus:ring-2 focus:ring-yellow-300"
                    />

                    {isColorPickerVisible && (
                        <ColorSelector
                            selectedColor={newCategoryColor}
                            onChange={setNewCategoryColor}
                        />
                    )}

                    <button
                        onClick={handleAddCategory}
                        className="bg-yellow-400 text-white px-6 py-3 rounded-xl text-lg font-medium hover:bg-yellow-500 transition"
                    >
                        Adicionar Categoria
                    </button>
                </div>

                <button
                    className="w-full bg-gray-200 text-gray-700 py-3 rounded-xl hover:bg-gray-300 transition text-lg font-medium"
                    onClick={onClose}
                >
                    Fechar
                </button>
            </div>
        </div>
    );
}

export default CategoryModal;
