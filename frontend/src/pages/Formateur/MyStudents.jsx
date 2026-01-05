import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import { FiUsers, FiMail, FiPhone, FiBook } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import './TrainerPages.css';

const MyStudents = () => {
    const name = sessionStorage.getItem('name') || 'Formateur';
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/groupes/my-students')
            .then(res => {
                setStudents(res.data);
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
                    <h2>Mes Étudiants</h2>
                    <p>Liste des apprenants inscrits à vos formations</p>
                </div>

                {loading ? (
                    <div className="loading-spinner">Chargement...</div>
                ) : (
                    <div className="trainer-table-container">
                        <table className="trainer-table">
                            <thead>
                                <tr>
                                    <th>Apprenant</th>
                                    <th>Contact</th>
                                    <th>Formation / Groupe</th>
                                    <th>Type</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, idx) => (
                                    <tr key={idx}>
                                        <td>
                                            <div className="student-info">
                                                <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{student.nom} {student.prenom}</strong>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="contact-info">
                                                <span><FiMail /> {student.email}</span>
                                                <span><FiPhone /> {student.telephone}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="course-ref">
                                                <FiBook style={{ fontSize: '1.2rem', color: 'var(--primary)', marginTop: '0.25rem' }} />
                                                <div>
                                                    <strong style={{ color: 'var(--text-main)' }}>{student.formation_titre}</strong>
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', fontWeight: 600 }}>{student.nom_groupe}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`type-badge-premium ${student.type === 'Par-Entreprise' ? 'badge-entreprise' : 'badge-individuel'}`}>
                                                {student.type}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {students.length === 0 && (
                            <div className="no-data-view">
                                <FiUsers />
                                <p>Aucun étudiant inscrit dans vos groupes.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default MyStudents;
