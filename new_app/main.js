document.addEventListener("DOMContentLoaded", async function () {
    const listDiv = document.querySelector("#menu");
    let currentPage = 1;
    const pageSize = 30;
    let loading = false;
    let isEnd = false;
    let characterCount = 0;

    async function httpRequest(type, url, options) {
        try {
            const response = await fetch(url, {
                method: type,
                ...options,
            });
            if (response.status === 200) {
                const data = await response.json();
                return data;
            } else {
                throw new Error(`Request failed with status ${response.status}`);
            }
        } catch (error) {
            throw new Error(`Request failed: ${error.message}`);
        }
    }

    function loadCharacterDetails(characterId) {
        const apiUrl = `https://www.anapioficeandfire.com/api/characters/${characterId}`;
        httpRequest('GET', apiUrl, null)
            .then((data) => {
                const characterDetails = document.getElementById('character-details');
                characterDetails.style.display = 'block';
                characterDetails.innerHTML = `
                <h1 class="character-name">${data.name}</h1>
                <div class="character-details">
                <p><span class="character-details-label">gender:</span> ${data.gender}</p>
                <p><span class="character-details-label">culture:</span> ${data.culture}</p>
                <p><span class="character-details-label">born:</span> ${data.born}</p>
                <p><span class="character-details-label">died:</span> ${data.died}</p>
                <p><span class="character-details-label">titles:</span> ${data.titles.join(', ')}</p>
                <p><span class="character-details-label">aliases:</span> ${data.aliases.join(', ')}</p>
                <p><span class="character-details-label">father:</span> ${data.father}</p>
                <p><span class="character-details-label">mother:</span> ${data.mother}</p>
                <p><span class="character-details-label">spouse:</span> ${data.spouse}</p>
                <p><span class="character-details-label">books:</span> ${data.books.join(', ')}</p>
                <p><span class="character-details-label">playedBy:</span> ${data.playedBy}</p>
                </div>
            `;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    function loadMoreCharacters() {
        if (loading) return;
        loading = true;
        currentPage++;
        const apiUrl = `https://www.anapioficeandfire.com/api/characters?page=${currentPage}&pageSize=${pageSize}`;
        httpRequest('GET', apiUrl, null)
            .then((data) => {
                const menu = document.getElementById('menu');
                data.forEach((character) => {
                    characterCount++;
                    const listItem = document.createElement('div');
                    listItem.classList.add('character-item');
                    listItem.dataset.id = character.url.split('/').pop();
                    listItem.textContent = 'character' + characterCount;
                    menu.appendChild(listItem);
                });
                loading = false;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    async function loadCharacterList() {
        const apiUrl = `https://www.anapioficeandfire.com/api/characters?page=1&pageSize=${pageSize}`;
        try {
            const data = await httpRequest('GET', apiUrl, null);
            const menu = document.getElementById('menu');
            data.forEach((character) => {
                characterCount++;
                const characterName = 'character' + characterCount;
                const listItem = document.createElement('div');
                listItem.classList.add('character-item');
                listItem.dataset.id = character.url.split('/').pop();
                listItem.textContent = characterName;
                menu.appendChild(listItem);
            });

            const firstCharacter = document.querySelector('.character-item');
            if (firstCharacter) {
                const characterId = firstCharacter.dataset.id;
                loadCharacterDetails(characterId);
            }

            listDiv.addEventListener('scroll', () => {
                if (listDiv.scrollTop + listDiv.clientHeight >= listDiv.scrollHeight - 400) {
                    loadMoreCharacters();
                }
            });
        } catch (error) {
            console.error(error);
        }
    }

    loadCharacterList();

    document.getElementById('menu').addEventListener('click', (event) => {
        if (event.target.classList.contains('character-item')) {

            const previousSelected = document.querySelector('.character-item-clicked');
            
            if (previousSelected) {
                previousSelected.classList.remove('character-item-clicked');
            }
            event.target.classList.add('character-item-clicked');

            const characterId = event.target.dataset.id;
            loadCharacterDetails(characterId);
        }
    });
});
