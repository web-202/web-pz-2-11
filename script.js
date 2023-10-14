const myDiv = document.getElementById('myDiv');
const myBtn = document.getElementById('myBtn');
const myData = document.querySelector('.datas');
const apiUrl = 'https://anapioficeandfire.com/api/characters/';
let visibleElements = 30;
let startVisibleElements = 30;
let activeCharacterId = null;
let buttons = []; // Додавання змінної для кнопок

function loadDataAndDisplay(id) {
  fetch(apiUrl + id)
    .then(response => response.json())
    .then(data => {
      const button = document.createElement('button');
      button.textContent = data.name;
      button.id = id;


      button.addEventListener('click', () => {
        displayContent(data, data.name);

        setActiveCharacter(id);
      });

      myDiv.appendChild(button);
      buttons.push(button); // Додаємо кнопку до масиву

      if (id === ids[0]) {
        displayContent(data, data.name);
        setActiveCharacter(id);
      }
    })
    .catch(error => {
      console.error(`Помилка завантаження даних для id ${id}:`, error);
    });
}

function setActiveCharacter(id) {
  const buttonSelected = document.getElementById(id);
  if (activeCharacterId === null){
    buttonSelected.classList.add('active');
  }else {
    const buttonPrevent = document.getElementById(activeCharacterId);
    buttonPrevent.classList.remove('active');
    buttonSelected.classList.add('active');
  }
  activeCharacterId = id;
}


const ids = [];
for (let i = 12; i <= 1000; i++) {
  ids.push(i);
}

for (let i = 0; i < startVisibleElements; i++) {
  loadDataAndDisplay(ids[i]);
}

function displayContent(data, name) {
  myData.innerHTML = '';
  document.getElementById('titles').textContent = name;

  // Створюємо контейнер для додавання нового вмісту
  const contentContainer = document.createElement('div');

  const keys = Object.keys(data);

  // Проходимося по ключам, починаючи з третього (індекс 2)
  for (let i = 2; i < keys.length; i++) {
    const key = keys[i];
    const value = data[key];

    // Створюємо контейнер для пари ключ-значення
    const pairContainer = document.createElement('div');
    pairContainer.className = 'key-value-pair';

    // Створюємо елемент для ключа
    const keyElement = document.createElement('span');
    keyElement.className = 'key';
    keyElement.textContent = key + ":";

    // Створюємо елемент для значення
    const valueElement = document.createElement('span');
    valueElement.className = 'value';
    valueElement.textContent = value;

    // Додаємо елементи до контейнера пари ключ-значення
    pairContainer.appendChild(keyElement);
    pairContainer.appendChild(valueElement);

    // Додаємо контейнер пари до загального контейнера
    contentContainer.appendChild(pairContainer);
  }

  // Додаємо новий вміст до myData поруч з існуючим
  myData.appendChild(contentContainer);
}

function loadMoreElements() {
  const additionalElements = 30; // Кількість додаткових елементів, які потрібно завантажити

  // Отримуємо наступні additionalElements елементів з API
  const elementsToLoad = ids.slice(visibleElements, visibleElements + additionalElements);

  // Завантажуємо дані для цих елементів
  elementsToLoad.forEach(id => {
    loadDataAndDisplay(id);
  });

  // Оновлюємо кількість видимих елементів
  visibleElements += additionalElements;
}

const loadMoreButton = document.createElement('button');
loadMoreButton.textContent = 'MORE';
loadMoreButton.addEventListener('click', () => {
  // Завантажуємо наступні 30 елементів або скільки вам потрібно
  loadMoreElements();
});

// Додаємо кнопку "Завантажити ще" після перших 30 елементів
myBtn.appendChild(loadMoreButton);
