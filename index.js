let ul = document.querySelector(".ul")
let page = -1;
let size = 5;
let loading = false

let nameElement = document.getElementById("name");
let genderElement = document.getElementById("gender");
let cultureElement = document.getElementById("culture");
let bornElement = document.getElementById("born");
let diedElement = document.getElementById("died");
let titlesElement = document.getElementById("titles");
let aliasesElement = document.getElementById("aliases");
let fatherElement = document.getElementById("father");
let motherElement = document.getElementById("mother");
let spouseElement = document.getElementById("spouse");
let booksElement = document.getElementById("books");
let povBooksElement = document.getElementById("povBooks");
let playedByElement = document.getElementById("playedBy");

function getCharacters() {
    loading = true;
    return fetch(`https://www.anapioficeandfire.com/api/characters?page=${page}&pageSize=${size}`).then(res => {
        return res.json().then(json => {
           return json
        }).finally(() => {
            loading = false;
        });
    })
}

function bio(index) {
    fetch(`https://www.anapioficeandfire.com/api/characters/${index}`).then(res => {
        res.json().then(json => {
            nameElement.textContent = json.name;
            genderElement.textContent = "gender: " + json.gender;
            bornElement.textContent = "born: " + json.born;
            diedElement.textContent = "died: " + json.died;
            titlesElement.textContent = "titles: " + json.titles;
            aliasesElement.textContent = "aliases: " + json.aliases;
            fatherElement.textContent = "father: " + json.father;
            motherElement.textContent = "mother: " + json.mother;
            spouseElement.textContent = "spouse: " + json.spouse;
            booksElement.textContent = "books: " + json.books.toString().replaceAll(",", ", ");
            povBooksElement.textContent = "povBooks: " + json.povBooks;
            playedByElement.textContent = "played by: " + json.playedBy;

        })
    })
}
 


function renew() {
    if (loading) {
        return; 
    }

    page++;
    getCharacters().then(json => {
        for (let i = 0; i < json.length; i++) {
            ul.innerHTML += `<li tabindex="${page * size + i + 1}" class="li">${page * size + i + 1} Character</li>`;
        }
    });
}

document.getElementById("button").addEventListener("click", () => {
    renew();
});
ul.addEventListener("scroll", () => {
    if (ul.scrollTop > ul.scrollHeight * 0.6) {
        renew()
    }
})

ul.addEventListener("click", (e) => {
    bio(e.target.tabIndex)
})

renew()