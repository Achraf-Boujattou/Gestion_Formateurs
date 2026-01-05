import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiBook, FiCalendar, FiUsers, FiTag } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import './TrainerPages.css';

const MyCourses = () => {
    const name = sessionStorage.getItem('name') || 'Formateur';
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        axios.get('http://localhost:8081/groupes/my-groups', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
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
                    <h2>Mes Cours & Formations</h2>
                    <p>Liste des sessions de formation qui vous sont assignées</p>
                </div>

                {loading ? (
                    <div className="loading-spinner">Chargement...</div>
                ) : (
                    <div className="courses-grid-trainer">
                        {courses.map(course => (
                            <div key={course.id} className="trainer-course-card card-premium">
                                <div className="course-badge">{course.categorie}</div>
                                <h3>{course.formation_titre}</h3>
                                <div className="course-group-name">Groupe: {course.nom_groupe}</div>

                                <div className="course-meta">
                                    <span><FiCalendar /> {course.date_formation ? new Date(course.date_formation).toLocaleDateString() : 'Date à définir'}</span>
                                    <span><FiUsers /> {course.membre_count} Apprenants</span>
                                </div>

                                <div className="course-footer">
                                    <div className="status-indicator active">En cours</div>
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
