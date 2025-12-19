// DOM Elements
const tripForm = document.getElementById('tripForm');
const planningForm = document.getElementById('planningForm');
const resultsContainer = document.getElementById('resultsContainer');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('errorMessage');
const themeToggle = document.getElementById('themeToggle');

// Theme Management
let currentTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', currentTheme);

themeToggle.addEventListener('click', () => {
    currentTheme = currentTheme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    localStorage.setItem('theme', currentTheme);
    
    // Add animation effect
    document.body.style.transition = 'all 0.3s ease';
});

// Smooth scroll to planner
function scrollToPlanner() {
    document.getElementById('planningForm').scrollIntoView({ 
        behavior: 'smooth',
        block: 'center'
    });
}

// Select destination from cards
function selectDestination(destination) {
    document.getElementById('destination').value = destination;
    scrollToPlanner();
    
    // Highlight selected card
    document.querySelectorAll('.destination-card').forEach(card => {
        card.classList.remove('selected');
    });
    document.querySelector(`[data-destination="${destination}"]`).classList.add('selected');
}

// Tab functionality
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Form submission handler
tripForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = {
        destination: document.getElementById('destination').value,
        days: document.getElementById('days').value,
        persons: document.getElementById('persons').value,
        transport: document.querySelector('input[name="transport"]:checked')?.value
    };
    
    // Validate form
    if (!validateForm(formData)) {
        return;
    }
    
    // Show loading with button animation
    const submitBtn = document.querySelector('.btn-primary');
    submitBtn.classList.add('loading');
    showLoading();
    hideError();
    
    try {
        // Send request to backend
        const response = await fetch('/api/plan-trip', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Something went wrong');
        }
        
        // Display results with animation
        displayResults(data);
        
        // Add success animation
        setTimeout(() => {
            resultsContainer.style.animation = 'slideInUp 0.6s ease';
        }, 100);
        
    } catch (error) {
        showError(error.message);
    } finally {
        hideLoading();
        document.querySelector('.btn-primary').classList.remove('loading');
    }
});

// Form validation
function validateForm(data) {
    if (!data.destination || !data.days || !data.persons || !data.transport) {
        showError('Please fill in all fields');
        return false;
    }
    
    if (data.days < 1 || data.days > 15) {
        showError('Number of days must be between 1 and 15');
        return false;
    }
    
    if (data.persons < 1 || data.persons > 10) {
        showError('Number of persons must be between 1 and 10');
        return false;
    }
    
    return true;
}

// Display trip results
function displayResults(data) {
    // Hide planning form and show results
    planningForm.style.display = 'none';
    resultsContainer.style.display = 'block';
    
    // Set trip title and details
    document.getElementById('tripTitle').textContent = `${data.destination} Trip Plan`;
    
    const tripDetails = document.getElementById('tripDetails');
    tripDetails.innerHTML = `
        <div class="detail-item">
            <strong>${data.destination}</strong>
            <span>Destination</span>
        </div>
        <div class="detail-item">
            <strong>${data.days}</strong>
            <span>Days</span>
        </div>
        <div class="detail-item">
            <strong>${data.persons}</strong>
            <span>Persons</span>
        </div>
        <div class="detail-item">
            <strong>${data.transport}</strong>
            <span>Transport</span>
        </div>
    `;
    
    // Display itinerary
    displayItinerary(data.itinerary);
    
    // Display stay areas
    displayStayAreas(data.stayAreas);
    
    // Display budget
    displayBudget(data.budget);
    
    // Scroll to results
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Display day-wise itinerary with animations
function displayItinerary(itinerary) {
    const itineraryContainer = document.getElementById('itinerary');
    
    itineraryContainer.innerHTML = itinerary.map((day, index) => `
        <div class="day-item" style="animation-delay: ${index * 0.1}s">
            <h4>📅 Day ${day.day}</h4>
            <div class="places-list">
                ${day.places.map(place => `<span class="place-tag">${place}</span>`).join('')}
            </div>
        </div>
    `).join('');
    
    // Add stagger animation
    document.querySelectorAll('.day-item').forEach((item, index) => {
        item.style.animation = `slideInUp 0.5s ease ${index * 0.1}s both`;
    });
}

// Display stay areas with animations
function displayStayAreas(stayAreas) {
    const stayContainer = document.getElementById('stayAreas');
    
    stayContainer.innerHTML = stayAreas.map((area, index) => `
        <div class="stay-item" style="animation-delay: ${index * 0.15}s">
            <h4>🏨 ${area.area}</h4>
            <p>💡 ${area.reason}</p>
        </div>
    `).join('');
    
    // Add stagger animation
    document.querySelectorAll('.stay-item').forEach((item, index) => {
        item.style.animation = `slideInUp 0.5s ease ${index * 0.15}s both`;
    });
}

// Display budget breakdown with animations
function displayBudget(budget) {
    const budgetContainer = document.getElementById('budgetBreakdown');
    
    let budgetHTML = `
        <div class="budget-grid">
            <div class="budget-item" style="animation-delay: 0.1s">
                <h4>🚗 Travel Cost</h4>
                <div class="budget-amount">₹${budget.travelCost.toLocaleString()}</div>
            </div>
            <div class="budget-item" style="animation-delay: 0.2s">
                <h4>🏨 Stay Cost</h4>
                <div class="budget-amount">₹${budget.stayCost.toLocaleString()}</div>
            </div>
            <div class="budget-item" style="animation-delay: 0.3s">
                <h4>🍽️ Food Cost</h4>
                <div class="budget-amount">₹${budget.foodCost.toLocaleString()}</div>
            </div>
            <div class="budget-item" style="animation-delay: 0.4s">
                <h4>🚌 Local Travel</h4>
                <div class="budget-amount">₹${budget.localTravelCost.toLocaleString()}</div>
            </div>
        </div>
        
        <div class="total-budget" style="animation-delay: 0.5s">
            <h3>💰 Total Estimated Cost</h3>
            <div class="total-amount">₹${budget.totalCost.toLocaleString()}</div>
        </div>
    `;
    
    // Add train note if applicable
    if (budget.trainNote) {
        budgetHTML += `
            <div class="train-note">
                <strong>Note:</strong> ${budget.trainNote}
            </div>
        `;
    }
    
    budgetContainer.innerHTML = budgetHTML;
    
    // Add stagger animation to budget items
    document.querySelectorAll('.budget-item, .total-budget').forEach((item, index) => {
        item.style.animation = `slideInUp 0.5s ease ${(index + 1) * 0.1}s both`;
    });
    
    // Animate numbers counting up
    animateNumbers();
}

// Animate numbers counting up
function animateNumbers() {
    document.querySelectorAll('.budget-amount, .total-amount').forEach(element => {
        const target = parseInt(element.textContent.replace(/[₹,]/g, ''));
        let current = 0;
        const increment = target / 50;
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            element.textContent = `₹${Math.floor(current).toLocaleString()}`;
        }, 30);
    });
}

