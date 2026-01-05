import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { FiStar, FiSend, FiCheckCircle, FiAlertCircle, FiMessageSquare, FiUser, FiInfo } from 'react-icons/fi';
import './EvaluationForm.css';

const EvaluationForm = () => {
    const { formationId } = useParams();
    const navigate = useNavigate();
    const [context, setContext] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [ratings, setRatings] = useState({
        pedagogie: 0,
        rythme: 0,
        supports: 0,
        maitrise: 0
    });
    const [commentaire, setCommentaire] = useState('');

    useEffect(() => {
        api.get(`/evaluations/context/${formationId}`)
            .then(res => {
                setContext(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setMessage({ type: 'error', text: "Lien invalide ou formation non trouvée." });
                setLoading(false);
            });
    }, [formationId]);

    const handleRating = (criterion, value) => {
        setRatings({ ...ratings, [criterion]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (Object.values(ratings).some(v => v === 0)) {
            setMessage({ type: 'error', text: "Veuillez évaluer tous les critères." });
            return;
        }

        setSubmitting(true);
        try {
            await api.post('/evaluations/submit', {
                formation_id: formationId,
                formateur_id: context.formateur_id,
                ...ratings,
                commentaire
            });
            setMessage({ type: 'success', text: "Merci pour votre feedback ! Il a été enregistré avec succès." });
            setTimeout(() => navigate('/'), 4000);
        } catch (err) {
            setMessage({ type: 'error', text: err.userMessage || "Erreur lors de la soumission. Veuillez réessayer." });
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="loading-eval">Chargement du formulaire...</div>;

    const criteria = [
        { id: 'pedagogie', label: 'Qualité pédagogique' },
        { id: 'rythme', label: 'Rythme de la formation' },
        { id: 'supports', label: 'Supports de cours et TP' },
        { id: 'maitrise', label: 'Maîtrise du sujet' }
    ];

    return (
        <div className="evaluation-page">
            <div className="eval-container animate-fade-in">
                {context && !message.text && (
                    <div className="eval-header">
                        <span className="eval-badge">Évaluation de fin de formation</span>
                        <h1>Comment s'est passée votre formation ?</h1>
                        <p>Votre avis est précieux pour nous aider à améliorer nos futurs programmes.</p>

                        <div className="eval-context-info">
                            <div className="info-box">
                                <FiInfo />
                                <div>
                                    <strong>Formation</strong>
                                    <p>{context.titre}</p>
                                </div>
                            </div>
                            <div className="info-box">
                                <FiUser />
                                <div>
                                    <strong>Formateur</strong>
                                    <p>{context.formateur_prenom} {context.formateur_nom}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {message.text ? (
                    <div className={`eval-status-view ${message.type}`}>
                        {message.type === 'success' ? <FiCheckCircle className="status-icon" /> : <FiAlertCircle className="status-icon" />}
                        <h2>{message.type === 'success' ? 'Soumission réussie !' : 'Oups !'}</h2>
                        <p>{message.text}</p>
                        <button onClick={() => navigate('/')} className="btn-return">Retour à l'accueil</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="eval-form card-premium">
                        <div className="criteria-list">
                            {criteria.map(c => (
                                <div key={c.id} className="criterion-row">
                                    <label>{c.label}</label>
                                    <div className="stars-box">
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <FiStar
                                                key={star}
                                                className={`star ${ratings[c.id] >= star ? 'active' : ''}`}
                                                onClick={() => handleRating(c.id, star)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="comment-section">
                            <label><FiMessageSquare /> Vos commentaires (optionnel)</label>
                            <textarea
                                placeholder="Partagez votre expérience globale avec nous..."
                                value={commentaire}
                                onChange={(e) => setCommentaire(e.target.value)}
                            />
                        </div>

                        <button type="submit" className="btn-submit-eval" disabled={submitting}>
                            {submitting ? 'Envoi...' : (<>Envoyer mon évaluation <FiSend /></>)}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default EvaluationForm;
