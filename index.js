document.addEventListener('DOMContentLoaded', function () {
  const apiBaseUrl = 'https://anapioficeandfire.com/api';

  const characterListElement = document.getElementById('character-list');
  const characterDetailsElement = document.getElementById('character-details');

  function httpRequest(type, url, options) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open(type, url, true);

      xhr.onload = function () {
        if (xhr.status >= 200 && xhr.status < 300) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(xhr.statusText);
        }
      };

      xhr.onerror = function () {
        reject(xhr.statusText);
      };

      if (options && type === 'POST') {
        xhr.setRequestHeader('Content-Type', 'application/json');
      }

      xhr.send(options ? JSON.stringify(options) : null);
    });
  }

  async function fetchCharacters() {
    try {
      const characters = await httpRequest('GET', `${apiBaseUrl}/characters?pageSize=20`);
      displayCharacters(characters);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  }

  function displayCharacters(characters) {
    characters.forEach(character => {
      if (character.name !== '') {
        console.log(character)
        const li = document.createElement('li');
        li.textContent = character.name;
        li.addEventListener('click', () => loadCharacterDetails(character.url));
        characterListElement.appendChild(li);
      }
    });

    if (characters.length > 0) {
      loadCharacterDetails(characters[0].url);
    }
  }

  async function loadCharacterDetails(url) {
    try {
      const character = await httpRequest('GET', url);
      displayCharacterDetails(character);
    } catch (error) {
      console.error('Error fetching character details:', error);
    }
  }

  function displayCharacterDetails(character) {
    const detailsHTML = `
            <h2>${character.name}</h2>
            <p><strong>Gender:</strong> ${character.gender}</p>
            <p><strong>Culture:</strong> ${character.culture}</p>
            <p><strong>Titles:</strong> ${character.titles.join(', ')}</p>
            <p><strong>Aliases:</strong> ${character.aliases.join(', ')}</p>
        `;

    characterDetailsElement.innerHTML = detailsHTML;
  }

  characterListElement.addEventListener('scroll', function () {
    if (characterListElement.scrollTop + characterListElement.clientHeight >= characterListElement.scrollHeight) {
      console.log('Load more characters...');
    }
  });

  fetchCharacters();
});
