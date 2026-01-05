import React, { useState } from 'react';
import api from '../../../services/api';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiCheckCircle, FiAlertCircle, FiSend, FiCpu, FiAward, FiGlobe } from 'react-icons/fi';
import './JoinAsTrainer.css';

const JoinAsTrainer = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        competences: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation basique côté client
        const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/; // Format français simple pour l'exemple
        const simplePhoneRegex = /^[0-9\+\s]{10,15}$/; // Plus permissif

        if (!simplePhoneRegex.test(formData.telephone)) {
            setMessage({ type: 'error', text: "Le format du numéro de téléphone semble invalide." });
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/candidatures', formData);
            if (res.data.Status === "Success") {
                setMessage({ type: 'success', text: "Votre candidature a été envoyée avec succès ! Notre équipe reviendra vers vous." });
                setFormData({ nom: '', prenom: '', email: '', telephone: '', competences: '' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.userMessage || "Une erreur est survenue." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="join-trainer-page">
            <div className="join-trainer-container">
                <div className="join-trainer-grid">
                    <div className="join-info-panel">
                        <span className="hero-badge">Recrutement 2026</span>
                        <h1>Devenez <span>Formateur</span> Partenaire</h1>
                        <p>Partagez votre expertise avec une communauté d'apprenants passionnés et bénéficiez d'une logistique clé en main.</p>

                        <div className="perks-list">
                            <div className="perk-item">
                                <div className="perk-icon"><FiAward /></div>
                                <div>
                                    <strong>Expertise Reconnue</strong>
                                    <p>Valorisez vos compétences auprès de grands comptes.</p>
                                </div>
                            </div>
                            <div className="perk-item">
                                <div className="perk-icon"><FiGlobe /></div>
                                <div>
                                    <strong>Impact Global</strong>
                                    <p>Intervenez sur des projets innovants et variés.</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ marginTop: '4rem' }}>
                            <Link to="/" style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <FiArrowLeft /> Retour à l'accueil
                            </Link>
                        </div>
                    </div>

                    <div className="join-form-panel">
                        {message.type === 'success' ? (
                            <div className="status-alert success" style={{ padding: '3rem', textAlign: 'center', display: 'block' }}>
                                <FiCheckCircle style={{ fontSize: '4rem', marginBottom: '1.5rem' }} />
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--success)' }}>Félicitations !</h3>
                                <p>{message.text}</p>
                                <button onClick={() => setMessage({ type: '', text: '' })} className="btn-primary" style={{ marginTop: '2rem' }}>Envoyer un autre profil</button>
                            </div>
                        ) : (
                            <>
                                <h2>Candidature Spontanée</h2>
                                {message.text && (
                                    <div className={`error-message`} style={{ marginBottom: '2rem' }}>
                                        <FiAlertCircle /> {message.text}
                                    </div>
                                )}
                                <form onSubmit={handleSubmit}>
                                    <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem' }}>
                                        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                            <label className="form-label-premium">Prénom</label>
                                            <input type="text" name="prenom" className="form-input-premium" value={formData.prenom} onChange={handleChange} required />
                                        </div>
                                        <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
                                            <label className="form-label-premium">Nom</label>
                                            <input type="text" name="nom" className="form-input-premium" value={formData.nom} onChange={handleChange} required />
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label className="form-label-premium">Email Professionnel</label>
                                        <input type="email" name="email" className="form-input-premium" value={formData.email} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                                        <label className="form-label-premium">Téléphone</label>
                                        <input type="tel" name="telephone" className="form-input-premium" value={formData.telephone} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                                        <label className="form-label-premium">Expertises (React, Java, Management...)</label>
                                        <textarea
                                            name="competences"
                                            className="form-input-premium"
                                            style={{ minHeight: '100px' }}
                                            value={formData.competences}
                                            onChange={handleChange}
                                            required
                                        />
                                        <span className="input-hint">Listez vos technologies ou sujets favoris.</span>
                                    </div>
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? 'Envoi en cours...' : (<>Envoyer ma candidature <FiSend /></>)}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinAsTrainer;
