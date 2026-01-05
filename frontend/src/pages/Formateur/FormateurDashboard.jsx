import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBook, FiUsers, FiAward, FiCalendar } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import './FormateurDashboard.css';

const FormateurDashboard = () => {
    const name = sessionStorage.getItem('name') || 'Formateur';
    const [stats, setStats] = useState({
        coursesCount: 0,
        studentsCount: 0,
        satisfaction: 98 // Static for now as evaluation logic is complex per trainer
    });
    const [recentGroups, setRecentGroups] = useState([]);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch Courses
        axios.get('http://localhost:8081/groupes/my-groups', { headers })
            .then(res => {
                setStats(prev => ({ ...prev, coursesCount: res.data.length }));
                setRecentGroups(res.data.slice(0, 3));
            })
            .catch(err => console.error(err));

        // Fetch Students
        axios.get('http://localhost:8081/groupes/my-students', { headers })
            .then(res => {
                setStats(prev => ({ ...prev, studentsCount: res.data.length }));
            })
            .catch(err => console.error(err));

    }, []);

    return (
        <DashboardLayout role="formateur" name={name}>
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon-wrapper courses"><FiBook /></div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.coursesCount}</div>
                        <div className="stat-label">Mes Cours</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper students"><FiUsers /></div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.studentsCount}</div>
                        <div className="stat-label">Apprenants</div>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon-wrapper satisfaction"><FiAward /></div>
                    <div className="stat-info">
                        <div className="stat-value">{stats.satisfaction}%</div>
                        <div className="stat-label">Satisfaction</div>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">
                <div className="content-header">
                    <FiCalendar className="section-icon" />
                    <h3>Mes prochaines sessions</h3>
                </div>
                {recentGroups.length > 0 ? (
                    <div className="recent-list">
                        {recentGroups.map(g => (
                            <div key={g.id} className="recent-item">
                                <strong>{g.formation_titre}</strong>
                                <span>{g.nom_groupe} • {g.membre_count} inscrits</span>
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
