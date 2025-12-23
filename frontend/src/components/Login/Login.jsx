import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
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
        axios.post('http://localhost:8081/login', values)
            .then(res => {
                if (res.data.Status === "Success") {
                    // Save auth info
                    localStorage.setItem('token', res.data.token);
                    localStorage.setItem('role', res.data.role);
                    localStorage.setItem('name', res.data.name);

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
                } else {
                    setError(res.data.Error);
                }
            })
            .catch(err => console.log(err));
    }

    return (
        <div className="auth-container">
            <div className="auth-card">
                <h1 className="auth-title">Connexion</h1>
                <p className="auth-subtitle">Accédez à votre espace de gestion</p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            className="form-input"
                            placeholder="Entrez votre email"
                            onChange={e => setValues({ ...values, email: e.target.value })}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Mot de passe</label>
                        <input
                            type="password"
                            id="password"
                            className="form-input"
                            placeholder="Entrez votre mot de passe"
                            onChange={e => setValues({ ...values, password: e.target.value })}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary">Se Connecter</button>
                </form>
            </div>
        </div>
    )
}

export default Login;
