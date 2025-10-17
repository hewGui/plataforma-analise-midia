// frontend/src/App.tsx
import React from 'react';
import './App.css';

// Definindo o tipo das props, neste caso, o componente não tem props.
// Usar React.FC (Function Component) é uma boa prática com TypeScript.
const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Plataforma de Análise de Mídia</h1>
      <p>Frontend (React + TypeScript) rodando com sucesso!</p>
    </div>
  );
};

export default App;