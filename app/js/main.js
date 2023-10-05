document.addEventListener("DOMContentLoaded", async function () {
    const listDiv = document.querySelector("#character-list");
    const detailsDiv = document.querySelector("#character-details");
    const characterName = document.querySelector(".character-name");
    let page = 1;
    const pageSize = 30;
    let isEnd = false;
    let loading = false;

    async function fetchData(type, url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error("Error:", error);
            throw error;
        }
    }

    function createSidebarListItem(number, name) {
        const listItem = document.createElement("div");
        listItem.textContent = `Character ${number}`;
        listItem.classList.add("list-item");
        listItem.addEventListener("click", () => {
            document.querySelectorAll(".list-item").forEach(item => item.classList.remove("active"));
            listItem.classList.add("active");
            showListItem(number);
        });
        return listItem;
    }

    async function showListItem(number) {
        const requestUrl = `https://anapioficeandfire.com/api/characters/${number}`;
        try {
            const character = await fetchData("GET", requestUrl);

            if (character.name == '') {
                characterName.textContent = 'Unknown'
            } else {
                characterName.textContent = character.name;
            }
           
            fillCharacterInfo(character);
        } catch (error) {
            console.error("Error:", error);
        }
    }

    function fillCharacterInfo(character) {
        while (detailsDiv.firstChild) {
            detailsDiv.removeChild(detailsDiv.firstChild);
        }

        const characterInfo = {
            "gender": character.gender || "Unknown",
            "culture": character.culture || "Unknown",
            "born": character.born || "Unknown",
            "died": character.died || "Unknown",
            "titles": character.titles.join(', ') || "Unknown",
            "aliases": character.aliases.join(', ') || "Unknown",
            "father": character.father || "Unknown",
            "mother": character.mother || "Unknown",
            "spouse": character.spouse || "Unknown",
            "books": extractBookNames(character.books) || "Unknown",
            "povBooks": extractPovBookNames(character.povBooks) || "Unknown",
            "playedBy": character.playedBy || "Unknown",
        };

        for (const property of Object.keys(characterInfo)) {
            createDetailItem(`${property}:`, characterInfo[property]);
        }
    }

    function extractBookNames(books) {
        if (!books || books.length === 0) {
            return "Unknown";
        }
        return books.map(extractBookName).join(', ');
    }

    function extractPovBookNames(povBooks) {
        if (!povBooks || povBooks.length === 0) {
            return "Unknown";
        }
        return povBooks.map(extractBookName).join(', ');
    }

    function extractBookName(bookUrl) {
        const match = /\/api\/books\/(\d+)/.exec(bookUrl);
        return match ? `book${match[1]}` : "Unknown";
    }

    function createDetailItem(title, value) {
        const detailItem = document.createElement("div");
        detailItem.className = 'detail-item';
        detailItem.innerHTML = `
            <div class="detail-item-title">${title}</div>
            <div class="detail-item-value ${value === 'Unknown' ? 'Unknown' : ''}">${value}</div>
        `;
        detailsDiv.appendChild(detailItem);
    }

    function isNearBottom() {
        return listDiv.scrollTop + listDiv.clientHeight >= listDiv.scrollHeight - 400;
    }

    listDiv.addEventListener("scroll", () => {
        if (isNearBottom() && !loading && !isEnd) {
            loading = true;
            setupSidebar();
        }
    });

    async function setupSidebar() {
        if (isEnd) {
            return;
        }

        const requestUrl = `https://www.anapioficeandfire.com/api/characters?page=${page}&pageSize=${pageSize}`;
        try {
            const characters = await fetchData("GET", requestUrl);
            page++;

            if (characters.length === 0) {
                isEnd = true;
                return;
            }

            characters.forEach((character) => {
                const number = character.url.split("/").pop();
                listDiv.appendChild(createSidebarListItem(number, character.name));
            });

            loading = false;
        } catch (error) {
            console.error("Error:", error);
        }
    }

    try {
        await setupSidebar();
        const firstListItem = document.querySelector(".list-item");
        if (firstListItem) {
            firstListItem.click();
        }
    } catch (error) {
        console.error("Error:", error);
    }
});
