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
            detailsHtml += `<p>Gender: ${data.gender}</p>`;
            detailsHtml += `<p>Culture: ${data.culture}</p>`
            detailsHtml += `<p>Born: ${data.born}</p>`
            detailsHtml += `<p>Died: ${data.died}</p>`
            detailsHtml += `<p>Gender: ${data.gender}</p>`
            detailsHtml += `<p>Titles: ${data.titles}</p>`
            detailsHtml += `<p>Aliases: ${data.aliases}</p>`
            detailsHtml += `<p>Father: ${data.father}</p>`
            detailsHtml += `<p>Mother: ${data.mother}</p>`
            if (data.allegiances && data.allegiances.length > 0) {
                detailsHtml += `<p>Allegiances:</p><ul>`;
                detailsHtml += data.allegiances.map(allegiance => `<li>${allegiance}</li>`).join('');
                detailsHtml += `</ul>`;
            } else {
                detailsHtml += `<p>No allegiances found</p>`;
            }

            if (data.books && data.books.length > 0) {
                detailsHtml += `<p>Books:</p><ul>`;
                detailsHtml += data.books.map(book => `<li>${book}</li>`).join('');
                detailsHtml += `</ul>`;
            } else {
                detailsHtml += `<p>No books found</p>`;
            }
            
            document.getElementById('characterDetails').innerHTML = detailsHtml;
        })
        .catch(e => console.error(e));
}