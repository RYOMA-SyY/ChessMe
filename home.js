// Theme handling
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('.theme-icon');

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

// Theme toggle click handler
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
});

// Update theme icon
function updateThemeIcon(theme) {
    themeIcon.textContent = theme === 'light' ? '☀️' : '🌙';
}

function startGame() {
    const playButton = document.querySelector('.play-button');
    const buttonText = playButton.querySelector('.button-text');
    const buttonIcon = playButton.querySelector('.button-icon');
    
    // Add loading animation
    buttonText.textContent = 'Loading...';
    buttonIcon.style.animation = 'spin 1s linear infinite';
    playButton.style.opacity = '0.7';      
    playButton.style.pointerEvents = 'none';
    
    // Redirect to game page after animation
    setTimeout(() => {     
        window.location.href = 'game.html';
    }, 1000);
}

// Add floating animation to chess pieces
document.addEventListener('DOMContentLoaded', () => {
    const pieces = document.querySelectorAll('.piece');
    pieces.forEach((piece, index) => {
        piece.style.animationDelay = `${index * 0.2}s`;
    });     

    // Add hover effect to features
    const features = document.querySelectorAll('.feature');
    features.forEach(feature => {
        feature.addEventListener('mouseenter', () => {
            feature.style.transform = 'translateY(-5px)';
        });
        
        feature.addEventListener('mouseleave', () => {
            feature.style.transform = 'translateY(0)';
        });
    });
}); 