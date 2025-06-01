import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from '../../img/costs_logo.png';
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "../../firebase";

function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        const q = query(collection(db, 'messages'), where('status', '==', 'unread'));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setUnreadCount(snapshot.size);
        });

        return () => unsubscribe();
    }, []);

    return (
        <nav className="bg-gray-900 p-4">
            <div className="container mx-auto flex flex-wrap items-center justify-between">
                <Link to="/" className="flex items-center">
                    <img src={logo} alt="Costs" className="h-8 mr-3" />
                </Link>

                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="text-white inline-flex items-center justify-center p-2 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white md:hidden"
                >
                    <svg className={`${isOpen ? 'hidden' : 'block'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                    </svg>
                    <svg className={`${isOpen ? 'block' : 'hidden'} h-6 w-6`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className={`${isOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`} id="mobile-menu">
                    <ul className="flex flex-col md:flex-row md:space-x-4 list-none">
                        <li>
                            <Link to="/" className="block py-2 pr-4 pl-3 text-white hover:text-yellow-400 md:p-0">Home</Link>
                        </li>
                        <li>
                            <Link to="/projects" className="block py-2 pr-4 pl-3 text-white hover:text-yellow-400 md:p-0">Projetos</Link>
                        </li>
                        <li>
                            <Link to="/contact" className="block py-2 pr-4 pl-3 text-white hover:text-yellow-400 md:p-0">Contato</Link>
                        </li>
                        <li>
                            <Link to="/messages" className="flex items-center gap-2 py-2 pr-4 pl-3 text-white hover:text-yellow-400 md:p-0">
                                Mensagens
                                {unreadCount > 0 && (
                                    <span
                                        className="bg-yellow-400 text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow"
                                        title={`${unreadCount} mensagem(ns) não lida(s)`}
                                    >
                                        {unreadCount}
                                    </span>
                                )}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
