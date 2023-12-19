const pageSize = 50;

async function getCharacters() {
    fetch(`https://anapioficeandfire.com/api/characters?page=15&pageSize=${pageSize}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then((response) => response.json())
        .then((body) => {
            
            let htmlContent = '';
            body.forEach((body, index) => {
                htmlContent += `<p class="character" data-url="${body.url}">Character ${index+1} </p>`;
            });
            document.getElementById('charactersList').innerHTML = htmlContent;

            const characterElements = document.querySelectorAll('.character');
            characterElements.forEach(p => {
                p.addEventListener('click', function() {
                    characterElements.forEach(elem => elem.classList.remove('selected-character'));
                    this.classList.add('selected-character');
                    getInfoAboutCharacter(this.getAttribute('data-url'));
                });
            });
            if (body.length > 0) {
                characterElements[0].classList.add('selected-character');
                getInfoAboutCharacter(body[0].url);
            }


        })
        .catch((e) => console.error(e));

}
document.addEventListener('DOMContentLoaded', function () {
    getCharacters();
});

function getInfoAboutCharacter(url) {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            console.log(data);
            let detailsHtml = '';
            if (data.name) { 
                detailsHtml+= `<h2>${data.name}</h2>`
            } else{
                detailsHtml+= `<h2>Name not Found!</h2>`
            };
            detailsHtml += `<p>Gender: ${data.gender || 'Info not Found!'}</p>`;
            detailsHtml += `<p>Culture: ${data.culture || 'Info not Found!'}</p>`;
            detailsHtml += `<p>Born: ${data.born || 'Info not Found!'}</p>`;
            detailsHtml += `<p>Died: ${data.died || 'Info not Found!'}</p>`;

            if (data.titles && data.titles.length > 0 && data.titles.some(title => title.trim() !== '')) {
                detailsHtml += `<p>Titles:</p><ul>`;
                detailsHtml += data.titles.map(title => `<li>${title}</li>`).join('');
                detailsHtml += `</ul>`;
            } else {
                detailsHtml += `<p>Titles: Info not Found!</p>`;
            }

            if (data.aliases && data.aliases.length > 0 && data.aliases.some(aliase => aliase.trim() !== '')) {
                detailsHtml += `<p>Aliases:</p><ul>`;
                detailsHtml += data.aliases.map(aliase => `<li>${aliase}</li>`).join('');
                detailsHtml += `</ul>`;
            } else {
                detailsHtml += `<p>Aliases: Info not Found!</p>`;
            }

            detailsHtml += `<p>Father: ${data.father || 'Info not Found!'}</p>`;
            detailsHtml += `<p>Mother: ${data.mother || 'Info not Found!'}</p>`;

            if (data.allegiances && data.allegiances.length > 0) {
                detailsHtml += `<p>Allegiances:</p><ul>`;
                detailsHtml += data.allegiances.map(allegiance => `<li>${allegiance}</li>`).join('');
                detailsHtml += `</ul>`;
            } else {
                detailsHtml += `<p>Allegiances: Info not Found!</p>`;
            }

            if (data.books && data.books.length > 0) {
                detailsHtml += `<p>Books:</p><ul>`;
                detailsHtml += data.books.map(book => `<li>${book}</li>`).join('');
                detailsHtml += `</ul>`;
            } else {
                detailsHtml += `<p>Books: Info not Found!</p>`;
            }
            
            document.getElementById('characterDetails').innerHTML = detailsHtml;
        })
        .catch(e => console.error(e));
}