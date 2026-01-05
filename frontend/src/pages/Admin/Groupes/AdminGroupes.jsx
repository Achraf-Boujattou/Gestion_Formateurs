import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUsers, FiPlus, FiTrash2, FiUserPlus, FiBook, FiUser, FiMoreVertical } from 'react-icons/fi';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import './AdminGroupes.css';

const AdminGroupes = () => {
    const name = sessionStorage.getItem('name') || 'Admin';
    const [groups, setGroups] = useState([]);
    const [dependencies, setDependencies] = useState({ formations: [], formateurs: [] });
    const [individus, setIndividus] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showAddMemberModal, setShowAddMemberModal] = useState(false);
    const [currentGroupId, setCurrentGroupId] = useState(null);
    const [newGroup, setNewGroup] = useState({ nom_groupe: '', formation_id: '', formateur_id: '' });
    const [selectedIndividuId, setSelectedIndividuId] = useState('');
    const [members, setMembers] = useState({}); // { groupId: [members] }

    useEffect(() => {
        fetchGroups();
        fetchDependencies();
        fetchInscriptions(); // To get the list of individuals
    }, []);

    const fetchGroups = async () => {
        const token = sessionStorage.getItem('token');
        const res = await axios.get('http://localhost:8081/groupes', { headers: { 'Authorization': `Bearer ${token}` } });
        setGroups(res.data);
    };

    const fetchDependencies = async () => {
        const token = sessionStorage.getItem('token');
        const res = await axios.get('http://localhost:8081/plannings/dependencies', { headers: { 'Authorization': `Bearer ${token}` } });
        setDependencies(res.data);
    };

    const fetchInscriptions = async () => {
        const token = sessionStorage.getItem('token');
        const res = await axios.get('http://localhost:8081/inscriptions', { headers: { 'Authorization': `Bearer ${token}` } });
        // Extract unique individuals
        const uniqueIndivs = [];
        const seenEmails = new Set();
        res.data.forEach(i => {
            if (!seenEmails.has(i.email)) {
                seenEmails.add(i.email);
                uniqueIndivs.push({ id: i.individu_id, nom: i.nom, prenom: i.prenom, email: i.email });
            }
        });
        setIndividus(uniqueIndivs);
    };

    const handleCreateGroup = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        await axios.post('http://localhost:8081/groupes', newGroup, { headers: { 'Authorization': `Bearer ${token}` } });
        setShowModal(false);
        fetchGroups();
    };

    const openAddMember = (groupId) => {
        setCurrentGroupId(groupId);
        setShowAddMemberModal(true);
    };

    const handleAddMember = async (e) => {
        e.preventDefault();
        const token = sessionStorage.getItem('token');
        try {
            await axios.post('http://localhost:8081/groupes/membres', {
                groupe_id: currentGroupId,
                individu_id: selectedIndividuId
            }, { headers: { 'Authorization': `Bearer ${token}` } });
            setShowAddMemberModal(false);
            fetchGroups();
        } catch (err) {
            alert(err.response?.data?.Error || "Erreur lors de l'ajout");
        }
    };

    const toggleMembers = async (groupId) => {
        if (members[groupId]) {
            const newM = { ...members };
            delete newM[groupId];
            setMembers(newM);
        } else {
            const token = sessionStorage.getItem('token');
            const res = await axios.get(`http://localhost:8081/groupes/${groupId}/membres`, { headers: { 'Authorization': `Bearer ${token}` } });
            setMembers({ ...members, [groupId]: res.data });
        }
    };

    return (
        <DashboardLayout role="admin" name={name}>
            <div className="groupes-container">
                <div className="groupes-header">
                    <div className="title-section">
                        <h2>Gestion des Groupes</h2>
                        <p>Créez des groupes d'apprentissage et affectez des formateurs</p>
                    </div>
                    <button className="add-btn" onClick={() => setShowModal(true)}>
                        <FiPlus /> Nouveau Groupe
                    </button>
                </div>

                <div className="groupes-grid">
                    {groups.map(g => (
                        <div key={g.id} className="group-card card-premium">
                            <div className="group-card-header">
                                <div className="g-icon-box"><FiUsers /></div>
                                <div className="g-title-box">
                                    <h3>{g.nom_groupe}</h3>
                                    <p><FiBook /> {g.formation_titre}</p>
                                </div>
                            </div>

                            <div className="group-meta">
                                <div className="meta-row">
                                    <FiUser />
                                    <span>Formateur: <strong>{g.formateur_nom ? `${g.formateur_prenom} ${g.formateur_nom}` : 'Non affecté'}</strong></span>
                                </div>
                                <div className="meta-row">
                                    <FiUsers />
                                    <span>Effectif: <strong>{g.membre_count} membres</strong></span>
                                </div>
                            </div>

                            <div className="group-actions">
                                <button className="btn-secondary" onClick={() => toggleMembers(g.id)}>
                                    {members[g.id] ? 'Masquer membres' : 'Voir membres'}
                                </button>
                                <button className="btn-primary" onClick={() => openAddMember(g.id)}>
                                    <FiUserPlus /> Ajouter membre
                                </button>
                            </div>

                            {members[g.id] && (
                                <div className="members-list animate-fade-in">
                                    {members[g.id].length === 0 ? <p className="no-members">Aucun membre dans ce groupe.</p> : (
                                        members[g.id].map(m => (
                                            <div key={m.id} className="member-item">
                                                <span>{m.prenom} {m.nom}</span>
                                                <small>{m.email}</small>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Create Group Modal */}
                {showModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Créer un nouveau groupe</h3>
                                <button className="close-btn" onClick={() => setShowModal(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleCreateGroup}>
                                <div className="form-group">
                                    <label>Nom du groupe</label>
                                    <input type="text" className="form-input" value={newGroup.nom_groupe} onChange={e => setNewGroup({ ...newGroup, nom_groupe: e.target.value })} required />
                                </div>
                                <div className="form-group">
                                    <label>Formation</label>
                                    <select className="form-input" value={newGroup.formation_id} onChange={e => setNewGroup({ ...newGroup, formation_id: e.target.value })} required>
                                        <option value="">Sélectionner une formation</option>
                                        {dependencies.formations.map(f => <option key={f.id} value={f.id}>{f.titre}</option>)}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Formateur</label>
                                    <select className="form-input" value={newGroup.formateur_id} onChange={e => setNewGroup({ ...newGroup, formateur_id: e.target.value })}>
                                        <option value="">Aucun (Temporairement)</option>
                                        {dependencies.formateurs.map(f => <option key={f.id} value={f.id}>{f.nom} {f.prenom}</option>)}
                                    </select>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Annuler</button>
                                    <button type="submit" className="btn-primary">Créer le groupe</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Add Member Modal */}
                {showAddMemberModal && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Ajouter un individu au groupe</h3>
                                <button className="close-btn" onClick={() => setShowAddMemberModal(false)}>&times;</button>
                            </div>
                            <form onSubmit={handleAddMember}>
                                <div className="form-group">
                                    <label>Sélectionner l'individu</label>
                                    <select className="form-input" value={selectedIndividuId} onChange={e => setSelectedIndividuId(e.target.value)} required>
                                        <option value="">Sélectionner...</option>
                                        {individus.map(i => <option key={i.id} value={i.id}>{i.prenom} {i.nom} ({i.email})</option>)}
                                    </select>
                                </div>
                                <div className="modal-actions">
                                    <button type="button" className="btn-secondary" onClick={() => setShowAddMemberModal(false)}>Annuler</button>
                                    <button type="submit" className="btn-primary">Ajouter</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
};

export default AdminGroupes;
