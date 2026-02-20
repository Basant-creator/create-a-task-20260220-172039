const API_BASE_URL = 'http://localhost:5000/api'; // Adjust if your backend is on a different port/host

document.addEventListener('DOMContentLoaded', () => {
    checkAuthentication();
    fetchUserData();
    setupLogout();
    // Assuming tasks will be fetched later in a separate task.js or integrated here
    // fetchTasks();
});

// Checks for authentication token
async function checkAuthentication() {
    const token = localStorage.getItem('token');
    if (!token) {
        // Not authenticated, redirect to login page
        window.location.href = '../public/login.html';
        return;
    }

    // Optionally, verify token on server if needed (e.g., /api/auth/me)
    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            // Token invalid or expired, clear and redirect
            localStorage.removeItem('token');
            window.location.href = '../public/login.html';
        }
        // If response.ok, user is authenticated
    } catch (error) {
        console.error('Authentication check failed:', error);
        localStorage.removeItem('token');
        window.location.href = '../public/login.html';
    }
}

// Fetches user data and updates UI
async function fetchUserData() {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data) {
                const user = data.data;
                document.querySelectorAll('#userName').forEach(el => el.textContent = user.name || 'User');
                document.querySelectorAll('#userEmail').forEach(el => el.textContent = user.email || 'user@example.com');
                document.getElementById('greeting').textContent = `Hello, ${user.name.split(' ')[0]}!`;
                // If profile page has email input, update it
                const profileEmailInput = document.getElementById('profileEmail');
                if (profileEmailInput) profileEmailInput.value = user.email;
                const profileNameInput = document.getElementById('profileName');
                if (profileNameInput) profileNameInput.value = user.name;
            }
        } else {
            // Handle error, maybe token expired or invalid
            localStorage.removeItem('token');
            window.location.href = '../public/login.html';
        }
    } catch (error) {
        console.error('Failed to fetch user data:', error);
    }
}

// Sets up the logout button
function setupLogout() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            window.location.href = '../public/login.html';
        });
    }
}

// Helper to toggle loading state for buttons (copied from auth.js for consistency)
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

// Function to display message boxes (success/error)
const displayMessageBox = (elementId, message, type = 'error') => {
    const messageBox = document.getElementById(elementId);
    if (messageBox) {
        messageBox.textContent = message;
        messageBox.className = `message-box ${type}`; // Add type class for styling
        messageBox.style.display = 'block';
    }
};

// Function to hide message boxes
const hideMessageBox = (elementId) => {
    const messageBox = document.getElementById(elementId);
    if (messageBox) {
        messageBox.style.display = 'none';
        messageBox.textContent = '';
    }
};

// Function for client-side validation feedback (copied from auth.js for consistency)
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

// Dummy task data for dashboard stats
// In a real app, this would be fetched from the backend API
function updateDashboardStats() {
    // Placeholder logic - replace with actual API calls to get task counts
    const totalTasks = 15;
    const pendingTasks = 8;
    const completedTasks = 7;
    const dueToday = 3;

    document.getElementById('totalTasks').textContent = totalTasks;
    document.getElementById('pendingTasks').textContent = pendingTasks;
    document.getElementById('completedTasks').textContent = completedTasks;
    document.getElementById('dueToday').textContent = dueToday;

    const tasksContainer = document.getElementById('tasksContainer');
    const noTasksMessage = document.getElementById('noTasksMessage');

    if (tasksContainer && tasksContainer.children.length === 0) {
        if (noTasksMessage) noTasksMessage.style.display = 'block';
    } else {
        if (noTasksMessage) noTasksMessage.style.display = 'none';
    }
}

// Call updateDashboardStats after user data is loaded (or tasks are fetched)
document.addEventListener('DOMContentLoaded', () => {
    // Other initializations
    // ...
    updateDashboardStats(); // Update dummy stats initially
});

// This file handles core dashboard functionality. Profile/Settings have their own JS.