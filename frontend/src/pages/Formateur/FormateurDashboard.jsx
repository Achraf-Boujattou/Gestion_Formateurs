import React from 'react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import './FormateurDashboard.css';

const FormateurDashboard = () => {
    const name = localStorage.getItem('name') || 'Formateur';

    return (
        <DashboardLayout role="formateur" name={name}>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">5</div>
                    <div className="stat-label">Mes Cours</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">42</div>
                    <div className="stat-label">Étudiants Inscrits</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">98%</div>
                    <div className="stat-label">Taux de Satisfaction</div>
                </div>
            </div>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', minHeight: '300px' }}>
                <h3>Planning de la semaine</h3>
                <p style={{ color: '#6b7280', marginTop: '1rem' }}>Vous n'avez pas de cours prévus aujourd'hui.</p>
            </div>
        </DashboardLayout>
    );
};

export default FormateurDashboard;
