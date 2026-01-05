/**
 * Validation utilities for input data
 */

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
exports.isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

/**
 * Validate password strength
 * Minimum 6 characters (can be enhanced)
 * @param {string} password - Password to validate
 * @returns {boolean} - True if valid, false otherwise
 */
exports.isValidPassword = (password) => {
    return password && password.length >= 6;
};

/**
 * Sanitize string input to prevent XSS
 * @param {string} input - String to sanitize
 * @returns {string} - Sanitized string
 */
exports.sanitizeString = (input) => {
    if (typeof input !== 'string') return input;
    return input.trim().replace(/[<>]/g, '');
};

/**
 * Validate phone number (French format)
 * @param {string} phone - Phone number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
exports.isValidPhone = (phone) => {
    const phoneRegex = /^(\+33|0)[1-9](\d{2}){4}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
};

/**
 * Validate date format (YYYY-MM-DD)
 * @param {string} date - Date to validate
 * @returns {boolean} - True if valid, false otherwise
 */
exports.isValidDate = (date) => {
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(date)) return false;
    const d = new Date(date);
    return d instanceof Date && !isNaN(d);
};

/**
 * Validate rating (1-5)
 * @param {number} rating - Rating to validate
 * @returns {boolean} - True if valid, false otherwise
 */
exports.isValidRating = (rating) => {
    const num = parseInt(rating);
    return !isNaN(num) && num >= 1 && num <= 5;
};

/**
 * Validate required fields
 * @param {object} data - Object containing data
 * @param {array} requiredFields - Array of required field names
 * @returns {object} - { valid: boolean, missing: array }
 */
exports.validateRequiredFields = (data, requiredFields) => {
    const missing = [];
    for (const field of requiredFields) {
        if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
            missing.push(field);
        }
    }
    return {
        valid: missing.length === 0,
        missing
    };
};

/**
 * Validate numeric value
 * @param {any} value - Value to validate
 * @param {number} min - Minimum value (optional)
 * @param {number} max - Maximum value (optional)
 * @returns {boolean} - True if valid, false otherwise
 */
exports.isValidNumber = (value, min = null, max = null) => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    return true;
};
