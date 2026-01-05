import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiUser, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
import './Login.css';

const Register = () => {
    const [values, setValues] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        axios.post('http://localhost:8081/register', values)
            .then(res => {
                if (res.data.Status === "Success") {
                    setSuccess(res.data.Message);
                    setTimeout(() => navigate('/login'), 2000);
                } else {
                    setError(res.data.Error);
                }
            })
            .catch(err => {
                setError(err.response?.data?.Error || "Une erreur est survenue");
            });
    }

    return (
        <div className="auth-container">
            <div className="auth-card animate-scale-in">
                <div className="auth-logo">
                    <div className="logo-circle">F</div>
                </div>
                <h1 className="auth-title">Inscription</h1>
                <p className="auth-subtitle">Créez votre compte formateur</p>

                {error && <div className="error-message">{error}</div>}
                {success && <div className="success-message-auth"><FiCheckCircle /> {success}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-row-auth">
                        <div className="form-group">
                            <label className="form-label">Prénom</label>
                            <div className="input-wrapper">
                                <FiUser className="input-icon" />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Prénom"
                                    onChange={e => setValues({ ...values, prenom: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nom</label>
                            <div className="input-wrapper">
                                <FiUser className="input-icon" />
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Nom"
                                    onChange={e => setValues({ ...values, nom: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Email</label>
                        <div className="input-wrapper">
                            <FiMail className="input-icon" />
                            <input
                                type="email"
                                className="form-input"
                                placeholder="votre@email.com"
                                onChange={e => setValues({ ...values, email: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mot de passe</label>
                        <div className="input-wrapper">
                            <FiLock className="input-icon" />
                            <input
                                type="password"
                                className="form-input"
                                placeholder="Mot de passe"
                                onChange={e => setValues({ ...values, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className="btn-primary">
                        S'inscrire
                    </button>

                    <div className="auth-footer-links">
                        <Link to="/login" className="back-to-login"><FiArrowLeft /> Retour à la connexion</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;
