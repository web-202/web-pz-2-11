//Variables
let page = 1;
let pageSize = 30;
let characters = document.getElementById('characters')
let about = document.getElementById('about_person')
let number = 1;
let currentId = 1;
let isLoading = false;


//Function will be sending request by url
const request = (type, url) => {
    return new Promise((resolve, reject) => {
        const httpRequest = new XMLHttpRequest();

        httpRequest.open(type, url)

        httpRequest.responseType = "json"

        httpRequest.onload = () => {
            if (httpRequest.status >= 400) {
                reject(httpRequest.response)
            } else {
                resolve(httpRequest.response)
            }
        }

        httpRequest.onerror = () => {
            reject(httpRequest.response)
        }

        httpRequest.send()
    })
}

async function giveCharacter() {
    const url = `https://anapioficeandfire.com/api/characters?page=${page}&&pageSize=${pageSize}`;
    let response = await request('GET', url)
    response.forEach((value, index) => {
        let div = document.createElement("div");

        div.textContent = `Character-${number}`
        div.classList.add('characters__el')
        div.dataset.url = value.url;
        div.id = number;
        number++;

        div.addEventListener('click', (event) => {
            const characterElement = event.currentTarget;
            characterElement.classList.add('active')
            const div = document.getElementById(currentId);
            div.classList.remove('active');
            const characterUrl = characterElement.dataset.url;
            currentId = characterElement.id;
            giveAboutOfCharacter(characterUrl, characterElement.textContent);
        });

        characters.appendChild(div)

    })

    if (page === 1) {
        const div = document.getElementById(currentId)
        div.classList.add('active');
        await giveAboutOfCharacter(div.dataset.url, div.textContent);
    }

    page++;
    isLoading = false;
}

async function giveAboutOfCharacter(characterUrl, name) {
    const character = await request('GET', characterUrl);
    while (about.firstChild) {
        about.removeChild(about.firstChild);
    }
    for (let element of Object.keys(character)) {
        if (element !== 'url' && character[element].toString().includes('https://anapioficeandfire.com/api/')) {
            const urls = character[element].toString().split(',');
            let elements = [];

            for (const item of urls) {
                try {
                    const data = await request("GET", item)
                    elements.push(data.name)
                } catch (e) {
                    console.log(`Error: ${e}`)
                    elements.push("")
                }
            }
            const div = document.createElement('div')
            div.textContent = `${element}: ${elements.join(',')}`
            div.classList.add('data')
            about.appendChild(div);
        } else if (element === 'name') {
            const div = document.createElement('div')
            if (character[element] === '') {
                div.textContent = `${element}: ${name}`;
            } else {
                div.textContent = `${element}: ${character[element]}`
            }
            div.classList.add('name')
            about.appendChild(div);
        } else {
            if (element !== 'url') {
                const div = document.createElement('div')
                div.textContent = `${element}: ${character[element]}`
                div.classList.add('data')
                about.appendChild(div);
            }
        }
    }

}


document.addEventListener("DOMContentLoaded", async function () {
    await giveCharacter();
});

const isCharacterDetailsScrolledToBottom = () => {
    return characters.scrollTop + characters.clientHeight >= characters.scrollHeight;
};

characters.addEventListener('scroll', async function () {
    if (isCharacterDetailsScrolledToBottom() && !isLoading) {
        isLoading = true;
        await giveCharacter();
    }
});
