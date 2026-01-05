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
