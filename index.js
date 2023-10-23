import { loadData } from "./js/index.js"; 


const gender = document.getElementById('gender')
const culture = document.getElementById('culture')
const born = document.getElementById("born")
const died = document.getElementById('died') 
const titles = document.getElementById('titles')
const aliases = document.getElementById('aliases')
const father = document.getElementById('father')
const mother = document.getElementById('mother')
const spouse = document.getElementById('spouse')
const books = document.getElementById('books')
const povBooks = document.getElementById('povBooks')
const playedBy = document.getElementById('playedBy')
const title = document.getElementById('title')



let currentPage = 1;
let active = ''

const defaultCharacter = async () => {
    const dom_character = document.getElementById(`character_1`)
    const data_character = await loadData('https://anapioficeandfire.com/api/characters/1')
    active = dom_character.id;
    dom_character.classList.add('active')

    setDataAbout(data_character)
}

const setDataAbout = (data_character) => {
    title.textContent = data_character.name
    gender.textContent = data_character.gender
    culture.textContent = data_character.culture
    born.textContent = data_character.born
    died.textContent = data_character.died
    titles.textContent = data_character.titles
    aliases.textContent = data_character.aliases
    father.textContent = data_character.father
    mother.textContent = data_character.mother
    spouse.textContent = data_character.spouse
    books.textContent = data_character.books
    povBooks.textContent = data_character.povBooks
    playedBy.textContent = data_character.playedBy
}


const characters = async (data_character) => {
    
   let url_character = `https://anapioficeandfire.com/api/characters/?page=${currentPage}`
    
   const data = await loadData(url_character)
   const container_characters = document.getElementById('characters')

   const characters = data

   await characters.forEach(async (character) => {       
            const item_character = document.createElement('div')
            const number_character = character.url.split('/')[5] 
            
            item_character.className = "character"
            item_character.textContent = `character ${number_character}`
            item_character.id = `character_${number_character}`
            item_character.addEventListener('click', async () => {
            
                const data_character = await loadData(character.url)
                
                if(active != ''){
                    console.log(active)
                   const character_active = document.getElementById(active)
                   character_active.classList.remove('active')
                }    
                
                const dom_character = document.getElementById(`character_${number_character}`)
                active = dom_character.id;
                dom_character.classList.add('active')

                setDataAbout(data_character)
            })
            console.log(currentPage)
            container_characters.appendChild(item_character)
   });

   if(currentPage == 1){
    defaultCharacter()
  }
  
   currentPage++;
}

const btn_load = document.getElementById('more')

characters()

btn_load.addEventListener('click', characters)