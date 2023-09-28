let page = 1;
let pageSize = 30;
let count = 1;
let isLoading = false;


const newRequest = (type, url) => {
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

async function loadCharacters (){
  const url = `https://anapioficeandfire.com/api/characters?page=${page}&&pageSize=${pageSize}`;
  const listOfCharacters = $('#list-of-characters');
  const res = await newRequest('GET', url)
  res.forEach((character) => {
    let characterBlock = "";
    if (character.name === ''){
      characterBlock = $(`<div data-url="${character.url}" class="character-el" >Character ${count}</div>`)
      count++;
    }
    else characterBlock = $(`<div data-url="${character.url}" class="character-el" >${character.name}</div>`)

    characterBlock.on('click', function () {
      const characterUrl = $(this).data('url');
      loadCharacterDetails(characterUrl, $(this).text());
    });

    listOfCharacters.append(characterBlock);
  })
  page++;
  isLoading = false;
}

async function loadCharacterDetails(characterUrl, textContent){
  const nameOfCharacter = $('#name');
  nameOfCharacter.text(textContent);

  const aboutOfCharacterEls = $('#about-of-character-els');
  aboutOfCharacterEls.children().remove()
  aboutOfCharacterEls.addClass('about-of-character-els__active');

  const details = await newRequest('GET', characterUrl);

  for (let element of Object.keys(details)) {
    if (element !== 'url' && details[element].toString().includes('https://anapioficeandfire.com/api/')) {
      const urls = details[element].toString().split(',');
      let elementsOfUrls = [];

      for (const item of urls) {
        try {
          const data = await newRequest("GET", item)
          elementsOfUrls.push(data.name)
        } catch (e) {
          console.log(`Error: ${e}`)
          elementsOfUrls.push("")
        }
      }
      const h4 = $(`<h4 class="about-of-character__el">${element}: </h4>`);
      const span = $(`<span>${elementsOfUrls.join(',')}</span>`);
      h4.append(span[0]);
      aboutOfCharacterEls.append(h4[0]);
    }
    else {
      const h4 = $(`<h4 class="about-of-character__el">${element}: </h4>`);
      const span = $(`<span>${details[element]}</span>`);
      h4.append(span[0]);
      aboutOfCharacterEls.append(h4[0]);
    }
  }
}


const  isCharacterDetailsScrolledToBottom = () =>  {
  const listOfCharacters = $('#list-of-characters');
  return listOfCharacters.scrollTop() + listOfCharacters.innerHeight() >= listOfCharacters[0].scrollHeight;
}

$('#list-of-characters').scroll(async function () {
  if (isCharacterDetailsScrolledToBottom() && !isLoading) {
    isLoading = true;
    await loadCharacters();
  }
});

$(document).ready(async function () {
  await loadCharacters();
});




