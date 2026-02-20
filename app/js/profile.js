// This script contains logic specific to the profile page.
// It assumes dashboard.js (which includes checkAuthentication, fetchUserData, setupLogout, toggleLoadingState, displayMessageBox, hideMessageBox, setValidationFeedback) is already loaded.

document.addEventListener('DOMContentLoaded', () => {
    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');
    const profileMessage = document.getElementById('profileMessage');

    // Populate profile form with initial data (already done by dashboard.js, but ensure consistency)
    fetchUserData(); // Call again to ensure if this script loads after dashboard.js

    // --- Profile Update Form Logic ---
    if (profileForm) {
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideMessageBox('profileMessage');
            toggleLoadingState('saveProfileBtn', 'saveProfileSpinner', 'saveProfileBtnText', true);

            const nameInput = document.getElementById('profileName');
            const name = nameInput.value.trim();

            let isValid = true;
            if (!name) {
                setValidationFeedback(nameInput, 'Full Name is required.', false);
                isValid = false;
            } else {
                setValidationFeedback(nameInput, '', true);
            }

            if (!isValid) {
                toggleLoadingState('saveProfileBtn', 'saveProfileSpinner', 'saveProfileBtnText', false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/users/${localStorage.getItem('userId')}`, { // Assuming userId is stored in localStorage by backend or can be extracted from token
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ name })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    displayMessageBox('profileMessage', 'Profile updated successfully!', 'success');
                    // Update UI immediately
                    document.querySelectorAll('#userName').forEach(el => el.textContent = name);
                    document.getElementById('greeting').textContent = `Hello, ${name.split(' ')[0]}!`;
                } else {
                    displayMessageBox('profileMessage', data.message || 'Failed to update profile.');
                }
            } catch (error) {
                console.error('Profile update error:', error);
                displayMessageBox('profileMessage', 'An unexpected error occurred. Please try again.');
            } finally {
                toggleLoadingState('saveProfileBtn', 'saveProfileSpinner', 'saveProfileBtnText', false);
            }
        });
        
        document.getElementById('cancelProfileBtn').addEventListener('click', () => {
            fetchUserData(); // Revert changes by re-fetching user data
            hideMessageBox('profileMessage');
        });
    }

    // --- Password Change Form Logic ---
    if (passwordForm) {
        passwordForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideMessageBox('profileMessage'); // Use the same message box for password changes
            toggleLoadingState('changePasswordBtn', 'changePasswordSpinner', 'changePasswordBtnText', true);

            const currentPasswordInput = document.getElementById('currentPassword');
            const newPasswordInput = document.getElementById('newPassword');
            const confirmNewPasswordInput = document.getElementById('confirmNewPassword');

            const currentPassword = currentPasswordInput.value;
            const newPassword = newPasswordInput.value;
            const confirmNewPassword = confirmNewPasswordInput.value;

            let isValid = true;

            // Client-side validation
            if (!currentPassword) {
                setValidationFeedback(currentPasswordInput, 'Current password is required.', false);
                isValid = false;
            } else {
                setValidationFeedback(currentPasswordInput, '', true);
            }

            if (!newPassword || newPassword.length < 6) {
                setValidationFeedback(newPasswordInput, 'New password must be at least 6 characters.', false);
                isValid = false;
            } else {
                setValidationFeedback(newPasswordInput, '', true);
            }

            if (newPassword !== confirmNewPassword) {
                setValidationFeedback(confirmNewPasswordInput, 'New passwords do not match.', false);
                isValid = false;
            } else {
                setValidationFeedback(confirmNewPasswordInput, '', true);
            }

            if (!isValid) {
                toggleLoadingState('changePasswordBtn', 'changePasswordSpinner', 'changePasswordBtnText', false);
                return;
            }

            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/users/change-password`, { // Assuming a dedicated endpoint for password change
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ currentPassword, newPassword })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    displayMessageBox('profileMessage', 'Password changed successfully! Please login again with your new password.', 'success');
                    // Optionally force re-login after password change for security
                    localStorage.removeItem('token');
                    setTimeout(() => window.location.href = '../public/login.html', 2000);
                } else {
                    displayMessageBox('profileMessage', data.message || 'Failed to change password. Please check your current password.');
                }
            } catch (error) {
                console.error('Password change error:', error);
                displayMessageBox('profileMessage', 'An unexpected error occurred. Please try again.');
            } finally {
                toggleLoadingState('changePasswordBtn', 'changePasswordSpinner', 'changePasswordBtnText', false);
                // Clear password fields regardless of success/failure
                currentPasswordInput.value = '';
                newPasswordInput.value = '';
                confirmNewPasswordInput.value = '';
            }
        });

        document.getElementById('cancelPasswordBtn').addEventListener('click', () => {
            passwordForm.reset(); // Clear password fields
            hideMessageBox('profileMessage');
            setValidationFeedback(document.getElementById('currentPassword'), '', true);
            setValidationFeedback(document.getElementById('newPassword'), '', true);
            setValidationFeedback(document.getElementById('confirmNewPassword'), '', true);
        });
    }
});