document.addEventListener('DOMContentLoaded', function () {
    const characterListContainer = document.getElementById('character-list');
    const characterInfoContainer = document.getElementById('character-info');
    const apiUrl = 'https://anapioficeandfire.com/api/characters';
    let currentPage = 1;

    function httpRequest(type, url, options) {
        return new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.open(type, url);
            xhr.onload = function () {
                if (xhr.status >= 200 && xhr.status < 300) {
                    resolve(JSON.parse(xhr.responseText));
                } else {
                    reject(new Error(`Помилка отримання даних: ${xhr.statusText}`));
                }
            };
            xhr.onerror = function () {
                reject(new Error('Помилка отримання даних'));
            };
            xhr.send(options);
        });
    }

    function loadMoreCharacters() {
        currentPage++;
        const url = `${apiUrl}?page=${currentPage}`;
        httpRequest('GET', url)
            .then(data => displayCharacterList(data))
            .catch(error => console.error('Помилка отримання даних:', error));
    }

    function displayCharacterList(characters) {
        characterListContainer.innerHTML = '';
    
        characters.forEach((character, index) => {
            const characterElement = document.createElement('div');
            characterElement.classList.add('character');
            characterElement.textContent = `character ${index + 1}`;
    
            characterElement.addEventListener('click', () => {
                displayCharacterInfo(character);
                setActiveCharacter(characterElement);
            });
    
            characterListContainer.appendChild(characterElement);
        });
    }
    function displayCharacterInfo(character) {

        const markup = `
        <h1>${character.name}</h1>
        <h2>gender: ${character.gender} culture: ${character.culture}</h2>
        <p>born: ${character.born}</p>
        <p>died: ${character.died}</p>
        <p>titles: ${character.titles.join(', ')}</p>
        <p>aliases: ${character.aliases.join(', ')}</p>
        <p>father: ${character.father}</p>
        <p>mother: ${character.mother}</p>
        <p>spouse: ${character.spouse}</p>
        <p>books: ${character.books.join(', ')}</p>
        <p>povBooks: ${character.povBooks.join(', ')}</p>
        <p>playedBy: "${character.playedBy.join(', ')}"</p>
        `;

        characterInfoContainer.innerHTML = markup;
    }


    function setActiveCharacter(selectedCharacterElement) {
        const characterElements = document.querySelectorAll('.character');
        characterElements.forEach(element => {
            element.style.backgroundColor = '#808080';
        });

        selectedCharacterElement.style.backgroundColor = '#fff';
    }

    window.addEventListener('scroll', function () {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            loadMoreCharacters();
        }
    });

    loadMoreCharacters();
});
