let page = 1
let pageSize = 40
let currentCharacter = ""
$(() => {
  fetchData(page).then(res => {
    currentCharacter = res[0].url
    renderSidebar(res)
  })
})

const renderSidebar = (characters) => {
  const sidebar = $(".sidebar")
  for (let i = 0; i < characters.length; i++) {
    const character = $(`<div class=" character ">${characters[i].name === "" ? "Character without name" : characters[i].name}</div>`)
    if (characters[i].url === currentCharacter) {
      changeCurrentCharacter(characters[i])
      character.addClass("active-character")
    }
    character.click(() => {
      const prevActiveCharacter = $(".active-character")
      prevActiveCharacter.removeClass("active-character")
      changeCurrentCharacter(characters[i])
      character.addClass("active-character")
    })
    sidebar.append(character)
  }
}

const changeCurrentCharacter = (character) => {
  const profile = $(".profile")

  currentCharacter = character.url

  profile.empty()
  const titleName = $(`<h2 class="title-name">${character.name === "" ? "Character without name" : character.name}</h2>`);
  const dataContainer = $("<div class='data-container'></div>")
  Object.keys(character).filter(item => item !== "name").map(key => {
    const dataRow = $(`
        <div class="data-row">
            <span class="data-key">${key}:</span>
        </div>
        `)
    if (Array.isArray(character[key])) {
      const dataValue = $("<div class='data-value'></div>")
      character[key].map(item => {
        dataValue.append($(`<p>${item}</p>`))
      })
      dataRow.append(dataValue)
    } else {
      const dataValue = $(`<span class='data-value'>${character[key]}</span>`)
      dataRow.append(dataValue)
    }
    dataContainer.append(dataRow)
  })
  profile.append(titleName, dataContainer)
}

const fetchData = async (page) => {
  const apiUrl = `https://www.anapioficeandfire.com/api/characters?page=${page}&pageSize=${pageSize}`
  const data = await fetch(apiUrl)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      return data;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  return data;
}

function isScrolledToBottom() {
  const contentHeight = $('.sidebar').height();
  const scrollHeight = $(window).scrollTop() + $(window).height();
  return scrollHeight >= contentHeight;
}

$(window).scroll(function () {
  if (isScrolledToBottom()) {
    page++
    fetchData(page).then(res => {
      renderSidebar(res)
    });
  }
});
