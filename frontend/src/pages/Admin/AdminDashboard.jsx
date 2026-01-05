import React, { useState, useEffect } from 'react';
import { FiUsers, FiBook, FiActivity, FiClock, FiCheckCircle, FiUserPlus } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import api from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const name = sessionStorage.getItem('name') || 'Admin';
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTrainers: 0,
        activeSessions: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const res = await api.get('/admin/stats');
            setStats({
                totalUsers: res.data.totalUsers,
                totalTrainers: res.data.totalTrainers,
                activeSessions: res.data.activeSessions
            });
            setRecentActivity(res.data.recentActivity || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="admin" name={name}>
            <div className="stats-grid">
                <div className="stat-card animate-fade-in">
                    <div className="stat-icon-wrapper users"><FiUsers /></div>
                    <div className="stat-info">
                        <div className="stat-value">{loading ? '...' : stats.totalUsers}</div>
                        <div className="stat-label">Utilisateurs Totaux</div>
                    </div>
                </div>
                <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-icon-wrapper formateurs"><FiBook /></div>
                    <div className="stat-info">
                        <div className="stat-value">{loading ? '...' : stats.totalTrainers}</div>
                        <div className="stat-label">Formateurs</div>
                    </div>
                </div>
                <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="stat-icon-wrapper active"><FiActivity /></div>
                    <div className="stat-info">
                        <div className="stat-value">{loading ? '...' : stats.activeSessions}</div>
                        <div className="stat-label">Sessions Actives</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content card-premium animate-slide-up">
                <div className="content-header">
                    <FiClock className="section-icon" />
                    <h3>Activité Récente</h3>
                </div>

                <div className="activity-list">
                    {recentActivity.length > 0 ? (
                        recentActivity.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <div className={`activity-icon ${activity.type.toLowerCase()}`}>
                                    {activity.type === 'Inscription' ? <FiCheckCircle /> : <FiUserPlus />}
                                </div>
                                <div className="activity-details">
                                    <p><strong>{activity.prenom} {activity.detail}</strong></p>
                                    <span>Nouveau {activity.type === 'Inscription' ? 'apprenant inscrit' : 'utilisateur créé'}</span>
                                </div>
                                <div className="activity-time">
                                    {new Date(activity.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="no-data">Aucune activité récente à afficher.</p>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
