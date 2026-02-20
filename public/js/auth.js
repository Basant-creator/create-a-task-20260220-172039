const API_BASE_URL = 'http://localhost:5000/api'; // Adjust if your backend is on a different port/host

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');

    // Function to display error messages
    const displayMessage = (elementId, message, type = 'error') => {
        const messageDiv = document.getElementById(elementId);
        messageDiv.textContent = message;
        messageDiv.style.display = 'block';
        messageDiv.className = type === 'error' ? 'error-message' : 'success-message';
    };

    // Function to hide error messages
    const hideMessage = (elementId) => {
        const messageDiv = document.getElementById(elementId);
        messageDiv.style.display = 'none';
        messageDiv.textContent = '';
    };

    // Function for client-side validation feedback
    const setValidationFeedback = (inputElement, message, isValid) => {
        const formGroup = inputElement.closest('.form-group');
        const feedbackElement = inputElement.nextElementSibling; // Assumes feedback div is next sibling

        if (!formGroup || !feedbackElement) return;

        if (isValid) {
            formGroup.classList.remove('error');
            feedbackElement.style.display = 'none';
            feedbackElement.textContent = '';
        } else {
            formGroup.classList.add('error');
            feedbackElement.style.display = 'block';
            feedbackElement.textContent = message;
        }
    };

    // Helper to toggle loading state for buttons
    const toggleLoadingState = (buttonId, spinnerId, textId, isLoading) => {
        const button = document.getElementById(buttonId);
        const spinner = document.getElementById(spinnerId);
        const text = document.getElementById(textId);

        if (button && spinner && text) {
            button.disabled = isLoading;
            spinner.style.display = isLoading ? 'inline-block' : 'none';
            text.style.display = isLoading ? 'none' : 'inline';
        }
    };

    // --- Login Form Logic ---
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideMessage('errorMessage');
            toggleLoadingState('loginBtn', 'loginSpinner', 'loginBtnText', true);

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const email = emailInput.value;
            const password = passwordInput.value;

            let isValid = true;

            // Basic client-side validation
            if (!email || !email.includes('@')) {
                setValidationFeedback(emailInput, 'Please enter a valid email address.', false);
                isValid = false;
            } else {
                setValidationFeedback(emailInput, '', true);
            }

            if (!password || password.length < 6) {
                setValidationFeedback(passwordInput, 'Password must be at least 6 characters.', false);
                isValid = false;
            } else {
                setValidationFeedback(passwordInput, '', true);
            }

            if (!isValid) {
                toggleLoadingState('loginBtn', 'loginSpinner', 'loginBtnText', false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    localStorage.setItem('token', data.token);
                    // Redirect to dashboard
                    window.location.href = '../app/dashboard.html';
                } else {
                    displayMessage('errorMessage', data.message || 'Login failed. Please check your credentials.');
                }
            } catch (error) {
                console.error('Login error:', error);
                displayMessage('errorMessage', 'An unexpected error occurred. Please try again.');
            } finally {
                toggleLoadingState('loginBtn', 'loginSpinner', 'loginBtnText', false);
            }
        });
    }

    // --- Signup Form Logic ---
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideMessage('errorMessage');
            toggleLoadingState('signupBtn', 'signupSpinner', 'signupBtnText', true);

            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');
            const termsCheckbox = document.getElementById('terms');

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;
            const termsAccepted = termsCheckbox.checked;

            let isValid = true;

            // Client-side validation
            if (!name) {
                setValidationFeedback(nameInput, 'Full Name is required.', false);
                isValid = false;
            } else {
                setValidationFeedback(nameInput, '', true);
            }

            if (!email || !email.includes('@')) {
                setValidationFeedback(emailInput, 'Please enter a valid email address.', false);
                isValid = false;
            } else {
                setValidationFeedback(emailInput, '', true);
            }

            if (!password || password.length < 6) {
                setValidationFeedback(passwordInput, 'Password must be at least 6 characters.', false);
                isValid = false;
            } else {
                setValidationFeedback(passwordInput, '', true);
            }

            if (password !== confirmPassword) {
                setValidationFeedback(confirmPasswordInput, 'Passwords do not match.', false);
                isValid = false;
            } else {
                setValidationFeedback(confirmPasswordInput, '', true);
            }

            if (!termsAccepted) {
                const termsFeedback = document.getElementById('termsFeedback');
                termsFeedback.style.display = 'block';
                termsFeedback.textContent = 'You must accept the terms and conditions.';
                isValid = false;
            } else {
                document.getElementById('termsFeedback').style.display = 'none';
            }

            if (!isValid) {
                toggleLoadingState('signupBtn', 'signupSpinner', 'signupBtnText', false);
                return;
            }

            try {
                const response = await fetch(`${API_BASE_URL}/auth/signup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (response.ok && data.token) {
                    localStorage.setItem('token', data.token);
                    displayMessage('errorMessage', 'Account created successfully! Redirecting...', 'success');
                    setTimeout(() => {
                        window.location.href = '../app/dashboard.html';
                    }, 1500);
                } else {
                    displayMessage('errorMessage', data.message || 'Signup failed. Please try again.');
                }
            } catch (error) {
                console.error('Signup error:', error);
                displayMessage('errorMessage', 'An unexpected error occurred. Please try again.');
            } finally {
                toggleLoadingState('signupBtn', 'signupSpinner', 'signupBtnText', false);
            }
        });
    }
});