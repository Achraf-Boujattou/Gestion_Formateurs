import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FiCalendar, FiPlus, FiTrash2, FiClock, FiCheckCircle, FiAlertCircle, FiInfo, FiChevronRight } from 'react-icons/fi';
import DashboardLayout from '../../../components/DashboardLayout/DashboardLayout';
import './Planning.css';

const Planning = () => {
    const role = sessionStorage.getItem('role');
    const name = sessionStorage.getItem('name') || 'Utilisateur';

    const [dependencies, setDependencies] = useState({ formations: [], formateurs: [], entreprises: [] });
    const [formData, setFormData] = useState({
        formation_id: '',
        formateur_id: '',
        entreprise_id: '',
        dates: []
    });
    const [plannings, setPlannings] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDependencies();
        fetchPlannings();
    }, []);

    const fetchDependencies = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:8081/plannings/dependencies', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setDependencies(res.data);
        } catch (err) {
            console.error("Erreur chargement dépendances", err);
        }
    };

    const fetchPlannings = async () => {
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.get('http://localhost:8081/plannings', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setPlannings(res.data);
        } catch (err) {
            console.error("Erreur chargement plannings", err);
        }
    };

    const handleDateChange = (date) => {
        const dateStr = date.toISOString().split('T')[0];
        if (formData.dates.includes(dateStr)) {
            setFormData({ ...formData, dates: formData.dates.filter(d => d !== dateStr) });
        } else {
            setFormData({ ...formData, dates: [...formData.dates, dateStr].sort() });
        }
    };

    const removeDate = (dateToRemove) => {
        setFormData({ ...formData, dates: formData.dates.filter(d => d !== dateToRemove) });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.dates.length === 0) {
            setMessage({ type: 'error', text: 'Veuillez sélectionner au moins une date.' });
            return;
        }

        setLoading(true);
        try {
            const token = sessionStorage.getItem('token');
            const res = await axios.post('http://localhost:8081/plannings', formData, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.data.Status === "Success") {
                setMessage({ type: 'success', text: 'Planning créé avec succès !' });
                setFormData({ formation_id: '', formateur_id: '', entreprise_id: '', dates: [] });
                fetchPlannings();
                setTimeout(() => setMessage({ type: '', text: '' }), 4000);
            }
        } catch (err) {
            const errorMsg = err.response?.data?.Error || "Erreur lors de la planification.";
            setMessage({ type: 'error', text: errorMsg });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Supprimer cette planification ?")) return;
        try {
            const token = sessionStorage.getItem('token');
            await axios.delete(`http://localhost:8081/plannings/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setMessage({ type: 'success', text: 'Planification supprimée.' });
            fetchPlannings();
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (err) {
            setMessage({ type: 'error', text: "Erreur lors de la suppression." });
        }
    };

    // Helper to format multiple dates for display
    const formatDates = (datesStr) => {
        if (!datesStr) return "Aucune date";
        const dates = datesStr.split(',');
        return dates.map(d => new Date(d).toLocaleDateString()).join(', ');
    };

    return (
        <DashboardLayout role={role} name={name}>
            <div className="planning-container">
                <div className="planning-header">
                    <div className="title-section">
                        <h2>Planification des Formations</h2>
                        <p>Organisez les sessions, affectez les formateurs et gérez le calendrier</p>
                    </div>
                </div>

                {message.text && (
                    <div className={`status-alert ${message.type}`}>
                        {message.type === 'success' ? <FiCheckCircle /> : <FiAlertCircle />}
                        <span>{message.text}</span>
                    </div>
                )}

                <div className="planning-main-grid">
                    {/* Form Section */}
                    <div className="planning-form-card card-premium">
                        <div className="card-top">
                            <FiPlus className="icon-main" />
                            <h3>Nouvelle Session</h3>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group-modern">
                                <label>Programme de Formation</label>
                                <select
                                    value={formData.formation_id}
                                    onChange={(e) => setFormData({ ...formData, formation_id: e.target.value })}
                                    required
                                >
                                    <option value="">Sélectionner une formation...</option>
                                    {dependencies.formations.map(f => <option key={f.id} value={f.id}>{f.titre}</option>)}
                                </select>
                            </div>

                            <div className="form-group-modern">
                                <label>Formateur Intervenant</label>
                                <select
                                    value={formData.formateur_id}
                                    onChange={(e) => setFormData({ ...formData, formateur_id: e.target.value })}
                                    required
                                >
                                    <option value="">Sélectionner un formateur...</option>
                                    {dependencies.formateurs.map(f => <option key={f.id} value={f.id}>{f.nom} {f.prenom}</option>)}
                                </select>
                            </div>

                            <div className="form-group-modern">
                                <label>Entreprise / Client</label>
                                <select
                                    value={formData.entreprise_id}
                                    onChange={(e) => setFormData({ ...formData, entreprise_id: e.target.value })}
                                    required
                                >
                                    <option value="">Sélectionner une entreprise...</option>
                                    {dependencies.entreprises.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
                                </select>
                            </div>

                            <div className="calendar-section">
                                <label>Sélection des dates (Calendrier)</label>
                                <div className="calendar-wrapper">
                                    <Calendar
                                        onChange={handleDateChange}
                                        tileClassName={({ date }) => {
                                            const dStr = date.toISOString().split('T')[0];
                                            return formData.dates.includes(dStr) ? 'selected-date' : null;
                                        }}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-submit-planning" disabled={loading}>
                                {loading ? 'Enregistrement...' : 'Planifier la Session'}
                            </button>
                        </form>
                    </div>

                    {/* Right Side: Selection Details & List */}
                    <div className="planning-details-column">
                        <div className="selected-dates-card card-premium">
                            <div className="card-top">
                                <FiCalendar className="icon-main" />
                                <h3>Dates Sélectionnées ({formData.dates.length})</h3>
                            </div>
                            <div className="dates-list">
                                {formData.dates.length === 0 ? (
                                    <div className="empty-state">
                                        <FiInfo />
                                        <span>Cliquez sur le calendrier pour ajouter des dates</span>
                                    </div>
                                ) : (
                                    formData.dates.map(d => (
                                        <div key={d} className="date-tag">
                                            <span>{new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' })}</span>
                                            <button type="button" onClick={() => removeDate(d)}><FiTrash2 /></button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>

                        <div className="recent-plannings-card card-premium">
                            <div className="card-top">
                                <FiClock className="icon-main" />
                                <h3>Sessions Récentes</h3>
                            </div>
                            <div className="plannings-list">
                                {plannings.length === 0 ? (
                                    <p className="no-data">Aucune planification trouvée.</p>
                                ) : (
                                    plannings.map(p => (
                                        <div key={p.id} className="planning-item">
                                            <div className="planning-info">
                                                <h4>{p.formation_titre}</h4>
                                                <p className="p-meta">Client: <strong>{p.entreprise_nom}</strong></p>
                                                <p className="p-dates">{formatDates(p.dates)}</p>
                                                <div className="formateur-badge">
                                                    {p.formateur_prenom} {p.formateur_nom}
                                                </div>
                                            </div>
                                            <button className="btn-delete-planning" onClick={() => handleDelete(p.id)}>
                                                <FiTrash2 />
                                            </button>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Planning;
