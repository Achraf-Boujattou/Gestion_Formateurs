import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FiBook, FiArrowRight, FiCheckCircle, FiUsers, FiAward, FiSearch, FiFilter, FiMapPin, FiCalendar, FiTag, FiX } from 'react-icons/fi';
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
        axios.get('http://localhost:8081/formations')
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
                    <h1>Développez vos compétences avec <span>excellence</span></h1>
                    <p>Découvrez notre catalogue de formations certifiantes et propulsez votre carrière vers de nouveaux sommets.</p>
                    <div className="hero-actions">
                        <a href="#formations" className="btn-primary-home">Voir les formations <FiArrowRight /></a>
                        <Link to="/login" className="btn-secondary-home">Espace Collaborateur</Link>
                    </div>
                </div>
            </header>

            {/* Filter Bar Section */}
            <div className="filter-wrapper animate-slide-up">
                <div className="filter-bar">
                    <div className="search-box">
                        <FiSearch />
                        <input
                            type="text"
                            placeholder="Rechercher une formation..."
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
                    <h2>Nos Formations Disponibles</h2>
                    <p>Affichage de {filteredFormations.length} résultat(s)</p>
                </div>

                <div className="formations-grid-public">
                    {filteredFormations.map(f => (
                        <div key={f.id} className="formation-card-public animate-scale-in">
                            <div className="f-card-badge">{f.categorie}</div>
                            <div className="f-card-icon"><FiBook /></div>
                            <h3>{f.titre}</h3>
                            <div className="f-meta-info">
                                <span><FiMapPin /> {f.ville}</span>
                                {f.date_formation && <span><FiCalendar /> {new Date(f.date_formation).toLocaleDateString()}</span>}
                            </div>
                            <div className="f-details">
                                <span><FiCheckCircle /> {f.nombre_heures} Heures</span>
                                <span><FiAward /> Certifiant</span>
                            </div>
                            <p>{f.objectifs.substring(0, 100)}...</p>
                            <Link to={`/register-formation/${f.id}`} className="btn-register-public">
                                S'inscrire maintenant <FiArrowRight />
                            </Link>
                        </div>
                    ))}
                    {filteredFormations.length === 0 && (
                        <div className="no-results animate-fade-in">
                            <FiFilter />
                            <p>Aucune formation ne correspond à vos critères de recherche.</p>
                            <button onClick={resetFilters} className="btn-secondary-home">Réinitialiser les filtres</button>
                        </div>
                    )}
                </div>
            </section>

            {/* Quality Section */}
            <section className="quality-section">
                <div className="quality-card">
                    <div className="q-info">
                        <h2>Pourquoi nous choisir ?</h2>
                        <ul>
                            <li><FiCheckCircle /> Des formateurs experts de leur domaine</li>
                            <li><FiCheckCircle /> Un accompagnement personnalisé</li>
                            <li><FiCheckCircle /> Des programmes pédagogiques innovants</li>
                            <li><FiCheckCircle /> Groupes restreints pour un meilleur apprentissage</li>
                        </ul>
                    </div>
                    <div className="q-visual">
                        <div className="q-v-circle"></div>
                        <FiUsers className="q-v-icon" />
                    </div>
                </div>
            </section>

            <footer className="footer-home">
                <div className="footer-content">
                    <p>&copy; 2026 FormationApp. Tous droits réservés.</p>
                    <div className="footer-links">
                        <Link to="/join-as-trainer">Devenir formateur</Link>
                        <Link to="/login">Espace Administration</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Home;