// Download itinerary function
function downloadItinerary() {
    // Simple implementation - in real app, would generate PDF
    const tripData = {
        destination: document.getElementById('tripTitle').textContent,
        itinerary: Array.from(document.querySelectorAll('.day-item')).map(item => ({
            day: item.querySelector('h4').textContent,
            places: Array.from(item.querySelectorAll('.place-tag')).map(tag => tag.textContent)
        })),
        budget: document.querySelector('.total-amount').textContent
    };
    
    const dataStr = JSON.stringify(tripData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'trip-itinerary.json';
    link.click();
    
    // Show success message
    showSuccess('Itinerary downloaded successfully! 📥');
}

// Show planning form with animation
function showPlanningForm() {
    resultsContainer.style.animation = 'slideOutDown 0.3s ease';
    
    setTimeout(() => {
        planningForm.style.display = 'block';
        resultsContainer.style.display = 'none';
        
        // Reset form
        tripForm.reset();
        document.querySelectorAll('input[name="transport"]').forEach(input => input.checked = false);
        hideError();
        
        // Scroll to hero
        document.querySelector('.hero-section').scrollIntoView({ behavior: 'smooth' });
    }, 300);
}

// Loading functions
function showLoading() {
    loading.style.display = 'flex';
}

function hideLoading() {
    loading.style.display = 'none';
}

// Error functions
function showError(message) {
    errorMessage.textContent = `❌ ${message}`;
    errorMessage.style.display = 'block';
    errorMessage.style.animation = 'shake 0.5s ease-in-out';
    
    // Auto hide after 5 seconds
    setTimeout(() => {
        hideError();
    }, 5000);
}

function hideError() {
    errorMessage.style.display = 'none';
}

// Success message function
function showSuccess(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    successDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #28a745;
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 1000;
        animation: slideInDown 0.3s ease;
    `;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌍 Smart Trip Planner loaded successfully');
    
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease both';
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    document.querySelectorAll('.destination-card, .review-card').forEach(el => {
        observer.observe(el);
    });
    
    // Add CSS for additional animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideOutDown {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(30px); }
        }
        @keyframes slideInDown {
            from { opacity: 0; transform: translateY(-30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .destination-card.selected {
            transform: scale(1.02);
            border: 3px solid var(--primary-color);
            box-shadow: 0 15px 35px rgba(102,126,234,0.3);
        }
    `;
    document.head.appendChild(style);
});

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hideError();
        if (loading.style.display === 'flex') {
            hideLoading();
        }
    }
});

// Add CSS animations keyframes
const animationStyles = `
@keyframes slideInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}
`;

if (!document.querySelector('#animation-styles')) {
    const styleSheet = document.createElement('style');
    styleSheet.id = 'animation-styles';
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
}