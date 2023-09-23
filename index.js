$(document).ready(function () {
  const listDiv = $("#character-list")
  const detailsDiv = $("#character-details")
  const characterNameDiv = $(".character-name")
  let page = 1
  let pageSize = 30
  let isEnd = false
  let loading = false;

  function sendRequest(type, url) {
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

  async function setUpSideBar() {
    if (isEnd) {
      return
    }

    let requestUrl = `https://www.anapioficeandfire.com/api/characters?page=${page}&pageSize=${pageSize}`
    try {
      const characters = await sendRequest("GET", requestUrl)
      page++

      if (characters.length === 0) {
        isEnd = true
        return
      }

      characters.forEach((character) => {
        const number = character.url.split("/").pop();
        listDiv.append(createSideBarListItem(number));
      });

      loading = false;

    } catch (e) {
      console.log("Error")
    }
  }

  function createSideBarListItem(number) {
    return $(`<div>character ${number}</div>`)
      .addClass("list-item")
      .on("click", (event) => {
        $(".list-item").removeClass("active");
        $(event.target).addClass("active")
        showListItem(number)
      })
  }

  async function showListItem(number) {
    const requestUrl = `https://anapioficeandfire.com/api/characters/${number}`;
    try {
      const character = await sendRequest("GET", requestUrl);
      await fillCharacterInfo(character);
    } catch (e) {
      alert(`Error: ${e}`);
    }
  }

  async function fillCharacterInfo(character) {
    detailsDiv.find(".detail-item").remove()
    characterNameDiv.text(character.name)

    for (let property of Object.keys(character)) {
      if (property !== "url" && character[property].toString().includes("https://anapioficeandfire.com/api/")) {
        let urlArr = character[property].toString().split(",")
        let valueArr = []
        for (let url of urlArr) {
          try {
            const data = await sendRequest("GET", url)
            valueArr.push(data.name)
          } catch (e) {
            console.log(`Error: ${e}`)
            valueArr.push("")
          }
        }
        createDetailItem(`${property}:`, valueArr.join(", "))
        continue
      }

      createDetailItem(`${property}:`, character[property])
    }
  }

    function createDetailItem(title, value) {
      detailsDiv.append(`<div class='detail-item'>
        <div class="detail-item-title">${title}</div>
        <div class="detail-item-value">${value}</div>
    </div>`);
    }

    function isNearBottom() {
      return listDiv.scrollTop() + listDiv.innerHeight() >= listDiv[0].scrollHeight - 400;
    }

    listDiv.on("scroll", () => {
      if (isNearBottom() && !loading && !isEnd) {
        loading = true;
        setUpSideBar();
      }
    });


    setUpSideBar()
      .then(() => {
        $(".list-item").first().click()
      })
  }

)
