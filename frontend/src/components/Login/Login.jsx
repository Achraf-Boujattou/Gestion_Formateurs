import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { FiMail, FiLock, FiArrowRight } from 'react-icons/fi';
import './Login.css';

const Login = ({ setAuth }) => {
    const [values, setValues] = useState({
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        api.post('/login', values)
            .then(res => {
                if (res.data.Status === "Success") {
                    // Save auth info in sessionStorage
                    sessionStorage.setItem('token', res.data.token);
                    sessionStorage.setItem('role', res.data.role);
                    sessionStorage.setItem('name', res.data.name);

                    // Update parent state
                    setAuth({
                        isAuthenticated: true,
                        role: res.data.role,
                        name: res.data.name
                    });

                    // Redirect based on role
                    if (res.data.role === 'admin') navigate('/admin');
                    else if (res.data.role === 'formateur') navigate('/formateur');
                    else if (res.data.role === 'assistant') navigate('/assistant');
                }
            })
            .catch(err => {
                setError(err.userMessage || "Erreur de connexion");
            });
    }

    return (
        <div className="auth-container">
            <div className="auth-card animate-scale-in">
                <div className="auth-logo">
                    <div className="logo-circle">BD</div>
                </div>
                <h1 className="auth-title">Espace de Connexion</h1>
                <p className="auth-subtitle">Accédez à votre plateforme de formation professionnelle</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label">Adresse email</label>
                        <div className="input-wrapper">
                            <FiMail className="input-icon" />
                            <input
                                type="email"
                                className="form-input"
                                placeholder="votre.email@exemple.com"
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
                                placeholder="Entrez votre mot de passe"
                                onChange={e => setValues({ ...values, password: e.target.value })}
                                required
                            />
                        </div>
                    </div>
                    <div className="auth-options">
                        <Link to="/forgot-password" disabled className="forgot-link">Mot de passe oublié ?</Link>
                    </div>

                    <button type="submit" className="btn-primary">
                        Accéder à mon espace <FiArrowRight />
                    </button>
                </form>

                <div className="auth-switch">
                    Pas encore de compte ? <Link to="/register">S'inscrire</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;
