import React from 'react';
import { FiBook, FiUsers, FiAward, FiCalendar } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import './FormateurDashboard.css';

const FormateurDashboard = () => {
    const name = sessionStorage.getItem('name') || 'Formateur';

    return (
        <DashboardLayout role="formateur" name={name}>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper courses"><FiBook /></div>
                    <div className="stat-info">
                        <div className="stat-value">5</div>
                        <div className="stat-label">Mes Cours</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper students"><FiUsers /></div>
                    <div className="stat-info">
                        <div className="stat-value">42</div>
                        <div className="stat-label">Étudiants Inscrits</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper satisfaction"><FiAward /></div>
                    <div className="stat-info">
                        <div className="stat-value">98%</div>
                        <div className="stat-label">Satisfaction</div>
                    </div>
                </div>
            </div>
            <div className="dashboard-content">
                <div className="content-header">
                    <FiCalendar className="section-icon" />
                    <h3>Planning de la semaine</h3>
                </div>
                <p className="no-data">Vous n'avez pas de cours prévus aujourd'hui.</p>
            </div>
        </DashboardLayout>
    );
};

export default FormateurDashboard;
