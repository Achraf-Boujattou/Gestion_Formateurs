import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import './DashboardLayout.css';

const DashboardLayout = ({ children, role, name }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        sessionStorage.clear();
        navigate('/');
        window.location.reload(); // Quick way to reset state
    };

    return (
        <div className="dashboard-layout">
            <aside className="sidebar">
                <div className="sidebar-title">
                    Formation<span style={{ color: '#111827' }}>App</span>
                </div>
                <nav>
                    <NavLink to={`/${role}`} className="nav-link" end>
                        Vue d'ensemble
                    </NavLink>
                    {role === 'admin' && (
                        <>
                            <NavLink to="/admin/utilisateurs" className="nav-link">Utilisateurs</NavLink>
                            <NavLink to="/admin/formations" className="nav-link">Formations</NavLink>
                            <NavLink to="/admin/parametres" className="nav-link">Paramètres</NavLink>
                        </>
                    )}
                    {role === 'formateur' && (
                        <>
                            <NavLink to="/formateur/cours" className="nav-link">Mes Cours</NavLink>
                            <NavLink to="/formateur/etudiants" className="nav-link">Étudiants</NavLink>
                        </>
                    )}
                </nav>
            </aside>
            <main className="main-content">
                <header className="header">
                    <div className="welcome-text">
                        <h2>Bonjour, {name}</h2>
                        <p style={{ color: '#6b7280' }}>Espace {role.charAt(0).toUpperCase() + role.slice(1)}</p>
                    </div>
                    <button onClick={handleLogout} className="logout-btn">
                        Déconnexion
                    </button>
                </header>
                {children}
            </main>
        </div>
    );
};

export default DashboardLayout;
