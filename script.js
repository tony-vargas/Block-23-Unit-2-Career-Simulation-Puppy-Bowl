const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');

const cohortName = "2308-ACC-PT-WEB-PT";
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/`;

const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL + 'players');
        const players = await response.json();
        return players;
    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(APIURL + `players/${playerId}`);
        const player = await response.json();
        // You can do something with the player data, perhaps display it in a modal or a separate section.
        console.log('Single Player Details:', player);
    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

const addNewPlayer = async (playerObj) => {
    try {
        const response = await fetch(APIURL + 'players', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(playerObj),
        });
        const newPlayer = await response.json();
        return newPlayer;
    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

const removePlayer = async (playerId) => {
    try {
        await fetch(APIURL + `players/${playerId}`, {
            method: 'DELETE',
        });
        console.log(`Player #${playerId} removed from the roster.`);
    } catch (err) {
        console.error(`Whoops, trouble removing player #${playerId} from the roster!`, err);
    }
};

const renderAllPlayers = (playerList) => {
    try {
        playerContainer.innerHTML = ''; // Clear the container before rendering

        playerList.forEach(player => {
            const playerCard = document.createElement('div');
            playerCard.classList.add('player-card');
            playerCard.innerHTML = `
                <p>${player.name}</p>
                <button onclick="fetchSinglePlayer(${player.id})">See Details</button>
                <button onclick="removePlayer(${player.id})">Remove from Roster</button>
            `;
            playerContainer.appendChild(playerCard);
        });
    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }
};

const renderNewPlayerForm = () => {
    try {
        newPlayerFormContainer.innerHTML = `
            <h2>Add New Player</h2>
            <form id="add-player-form">
                <label for="playerName">Player Name:</label>
                <input type="text" id="playerName" required>

                <label for="playerPosition">Player Position:</label>
                <input type="text" id="playerPosition" required>

                <label for="playerTeam">Player Team:</label>
                <input type="text" id="playerTeam" required>

                <button type="button" onclick="submitNewPlayer()">Add Player</button>
            </form>
        `;
    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
};

const submitNewPlayer = async () => {
    const playerName = document.getElementById('playerName').value;
    const playerPosition = document.getElementById('playerPosition').value;
    const playerTeam = document.getElementById('playerTeam').value;

    const newPlayer = await addNewPlayer({ name: playerName, position: playerPosition, team: playerTeam });

    // Fetch all players again and re-render the list
    const updatedPlayers = await fetchAllPlayers();
    renderAllPlayers(updatedPlayers);
};

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();
}

init();
