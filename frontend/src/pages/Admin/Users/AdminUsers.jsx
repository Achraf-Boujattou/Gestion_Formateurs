import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { FiEdit2, FiTrash2, FiSearch, FiPlus, FiUserPlus, FiAlertCircle, FiCheckCircle, FiUser, FiMail, FiLock, FiShield, FiCheckSquare } from 'react-icons/fi';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import './AdminUsers.css';

const AdminUsers = () => {
    const name = sessionStorage.getItem('name') || 'Admin';
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [currentId, setCurrentId] = useState(null);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        password: '',
        role: 'admin',
        competences: '',
        remarques: ''
    });
    const [message, setMessage] = useState({ type: '', text: '' });

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;

    const fetchUsers = () => {
        api.get('/utilisateurs')
            .then(res => {
                setUsers(res.data);
                setFilteredUsers(res.data);
            })
            .catch(err => console.error("Erreur chargement utilisateurs", err));
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Search Logic
    useEffect(() => {
        const results = users.filter(user =>
            user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredUsers(results);
        setCurrentPage(1); // Reset to first page on search
    }, [searchTerm, users]);

    // Pagination Logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Form Handling
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleOpenModal = () => {
        setIsEditMode(false);
        setFormData({ nom: '', prenom: '', email: '', password: '', role: 'formateur', competences: '', remarques: '' });
        setShowModal(true);
    };

    const handleEdit = (user) => {
        setIsEditMode(true);
        setCurrentId(user.id);
        setFormData({
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
            password: '', // Don't show password
            role: user.role,
            competences: user.competences || '',
            remarques: user.remarques || ''
        });
        setShowModal(true);
    };

    const handleDelete = (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
            api.delete(`/utilisateurs/${id}`)
                .then(res => {
                    if (res.data.Status === "Success") {
                        setMessage({ type: 'success', text: 'Utilisateur supprimé.' });
                        fetchUsers();
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
            ? api.put(`/utilisateurs/${currentId}`, formData)
            : api.post('/utilisateurs', formData);

        apiCall
            .then(res => {
                if (res.data.Status === "Success") {
                    setMessage({ type: 'success', text: isEditMode ? 'Utilisateur modifié !' : 'Utilisateur ajouté !' });
                    setShowModal(false);
                    fetchUsers();
                    setTimeout(() => setMessage({ type: '', text: '' }), 3000);
                }
            })
            .catch(err => {
                setMessage({ type: 'error', text: err.userMessage || "Erreur lors de l'opération." });
            });
    };

    return (
        <DashboardLayout role="admin" name={name}>
            <div className="users-container">
                <div className="users-header">
                    <div className="title-section">
                        <h2>Gestion des Utilisateurs</h2>
                        <p>Consultez et gérez les accès de vos collaborateurs</p>
                    </div>
                    <div className="header-actions">
                        <div className="search-wrapper">
                            <FiSearch className="search-icon" />
                            <input
                                type="text"
                                className="search-bar-premium"
                                placeholder="Rechercher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="add-btn" onClick={handleOpenModal}>
                            <FiPlus /> Nouvel Utilisateur
                        </button>
                    </div>
                </div>

                {message.text && (
                    <div className={`status-alert ${message.type}`}>
                        {message.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="table-responsive">
                    <table className="users-table">
                        <thead>
                            <tr>
                                <th>Nom</th>
                                <th>Email</th>
                                <th>Rôle</th>
                                <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(user => (
                                <tr key={user.id}>
                                    <td><strong>{user.prenom} {user.nom}</strong></td>
                                    <td>{user.email}</td>
                                    <td>
                                        <span className={`role-badge role-${user.role}`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="btn-action-premium btn-action-edit" onClick={() => handleEdit(user)} title="Modifier l'utilisateur">
                                                <FiEdit2 />
                                            </button>
                                            <button className="btn-action-premium btn-action-delete" onClick={() => handleDelete(user.id)} title="Supprimer l'utilisateur">
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan="4" style={{ textAlign: 'center', color: '#6b7280' }}>Aucun utilisateur trouvé.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="pagination">
                        {[...Array(totalPages)].map((_, i) => (
                            <button
                                key={i}
                                onClick={() => paginate(i + 1)}
                                className={`page-btn ${currentPage === i + 1 ? 'active' : ''}`}
                            >
                                {i + 1}
                            </button>
                        ))}
                    </div>
                )}

                {/* Modal */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>{isEditMode ? 'Modifier Utilisateur' : 'Ajouter Utilisateur'}</h3>
                                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleSubmit} className="premium-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label>Prénom <span className="req">*</span></label>
                                        <div className="input-with-icon">
                                            <FiUser className="field-icon" />
                                            <input
                                                type="text"
                                                name="prenom"
                                                value={formData.prenom}
                                                onChange={handleChange}
                                                placeholder="Ex: Jean"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Nom <span className="req">*</span></label>
                                        <div className="input-with-icon">
                                            <FiUser className="field-icon" />
                                            <input
                                                type="text"
                                                name="nom"
                                                value={formData.nom}
                                                onChange={handleChange}
                                                placeholder="Ex: Dupont"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group full-width">
                                        <label>Email Professionnel <span className="req">*</span></label>
                                        <div className="input-with-icon">
                                            <FiMail className="field-icon" />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="jean.dupont@entreprise.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Rôle <span className="req">*</span></label>
                                        <div className="input-with-icon">
                                            <FiShield className="field-icon" />
                                            <select name="role" value={formData.role} onChange={handleChange} required>
                                                <option value="formateur">Formateur</option>
                                                <option value="assistant">Assistant</option>
                                                <option value="admin">Administrateur</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="form-group">
                                        <label>Mot de passe {isEditMode && '(Optionnel)'}</label>
                                        <div className="input-with-icon">
                                            <FiLock className="field-icon" />
                                            <input
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                placeholder={isEditMode ? "••••••••" : "Mot de passe sécurisé"}
                                                required={!isEditMode}
                                            />
                                        </div>
                                    </div>

                                    {formData.role === 'formateur' && (
                                        <>
                                            <div className="form-group full-width">
                                                <label>Compétences Clés</label>
                                                <div className="input-with-icon">
                                                    <FiCheckSquare className="field-icon" />
                                                    <textarea
                                                        name="competences"
                                                        value={formData.competences}
                                                        onChange={handleChange}
                                                        rows="3"
                                                        placeholder="Ex: React, Java, SQL, Gestion de projet..."
                                                    />
                                                </div>
                                            </div>
                                            <div className="form-group full-width">
                                                <label>Remarques / Bio</label>
                                                <div className="input-with-icon">
                                                    <FiEdit2 className="field-icon" />
                                                    <textarea
                                                        name="remarques"
                                                        value={formData.remarques}
                                                        onChange={handleChange}
                                                        rows="2"
                                                        placeholder="Notes additionnelles sur le formateur..."
                                                    />
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="modal-actions">
                                    <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>Annuler</button>
                                    <button type="submit" className="btn-primary">
                                        <FiCheckCircle />
                                        {isEditMode ? 'Enregistrer les modifications' : 'Créer l\'utilisateur'}
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

export default AdminUsers;
