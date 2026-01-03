// Supabase Configuration - loaded from config.js
const SUPABASE_URL = CONFIG.SUPABASE_URL;
const SUPABASE_KEY = CONFIG.SUPABASE_KEY;
const BACKEND_URL = CONFIG.BACKEND_URL;

// Initialize Supabase client
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Toggle between login and signup forms
function toggleForms() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    loginForm.classList.toggle('active');
    signupForm.classList.toggle('active');
    
    // Clear error messages
    document.getElementById('loginError').classList.remove('show');
    document.getElementById('signupError').classList.remove('show');
}

// Login function
document.getElementById('loginFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const errorDiv = document.getElementById('loginError');
    
    try {
        const { data, error } = await supabaseClient.auth.signInWithPassword({
            email,
            password
        });
        
        if (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.add('show');
        } else {
            // Store user info and show dashboard
            localStorage.setItem('userEmail', email);
            showDashboard(email);
        }
    } catch (err) {
        errorDiv.textContent = 'An error occurred. Please try again.';
        errorDiv.classList.add('show');
    }
});

// Sign up function
document.getElementById('signupFormElement').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    const errorDiv = document.getElementById('signupError');
    
    // Validate passwords match
    if (password !== confirmPassword) {
        errorDiv.textContent = 'Passwords do not match';
        errorDiv.classList.add('show');
        return;
    }
    
    try {
        const { data, error } = await supabaseClient.auth.signUp({
            email,
            password
        });

       //if user is already registered - added by me
        if(data.user.aud === 'authenticated') {
            errorDiv.textContent = 'Email is already registered. Please log in instead.';
            errorDiv.classList.add('show');
            return;
        }
        
        if (error) {
            errorDiv.textContent = error.message;
            errorDiv.classList.add('show');
        } else {
            errorDiv.classList.remove('show');
            // Auto-login after signup
            localStorage.setItem('userEmail', email);
            showDashboard(email);
        }
    } catch (err) {
        errorDiv.textContent = 'An error occurred. Please try again.';
        errorDiv.classList.add('show');
    }
});

// Show dashboard
function showDashboard(email) {
    document.getElementById('authContainer').classList.add('hidden');
    document.getElementById('dashboardContainer').classList.remove('hidden');
    document.getElementById('userEmail').textContent = email;
    document.getElementById('chatMessages').innerHTML = '';
}

// Logout function
document.getElementById('logoutBtn').addEventListener('click', async () => {
    try {
        await supabaseClient.auth.signOut();
        localStorage.removeItem('userEmail');
        
        // Show login form
        document.getElementById('authContainer').classList.remove('hidden');
        document.getElementById('dashboardContainer').classList.add('hidden');
        document.getElementById('loginForm').classList.add('active');
        document.getElementById('signupForm').classList.remove('active');
        
        // Clear forms
        document.getElementById('loginFormElement').reset();
        document.getElementById('signupFormElement').reset();
        document.getElementById('chatMessages').innerHTML = '';
    } catch (err) {
        console.error('Logout error:', err);
    }
});

// Chat function - send message to backend
document.getElementById('chatForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const input = document.getElementById('chatInput');
    const message = input.value.trim();
    const errorDiv = document.getElementById('chatError');
    
    if (!message) return;
    
    // Clear error
    errorDiv.classList.remove('show');
    
    // Add user message to chat
    addMessageToChat(message, 'user');
    input.value = '';
    input.focus();
    
    try {
        // Get auth token
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (!session) {
            errorDiv.textContent = 'Session expired. Please login again.';
            errorDiv.classList.add('show');
            return;
        }
        
        // Send to backend
        const response = await fetch(`${BACKEND_URL}/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${session.access_token}`
            },
            body: JSON.stringify({ message })
        });
        
        if (!response.ok) {
            throw new Error('Failed to get response from server');
        }
        
        const data = await response.json();
        addMessageToChat(data.reply, 'ai');
        
    } catch (err) {
        errorDiv.textContent = err.message || 'An error occurred. Please try again.';
        errorDiv.classList.add('show');
    }
});

// Helper function to add message to chat display
function addMessageToChat(text, sender) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageEl = document.createElement('div');
    messageEl.className = `message ${sender}`;
    
    const contentEl = document.createElement('div');
    contentEl.className = 'message-content';
    contentEl.textContent = text;
    
    messageEl.appendChild(contentEl);
    messagesDiv.appendChild(messageEl);
    
    // Scroll to bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

// Check if user is already logged in on page load
window.addEventListener('load', async () => {
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        
        if (session) {
            showDashboard(session.user.email);
        }
    } catch (err) {
        console.error('Session check error:', err);
    }
});
