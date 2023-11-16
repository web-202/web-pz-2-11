let nextPage = 1;
let characterCount = 1;

function httpRequest(type, url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open(type, url, true);
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            callback(response);
        }
    };
    xhr.send();
}

function loadMoreCharacters() {
    const characterList = document.getElementById("character-list");

    httpRequest("GET", `https://anapioficeandfire.com/api/characters?page=${nextPage}&pageSize=10`, function (data) {
        if (data.length === 0) {
            document.getElementById('loadMoreButton').disabled = true;
            return;
        }

        const startIndex = (nextPage - 1) * 10 + 1;

        data.forEach(function (character, index) {
            const listItem = document.createElement("li");
            listItem.textContent = `Character ${startIndex + index}`;
            
            listItem.addEventListener("click", function () {
                loadCharacterDetails(character.url);
                markSelectedCharacter(startIndex + index - 1);
            });

            characterList.appendChild(listItem);

            if (index === 0) {
                loadCharacterDetails(character.url);
                markSelectedCharacter(startIndex + index - 1);
            }
        });
        nextPage++;
    });
}


document.getElementById('loadMoreButton').addEventListener('click', loadMoreCharacters);

function loadCharacterDetails(characterUrl) {
    const characterDetails = document.getElementById("character-details");
    httpRequest("GET", characterUrl, function (data) {
        let html = `<p>Name: ${data.name || "Unknown"}</p>`;
        html += `<p>Gender: ${data.gender || "Unknown"}</p>`;
        html += `<p>Culture: ${data.culture || "Unknown"}</p>`;
        html += `<p>Born: ${data.born || "Unknown"}</p>`;
        html += `<p>Died: ${data.died || "Still Alive"}</p>`;
        if (data.titles && data.titles.length > 0) {
            html += "<p>Titles:</p><ul>";
            data.titles.forEach(title => {
                html += `<li>${title}</li>`;
            });
            html += "</ul>";
        }
        if (data.aliases && data.aliases.length > 0) {
            html += "<p>Aliases:</p><ul>";
            data.aliases.forEach(alias => {
                html += `<li>${alias}</li>`;
            });
            html += "</ul>";
        }

        characterDetails.innerHTML = html;
    });
}

function markSelectedCharacter(index) {
    const characterList = document.getElementById("character-list");
    Array.from(characterList.children).forEach((item) => {
        item.classList.remove('selected');
    });
    const actualIndex = characterCount + index;
    characterList.children[index].classList.add('selected');
}
