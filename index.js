const listEl = document.getElementById("list")
const itemEl = document.getElementById("item")

let page = 1
let size = 25

async function httRequest(type, url) {
  const response = await fetch(url, {
    method: type,
  })

  const json = await response.json()

  return json
}

async function getListCharacters() {
  const params = new URLSearchParams({
    page: page,
    pageSize: size,
  })


  const list = await httRequest("GET", "https://www.anapioficeandfire.com/api/characters?" + params)

  return list
}


async function getItem(url) {
  const item = await httRequest("GET", url)

  return item
}

async function setUpList() {
  const list = await getListCharacters()

  if(list.length === 0) {
    return
  }

  let index = page * size - size
  for (let item of list) {
    const div = document.createElement("div")
    div.className = "list-item"
    div.textContent = `character ${++index}`
    div.addEventListener("click", () => {
        setUpItem(item.url)
    })

    listEl.append(div)
  }

  page++

  const button = document.createElement("button")
  button.textContent = "More"
  button.className = "more-button"
  button.addEventListener("click", () => {
    setUpList()
    button.remove()
  }, {once: true})

  listEl.append(button)
}

async function setUpItem(url) {
  const item = await getItem(url)
  const itemProperties = Object.getOwnPropertyNames(item)

  itemEl.innerHTML = `<div class="item-name">${item.name || "Unknown"}</div>`


  for (let itemProperty of itemProperties) {
    const div = document.createElement("div")

    if(typeof item[itemProperty] === "object") {
      div.textContent = `${itemProperty}: ${item[itemProperty].join(", ")}`
    } else {
      div.textContent = `${itemProperty}: ${item[itemProperty]}`
    }

    itemEl.append(div)
  }
}

setUpList()

