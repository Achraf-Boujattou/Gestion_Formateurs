import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiXCircle, FiClock, FiPhone, FiMail, FiMapPin, FiCalendar, FiSearch } from 'react-icons/fi';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import './AdminInscriptions.css';

const AdminInscriptions = () => {
    const name = sessionStorage.getItem('name') || 'Admin';
    const [inscriptions, setInscriptions] = useState([]);
    const [filteredInscriptions, setFilteredInscriptions] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchInscriptions();
    }, []);

    useEffect(() => {
        const results = inscriptions.filter(inscr =>
            inscr.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inscr.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
            inscr.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (inscr.formation_titre && inscr.formation_titre.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredInscriptions(results);
    }, [searchTerm, inscriptions]);

    const fetchInscriptions = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:8081/inscriptions', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setInscriptions(res.data);
            setFilteredInscriptions(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = sessionStorage.getItem('token');
            await axios.put(`http://localhost:8081/inscriptions/${id}/status`, { status: newStatus }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchInscriptions();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <DashboardLayout role="admin" name={name}>
            <div className="inscriptions-container">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <div className="title-section">
                        <h2>Inscriptions Publiques</h2>
                        <p>Gérez les demandes d'inscription des individus aux formations</p>
                    </div>
                    <div className="search-wrapper">
                        <FiSearch className="search-icon" />
                        <input
                            type="text"
                            className="search-bar-premium"
                            placeholder="Rechercher un inscrit..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="inscriptions-grid">
                    {filteredInscriptions.map(inscr => (
                        <div key={inscr.id} className="inscription-card card-premium">
                            <div className="inscr-status-badge" data-status={inscr.status}>
                                {inscr.status === 'valide' ? <FiCheckCircle /> : inscr.status === 'annule' ? <FiXCircle /> : <FiClock />}
                                {inscr.status}
                            </div>

                            <div className="inscr-header">
                                <div className="inscr-avatar">{inscr.prenom[0]}{inscr.nom[0]}</div>
                                <div>
                                    <h3>{inscr.prenom} {inscr.nom}</h3>
                                    <p className="formation-tag">{inscr.formation_titre}</p>
                                </div>
                            </div>

                            <div className="inscr-details">
                                <div className="detail-item"><FiMail /> {inscr.email}</div>
                                <div className="detail-item"><FiPhone /> {inscr.telephone}</div>
                                <div className="detail-item"><FiMapPin /> {inscr.ville}</div>
                                <div className="detail-item"><FiCalendar /> {new Date(inscr.date_naissance).toLocaleDateString()}</div>
                            </div>

                            <div className="inscr-actions">
                                <button className="btn-approve" onClick={() => handleStatusChange(inscr.id, 'valide')}>Valider</button>
                                <button className="btn-reject" onClick={() => handleStatusChange(inscr.id, 'annule')}>Annuler</button>
                            </div>
                        </div>
                    ))}
                    {inscriptions.length === 0 && !loading && <p className="no-data">Aucune inscription pour le moment.</p>}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminInscriptions;
