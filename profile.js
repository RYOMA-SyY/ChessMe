// JavaScript for the Player Profile page

document.addEventListener('DOMContentLoaded', () => {
    const statisticsGrid = document.querySelector('.statistics-grid');
    const usernameElement = document.querySelector('.user-info h2');

    // Placeholder data for player statistics
    // In a real application, this data would be fetched from a backend.
    const placeholderStats = {
        username: "ChessMaster",
        gamesPlayed: 150,
        wins: 80,
        losses: 50,
        draws: 20,
        winRate: "53.3%",
        rating: 1250
    };

    // Function to display player statistics
    function displayPlayerStats(stats) {
        // Clear existing content
        statisticsGrid.innerHTML = '';

        // Update username
        if (usernameElement) {
            usernameElement.textContent = stats.username || "Player Profile";
        }

        // Create and append statistic items
        // Using an object to maintain order and labels
        const statsToDisplay = {
            "Games Played": stats.gamesPlayed,
            "Wins": stats.wins,
            "Losses": stats.losses,
            "Draws": stats.draws,
            "Win Rate": stats.winRate,
            "Rating": stats.rating
        };

        for (const label in statsToDisplay) {
            if (statsToDisplay.hasOwnProperty(label)) {
                const value = statsToDisplay[label];

                const statItem = document.createElement('div');
                statItem.classList.add('stat-item');

                // You might add an icon here based on the label or another property
                // const statIcon = document.createElement('span');
                // statIcon.classList.add('stat-icon');
                // statIcon.textContent = '📊'; // Example icon
                // statItem.appendChild(statIcon);

                const statLabel = document.createElement('span');
                statLabel.classList.add('stat-label');
                statLabel.textContent = label + ":";

                const statValue = document.createElement('span');
                statValue.classList.add('stat-value');
                statValue.textContent = value;


                statItem.appendChild(statLabel);
                statItem.appendChild(statValue);

                statisticsGrid.appendChild(statItem);
            } 
        }
    }

    // Call the display function with placeholder data on load
    displayPlayerStats(placeholderStats);

});     