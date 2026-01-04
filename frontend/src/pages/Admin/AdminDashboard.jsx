import React from 'react';
import { FiUsers, FiBook, FiActivity } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const name = sessionStorage.getItem('name') || 'Admin';

    return (
        <DashboardLayout role="admin" name={name}>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper users"><FiUsers /></div>
                    <div className="stat-info">
                        <div className="stat-value">124</div>
                        <div className="stat-label">Utilisateurs Totaux</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper formateurs"><FiBook /></div>
                    <div className="stat-info">
                        <div className="stat-value">15</div>
                        <div className="stat-label">Formateurs</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper active"><FiActivity /></div>
                    <div className="stat-info">
                        <div className="stat-value">8</div>
                        <div className="stat-label">Sessions Actives</div>
                    </div>
                </div>
            </div>
            {/* Content placeholder */}
            <div className="dashboard-content">
                <h3>Activité Récente</h3>
                <p>Aucune activité récente à afficher.</p>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
