import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../../../services/api';
import { FiArrowLeft, FiUser, FiMail, FiPhone, FiMapPin, FiCalendar, FiCheckCircle, FiAlertCircle, FiSend } from 'react-icons/fi';
import './RegisterFormation.css';

const RegisterFormation = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [formation, setFormation] = useState(null);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        ville: '',
        date_naissance: '',
        formation_id: id
    });
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        api.get(`/formations/${id}`)
            .then(res => setFormation(res.data))
            .catch(err => console.error(err));
    }, [id]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation téléphone simple
        const simplePhoneRegex = /^[0-9\+\s]{10,15}$/;
        if (!simplePhoneRegex.test(formData.telephone)) {
            setMessage({ type: 'error', text: "Le format du numéro de téléphone semble invalide." });
            return;
        }

        setLoading(true);
        try {
            const res = await api.post('/inscriptions/public', formData);
            if (res.data.Status === "Success") {
                setMessage({ type: 'success', text: "Inscription réussie ! Vous allez être redirigé vers l'accueil." });
                setTimeout(() => navigate('/'), 3000);
            }
        } catch (err) {
            setMessage({ type: 'error', text: err.userMessage || "Une erreur est survenue." });
        } finally {
            setLoading(false);
        }
    };

    if (!formation) return <div className="loading-public">Chargement...</div>;

    return (
        <div className="register-page-public">
            <div className="register-container-public animate-fade-in">
                <Link to="/" className="back-link-public"><FiArrowLeft /> Retour au catalogue</Link>

                <div className="register-grid-public">
                    <div className="register-info-panel">
                        <span className="info-badge">Inscription Individualisée</span>
                        <h1>Rejoignez la formation <span>{formation.titre}</span></h1>
                        <p>Complétez le formulaire pour réserver votre place. Nos conseillers vous contacteront pour valider votre dossier.</p>

                        <div className="formation-summary-card">
                            <div className="f-sum-item">
                                <FiCalendar />
                                <div>
                                    <strong>Volume Horaire</strong>
                                    <p>{formation.nombre_heures} Heures de cours</p>
                                </div>
                            </div>
                            <div className="f-sum-item">
                                <FiCheckCircle />
                                <div>
                                    <strong>Objectif</strong>
                                    <p>{formation.objectifs.substring(0, 80)}...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="register-form-panel card-premium-public">
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
                                <input type="email" name="email" placeholder="exemple@email.com" value={formData.email} onChange={handleChange} required />
                            </div>

                            <div className="form-group-public">
                                <label><FiPhone /> Numéro de téléphone</label>
                                <input type="tel" name="telephone" placeholder="06XXXXXXXX" value={formData.telephone} onChange={handleChange} required />
                            </div>

                            <div className="form-row-public">
                                <div className="form-group-public">
                                    <label><FiMapPin /> Ville de résidence</label>
                                    <input type="text" name="ville" placeholder="Ex: Casablanca" value={formData.ville} onChange={handleChange} required />
                                </div>
                                <div className="form-group-public">
                                    <label><FiCalendar /> Date de naissance</label>
                                    <input type="date" name="date_naissance" value={formData.date_naissance} onChange={handleChange} required />
                                </div>
                            </div>

                            <button type="submit" className="btn-submit-public" disabled={loading}>
                                {loading ? 'Envoi en cours...' : (<>Confirmer mon inscription <FiSend /></>)}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterFormation;
