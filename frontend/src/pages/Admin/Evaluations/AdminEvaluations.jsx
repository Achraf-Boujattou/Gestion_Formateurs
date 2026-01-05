import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiStar, FiCalendar, FiUser, FiBook, FiMessageSquare } from 'react-icons/fi';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import './AdminEvaluations.css';

const AdminEvaluations = () => {
    const name = sessionStorage.getItem('name') || 'Admin';
    const [evaluations, setEvaluations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchEvaluations();
    }, []);

    const fetchEvaluations = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:8081/evaluations', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setEvaluations(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = (rating) => {
        return (
            <div className="stars-display">
                {[1, 2, 3, 4, 5].map(star => (
                    <FiStar key={star} className={`star-icon ${rating >= star ? 'filled' : ''}`} />
                ))}
            </div>
        );
    };

    // Calculate Average for a specific evaluation
    const getAvg = (e) => (e.pedagogie + e.rythme + e.supports + e.maitrise) / 4;

    return (
        <DashboardLayout role="admin" name={name}>
            <div className="admin-eval-container">
                <div className="title-section">
                    <h2>Retours d'Expérience</h2>
                    <p>Analysez les évaluations soumises par les participants</p>
                </div>

                <div className="eval-stats-summary">
                    <div className="eval-summary-card">
                        <strong>{evaluations.length}</strong>
                        <span>Évaluations reçues</span>
                    </div>
                </div>

                <div className="eval-list-grid">
                    {evaluations.map(e => (
                        <div key={e.id} className="eval-admin-card card-premium">
                            <div className="eval-card-header">
                                <div className="avg-badge">{getAvg(e).toFixed(1)} / 5</div>
                                <div className="header-main">
                                    <h3><FiBook /> {e.formation_titre}</h3>
                                    <p><FiUser /> Formateur: <strong>{e.formateur_prenom} {e.formateur_nom}</strong></p>
                                </div>
                            </div>

                            <div className="scores-grid">
                                <div className="score-item">
                                    <label>Pédagogie</label>
                                    {renderStars(e.pedagogie)}
                                </div>
                                <div className="score-item">
                                    <label>Rythme</label>
                                    {renderStars(e.rythme)}
                                </div>
                                <div className="score-item">
                                    <label>Supports/TP</label>
                                    {renderStars(e.supports)}
                                </div>
                                <div className="score-item">
                                    <label>Maîtrise</label>
                                    {renderStars(e.maitrise)}
                                </div>
                            </div>

                            {e.commentaire && (
                                <div className="admin-comment">
                                    <FiMessageSquare />
                                    <p>"{e.commentaire}"</p>
                                </div>
                            )}

                            <div className="eval-card-footer">
                                <FiCalendar /> {new Date(e.created_at).toLocaleDateString()}
                            </div>
                        </div>
                    ))}
                </div>
                {evaluations.length === 0 && !loading && <p className="no-data">Aucune évaluation enregistrée pour le moment.</p>}
            </div>
        </DashboardLayout>
    );
};

export default AdminEvaluations;
