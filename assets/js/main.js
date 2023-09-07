const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')

const maxRecords = 151
const limit = 10
let offset = 0;
const CONVERSOR_CM = 2.54;

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}" data-bs-toggle="modal" data-bs-target="#pokemonDetailModal" onclick="openModalPokemoDetail(${pokemon.number})">
            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map((type) => `<li class="type ${type}">${type}</li>`).join('')}
                </ol>

                <img src="${pokemon.photo}"
                     alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then((pokemons = []) => {
        const newHtml = pokemons.map(convertPokemonToLi).join('')
        pokemonList.innerHTML += newHtml
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit
    const qtdRecordsWithNexPage = offset + limit

    if (qtdRecordsWithNexPage >= maxRecords) {
        const newLimit = maxRecords - offset
        loadPokemonItens(offset, newLimit)

        loadMoreButton.parentElement.removeChild(loadMoreButton)
    } else {
        loadPokemonItens(offset, limit)
    }
})

function openModalPokemoDetail(id){
    let modal = document.querySelector('.modal-content');  

    modal.innerHTML = `    
        <div class="modal-content">
        <div class="modal-header ${pokemonDetailsForModal[id].types[0].type.name}">
        <h5 class="modal-title " >${pokemonDetailsForModal[id].name} </h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body ${pokemonDetailsForModal[id].types[0].type.name} row">
            <div class="pokemon-image col-12 col-md-6">
                <span>
                    #${pokemonDetailsForModal[id].id}
                </span>
                <img class="img-fluid pokemon-image" src="${pokemonDetailsForModal[id].sprites.other['official-artwork'].front_default }" alt="">
            </div>
            <div class="pokemon-detail col-12 col-md-6">
                <ul class="types">
                ${pokemonDetailsForModal[id].types.map((type) => `<li class="type ${type.type.name}">${type.type.name}</li>`).join('')}
                </ul>   
                <div class="details">
                    <p>Height: ${pokemonDetailsForModal[id].height * CONVERSOR_CM} cm</p>
                    ${pokemonDetailsForModal[id].stats.map((stat) => ` <p>${stat.stat.name}: ${stat.base_stat} </p>`).join('')}
                </div>        
            </div>
        </div>
        <div class="modal-footer ${pokemonDetailsForModal[id].types[0].type.name}">
            <p>${pokemonDetailsForModal[id].name} has ${pokemonDetailsForModal[id].moves.length} movements and main type is ${pokemonDetailsForModal[id].types[0].type.name} </p>
        </div>
    </div> `
}