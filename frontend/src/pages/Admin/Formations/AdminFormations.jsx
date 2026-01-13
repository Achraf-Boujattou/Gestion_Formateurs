import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { FiEdit2, FiTrash2, FiPlus, FiBook, FiCheckCircle, FiAlertCircle, FiClock, FiDollarSign, FiTag, FiMapPin, FiCalendar, FiTarget, FiList } from 'react-icons/fi';
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
        api.get('/formations')
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
            api.delete(`/formations/${id}`)
                .then(res => {
                    if (res.data.Status === "Success") {
                        setMessage({ type: 'success', text: 'Formation supprimée.' });
                        fetchFormations();
                        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                    }
                })
                .catch(err => {
                    setMessage({ type: 'error', text: err.userMessage || "Erreur suppression." });
                });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const apiCall = isEditMode
            ? api.put(`/formations/${currentId}`, formData)
            : api.post('/formations', formData);

        apiCall
            .then(res => {
                if (res.data.Status === "Success") {
                    setMessage({ type: 'success', text: isEditMode ? 'Formation modifiée !' : 'Formation ajoutée !' });
                    setShowModal(false);
                    fetchFormations();
                    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                }
            })
            .catch(err => {
                setMessage({ type: 'error', text: err.userMessage || "Erreur lors de l'opération." });
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
                                            <button className="btn-action-premium btn-action-edit" onClick={() => handleEdit(formation)} title="Modifier">
                                                <FiEdit2 />
                                            </button>
                                            <button className="btn-action-premium btn-action-delete" onClick={() => handleDelete(formation.id)} title="Supprimer">
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
                            <form onSubmit={handleSubmit} className="premium-form">
                                <div className="form-sections-container">
                                    {/* Section 1: Informations Générales */}
                                    <div className="form-section-modern animate-slide-up stagger-1">
                                        <div className="section-header-mini">
                                            <FiTag /> <span>Généralités</span>
                                        </div>
                                        <div className="form-grid">
                                            <div className="form-group full-width">
                                                <label>Titre de la formation <span className="req">*</span></label>
                                                <div className="input-with-icon">
                                                    <FiBook className="field-icon" />
                                                    <input
                                                        type="text"
                                                        name="titre"
                                                        placeholder="Ex: Masterclass React & Node.js"
                                                        value={formData.titre}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Catégorie</label>
                                                <div className="input-with-icon">
                                                    <FiTag className="field-icon" />
                                                    <select name="categorie" value={formData.categorie} onChange={handleChange}>
                                                        <option value="Informatique">Informatique</option>
                                                        <option value="Management">Management</option>
                                                        <option value="Soft Skills">Soft Skills</option>
                                                        <option value="Marketing">Marketing</option>
                                                        <option value="Design">Design</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Ville</label>
                                                <div className="input-with-icon">
                                                    <FiMapPin className="field-icon" />
                                                    <input
                                                        type="text"
                                                        name="ville"
                                                        placeholder="Ex: Casablanca"
                                                        value={formData.ville}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Logistique & Coûts */}
                                    <div className="form-section-modern animate-slide-up stagger-2">
                                        <div className="section-header-mini">
                                            <FiClock /> <span>Logistique & Coût</span>
                                        </div>
                                        <div className="form-grid">
                                            <div className="form-group">
                                                <label>Date de démarrage</label>
                                                <div className="input-with-icon">
                                                    <FiCalendar className="field-icon" />
                                                    <input
                                                        type="date"
                                                        name="date_formation"
                                                        value={formData.date_formation}
                                                        onChange={handleChange}
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group">
                                                <label>Nombre d'heures</label>
                                                <div className="input-with-icon">
                                                    <FiClock className="field-icon" />
                                                    <input
                                                        type="number"
                                                        name="nombre_heures"
                                                        placeholder="Ex: 35"
                                                        value={formData.nombre_heures}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group full-width">
                                                <label>Coût par participant (€)</label>
                                                <div className="input-with-icon">
                                                    <FiDollarSign className="field-icon" />
                                                    <input
                                                        type="number"
                                                        name="cout"
                                                        placeholder="Ex: 1500"
                                                        value={formData.cout}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 3: Contenu Pédagogique */}
                                    <div className="form-section-modern animate-slide-up stagger-3">
                                        <div className="section-header-mini">
                                            <FiTarget /> <span>Contenu Pédagogique</span>
                                        </div>
                                        <div className="form-grid">
                                            <div className="form-group full-width">
                                                <label>Objectifs Pédagogiques</label>
                                                <div className="input-with-icon">
                                                    <FiTarget className="field-icon" />
                                                    <textarea
                                                        name="objectifs"
                                                        placeholder="Quels sont les compétences visées..."
                                                        value={formData.objectifs}
                                                        onChange={handleChange}
                                                        required
                                                        rows="3"
                                                    />
                                                </div>
                                            </div>

                                            <div className="form-group full-width">
                                                <label>Programme Détaillé</label>
                                                <div className="input-with-icon">
                                                    <FiList className="field-icon" />
                                                    <textarea
                                                        name="programme"
                                                        placeholder="Module 1: Introduction..."
                                                        value={formData.programme}
                                                        onChange={handleChange}
                                                        required
                                                        rows="4"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Annuler</button>
                                    <button type="submit" className="btn-primary">
                                        <FiCheckCircle />
                                        {isEditMode ? 'Enregistrer les modifications' : 'Créer la formation'}
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
