CREATE TABLE IF NOT EXISTS utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'formateur', 'assistant') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS formations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titre VARCHAR(255) NOT NULL,
    categorie VARCHAR(100) DEFAULT 'Informatique',
    ville VARCHAR(100) DEFAULT 'Casablanca',
    date_formation DATE NULL,
    nombre_heures INT NOT NULL,
    cout DECIMAL(10, 2) NOT NULL,
    objectifs TEXT NOT NULL,
    programme TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS formateur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT NOT NULL UNIQUE,
    competences TEXT NOT NULL COMMENT 'Mots-clés des compétences',
    remarques TEXT NULL COMMENT 'Remarques optionnelles',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_formateur_utilisateur 
        FOREIGN KEY (utilisateur_id) 
        REFERENCES utilisateurs(id) 
        ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS entreprises (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(255) NOT NULL,
    adresse TEXT,
    telephone VARCHAR(20),
    site_web VARCHAR(255),
    email VARCHAR(150),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS planifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    formation_id INT NOT NULL,
    formateur_id INT NOT NULL,
    entreprise_id INT NOT NULL,
    status ENUM('prevu', 'termine', 'annule') DEFAULT 'prevu',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES formateur(id) ON DELETE CASCADE,
    FOREIGN KEY (entreprise_id) REFERENCES entreprises(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS planification_dates (
    id INT AUTO_INCREMENT PRIMARY KEY,
    planification_id INT NOT NULL,
    date DATE NOT NULL,
    FOREIGN KEY (planification_id) REFERENCES planifications(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS individus (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    ville VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telephone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS inscriptions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    individu_id INT NOT NULL,
    formation_id INT NOT NULL,
    status ENUM('en_attente', 'valide', 'annule') DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (individu_id) REFERENCES individus(id) ON DELETE CASCADE,
    FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS groupes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom_groupe VARCHAR(100) NOT NULL,
    formation_id INT NOT NULL,
    formateur_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES formateur(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS groupe_individus (
    groupe_id INT NOT NULL,
    individu_id INT NOT NULL,
    PRIMARY KEY (groupe_id, individu_id),
    FOREIGN KEY (groupe_id) REFERENCES groupes(id) ON DELETE CASCADE,
    FOREIGN KEY (individu_id) REFERENCES individus(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS evaluations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    formation_id INT NOT NULL,
    formateur_id INT NOT NULL,
    pedagogie TINYINT NOT NULL CHECK (pedagogie BETWEEN 1 AND 5),
    rythme TINYINT NOT NULL CHECK (rythme BETWEEN 1 AND 5),
    supports TINYINT NOT NULL CHECK (supports BETWEEN 1 AND 5),
    maitrise TINYINT NOT NULL CHECK (maitrise BETWEEN 1 AND 5),
    commentaire TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (formation_id) REFERENCES formations(id) ON DELETE CASCADE,
    FOREIGN KEY (formateur_id) REFERENCES formateur(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS candidatures_formateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    telephone VARCHAR(20) NOT NULL,
    competences TEXT NOT NULL,
    statut ENUM('en_attente', 'valide', 'refuse') DEFAULT 'en_attente',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ========================================
-- INDEX POUR OPTIMISATION DES PERFORMANCES
-- ========================================

-- Index sur les colonnes fréquemment utilisées dans les WHERE et JOIN
CREATE INDEX idx_utilisateurs_role ON utilisateurs(role);
CREATE INDEX idx_utilisateurs_email ON utilisateurs(email);

CREATE INDEX idx_formations_categorie ON formations(categorie);
CREATE INDEX idx_formations_ville ON formations(ville);
CREATE INDEX idx_formations_date ON formations(date_formation);

CREATE INDEX idx_formateur_utilisateur ON formateur(utilisateur_id);

CREATE INDEX idx_planifications_formation ON planifications(formation_id);
CREATE INDEX idx_planifications_formateur ON planifications(formateur_id);
CREATE INDEX idx_planifications_entreprise ON planifications(entreprise_id);
CREATE INDEX idx_planifications_status ON planifications(status);

CREATE INDEX idx_planification_dates_planification ON planification_dates(planification_id);
CREATE INDEX idx_planification_dates_date ON planification_dates(date);

CREATE INDEX idx_individus_email ON individus(email);

CREATE INDEX idx_inscriptions_individu ON inscriptions(individu_id);
CREATE INDEX idx_inscriptions_formation ON inscriptions(formation_id);
CREATE INDEX idx_inscriptions_status ON inscriptions(status);

CREATE INDEX idx_groupes_formation ON groupes(formation_id);
CREATE INDEX idx_groupes_formateur ON groupes(formateur_id);

CREATE INDEX idx_groupe_individus_groupe ON groupe_individus(groupe_id);
CREATE INDEX idx_groupe_individus_individu ON groupe_individus(individu_id);

CREATE INDEX idx_evaluations_formation ON evaluations(formation_id);
CREATE INDEX idx_evaluations_formateur ON evaluations(formateur_id);

CREATE INDEX idx_candidatures_statut ON candidatures_formateurs(statut);
CREATE INDEX idx_candidatures_email ON candidatures_formateurs(email);
