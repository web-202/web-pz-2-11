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
let characterCount1 = 1; 
function loadCharacters() {
    const characterList = document.getElementById("character-list");
    let selectedCharacter = null;
    httpRequest("GET", "https://anapioficeandfire.com/api/characters?page=1&pageSize=50", function (data) {
        data.forEach(function (character) {
            const listItem = document.createElement("li");
            listItem.textContent = `Character ${characterCount1}`;
            characterCount1++;

            listItem.addEventListener("click", function () {
                if (selectedCharacter) {
                    selectedCharacter.classList.remove("selected");
                }

                selectedCharacter = listItem;
                selectedCharacter.classList.add("selected");

                loadCharacterDetails(character.url);
            });

            listItem.addEventListener("mouseover", function () {
                if (listItem !== selectedCharacter) {
                    listItem.style.backgroundColor = "#f0f0f0"; 
                }
            });

            listItem.addEventListener("mouseout", function () {
                if (listItem !== selectedCharacter) {
                    listItem.style.backgroundColor = "transparent";
                }
            });

            characterList.appendChild(listItem);
        });
        loadCharacterDetails(data[0].url);
    });
}
let characterCount = 1;
function loadCharacterDetails(characterUrl) {
    const characterDetails = document.getElementById("character-details");
        httpRequest("GET", characterUrl, function (data) {
        let html = `<h2>Character ${characterCount}</h2>`;
        characterCount++; 
        html += `<p>Name: ${data.name || "Unknown"}</p>`;
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
        if (data.allegiances && data.allegiances.length > 0) {
            html += "<p>Allegiances:</p><ul>";
            data.allegiances.forEach(allegianceUrl => {
            });
            html += "</ul>";
        }
        if (data.books && data.books.length > 0) {
            html += "<p>Appeared in Books:</p><ul>";
            data.books.forEach(bookUrl => {
            });
            html += "</ul>";
        }
        if (data.povBooks && data.povBooks.length > 0) {
            html += "<p>Point of View in Books:</p><ul>";
            data.povBooks.forEach(bookUrl => {
            });
            html += "</ul>";
        }
        if (data.tvSeries && data.tvSeries.length > 0) {
            html += "<p>Appeared in TV Series:</p><ul>";
            data.tvSeries.forEach(series => {
                html += `<li>${series}</li>`;
            });
            html += "</ul>";
        }
        if (data.playedBy && data.playedBy.length > 0) {
            html += "<p>Played By:</p><ul>";
            data.playedBy.forEach(actor => {
                html += `<li>${actor}</li>`;
            });
            html += "</ul>";
        }
        characterDetails.innerHTML = html;
    });
}
loadCharacters();
