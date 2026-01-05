import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiMail, FiPhone, FiBook } from 'react-icons/fi';
import DashboardLayout from '../../components/DashboardLayout/DashboardLayout';
import './TrainerPages.css';

const MyStudents = () => {
    const name = sessionStorage.getItem('name') || 'Formateur';
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        axios.get('http://localhost:8081/groupes/my-students', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
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
                    <div className="table-wrapper card-premium">
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
                                                <strong>{student.nom} {student.prenom}</strong>
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
                                                <FiBook />
                                                <div>
                                                    <strong>{student.formation_titre}</strong>
                                                    <p>{student.nom_groupe}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className={`type-badge ${student.type}`}>{student.type}</span>
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
