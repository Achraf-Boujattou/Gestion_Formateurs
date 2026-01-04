import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiEdit2, FiTrash2, FiSearch, FiPlus, FiUserPlus, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
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
        const token = sessionStorage.getItem('token');
        axios.get('http://localhost:8081/utilisateurs', {
            headers: { 'Authorization': `Bearer ${token}` }
        })
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
            const token = sessionStorage.getItem('token');
            axios.delete(`http://localhost:8081/utilisateurs/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => {
                    if (res.data.Status === "Success") {
                        setMessage({ type: 'success', text: 'Utilisateur supprimé.' });
                        fetchUsers();
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
            apiCall = axios.put(`http://localhost:8081/utilisateurs/${currentId}`, formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        } else {
            apiCall = axios.post('http://localhost:8081/utilisateurs', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
        }

        apiCall
            .then(res => {
                if (res.data.Status === "Success") {
                    setMessage({ type: 'success', text: isEditMode ? 'Utilisateur modifié !' : 'Utilisateur ajouté !' });
                    setShowModal(false);
                    fetchUsers();
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
                                className="search-bar"
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
                                            <button className="btn-action btn-edit" onClick={() => handleEdit(user)} title="Modifier l'utilisateur">
                                                <FiEdit2 />
                                            </button>
                                            <button className="btn-action btn-delete" onClick={() => handleDelete(user.id)} title="Supprimer l'utilisateur">
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
                            <form onSubmit={handleSubmit}>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">Prénom</label>
                                        <input type="text" name="prenom" className="form-input" value={formData.prenom} onChange={handleChange} required />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label className="form-label">Nom</label>
                                        <input type="text" name="nom" className="form-input" value={formData.nom} onChange={handleChange} required />
                                    </div>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Email</label>
                                    <input type="email" name="email" className="form-input" value={formData.email} onChange={handleChange} required />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Rôle</label>
                                    <select name="role" className="form-input" value={formData.role} onChange={handleChange} required>
                                        <option value="formateur">Formateur</option>
                                        <option value="assistant">Assistant</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Mot de passe {isEditMode && '(Laisser vide pour ne pas changer)'}</label>
                                    <input type="password" name="password" className="form-input" value={formData.password} onChange={handleChange} required={!isEditMode} />
                                </div>
                                {formData.role === 'formateur' && (
                                    <>
                                        <div className="form-group">
                                            <label className="form-label">Compétences</label>
                                            <textarea name="competences" className="form-input" value={formData.competences} onChange={handleChange} rows="3" placeholder="Ex: React, Java, SQL..."></textarea>
                                        </div>
                                        <div className="form-group">
                                            <label className="form-label">Remarques</label>
                                            <textarea name="remarques" className="form-input" value={formData.remarques} onChange={handleChange} rows="3"></textarea>
                                        </div>
                                    </>
                                )}
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

export default AdminUsers;
