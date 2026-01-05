import React from 'react';
import './FormComponents.css';

/**
 * Input avec icône - Composant réutilisable
 * @param {string} icon - Composant d'icône React (ex: FiMail)
 * @param {string} type - Type d'input (text, email, password, etc.)
 * @param {string} placeholder - Texte du placeholder
 * @param {string} value - Valeur contrôlée
 * @param {function} onChange - Fonction de changement
 * @param {boolean} required - Champ requis
 * @param {string} name - Nom du champ
 */
export const InputWithIcon = ({
    icon: Icon,
    type = 'text',
    placeholder,
    value,
    onChange,
    required = false,
    name,
    ...props
}) => {
    return (
        <div className="input-with-icon">
            {Icon && <Icon className="field-icon" />}
            <input
                type={type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                name={name}
                {...props}
            />
        </div>
    );
};

/**
 * Textarea avec icône
 */
export const TextareaWithIcon = ({
    icon: Icon,
    placeholder,
    value,
    onChange,
    required = false,
    name,
    rows = 4,
    ...props
}) => {
    return (
        <div className="input-with-icon">
            {Icon && <Icon className="field-icon" />}
            <textarea
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                required={required}
                name={name}
                rows={rows}
                {...props}
            />
        </div>
    );
};

/**
 * Select avec icône
 */
export const SelectWithIcon = ({
    icon: Icon,
    value,
    onChange,
    required = false,
    name,
    children,
    ...props
}) => {
    return (
        <div className="input-with-icon">
            {Icon && <Icon className="field-icon" />}
            <select
                value={value}
                onChange={onChange}
                required={required}
                name={name}
                {...props}
            >
                {children}
            </select>
        </div>
    );
};

/**
 * Groupe de formulaire complet avec label
 */
export const FormGroup = ({
    label,
    required = false,
    children,
    fullWidth = false
}) => {
    return (
        <div className={`form-group ${fullWidth ? 'full-width' : ''}`}>
            {label && (
                <label className="form-label">
                    {label}
                    {required && <span className="req">*</span>}
                </label>
            )}
            {children}
        </div>
    );
};

/**
 * Barre de recherche avec icône
 */
export const SearchBar = ({
    placeholder = 'Rechercher...',
    value,
    onChange,
    className = ''
}) => {
    return (
        <div className={`search-wrapper ${className}`}>
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
                type="text"
                className="search-bar-premium"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
};
