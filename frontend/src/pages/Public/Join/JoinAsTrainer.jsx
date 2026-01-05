import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiCheckCircle, FiAlertCircle, FiSend, FiCpu } from 'react-icons/fi';
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
        setLoading(true);
        try {
            const res = await axios.post('http://localhost:8081/candidatures/public', formData);
            if (res.data.Status === "Success") {
                setMessage({ type: 'success', text: "Votre candidature a été envoyée avec succès ! Notre équipe reviendra vers vous." });
                setFormData({ nom: '', prenom: '', email: '', telephone: '', competences: '' });
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.Error || "Une erreur est survenue." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="join-trainer-page">
            <div className="join-trainer-container animate-fade-in">
                <Link to="/" className="back-link-public"><FiArrowLeft /> Retour à l'accueil</Link>

                <div className="join-trainer-grid">
                    <div className="join-info-panel">
                        <span className="info-badge">Recrutement Experts</span>
                        <h1>Devenez <span>Formateur</span> Partenaire</h1>
                        <p>Vous êtes un expert dans votre domaine ? Rejoignez notre réseau de formateurs et partagez votre savoir-faire avec nos apprenants.</p>

                        <div className="perks-list">
                            <div className="perk-item">
                                <div className="perk-icon"><FiCpu /></div>
                                <div>
                                    <strong>Missions Flexibles</strong>
                                    <p>Adaptez vos interventions selon vos disponibilités.</p>
                                </div>
                            </div>
                            <div className="perk-item">
                                <div className="perk-icon"><FiCheckCircle /></div>
                                <div>
                                    <strong>Rémunération Attractive</strong>
                                    <p>Profitez d'un barème compétitif pour vos prestations.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="join-form-panel card-premium">
                        {message.text && (
                            <div className={`status-alert-public ${message.type}`}>
                                {message.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                                <span>{message.text}</span>
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="form-row-public">
                                <div className="form-group-public">
                                    <label><FiUser /> Prénom</label>
                                    <input type="text" name="prenom" placeholder="Votre prénom" value={formData.prenom} onChange={handleChange} required />
                                </div>
                                <div className="form-group-public">
                                    <label><FiUser /> Nom</label>
                                    <input type="text" name="nom" placeholder="Votre nom" value={formData.nom} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="form-group-public">
                                <label><FiMail /> Email Professionnel</label>
                                <input type="email" name="email" placeholder="votre@email.com" value={formData.email} onChange={handleChange} required />
                            </div>

                            <div className="form-group-public">
                                <label><FiPhone /> Téléphone</label>
                                <input type="tel" name="telephone" placeholder="06XXXXXXXX" value={formData.telephone} onChange={handleChange} required />
                            </div>

                            <div className="form-group-public">
                                <label><FiCpu /> Compétences & Expertises</label>
                                <textarea
                                    name="competences"
                                    placeholder="Ex: React JS, Node.js, Gestion de projet, Marketing Digital..."
                                    value={formData.competences}
                                    onChange={handleChange}
                                    required
                                />
                                <small className="input-hint">Séparez vos compétences par des virgules.</small>
                            </div>

                            <button type="submit" className="btn-submit-public" disabled={loading}>
                                {loading ? 'Envoi...' : (<>Envoyer ma candidature <FiSend /></>)}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JoinAsTrainer;
