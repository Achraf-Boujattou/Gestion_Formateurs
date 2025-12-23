import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import './AdminFormations.css';

const AdminFormations = () => {
    const name = localStorage.getItem('name') || 'Admin';
    const [formations, setFormations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        titre: '',
        nombre_heures: '',
        cout: '',
        objectifs: '',
        programme: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    // Fetch existing formations
    const fetchFormations = () => {
        axios.get('http://localhost:8081/formations')
            .then(res => setFormations(res.data))
            .catch(err => console.error("Erreur chargement formations", err));
    };

    useEffect(() => {
        fetchFormations();
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Get token for auth

        axios.post('http://localhost:8081/formations', formData, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => {
                if (res.data.Status === "Success") {
                    setMessage({ type: 'success', text: 'Formation ajoutée avec succès !' });
                    setShowModal(false);
                    setFormData({ titre: '', nombre_heures: '', cout: '', objectifs: '', programme: '' });
                    fetchFormations(); // Refresh list

                    // Clear message after 3 seconds
                    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                } else {
                    setMessage({ type: 'error', text: res.data.Error });
                }
            })
            .catch(err => {
                console.error(err);
                setMessage({ type: 'error', text: "Erreur lors de l'ajout." });
            });
    };

    return (
        <DashboardLayout role="admin" name={name}>
            <div className="formations-container">
                <div className="formations-header">
                    <h2>Gestion des Formations</h2>
                    <button className="add-btn" onClick={() => setShowModal(true)}>
                        + Nouvelle Formation
                    </button>
                </div>

                {message.text && (
                    <div className={`error-message`} style={{ backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2', color: message.type === 'success' ? '#065f46' : '#991b1b' }}>
                        {message.text}
                    </div>
                )}

                <div className="formations-grid">
                    {formations.map(formation => (
                        <div key={formation.id} className="formation-card">
                            <div>
                                <h3 className="formation-title">{formation.titre}</h3>
                                <p className="formation-details">{formation.nombre_heures} Heures</p>
                                <p className="formation-details" style={{ fontSize: '0.9rem', margin: '10px 0' }}>
                                    {formation.objectifs.substring(0, 100)}...
                                </p>
                            </div>
                            <div className="formation-price">{formation.cout} €</div>
                        </div>
                    ))}
                    {formations.length === 0 && <p>Aucune formation publique pour le moment.</p>}
                </div>

                {/* Modal for Adding Formation */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Ajouter une Formation</h3>
                                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label className="form-label">Titre de la formation</label>
                                    <input
                                        type="text"
                                        name="titre"
                                        className="form-input"
                                        value={formData.titre}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">Heures</label>
                                        <input
                                            type="number"
                                            name="nombre_heures"
                                            className="form-input"
                                            value={formData.nombre_heures}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">Coût (€)</label>
                                        <input
                                            type="number"
                                            name="cout"
                                            className="form-input"
                                            value={formData.cout}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Objectifs Pédagogiques</label>
                                    <textarea
                                        name="objectifs"
                                        className="form-input textarea-field"
                                        value={formData.objectifs}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Programme Détaillé</label>
                                    <textarea
                                        name="programme"
                                        className="form-input textarea-field"
                                        value={formData.programme}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                                    <button type="submit" className="btn-primary" style={{ marginTop: 0 }}>Enregistrer</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminFormations;
