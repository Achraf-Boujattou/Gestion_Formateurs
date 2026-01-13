import React, { useState, useEffect } from 'react';
import api from '../../../services/api';
import { Link } from 'react-router-dom';
import {
    FiBook, FiArrowRight, FiCheckCircle, FiUsers, FiAward, FiSearch,
    FiFilter, FiMapPin, FiCalendar, FiTag, FiX, FiZap, FiTarget, FiClock, FiUserPlus, FiShield
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
            {/* Simple Hero Section */}
            <header className="hero-simple">
                <div className="container">
                    <div className="hero-content-simple animate-fade-in">
                        <span className="hero-label">Centre de Formation Professionnelle</span>
                        <h1>Construisez les compétences de demain</h1>
                        <p>Des parcours de formation conçus par des experts pour accompagner votre évolution professionnelle et renforcer votre expertise métier.</p>
                        <div className="hero-btns">
                            <a href="#formations" className="btn-main">Explorer les programmes</a>
                            <Link to="/join-as-trainer" className="btn-outline">Rejoindre notre équipe</Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Clean Filter Section */}
            <div className="search-section-clean animate-fade-in">
                <div className="search-container-simple">
                    <div className="search-field-main">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Rechercher une formation..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <div className="filters-row-simple">
                        <div className="filter-select-simple">
                            <FiTag />
                            <select value={filters.categorie} onChange={(e) => setFilters({ ...filters, categorie: e.target.value })}>
                                <option value="">Toutes catégories</option>
                                {categories.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="filter-select-simple">
                            <FiMapPin />
                            <select value={filters.ville} onChange={(e) => setFilters({ ...filters, ville: e.target.value })}>
                                <option value="">Toutes les villes</option>
                                {villes.map(v => <option key={v} value={v}>{v}</option>)}
                            </select>
                        </div>
                        {(search || filters.categorie || filters.ville || filters.date) && (
                            <button className="btn-clear-simple" onClick={resetFilters} title="Effacer">
                                <FiX />
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Formations Grid */}
            <section id="formations" className="formations-section">
                <div className="section-header">
                    <h2>Catalogue de Formations</h2>
                    <p className="text-muted">{filteredFormations.length} programmes disponibles</p>
                </div>

                <div className="formations-grid-public">
                    {filteredFormations.map((f, index) => (
                        <div
                            key={f.id}
                            className="card-formation-simple card-animated card-entrance animate-fade-in"
                            style={{ animationDelay: `${index * 0.08}s` }}
                        >
                            <div className="card-tag">{f.categorie}</div>

                            <div className="f-card-body-premium">
                                <h3>{f.titre}</h3>
                                <p className="f-card-description">{f.objectifs.substring(0, 100)}...</p>

                                <div className="f-card-meta-premium">
                                    <div className="meta-info">
                                        <FiMapPin className="meta-icon" />
                                        <span>{f.ville}</span>
                                    </div>
                                    <div className="meta-info">
                                        <FiClock className="meta-icon" />
                                        <span>{f.nombre_heures}h</span>
                                    </div>
                                </div>

                                <div className="f-card-footer-premium">
                                    <div className="f-price-box">
                                        <span className="price-label">Investissement</span>
                                        <span className="price-value">{f.cout}€</span>
                                    </div>
                                    <Link to={`/register-formation/${f.id}`} className="btn-enroll-premium">
                                        S'inscrire <FiArrowRight />
                                    </Link>
                                </div>
                            </div>
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

            {/* Why Us Section */}
            <section className="why-us-simple">
                <div className="container">
                    <div className="section-title-simple">
                        <h2>Notre Engagement Qualité</h2>
                    </div>
                    <div className="why-grid-simple">
                        <div className="why-card">
                            <FiUsers className="why-icon" />
                            <h3>Formateurs Experts</h3>
                            <p>Des professionnels reconnus qui partagent leur expertise terrain.</p>
                        </div>
                        <div className="why-card">
                            <FiTarget className="why-icon" />
                            <h3>Approche Opérationnelle</h3>
                            <p>Des compétences directement applicables en situation professionnelle.</p>
                        </div>
                        <div className="why-card">
                            <FiAward className="why-icon" />
                            <h3>Certifications Reconnues</h3>
                            <p>Des attestations valorisées par les employeurs et recruteurs.</p>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="footer-home" style={{ padding: '4rem 1.5rem', borderTop: '1px solid var(--border-light)', marginTop: '4rem', textAlign: 'center' }}>
                <div className="footer-content">
                    <h3 style={{ marginBottom: '1rem' }}>BD Formation</h3>
                    <p className="text-muted" style={{ marginBottom: '2rem' }}>&copy; 2026 BD Formation. Tous droits réservés.</p>
                    <div className="footer-links" style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                        <Link to="/join-as-trainer" style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiUserPlus /> Devenir formateur
                        </Link>
                        <Link to="/login" style={{ fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <FiShield /> Espace Administration
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
