import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiBriefcase, FiBookOpen, FiSettings, FiLogOut, FiUsers as FiStudents, FiLayout } from 'react-icons/fi';
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
                    <FiLayout className="logo-icon" /> Formation<span>App</span>
                </div>
                <nav>
                    <NavLink to={`/${role}`} className="nav-link" end>
                        <FiHome /> <span>Vue d'ensemble</span>
                    </NavLink>
                    {role === 'admin' && (
                        <>
                            <NavLink to="/admin/utilisateurs" className="nav-link">
                                <FiUsers /> <span>Utilisateurs</span>
                            </NavLink>
                            <NavLink to="/admin/entreprises" className="nav-link">
                                <FiBriefcase /> <span>Entreprises</span>
                            </NavLink>
                            <NavLink to="/admin/formations" className="nav-link">
                                <FiBookOpen /> <span>Formations</span>
                            </NavLink>
                            <NavLink to="/admin/parametres" className="nav-link">
                                <FiSettings /> <span>Paramètres</span>
                            </NavLink>
                        </>
                    )}
                    {role === 'assistant' && (
                        <>
                            <NavLink to="/assistant/entreprises" className="nav-link">
                                <FiBriefcase /> <span>Entreprises</span>
                            </NavLink>
                        </>
                    )}
                    {role === 'formateur' && (
                        <>
                            <NavLink to="/formateur/cours" className="nav-link">
                                <FiBookOpen /> <span>Mes Cours</span>
                            </NavLink>
                            <NavLink to="/formateur/etudiants" className="nav-link">
                                <FiStudents /> <span>Étudiants</span>
                            </NavLink>
                        </>
                    )}
                </nav>
                <button onClick={handleLogout} className="sidebar-logout">
                    <FiLogOut /> <span>Déconnexion</span>
                </button>
            </aside>
            <main className="main-content">
                <header className="header">
                    <div className="welcome-text">
                        <h2>Bonjour, {name}</h2>
                        <p>Espace {role.charAt(0).toUpperCase() + role.slice(1)}</p>
                    </div>
                    <div className="header-actions">
                        <div className="user-avatar">{name.charAt(0)}</div>
                    </div>
                </header>
                <div className="page-content animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
