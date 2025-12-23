import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEdit, FaTrash } from 'react-icons/fa';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import './AdminFormations.css';

const AdminFormations = () => {
    const name = localStorage.getItem('name') || 'Admin';
    const [formations, setFormations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
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

    const handleOpenModal = () => {
        setIsEditMode(false);
        setFormData({ titre: '', nombre_heures: '', cout: '', objectifs: '', programme: '' });
        setShowModal(true);
    };

    const handleEdit = (formation) => {
        setIsEditMode(true);
        setCurrentId(formation.id);
        setFormData({
            titre: formation.titre,
            nombre_heures: formation.nombre_heures,
            cout: formation.cout,
            objectifs: formation.objectifs,
            programme: formation.programme
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
            const token = localStorage.getItem('token');
            axios.delete(`http://localhost:8081/formations/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => {
                    if (res.data.Status === "Success") {
                        setMessage({ type: 'success', text: 'Formation supprimée.' });
                        fetchFormations();
                        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                    } else {
                        setMessage({ type: 'error', text: res.data.Error });
                    }
                })
                .catch(err => {
                    console.error(err);
                    setMessage({ type: 'error', text: "Erreur suppression." });
                });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        let apiCall;
        if (isEditMode) {
            apiCall = axios.put(`http://localhost:8081/formations/${currentId}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } else {
            apiCall = axios.post('http://localhost:8081/formations', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        }

        apiCall
            .then(res => {
                if (res.data.Status === "Success") {
                    setMessage({ type: 'success', text: isEditMode ? 'Formation modifiée !' : 'Formation ajoutée !' });
                    setShowModal(false);
                    setFormData({ titre: '', nombre_heures: '', cout: '', objectifs: '', programme: '' });
                    fetchFormations();
                    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                } else {
                    setMessage({ type: 'error', text: res.data.Error });
                }
            })
            .catch(err => {
                console.error(err);
                setMessage({ type: 'error', text: "Erreur lors de l'opération." });
            });
    };

    return (
        <DashboardLayout role="admin" name={name}>
            <div className="formations-container">
                <div className="formations-header">
                    <h2>Gestion des Formations</h2>
                    <button className="add-btn" onClick={handleOpenModal}>
                        + Nouvelle Formation
                    </button>
                </div>

                {message.text && (
                    <div className={`error-message`} style={{ backgroundColor: message.type === 'success' ? '#d1fae5' : '#fee2e2', color: message.type === 'success' ? '#065f46' : '#991b1b' }}>
                        {message.text}
                    </div>
                )}

                <div className="table-responsive">
                    <table className="formations-table">
                        <thead>
                            <tr>
                                <th>Titre</th>
                                <th>Heures</th>
                                <th>Coût (€)</th>
                                <th>Objectifs</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formations.map(formation => (
                                <tr key={formation.id}>
                                    <td><strong>{formation.titre}</strong></td>
                                    <td>{formation.nombre_heures} h</td>
                                    <td>{formation.cout} €</td>
                                    <td>{formation.objectifs.substring(0, 50)}...</td>
                                    <td>
                                        <div className="actions-cell" style={{ justifyContent: 'flex-end' }}>
                                            <button className="btn-action btn-edit" onClick={() => handleEdit(formation)} title="Modifier">
                                                <FaEdit size={16} />
                                            </button>
                                            <button className="btn-action btn-delete" onClick={() => handleDelete(formation.id)} title="Supprimer">
                                                <FaTrash size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {formations.length === 0 && (
                                <tr>
                                    <td colSpan="5" style={{ textAlign: 'center', color: '#6b7280' }}>Aucune formation trouvée.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Modal for Adding/Editing Formation */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>{isEditMode ? 'Modifier la Formation' : 'Ajouter une Formation'}</h3>
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
                                    <button type="submit" className="btn-primary" style={{ marginTop: 0 }}>
                                        {isEditMode ? 'Modifier' : 'Enregistrer'}
                                    </button>
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
