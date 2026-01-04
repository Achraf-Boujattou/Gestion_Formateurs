import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiGlobe, FiPhone, FiMail, FiMapPin, FiPlus, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import './Entreprises.css';

const Entreprises = () => {
    const role = sessionStorage.getItem('role');
    const name = sessionStorage.getItem('name') || 'Utilisateur';
    const [entreprises, setEntreprises] = useState([]);
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

    const fetchEntreprises = () => {
        const token = sessionStorage.getItem('token');
        axios.get('http://localhost:8081/entreprises', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => setEntreprises(res.data))
            .catch(err => console.error("Erreur chargement entreprises", err));
    };

    useEffect(() => {
        fetchEntreprises();
    }, []);

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

    const handleDelete = (id) => {
        if (window.confirm("Supprimer cette entreprise ?")) {
            const token = sessionStorage.getItem('token');
            axios.delete(`http://localhost:8081/entreprises/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => {
                    setMessage({ type: 'success', text: 'Entreprise supprimée.' });
                    fetchEntreprises();
                    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                })
                .catch(err => setMessage({ type: 'error', text: 'Erreur suppression.' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        const apiCall = isEditMode
            ? axios.put(`http://localhost:8081/entreprises/${currentId}`, formData, { headers: { 'Authorization': `Bearer ${token}` } })
            : axios.post('http://localhost:8081/entreprises', formData, { headers: { 'Authorization': `Bearer ${token}` } });

        apiCall.then(res => {
            setMessage({ type: 'success', text: isEditMode ? 'Entreprise modifiée !' : 'Entreprise ajoutée !' });
            setShowModal(false);
            fetchEntreprises();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        }).catch(err => {
            setMessage({ type: 'error', text: "Erreur lors de l'enregistrement." });
        });
    };

    return (
        <DashboardLayout role={role} name={name}>
            <div className="entreprises-container">
                <div className="entreprises-header">
                    <div className="title-section">
                        <h2>Gestion des Entreprises</h2>
                        <p>Partenaires et structures d'accueil</p>
                    </div>
                    <button className="add-btn" onClick={handleOpenModal}>
                        <FiPlus /> Nouvelle Entreprise
                    </button>
                </div>

                {message.text && (
                    <div className={`status-alert ${message.type}`}>
                        {message.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="entreprises-grid">
                    {entreprises.map(ent => (
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
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Nom de l'entreprise *</label>
                                    <input type="text" name="nom" className="form-input" value={formData.nom} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label>Adresse</label>
                                    <textarea name="adresse" className="form-input" value={formData.adresse} onChange={handleChange} rows="2" />
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label>Téléphone</label>
                                        <input type="text" name="telephone" className="form-input" value={formData.telephone} onChange={handleChange} />
                                    </div>
                                    <div className="form-group">
                                        <label>Email</label>
                                        <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label>Site Web</label>
                                    <input type="text" name="site_web" className="form-input" value={formData.site_web} onChange={handleChange} placeholder="www.exemple.com" />
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                                    <button type="submit" className="btn-primary">Enregistrer</button>
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
