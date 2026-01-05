import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Link } from 'react-router-dom';
import {
    FiBook, FiArrowRight, FiCheckCircle, FiUsers, FiAward, FiSearch,
    FiFilter, FiMapPin, FiCalendar, FiTag, FiX, FiZap, FiTarget
} from 'react-icons/fi';
import './Home.css';

const Home = () => {
    const [formations, setFormations] = useState([]);
    const [filteredFormations, setFilteredFormations] = useState([]);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        categorie: '',
        ville: '',
        date: ''
    });

    // Categories and cities extracted from data
    const [categories, setCategories] = useState([]);
    const [villes, setVilles] = useState([]);

    useEffect(() => {
        api.get('/formations')
            .then(res => {
                setFormations(res.data);
                setFilteredFormations(res.data);

                // Extract unique values for filters
                const cats = [...new Set(res.data.map(f => f.categorie).filter(Boolean))];
                const vils = [...new Set(res.data.map(f => f.ville).filter(Boolean))];
                setCategories(cats);
                setVilles(vils);
            })
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        let result = formations;

        // Search by title
        if (search) {
            result = result.filter(f => f.titre.toLowerCase().includes(search.toLowerCase()));
        }

        // Filter by category
        if (filters.categorie) {
            result = result.filter(f => f.categorie === filters.categorie);
        }

        // Filter by city
        if (filters.ville) {
            result = result.filter(f => f.ville === filters.ville);
        }

        // Filter by date (if date_formation >= filter.date)
        if (filters.date) {
            result = result.filter(f => f.date_formation && f.date_formation >= filters.date);
        }

        setFilteredFormations(result);
    }, [search, filters, formations]);

    const resetFilters = () => {
        setSearch('');
        setFilters({ categorie: '', ville: '', date: '' });
    };

    return (
        <div className="home-page">
            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content animate-fade-in">
                    <span className="hero-badge">Plateforme de Formation Professionnelle</span>
                    <h1>Boostez vos compétences avec <span>excellence</span></h1>
                    <p>Accédez à un catalogue exclusif de formations certifiantes. Apprenez auprès des meilleurs experts et propulsez votre carrière.</p>
                    <div className="hero-actions">
                        <a href="#formations" className="btn-primary">Découvrir le catalogue <FiArrowRight /></a>
                        <Link to="/join-as-trainer" className="btn-secondary">Je suis formateur</Link>
                    </div>
                </div>
            </header>

            {/* Filter Bar Section */}
            <div className="filter-wrapper animate-fade-in">
                <div className="filter-bar">
                    <div className="search-box">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Quelle compétence recherchez-vous ?"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="filter-group">
                        <div className="filter-item">
                            <FiTag className="f-icon" />
                            <select
                                value={filters.categorie}
                                onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}
                            >
                                <option value="">Toutes catégories</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="filter-item">
                            <FiMapPin className="f-icon" />
                            <select
                                value={filters.ville}
                                onChange={(e) => setFilters({ ...filters, ville: e.target.value })}
                            >
                                <option value="">Toutes les villes</option>
                                {villes.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>

                        <div className="filter-item">
                            <FiCalendar className="f-icon" />
                            <input
                                type="date"
                                value={filters.date}
                                onChange={(e) => setFilters({ ...filters, date: e.target.value })}
                            />
                        </div>

                        {(search || filters.categorie || filters.ville || filters.date) && (
                            <button className="btn-reset" onClick={resetFilters} title="Réinitialiser">
                                <FiX />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Formations Grid */}
            <section id="formations" className="formations-section">
                <div className="section-header">
                    <h2>Formations à la une</h2>
                    <p className="text-muted">{filteredFormations.length} sessions disponibles pour votre avenir</p>
                </div>

                <div className="formations-grid-public">
                    {filteredFormations.map(f => (
                        <div key={f.id} className="formation-card-public animate-fade-in">
                            <div className="f-card-badge">{f.categorie}</div>

                            <div className="CardHeader">
                                <div className="f-icon-box"><FiBook /></div>
                                <h3>{f.titre}</h3>
                            </div>

                            <p className="f-desc">{f.objectifs.substring(0, 90)}...</p>

                            <div className="f-meta-info" style={{ marginTop: '1rem' }}>
                                <span><FiMapPin /> {f.ville}</span>
                                {f.date_formation && <span><FiCalendar /> {new Date(f.date_formation).toLocaleDateString()}</span>}
                            </div>

                            <div className="f-tags">
                                <span className="tag"><FiCheckCircle style={{ marginRight: 4 }} /> {f.nombre_heures}h</span>
                                <span className="tag"><FiAward style={{ marginRight: 4 }} /> Certifiant</span>
                            </div>

                            <Link to={`/register-formation/${f.id}`} className="btn-card-action">
                                S'inscrire <FiArrowRight />
                            </Link>
                        </div>
                    ))}

                    {filteredFormations.length === 0 && (
                        <div className="no-results glass-panel" style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', borderRadius: 'var(--radius-lg)' }}>
                            <FiFilter style={{ fontSize: '3rem', color: 'var(--text-tertiary)', marginBottom: '1rem' }} />
                            <h3>Aucun résultat trouvé</h3>
                            <p style={{ marginBottom: '1.5rem' }}>Essayez de modifier vos filtres ou votre recherche.</p>
                            <button onClick={resetFilters} className="btn-primary">Tout effacer</button>
                        </div>
                    )}
                </div>
            </section>

            {/* Quality Section */}
            <section className="quality-section">
                <div className="container">
                    <div className="section-header">
                        <h2>L'excellence pédagogique</h2>
                        <p>Nous nous engageons pour votre réussite</p>
                    </div>
                    <div className="quality-grid">
                        <div className="formation-card-public" style={{ textAlign: 'center', alignItems: 'center' }}>
                            <div className="f-icon-box" style={{ marginBottom: '1rem', color: 'var(--accent)' }}><FiUsers /></div>
                            <h3>Experts Qualifiés</h3>
                            <p className="text-muted">Nos formateurs sont validés par nos équipes et notés par les apprenants.</p>
                        </div>
                        <div className="formation-card-public" style={{ textAlign: 'center', alignItems: 'center' }}>
                            <div className="f-icon-box" style={{ marginBottom: '1rem', color: 'var(--primary)' }}><FiTarget /></div>
                            <h3>Pratique Intensive</h3>
                            <p className="text-muted">Des ateliers concrets pour maîtriser rapidement les compétences.</p>
                        </div>
                        <div className="formation-card-public" style={{ textAlign: 'center', alignItems: 'center' }}>
                            <div className="f-icon-box" style={{ marginBottom: '1rem', color: 'var(--success)' }}><FiZap /></div>
                            <h3>Suivi Personnalisé</h3>
                            <p className="text-muted">Un accompagnement tout au long de votre parcours.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer-home" style={{ padding: '4rem 1.5rem', borderTop: '1px solid var(--border-light)', marginTop: '4rem', textAlign: 'center' }}>
                <div className="footer-content">
                    <h3 style={{ marginBottom: '1rem' }}>FormationApp</h3>
                    <p className="text-muted" style={{ marginBottom: '2rem' }}>&copy; 2026 FormationApp. Tous droits réservés.</p>
                    <div className="footer-links" style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                        <Link to="/join-as-trainer" style={{ fontWeight: 500 }}>Devenir formateur</Link>
                        <Link to="/login" style={{ fontWeight: 500 }}>Espace Administration</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
