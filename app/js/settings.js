// This script contains logic specific to the settings page.
// It assumes dashboard.js (which includes checkAuthentication, fetchUserData, setupLogout, toggleLoadingState, displayMessageBox, hideMessageBox, setValidationFeedback) is already loaded.

document.addEventListener('DOMContentLoaded', () => {
    const generalSettingsForm = document.getElementById('generalSettingsForm');
    const notificationSettingsForm = document.getElementById('notificationSettingsForm');
    const settingsMessage = document.getElementById('settingsMessage');

    // Populate settings forms with current user settings (dummy for now)
    function loadUserSettings() {
        // In a real app, this would fetch from a /api/users/settings endpoint
        const userSettings = {
            timezone: 'America/New_York',
            dateFormat: 'MM/DD/YYYY',
            emailNotifications: true,
            desktopNotifications: false
        };

        if (document.getElementById('timezone')) {
            document.getElementById('timezone').value = userSettings.timezone;
        }
        if (document.getElementById('dateFormat')) {
            document.getElementById('dateFormat').value = userSettings.dateFormat;
        }
        if (document.getElementById('emailNotifications')) {
            document.getElementById('emailNotifications').checked = userSettings.emailNotifications;
        }
        if (document.getElementById('desktopNotifications')) {
            document.getElementById('desktopNotifications').checked = userSettings.desktopNotifications;
        }
    }

    loadUserSettings(); // Load settings on page load

    // --- General Settings Form Logic ---
    if (generalSettingsForm) {
        generalSettingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideMessageBox('settingsMessage');
            toggleLoadingState('saveGeneralSettingsBtn', 'saveGeneralSettingsSpinner', 'saveGeneralSettingsBtnText', true);

            const timezone = document.getElementById('timezone').value;
            const dateFormat = document.getElementById('dateFormat').value;

            // In a real app, send this to the backend
            try {
                // Example API call (replace with actual endpoint)
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/users/settings`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ timezone, dateFormat })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    displayMessageBox('settingsMessage', 'General settings saved successfully!', 'success');
                } else {
                    displayMessageBox('settingsMessage', data.message || 'Failed to save general settings.');
                }
            } catch (error) {
                console.error('General settings save error:', error);
                displayMessageBox('settingsMessage', 'An unexpected error occurred. Please try again.');
            } finally {
                toggleLoadingState('saveGeneralSettingsBtn', 'saveGeneralSettingsSpinner', 'saveGeneralSettingsBtnText', false);
            }
        });
    }

    // --- Notification Settings Form Logic ---
    if (notificationSettingsForm) {
        notificationSettingsForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            hideMessageBox('settingsMessage');
            toggleLoadingState('saveNotificationSettingsBtn', 'saveNotificationSettingsSpinner', 'saveNotificationSettingsBtnText', true);

            const emailNotifications = document.getElementById('emailNotifications').checked;
            const desktopNotifications = document.getElementById('desktopNotifications').checked;

            // In a real app, send this to the backend
            try {
                // Example API call (replace with actual endpoint)
                const token = localStorage.getItem('token');
                const response = await fetch(`${API_BASE_URL}/users/notification-settings`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ emailNotifications, desktopNotifications })
                });

                const data = await response.json();

                if (response.ok && data.success) {
                    displayMessageBox('settingsMessage', 'Notification settings saved successfully!', 'success');
                } else {
                    displayMessageBox('settingsMessage', data.message || 'Failed to save notification settings.');
                }
            } catch (error) {
                console.error('Notification settings save error:', error);
                displayMessageBox('settingsMessage', 'An unexpected error occurred. Please try again.');
            } finally {
                toggleLoadingState('saveNotificationSettingsBtn', 'saveNotificationSettingsSpinner', 'saveNotificationSettingsBtnText', false);
            }
        });
    }

    // --- Delete Account Button (Placeholder) ---
    const deleteAccountBtn = document.querySelector('.btn-danger');
    if (deleteAccountBtn) {
        deleteAccountBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                // In a real app, trigger API call to delete account
                displayMessageBox('settingsMessage', 'Account deletion initiated (dummy action).', 'success');
                // localStorage.removeItem('token');
                // setTimeout(() => window.location.href = '../public/login.html', 2000);
            }
        });
    }
});