const apiUrl = 'https://anapioficeandfire.com/api/books/1';
const contentContainer = document.getElementById('characters');
const tooltip = document.querySelector('.tooltip');
const nameCharacter = document.querySelector('.name_character');


let page = 1;
let charactersLoaded = 0;
const charactersPerPage = 40;
let loading = false;
let countCharacter = 1


const httpRequest = (type, url, options) => {
    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open(type, url, true);

        xhr.onload = function () {
            if (xhr.status >= 200 && xhr.status < 300) {
                resolve(JSON.parse(xhr.responseText));
            } else {
                reject(new Error(`HTTP request failed with status ${xhr.status}`));
            }
        };

        xhr.onerror = function () {
            reject(new Error('HTTP request failed'));
        };

        if (options && options.headers) {
            for (const [key, value] of Object.entries(options.headers)) {
                xhr.setRequestHeader(key, value);
            }
        }

        xhr.send(options ? options.body : null);
    });
}

const fetchData = async () => {
    try {
        const data = await httpRequest('GET', `${apiUrl}`);
        const charactersApi = data.characters.slice(charactersLoaded, charactersLoaded + charactersPerPage);
        const charactersList = [];

        for (const item of charactersApi) {
            try {
                const characterData = await httpRequest('GET', `${item}`);
                charactersList.push(characterData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        }

        charactersLoaded += charactersPerPage;
        return charactersList;
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

const appendDataToPage = async () => {
    if (loading) return;
    loading = true;

    try {
        const data = await fetchData();
        data.forEach(item => {
            const listItem = document.createElement('div');
            listItem.classList.add('list-item');

            const nameElement = document.createElement('span');
            nameElement.classList.add('name');
            nameElement.textContent = `${item.name}  (${item.gender})`;
           

            const tool = document.createElement('span');
            listItem.addEventListener('click', () => {
                nameCharacter.textContent = `Charter ${countCharacter}\n${item.name}`;
                countCharacter++;
           
                tooltip.innerHTML = `
                <div class="tooltip">
                <div>gender: ${item.gender || ''}</div>
                <div>culture: ${item.culture || ''}</div>
                <div>died: ${item.died || ''}</div>
                <div>born: ${item.born || ''}</div>
                <div>father: ${item.father || ''}</div>
                <div>mother: ${item.mother || ''}</div>
                <div>spouse: ${item.spouse || ''}</div>
                <div>titles: ${item.titles[0] || ''}</div>
                <div>aliases: ${item.aliases[0] || ''}</div>
                <div>${(item.playedBy && item.playedBy !== '') ? `Played By: ${item.playedBy}` : 'Not played'}</div>
            </div>
            `;
            })

            listItem.appendChild(nameElement);

            contentContainer.appendChild(listItem);
        });
    } finally {
        loading = false;
    }
}

const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

    if (scrollTop + clientHeight >= scrollHeight - 10) {
        appendDataToPage();
    }
}

window.addEventListener('scroll', handleScroll);
appendDataToPage()
// document.getElementById('loadDataBtn').addEventListener('click', appendDataToPage);
