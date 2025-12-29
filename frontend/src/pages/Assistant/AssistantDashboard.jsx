import React from 'react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import './AssistantDashboard.css';

const AssistantDashboard = () => {
    const name = sessionStorage.getItem('name') || 'Assistant';

    return (
        <DashboardLayout role="assistant" name={name}>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">12</div>
                    <div className="stat-label">Demandes en attente</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">3</div>
                    <div className="stat-label">Rapports à valider</div>
                </div>
            </div>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', minHeight: '300px' }}>
                <h3>Tâches Administratives</h3>
                <p style={{ color: '#6b7280', marginTop: '1rem' }}>Toutes les tâches urgentes ont été traitées.</p>
            </div>
        </DashboardLayout>
    );
};

export default AssistantDashboard;
