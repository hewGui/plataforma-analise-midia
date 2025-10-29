import React from "react";
import { Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <nav>
        <Link to="/login">Login</Link> |
        <Link to="/register">Registrar</Link> |
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      {/*Define as Rotas da Aplicação*/}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />

      {/*Rota Padrão (ex: redireciona para login) */}  
      <Route path="/" element={<Login />} />
      </Routes>
    </div>
  );
};

export default App;