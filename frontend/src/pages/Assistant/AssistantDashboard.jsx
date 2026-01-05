import React from 'react';
import { FiClock, FiFileText, FiList, FiCheckCircle } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import './AssistantDashboard.css';

const AssistantDashboard = () => {
    const name = sessionStorage.getItem('name') || 'Assistant';

    return (
        <DashboardLayout role="assistant" name={name}>
            <div className="stats-grid">
                <div className="stat-card animate-fade-in">
                    <div className="stat-icon-wrapper pending"><FiClock /></div>
                    <div className="stat-info">
                        <div className="stat-value">12</div>
                        <div className="stat-label">Demandes en attente</div>
                    </div>
                </div>
                <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-icon-wrapper reports"><FiFileText /></div>
                    <div className="stat-info">
                        <div className="stat-value">3</div>
                        <div className="stat-label">Rapports à valider</div>
                    </div>
                </div>
            </div>
            <div className="dashboard-content card-premium animate-slide-up">
                <div className="content-header">
                    <FiList className="section-icon" />
                    <h3>Tâches Administratives</h3>
                </div>
                <p className="no-data">Toutes les tâches urgentes ont été traitées.</p>
            </div>
        </DashboardLayout>
    );
};

export default AssistantDashboard;
