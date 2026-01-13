import React, { useState, useEffect } from 'react';
import { FiUsers, FiBook, FiActivity, FiClock, FiCheckCircle, FiUserPlus, FiBriefcase, FiLayers, FiCalendar, FiAward, FiEdit, FiTrendingUp, FiStar } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import api from '../../services/api';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const name = sessionStorage.getItem('name') || 'Admin';
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalTrainers: 0,
        activeSessions: 0,
        totalFormations: 0,
        totalEntreprises: 0
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
                activeSessions: res.data.activeSessions,
                totalFormations: res.data.totalFormations,
                totalEntreprises: res.data.totalEntreprises
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
            <div className="stats-grid animate-fade-in">
                <div className="stat-card">
                    <div className="stat-icon-wrapper users"><FiUsers /></div>
                    <div className="stat-info">
                        <div className="stat-value">{loading ? '...' : stats.totalUsers}</div>
                        <div className="stat-label">Utilisateurs Totaux</div>
                    </div>
                </div>
                <div className="stat-card" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-icon-wrapper formateurs"><FiBook /></div>
                    <div className="stat-info">
                        <div className="stat-value">{loading ? '...' : stats.totalTrainers}</div>
                        <div className="stat-label">Formateurs</div>
                    </div>
                </div>
                <div className="stat-card" style={{ animationDelay: '0.2s' }}>
                    <div className="stat-icon-wrapper active"><FiActivity /></div>
                    <div className="stat-info">
                        <div className="stat-value">{loading ? '...' : stats.activeSessions}</div>
                        <div className="stat-label">Sessions Actives</div>
                    </div>
                </div>
                <div className="stat-card" style={{ animationDelay: '0.3s' }}>
                    <div className="stat-icon-wrapper formations"><FiLayers /></div>
                    <div className="stat-info">
                        <div className="stat-value">{loading ? '...' : stats.totalFormations}</div>
                        <div className="stat-label">Formations</div>
                    </div>
                </div>
                <div className="stat-card" style={{ animationDelay: '0.4s' }}>
                    <div className="stat-icon-wrapper entreprises"><FiBriefcase /></div>
                    <div className="stat-info">
                        <div className="stat-value">{loading ? '...' : stats.totalEntreprises}</div>
                        <div className="stat-label">Entreprises</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content card-premium animate-slide-up">
                <div className="content-header">
                    <FiTrendingUp className="section-icon" />
                    <h3>Activité Récente</h3>
                    <span className="activity-badge">{recentActivity.length} événements</span>
                </div>

                <div className="activity-list">
                    {recentActivity.length > 0 ? (
                        recentActivity.map((activity, index) => {
                            // Determine icon based on activity type
                            const getActivityIcon = (type) => {
                                switch (type?.toLowerCase()) {
                                    case 'inscription': return <FiCheckCircle />;
                                    case 'utilisateur': return <FiUserPlus />;
                                    case 'formation': return <FiBook />;
                                    case 'planning': return <FiCalendar />;
                                    case 'evaluation': return <FiStar />;
                                    default: return <FiActivity />;
                                }
                            };

                            // Relative time formatting
                            const getRelativeTime = (date) => {
                                const now = new Date();
                                const actDate = new Date(date);
                                const diffMs = now - actDate;
                                const diffMins = Math.floor(diffMs / 60000);
                                const diffHours = Math.floor(diffMs / 3600000);
                                const diffDays = Math.floor(diffMs / 86400000);

                                if (diffMins < 60) return `Il y a ${diffMins} min`;
                                if (diffHours < 24) return `Il y a ${diffHours}h`;
                                if (diffDays < 7) return `Il y a ${diffDays}j`;
                                return actDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
                            };

                            return (
                                <div key={index} className="activity-item" style={{ animationDelay: `${index * 0.05}s` }}>
                                    <div className={`activity-icon ${activity.type?.toLowerCase() || 'default'}`}>
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="activity-details">
                                        <p><strong>{activity.prenom} {activity.detail}</strong></p>
                                        <span>
                                            {activity.type === 'Inscription' && '📚 Nouvel apprenant inscrit'}
                                            {activity.type === 'Utilisateur' && '👤 Nouveau compte créé'}
                                            {activity.type === 'Formation' && '📖 Formation ajoutée'}
                                            {activity.type === 'Planning' && '📅 Session planifiée'}
                                            {activity.type === 'Evaluation' && '⭐ Évaluation reçue'}
                                            {!['Inscription', 'Utilisateur', 'Formation', 'Planning', 'Evaluation'].includes(activity.type) && '🔔 Nouvelle activité'}
                                        </span>
                                    </div>
                                    <div className="activity-time">
                                        <FiClock className="time-icon" />
                                        {getRelativeTime(activity.created_at)}
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="no-data-state">
                            <FiActivity className="empty-icon" />
                            <p>Aucune activité récente</p>
                            <span>Les nouvelles actions apparaîtront ici</span>
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminDashboard;
