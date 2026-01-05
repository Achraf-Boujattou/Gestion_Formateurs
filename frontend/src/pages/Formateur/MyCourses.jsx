import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiBook, FiCalendar, FiUsers, FiTag, FiClock } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import './TrainerPages.css';

const MyCourses = () => {
    const name = sessionStorage.getItem('name') || 'Formateur';
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/groupes/my-groups')
            .then(res => {
                setCourses(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    return (
        <DashboardLayout role="formateur" name={name}>
            <div className="trainer-page">
                <div className="page-header">
                    <h2>Mes Formations</h2>
                    <p>Liste des sessions de formation qui vous sont assignées</p>
                </div>

                {loading ? (
                    <div className="loading-spinner">Chargement...</div>
                ) : (
                    <div className="courses-grid-trainer">
                        {courses.map(course => (
                            <div key={course.id} className="trainer-course-card">
                                <span className="type-badge-premium badge-entreprise" style={{ position: 'absolute', top: '1.5rem', right: '1.5rem' }}>
                                    {course.categorie || 'Formation'}
                                </span>
                                <FiBook style={{ fontSize: '2.5rem', color: 'var(--primary)', marginBottom: '1.5rem' }} />
                                <h3>{course.formation_titre}</h3>
                                <div className="course-group-name">Groupe: {course.nom_groupe}</div>

                                <div className="course-meta">
                                    <span><FiCalendar /> {course.date_formation ? new Date(course.date_formation).toLocaleDateString() : 'Date à définir'}</span>
                                    <span><FiUsers /> {course.membre_count} Apprenants</span>
                                </div>

                                <div className="course-footer">
                                    <div className="status-active">Session Active</div>
                                </div>
                            </div>
                        ))}
                        {courses.length === 0 && (
                            <div className="no-data-view">
                                <FiBook />
                                <p>Aucun cours ne vous est assigné pour le moment.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyCourses;
