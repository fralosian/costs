import React, { createContext, useContext } from 'react';

// Definindo as cores
const colors = {
    'category-infraestrutura': 'bg-category-infra',
    'category-desenvolvimento': 'bg-category-desenvolvimento',
    'category-design': 'bg-category-design',
    'category-planejamento': 'bg-category-planejamento',
    'category-administração': 'bg-category-administração',
};

// Criando o contexto
const ColorContext = createContext(colors);

// Provedor do contexto
export const ColorProvider = ({ children }) => {
    return (
        <ColorContext.Provider value={colors}>
            {children}
        </ColorContext.Provider>
    );
};

// Hook para consumir o contexto
export const useColors = () => useContext(ColorContext);
