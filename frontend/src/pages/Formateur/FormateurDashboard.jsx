import React, { useState, useEffect } from 'react';
import { FiBook, FiUsers, FiAward, FiCalendar } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import api from '../../services/api';
import './FormateurDashboard.css';

const FormateurDashboard = () => {
    const name = sessionStorage.getItem('name') || 'Formateur';
    const [stats, setStats] = useState({
        coursesCount: 0,
        studentsCount: 0,
        satisfaction: 98 // Static for now as evaluation logic is complex per trainer
    });
    const [recentGroups, setRecentGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch Groups/Courses
            const groupsRes = await api.get('/groupes/my-groups');
            const groupsData = groupsRes.data || [];

            // Fetch Students
            const studentsRes = await api.get('/groupes/my-students');
            const studentsData = studentsRes.data || [];

            setStats(prev => ({
                ...prev,
                coursesCount: groupsData.length,
                studentsCount: studentsData.length
            }));

            setRecentGroups(groupsData.slice(0, 3));
        } catch (err) {
            console.error("Error fetching dashboard data:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <DashboardLayout role="formateur" name={name}>
            <div className="stats-grid">
                <div className="stat-card animate-fade-in">
                    <div className="stat-icon-wrapper courses"><FiBook /></div>
                    <div className="stat-info">
                        <div className="stat-value">{loading ? '...' : stats.coursesCount}</div>
                        <div className="stat-label">Mes Formations</div>
                    </div>
                </div>
                <div className="stat-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-icon-wrapper students"><FiUsers /></div>
                    <div className="stat-info">
                        <div className="stat-value">{loading ? '...' : stats.studentsCount}</div>
                        <div className="stat-label">Apprenants</div>
                    </div>
                </div>
                <div className="stat-card animate-fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="stat-icon-wrapper satisfaction"><FiAward /></div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.satisfaction}%</div>
                        <div className="stat-label">Satisfaction</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content card-premium animate-slide-up">
                <div className="content-header">
                    <FiCalendar className="section-icon" />
                    <h3>Mes prochaines sessions</h3>
                </div>
                {recentGroups.length > 0 ? (
                    <div className="recent-list">
                        {recentGroups.map((g, index) => (
                            <div key={g.id} className="recent-item" style={{ animationDelay: `${index * 0.1}s` }}>
                                <div className="recent-item-content">
                                    <strong>{g.formation_titre}</strong>
                                    <span>{g.nom_groupe} • {g.membre_count} inscrits</span>
                                </div>
                                <div className="recent-item-date">
                                    {g.date_formation ? new Date(g.date_formation).toLocaleDateString() : 'Date à définir'}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="no-data">Vous n'avez pas de cours prévus aujourd'hui.</p>
                )}
            </div>
        </DashboardLayout>
    );
};

export default FormateurDashboard;
