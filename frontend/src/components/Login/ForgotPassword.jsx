import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiSend, FiCheckCircle } from 'react-icons/fi';
import './Login.css';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        axios.post('http://localhost:8081/forgot-password', { email })
            .then(res => {
                if (res.data.Status === "Success") {
                    setSuccess(res.data.Message);
                } else {
                    setError(res.data.Error);
                }
            })
            .catch(err => {
                setError(err.response?.data?.Error || "Une erreur est survenue");
            })
            .finally(() => setLoading(false));
    }

    return (
        <div className="auth-container">
            <div className="auth-card animate-scale-in">
                <div className="auth-logo">
                    <div className="logo-circle">?</div>
                </div>
                <h1 className="auth-title">Mot de passe oublié</h1>
                <p className="auth-subtitle">Entrez votre email pour réinitialiser votre accès</p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message-auth"><FiCheckCircle /> {success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="input-wrapper">
                            <FiMail className="input-icon" />
                            <input
                                type="email"
                                className="form-input"
                                placeholder="votre@email.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? 'Envoi...' : <><FiSend /> Envoyer le lien</>}
                    </button>

                    <div className="auth-footer-links">
                        <Link to="/login" className="back-to-login"><FiArrowLeft /> Retour à la connexion</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ForgotPassword;
