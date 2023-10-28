let nextPage = 1;
let characterCount1 = 1;
let isLoading = false;
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
function loadCharacters() {
    const characterList = document.getElementById("character-list");
    let nextPage = 1;

    function loadMoreCharacters() {
        httpRequest("GET", `https://anapioficeandfire.com/api/characters?page=${nextPage}&pageSize=50`, function (data) {
            if (data.length === 0) {
                window.removeEventListener('scroll', scrollHandler);
                return;
            }
            data.forEach(function (character) {
                const listItem = document.createElement("li");
                listItem.textContent = `Character ${characterList.children.length + 1}`;

                listItem.addEventListener("click", function () {
                    loadCharacterDetails(character.url);
                });

                characterList.appendChild(listItem);
            });
            nextPage++;
        });
    }

    loadMoreCharacters();

    function scrollHandler() {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
            loadMoreCharacters();
        }
    }

    window.addEventListener('scroll', scrollHandler);
}
function loadCharacterDetails(characterUrl) {
    const characterDetails = document.getElementById("character-details");
    httpRequest("GET", characterUrl, function (data) {
    });
}

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
loadCharacters();
