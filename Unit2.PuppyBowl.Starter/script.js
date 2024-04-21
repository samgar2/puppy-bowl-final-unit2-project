const playerContainer = document.getElementById('all-players-container');
const newPlayerFormContainer = document.getElementById('new-player-form');
const singlePlayerContainer = document.getElementById('single-player-container');

// Add your cohort name to the cohortName variable below, replacing the 'COHORT-NAME' placeholder
const cohortName = '2310-GHP-ET-WEB-FT-SF';
// Use the APIURL variable for fetch requests
const APIURL = `https://fsa-puppy-bowl.herokuapp.com/api/${cohortName}/players`;

// Creating our state
const state = {
    data: {
        players: [],
    }
};

/**
 * It fetches all players from the API and returns them
 * @returns An array of objects.
 */
// GET: show all players
const fetchAllPlayers = async () => {
    try {
        const response = await fetch(APIURL);
        const json = await response.json();
        state.data = json.data;
        console.log(state.data.players)

    } catch (err) {
        console.error('Uh oh, trouble fetching players!', err);
    }
};

// GET: show a single player
const fetchSinglePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`);
        const json = await response.json();
        console.log(json);
        console.log(state.data)

        renderSinglePlayer(json.data.player);

    } catch (err) {
        console.error(`Oh no, trouble fetching player #${playerId}!`, err);
    }
};

// POST: add new player
const addNewPlayer = async (playerObj) => {
    playerObj.preventDefault();

    try {
        const playerName = document.getElementById("name");
        const playerBreed = document.getElementById("breed");
        const playerImageUrl = document.getElementById("imageUrl");

        const response = await fetch(APIURL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: playerName.value,
                breed: playerBreed.value,
                imageUrl: playerImageUrl.value,
            }),
        });

        init();

        const json = await response.json();
        console.log(json);

    } catch (err) {
        console.error('Oops, something went wrong with adding that player!', err);
    }
};

// DELETE: delete player
const removePlayer = async (playerId) => {
    try {
        const response = await fetch(`${APIURL}/${playerId}`, {
            method: "DELETE",
        })

        init();

    } catch (err) {
        console.error(
            `Whoops, trouble removing player #${playerId} from the roster!`,
            err
        );
    }
};

/**
 * It takes an array of player objects, loops through them, and creates a string of HTML for each
 * player, then adds that string to a larger string of HTML that represents all the players. 
 * 
 * Then it takes that larger string of HTML and adds it to the DOM. 
 * 
 * It also adds event listeners to the buttons in each player card. 
 * 
 * The event listeners are for the "See details" and "Remove from roster" buttons. 
 * 
 * The "See details" button calls the `fetchSinglePlayer` function, which makes a fetch request to the
 * API to get the details for a single player. 
 * 
 * The "Remove from roster" button calls the `removePlayer` function, which makes a fetch request to
 * the API to remove a player from the roster. 
 * 
 * The `fetchSinglePlayer` and `removePlayer` functions are defined in the
 * @param playerList - an array of player objects
 * @returns the playerContainerHTML variable.
 */
const renderAllPlayers = (playerList) => {
    console.log(state.data)

    try {
        const playerList = state.data.players.map((player) => {
            const ul = document.createElement("ul");
            const li = document.createElement("li");
            li.innerHTML = `
          <h2>${player.name}</h2>
          <p>${player.breed}</p>
          <img src="${player.imageUrl}" alt="${player.name}" />`;
        ul.appendChild(li);

            // Make See details button
            const fetchButton = document.createElement('button')
            fetchButton.textContent = "See details"
            li.append(fetchButton)

            fetchButton.addEventListener("click", () => fetchSinglePlayer(player.id))

            // Make Remove from roster button
            const deleteButton = document.createElement('button')
            deleteButton.textContent = "Remove from roster"
            li.append(deleteButton)

            deleteButton.addEventListener("click", () => removePlayer(player.id))

            return ul;
        })

        playerContainer.replaceChildren(...playerList);

    } catch (err) {
        console.error('Uh oh, trouble rendering players!', err);
    }

    return playerList;
};

// Render function for looking at a single player
const renderSinglePlayer = (player) => {
    try {
    const ul = document.createElement("ul");
    const li = document.createElement("li");
    li.innerHTML = `
     <h2>${player.name}</h2>
     <p>${player.breed}</p>
     <img src="${player.imageUrl}" alt="${player.name}" />`;

   const mainPageButton = document.createElement('button')
   mainPageButton.textContent = "Main Page"
   li.appendChild(mainPageButton)
   ul.appendChild(li);

    mainPageButton.addEventListener("click", () => renderAllPlayers(player));

    playerContainer.replaceChildren(ul); 
        
    } catch (err) { 
        console.error ('Uh oh, trouble rendering single player!', err);
    }
}

/**
 * It renders a form to the DOM, and when the form is submitted, it adds a new player to the database,
 * fetches all players from the database, and renders them to the DOM.
 */
const renderNewPlayerForm = () => {
    try {
    // HTML: Setup our form
    const header = document.createElement("h1");
    header.textContent = "Puppy Bowl";

    // HTML: Make the form labels, headers, and buttons
    const playerForm = document.createElement("form");
    playerForm.innerHTML = `
    </br><label>
    Name
    </label>
    <input type="text" id="name" />

    <label>
    Breed
    </label>
    <input type="text" id="breed" />

    <label>
    Image
    </label>
    <input type="imageUrl" id="imageUrl" />
    </br></br>
    <button type = "submit" >Add New Player</button> </br></br>`

    header.appendChild(playerForm);
    newPlayerFormContainer.replaceChildren(header);

    header.addEventListener("submit", addNewPlayer);

    return header;

    } catch (err) {
        console.error('Uh oh, trouble rendering the new player form!', err);
    }
}

const init = async () => {
    const players = await fetchAllPlayers();
    renderAllPlayers(players);

    renderNewPlayerForm();

    document.body.appendChild(singlePlayerContainer);
}

init();