import { useState, useEffect } from 'react';
import { FaTrash, FaEye } from 'react-icons/fa';
import { collection, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';

function Messages() {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [filter, setFilter] = useState('all');
    const [sortOrder, setSortOrder] = useState('desc');

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        setLoading(true);
        try {
            const querySnapshot = await getDocs(collection(db, 'messages'));
            const data = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setMessages(data);
        } catch (error) {
            console.error('Erro ao buscar mensagens:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, 'messages', id));
            setMessages(messages.filter(message => message.id !== id));
        } catch (error) {
            console.error('Erro ao excluir mensagem:', error);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await updateDoc(doc(db, 'messages', id), { status: 'read' });
            setMessages(messages.map(msg => msg.id === id ? { ...msg, status: 'read' } : msg));
        } catch (error) {
            console.error('Erro ao marcar como lida:', error);
        }
    };
    const handleMarkAsUnread = async (id) => {
        try {
            await updateDoc(doc(db, 'messages', id), { status: 'unread' });
            setMessages(messages.map(msg => msg.id === id ? { ...msg, status: 'unread' } : msg));
        } catch (error) {
            console.error('Erro ao marcar como não lida:', error);
        }
    };
    const filteredMessages = messages.filter(message => {
        if (filter === 'all') return true;
        return filter === 'read' ? message.status === 'read' : message.status === 'unread';
    });

    const sortedMessages = filteredMessages.sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
    });

    return (
        <div className="p-8 w-full">
            <h1 className="text-4xl font-bold mb-8">Mensagens Enviadas</h1>

            <div className="flex flex-col md:flex-row gap-4 mb-4">
                <select
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2"
                >
                    <option value="all">Todos</option>
                    <option value="unread">Não Lidas</option>
                    <option value="read">Lidas</option>
                </select>

                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="bg-white border border-gray-300 rounded-md shadow-sm px-3 py-2"
                >
                    <option value="desc">Mais Recentes</option>
                    <option value="asc">Mais Antigas</option>
                </select>

                <button
                    onClick={fetchMessages}
                    className="bg-yellow-400 text-black font-bold px-4 py-2 rounded-md shadow hover:bg-yellow-500"
                >
                    Atualizar
                </button>
            </div>

            {loading ? (
                <p>Carregando...</p>
            ) : (
                <div className="flex flex-col gap-8">
                    {sortedMessages.length > 0 ? (
                        sortedMessages.map((message) => (
                            <div key={message.id} className={`bg-white p-6 rounded-lg shadow-lg flex flex-col ${message.status === 'read' ? 'opacity-50' : ''}`}>
                                <h2 className="text-2xl font-semibold mb-2">{message.name}</h2>
                                <p className="text-gray-700 mb-2"><strong>Email:</strong> {message.email}</p>
                                <p className="text-gray-700 mb-2"><strong>Mensagem:</strong> {message.message}</p>
                                <p className="text-gray-500 mb-4"><strong>Data:</strong> {new Date(message.date).toLocaleString()}</p>
                                <div className="flex gap-4">
                                    {message.status === 'unread' ? (
                                        <button
                                            onClick={() => handleMarkAsRead(message.id)}
                                            className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700"
                                        >
                                            <FaEye className="mr-2" /> Marcar como lida
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => handleMarkAsUnread(message.id)}
                                            className="bg-yellow-600 text-black px-4 py-2 rounded-md flex items-center hover:bg-yellow-500"
                                        >
                                            <FaEye className="mr-2" /> Marcar como não lida
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(message.id)}
                                        className="bg-red-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-red-700"
                                    >
                                        <FaTrash className="mr-2" /> Excluir
                                    </button>
                                </div>

                            </div>
                        ))
                    ) : (
                        <p className="text-gray-700">Nenhuma mensagem encontrada.</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default Messages;
