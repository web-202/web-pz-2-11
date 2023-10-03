const myDiv = document.getElementById('myDiv');
const myBtn = document.getElementById('myBtn');
const myData = document.querySelector('.datas');
const apiUrl = 'https://anapioficeandfire.com/api/characters/';
let visibleElements = 30;
let startVisibleElements = 30;


function loadDataAndDisplay(id) {
  fetch(apiUrl + id)
    .then(response => response.json())
    .then(data => {
      const button = document.createElement('button');
      button.textContent = data.name;

      button.addEventListener('click', () => {
        displayContent(data, data.name);
      });

      myDiv.appendChild(button);

      if (id === ids[0]) {
        displayContent(data, data.name);
        activeCharacterId = id;
      }
    })
    .catch(error => {
      console.error(`Помилка завантаження даних для id ${id}:`, error);
    });
}

const ids = [];
//тут я взяв з 12 бо перші 11 не мають імені, і псують загальну картину
for (let i = 12; i <= 1000; i++) {
  ids.push(i);
}

for (let i = 0; i < startVisibleElements; i++) {
  loadDataAndDisplay(ids[i]);
}

function displayContent(data, name) {
  myData.innerHTML = '';
  document.getElementById('titles').textContent = name;

  const contentContainer = document.createElement('div');

  const keys = Object.keys(data);

  for (let i = 2; i < keys.length; i++) {
    const key = keys[i];
    const value = data[key];

    const pairContainer = document.createElement('div');
    pairContainer.className = 'key-value-pair';

    const keyElement = document.createElement('span');
    keyElement.className = 'key';
    keyElement.textContent = key + ":";

    const valueElement = document.createElement('span');
    valueElement.className = 'value';
    valueElement.textContent = value;

    pairContainer.appendChild(keyElement);
    pairContainer.appendChild(valueElement);

    contentContainer.appendChild(pairContainer);
  }

  myData.appendChild(contentContainer);
}

function loadMoreElements() {
  const additionalElements = 30;

  const elementsToLoad = ids.slice(visibleElements, visibleElements + additionalElements);

  elementsToLoad.forEach(id => {
    loadDataAndDisplay(id);
  });

  visibleElements += additionalElements;
}

const loadMoreButton = document.createElement('button');
loadMoreButton.textContent = 'MORE';
loadMoreButton.addEventListener('click', () => {
  loadMoreElements();
});

myBtn.appendChild(loadMoreButton);
