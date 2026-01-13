import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FiCalendar, FiPlus, FiTrash2, FiClock, FiCheckCircle, FiAlertCircle, FiBookOpen, FiUser, FiBriefcase, FiList } from 'react-icons/fi';
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
                <div className="planning-header animate-slide-up">
                    <div className="title-section">
                        <h1>Planification des Formations</h1>
                        <p>Configurez les sessions, coordonnez les formateurs et optimisez le calendrier opérationnel</p>
                    </div>
                </div>

                {message.text && (
                    <div className={`status-alert ${message.type} animate-scale-in`}>
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
                            <div className="form-group-modern animate-slide-up stagger-1">
                                <label><FiBookOpen className="label-icon" /> Programme de Formation</label>
                                <div className="input-with-icon">
                                    <FiBookOpen className="field-icon" />
                                    <select
                                        value={formData.formation_id}
                                        onChange={(e) => setFormData({ ...formData, formation_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Sélectionner une formation...</option>
                                        {dependencies.formations.map(f => <option key={f.id} value={f.id}>{f.titre}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group-modern animate-slide-up stagger-2">
                                <label><FiUser className="label-icon" /> Formateur Intervenant</label>
                                <div className="input-with-icon">
                                    <FiUser className="field-icon" />
                                    <select
                                        value={formData.formateur_id}
                                        onChange={(e) => setFormData({ ...formData, formateur_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Sélectionner un formateur...</option>
                                        {dependencies.formateurs.map(f => <option key={f.id} value={f.id}>{f.nom} {f.prenom}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="form-group-modern animate-slide-up stagger-3">
                                <label><FiBriefcase className="label-icon" /> Entreprise / Client</label>
                                <div className="input-with-icon">
                                    <FiBriefcase className="field-icon" />
                                    <select
                                        value={formData.entreprise_id}
                                        onChange={(e) => setFormData({ ...formData, entreprise_id: e.target.value })}
                                        required
                                    >
                                        <option value="">Sélectionner une entreprise...</option>
                                        {dependencies.entreprises.map(e => <option key={e.id} value={e.id}>{e.nom}</option>)}
                                    </select>
                                </div>
                            </div>

                            <div className="calendar-section animate-slide-up stagger-4">
                                <label>Sélection des dates (Calendrier)</label>
                                <div className="calendar-wrapper-premium">
                                    <Calendar
                                        onChange={handleDateChange}
                                        tileClassName={({ date }) => {
                                            const dStr = date.toISOString().split('T')[0];
                                            return formData.dates.includes(dStr) ? 'selected-date' : null;
                                        }}
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn-submit-planning-premium" disabled={loading}>
                                {loading ? (
                                    <>
                                        <span className="loader-sm"></span>
                                        <span>Enregistrement...</span>
                                    </>
                                ) : (
                                    <>
                                        <FiCheckCircle />
                                        <span>Planifier la Session</span>
                                    </>
                                )}
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
                            <div className="dates-list custom-scrollbar">
                                {formData.dates.length === 0 ? (
                                    <div className="empty-state-glass">
                                        <FiCalendar className="pulse" />
                                        <span>Sélectionnez les dates sur le calendrier pour commencer</span>
                                    </div>
                                ) : (
                                    formData.dates.map((d, index) => (
                                        <div key={d} className={`date-chip animate-slide-right stagger-${(index % 5) + 1}`}>
                                            <FiCalendar className="chip-icon" />
                                            <span>{new Date(d).toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'long' })}</span>
                                            <button type="button" className="remove-chip" onClick={() => removeDate(d)}><FiTrash2 /></button>
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
                            <div className="plannings-list custom-scrollbar">
                                {plannings.length === 0 ? (
                                    <div className="empty-state-simple">
                                        <p>Aucune historique de planification.</p>
                                    </div>
                                ) : (
                                    plannings.map((p, index) => (
                                        <div key={p.id} className={`planning-card-item animate-slide-up stagger-${(index % 5) + 1}`}>
                                            <div className="card-indicator"></div>
                                            <div className="planning-info">
                                                <div className="info-main">
                                                    <h4>{p.formation_titre}</h4>
                                                    <span className="badge-company">{p.entreprise_nom}</span>
                                                </div>
                                                <div className="info-meta">
                                                    <div className="meta-item">
                                                        <FiCalendar />
                                                        <span>{formatDates(p.dates)}</span>
                                                    </div>
                                                    <div className="meta-item">
                                                        <FiUser />
                                                        <span className="badge-formateur">{p.formateur_prenom} {p.formateur_nom}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <button className="btn-action-delete" onClick={() => handleDelete(p.id)} title="Supprimer">
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
