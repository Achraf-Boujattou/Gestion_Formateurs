import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiPlus, FiBook, FiCheckCircle, FiAlertCircle, FiClock, FiDollarSign, FiTag, FiMapPin, FiCalendar } from 'react-icons/fi';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import './AdminFormations.css';

const AdminFormations = () => {
    const name = sessionStorage.getItem('name') || 'Admin';
    const [formations, setFormations] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        titre: '',
        nombre_heures: '',
        cout: '',
        objectifs: '',
        programme: '',
        categorie: 'Informatique',
        ville: 'Casablanca',
        date_formation: ''
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
        setFormData({
            titre: '', nombre_heures: '', cout: '', objectifs: '', programme: '',
            categorie: 'Informatique', ville: 'Casablanca', date_formation: ''
        });
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
            programme: formation.programme,
            categorie: formation.categorie || 'Informatique',
            ville: formation.ville || 'Casablanca',
            date_formation: formation.date_formation ? formation.date_formation.split('T')[0] : ''
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cette formation ?")) {
            const token = sessionStorage.getItem('token');
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
        const token = sessionStorage.getItem('token');

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
                    <div className="title-section">
                        <h2>Gestion des Formations</h2>
                        <p>Catalogue des programmes et modules pédagogiques</p>
                    </div>
                    <button className="add-btn" onClick={handleOpenModal}>
                        <FiPlus /> Nouvelle Formation
                    </button>
                </div>

                {message.text && (
                    <div className={`status-alert ${message.type}`}>
                        {message.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="table-responsive">
                    <table className="formations-table">
                        <thead>
                            <tr>
                                <th>Titre & Catégorie</th>
                                <th>Localisation</th>
                                <th>Date & Heures</th>
                                <th>Coût (€)</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {formations.map(formation => (
                                <tr key={formation.id}>
                                    <td>
                                        <div className="formation-info">
                                            <strong>{formation.titre}</strong>
                                            <span className="cat-text"><FiTag /> {formation.categorie}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="val-badge"><FiMapPin /> {formation.ville}</div>
                                    </td>
                                    <td>
                                        <div className="date-hours-info">
                                            {formation.date_formation && <span className="date-text"><FiCalendar /> {new Date(formation.date_formation).toLocaleDateString()}</span>}
                                            <span className="hours-text"><FiClock /> {formation.nombre_heures}h</span>
                                        </div>
                                    </td>
                                    <td>
                                        <div className="val-badge price"><FiDollarSign /> {formation.cout}€</div>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="btn-action btn-edit" onClick={() => handleEdit(formation)} title="Modifier">
                                                <FiEdit2 />
                                            </button>
                                            <button className="btn-action btn-delete" onClick={() => handleDelete(formation.id)} title="Supprimer">
                                                <FiTrash2 />
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
                        <div className="modal-content large">
                            <div className="modal-header">
                                <h3>{isEditMode ? 'Modifier la Formation' : 'Ajouter une Formation'}</h3>
                                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="form-group span-2">
                                        <label className="form-label">Titre de la formation</label>
                                        <input type="text" name="titre" className="form-input" value={formData.titre} onChange={handleChange} required />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Catégorie</label>
                                        <select name="categorie" className="form-input" value={formData.categorie} onChange={handleChange}>
                                            <option value="Informatique">Informatique</option>
                                            <option value="Management">Management</option>
                                            <option value="Soft Skills">Soft Skills</option>
                                            <option value="Marketing">Marketing</option>
                                            <option value="Design">Design</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Ville</label>
                                        <input type="text" name="ville" className="form-input" value={formData.ville} onChange={handleChange} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Date prévue</label>
                                        <input type="date" name="date_formation" className="form-input" value={formData.date_formation} onChange={handleChange} />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Nombre d'heures</label>
                                        <input type="number" name="nombre_heures" className="form-input" value={formData.nombre_heures} onChange={handleChange} required />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Coût (€)</label>
                                        <input type="number" name="cout" className="form-input" value={formData.cout} onChange={handleChange} required />
                                    </div>

                                    <div className="form-group span-2">
                                        <label className="form-label">Objectifs Pédagogiques</label>
                                        <textarea name="objectifs" className="form-input textarea-field" value={formData.objectifs} onChange={handleChange} required />
                                    </div>

                                    <div className="form-group span-2">
                                        <label className="form-label">Programme Détaillé</label>
                                        <textarea name="programme" className="form-input textarea-field" value={formData.programme} onChange={handleChange} required />
                                    </div>
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
