import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiCheckCircle, FiXCircle, FiClock, FiMail, FiPhone, FiTag, FiUserCheck, FiInfo } from 'react-icons/fi';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import './AdminCandidatures.css';

const AdminCandidatures = () => {
    const name = sessionStorage.getItem('name') || 'Admin';
    const [candidatures, setCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');

    useEffect(() => {
        fetchCandidatures();
    }, []);

    const fetchCandidatures = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:8081/candidatures', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setCandidatures(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (id, newStatus) => {
        if (!window.confirm(`Voulez-vous vraiment ${newStatus === 'valide' ? 'valider' : 'refuser'} cette candidature ?`)) return;

        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.put(`http://localhost:8081/candidatures/${id}/status`, { statut: newStatus }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage(res.data.Message);
            fetchCandidatures();
            setTimeout(() => setMessage(''), 5000);
        } catch (err) {
            alert(err.response?.data?.Error || "Erreur système");
        }
    };

    return (
        <DashboardLayout role="admin" name={name}>
            <div className="candidatures-container">
                <div className="title-section">
                    <h2>Candidatures Formateurs</h2>
                    <p>Gérez les demandes d'experts souhaitant rejoindre votre réseau</p>
                </div>

                {message && (
                    <div className="message-toast animate-slide-up">
                        <FiInfo /> <span>{message}</span>
                    </div>
                )}

                <div className="cand-grid">
                    {candidatures.map(cand => (
                        <div key={cand.id} className="cand-card card-premium">
                            <div className="cand-status" data-status={cand.statut}>
                                {cand.statut === 'valide' ? <FiCheckCircle /> : cand.statut === 'refuse' ? <FiXCircle /> : <FiClock />}
                                {cand.statut}
                            </div>

                            <div className="cand-header">
                                <div className="cand-avatar">{cand.prenom[0]}{cand.nom[0]}</div>
                                <div>
                                    <h3>{cand.prenom} {cand.nom}</h3>
                                    <p><FiMail /> {cand.email}</p>
                                </div>
                            </div>

                            <div className="cand-body">
                                <div className="info-field">
                                    <FiPhone /> <span>{cand.telephone}</span>
                                </div>
                                <div className="skills-area">
                                    <label><FiTag /> Compétences :</label>
                                    <div className="skills-tags">
                                        {cand.competences.split(',').map((skill, i) => (
                                            <span key={i} className="skill-tag">{skill.trim()}</span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {cand.statut === 'en_attente' && (
                                <div className="cand-actions">
                                    <button className="btn-approve" onClick={() => handleStatusChange(cand.id, 'valide')}>
                                        <FiUserCheck /> Valider
                                    </button>
                                    <button className="btn-reject" onClick={() => handleStatusChange(cand.id, 'refuse')}>
                                        Confirmer le refus
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {candidatures.length === 0 && !loading && <p className="no-data">Aucune candidature reçue.</p>}
                </div>
            </div>
        </DashboardLayout>
    );
};

export default AdminCandidatures;
