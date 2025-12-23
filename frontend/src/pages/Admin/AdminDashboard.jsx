import React from 'react';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const name = localStorage.getItem('name') || 'Admin';

    return (
        <DashboardLayout role="admin" name={name}>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-value">124</div>
                    <div className="stat-label">Utilisateurs Totaux</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">15</div>
                    <div className="stat-label">Formateurs</div>
                </div>
                <div className="stat-card">
                    <div className="stat-value">8</div>
                    <div className="stat-label">Sessions Actives</div>
                </div>
            </div>
            {/* Content placeholder */}
            <div style={{ background: 'white', padding: '2rem', borderRadius: '1rem', minHeight: '300px' }}>
                <h3>Activité Récente</h3>
                <p style={{ color: '#6b7280', marginTop: '1rem' }}>Aucune activité récente à afficher.</p>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
