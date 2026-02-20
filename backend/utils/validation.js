// backend/utils/validation.js
// This file can contain reusable validation logic,
// though for this project, `express-validator` is directly used in routes.
// This file serves as a placeholder as per requirement,
// demonstrating where custom validation helpers could be placed.

/**
 * Basic email format validation
 * @param {string} email
 * @returns {boolean} True if email is valid, false otherwise.
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Basic password strength validation
 * @param {string} password
 * @param {number} minLength Minimum length required
 * @returns {boolean} True if password meets criteria, false otherwise.
 */
function isValidPassword(password, minLength = 6) {
    return password && password.length >= minLength;
}

/**
 * Validates a name field
 * @param {string} name
 * @returns {boolean} True if name is not empty, false otherwise.
 */
function isValidName(name) {
    return name && name.trim().length > 0;
}

module.exports = {
    isValidEmail,
    isValidPassword,
    isValidName
};