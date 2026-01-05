import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { FiEdit2, FiTrash2, FiGlobe, FiPhone, FiMail, FiMapPin, FiPlus, FiCheckCircle, FiAlertCircle, FiSearch } from 'react-icons/fi';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import './Entreprises.css';

const Entreprises = () => {
    const role = sessionStorage.getItem('role');
    const name = sessionStorage.getItem('name') || 'Utilisateur';
    const [entreprises, setEntreprises] = useState([]);
    const [filteredEntreprises, setFilteredEntreprises] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        nom: '',
        adresse: '',
        telephone: '',
        site_web: '',
        email: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    const fetchEntreprises = async () => {
        try {
            const res = await api.get('/entreprises');
            setEntreprises(res.data);
            setFilteredEntreprises(res.data);
        } catch (err) {
            console.error("Erreur chargement entreprises", err);
        }
    };

    useEffect(() => {
        fetchEntreprises();
    }, []);

    useEffect(() => {
        const results = entreprises.filter(ent =>
            ent.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (ent.adresse && ent.adresse.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredEntreprises(results);
    }, [searchTerm, entreprises]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOpenModal = () => {
        setIsEditMode(false);
        setFormData({ nom: '', adresse: '', telephone: '', site_web: '', email: '' });
        setShowModal(true);
    };

    const handleEdit = (ent) => {
        setIsEditMode(true);
        setCurrentId(ent.id);
        setFormData({
            nom: ent.nom,
            adresse: ent.adresse || '',
            telephone: ent.telephone || '',
            site_web: ent.site_web || '',
            email: ent.email || ''
        });
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Supprimer cette entreprise ?")) {
            try {
                await api.delete(`/entreprises/${id}`);
                setMessage({ type: 'success', text: 'Entreprise supprimée.' });
                fetchEntreprises();
                setTimeout(() => setMessage({ type: '', text: '' }), 3000);
            } catch (err) {
                setMessage({ type: 'error', text: err.response?.data?.Error || 'Erreur suppression.' });
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEditMode) {
                await api.put(`/entreprises/${currentId}`, formData);
                setMessage({ type: 'success', text: 'Entreprise modifiée !' });
            } else {
                await api.post('/entreprises', formData);
                setMessage({ type: 'success', text: 'Entreprise ajoutée !' });
            }
            setShowModal(false);
            fetchEntreprises();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.Error || "Erreur lors de l'enregistrement." });
        }
    };

    return (
        <DashboardLayout role={role} name={name}>
            <div className="entreprises-container">
                <div className="entreprises-header">
                    <div className="title-section">
                        <h2>Gestion des Entreprises</h2>
                        <p>Partenaires et structures d'accueil</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <div className="search-wrapper">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                className="search-bar-premium"
                                placeholder="Rechercher une entreprise..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="add-btn" onClick={handleOpenModal}>
                            <FiPlus /> Nouvelle Entreprise
                        </button>
                    </div>
                </div>

                {message.text && (
                    <div className={`status-alert ${message.type}`}>
                        {message.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="entreprises-grid">
                    {filteredEntreprises.map(ent => (
                        <div key={ent.id} className="entreprise-card animate-fade-in">
                            <div className="card-header">
                                <h3>{ent.nom}</h3>
                                <div className="card-actions">
                                    <button onClick={() => handleEdit(ent)} className="edit-icon" title="Modifier"><FiEdit2 /></button>
                                    <button onClick={() => handleDelete(ent.id)} className="delete-icon" title="Supprimer"><FiTrash2 /></button>
                                </div>
                            </div>
                            <div className="card-body">
                                {ent.adresse && <p><FiMapPin /> {ent.adresse}</p>}
                                {ent.telephone && <p><FiPhone /> {ent.telephone}</p>}
                                {ent.email && <p><FiMail /> {ent.email}</p>}
                                {ent.site_web && (
                                    <p>
                                        <FiGlobe /> <a href={ent.site_web.startsWith('http') ? ent.site_web : `https://${ent.site_web}`} target="_blank" rel="noopener noreferrer">
                                            {ent.site_web.replace(/^https?:\/\//, '')}
                                        </a>
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>{isEditMode ? 'Modifier Entreprise' : 'Ajouter Entreprise'}</h3>
                                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit} className="premium-form">
                                <div className="form-grid">
                                    <div className="form-group full-width">
                                        <label>Nom de l'entreprise <span className="req">*</span></label>
                                        <div className="input-with-icon">
                                            <FiEdit2 className="field-icon" />
                                            <input
                                                type="text"
                                                name="nom"
                                                placeholder="Ex: Tech Solutions Inc."
                                                value={formData.nom}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Adresse du siège</label>
                                        <div className="input-with-icon">
                                            <FiMapPin className="field-icon" />
                                            <textarea
                                                name="adresse"
                                                placeholder="123 Avenue de l'Innovation..."
                                                value={formData.adresse}
                                                onChange={handleChange}
                                                rows="2"
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Contact Téléphonique</label>
                                        <div className="input-with-icon">
                                            <FiPhone className="field-icon" />
                                            <input
                                                type="tel"
                                                name="telephone"
                                                placeholder="+33 6 12 34 56 78"
                                                value={formData.telephone}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Email Professionnel</label>
                                        <div className="input-with-icon">
                                            <FiMail className="field-icon" />
                                            <input
                                                type="email"
                                                name="email"
                                                placeholder="contact@entreprise.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Site Internet</label>
                                        <div className="input-with-icon">
                                            <FiGlobe className="field-icon" />
                                            <input
                                                type="text"
                                                name="site_web"
                                                placeholder="www.tech-solutions.com"
                                                value={formData.site_web}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Annuler et fermer</button>
                                    <button type="submit" className="btn-primary">
                                        <FiCheckCircle />
                                        {isEditMode ? 'Enregistrer les modifications' : 'Confirmer l\'ajout'}
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

export default Entreprises;
