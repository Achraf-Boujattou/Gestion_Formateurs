import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { FiHome, FiUsers, FiBriefcase, FiBookOpen, FiSettings, FiLogOut, FiUsers as FiStudents, FiLayout, FiCalendar, FiInbox, FiGrid, FiStar, FiUserPlus } from 'react-icons/fi';
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
                <Link to={`/${role}`} className="sidebar-title" style={{ textDecoration: 'none' }}>
                    <FiLayout className="logo-icon" /> Formation<span>App</span>
                </Link>
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
                            <NavLink to="/admin/planning" className="nav-link">
                                <FiCalendar /> <span>Planning</span>
                            </NavLink>
                            <NavLink to="/admin/inscriptions" className="nav-link">
                                <FiInbox /> <span>Inscriptions</span>
                            </NavLink>
                            <NavLink to="/admin/groupes" className="nav-link">
                                <FiGrid /> <span>Groupes</span>
                            </NavLink>
                            <NavLink to="/admin/evaluations" className="nav-link">
                                <FiStar /> <span>Évaluations</span>
                            </NavLink>
                            <NavLink to="/admin/candidatures" className="nav-link">
                                <FiUserPlus /> <span>Candidatures</span>
                            </NavLink>
                        </>
                    )}
                    {role === 'assistant' && (
                        <>
                            <NavLink to="/assistant/entreprises" className="nav-link">
                                <FiBriefcase /> <span>Entreprises</span>
                            </NavLink>
                            <NavLink to="/assistant/planning" className="nav-link">
                                <FiCalendar /> <span>Planning</span>
                            </NavLink>
                            <NavLink to="/assistant/inscriptions" className="nav-link">
                                <FiInbox /> <span>Inscriptions</span>
                            </NavLink>
                            <NavLink to="/assistant/groupes" className="nav-link">
                                <FiGrid /> <span>Groupes</span>
                            </NavLink>
                            <NavLink to="/assistant/evaluations" className="nav-link">
                                <FiStar /> <span>Évaluations</span>
                            </NavLink>
                        </>
                    )}
                    {role === 'formateur' && (
                        <>
                            <NavLink to="/formateur/cours" className="nav-link">
                                <FiBookOpen /> <span>Mes Formations</span>
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
