var json;
var selectionPool;
const pokemon_img = document.getElementById("pokemon_img");
// Species > variety > form > gender > shiny > artworks

setup();

async function setup() {

    await fetch("https://beta.pokeapi.co/graphql/v1beta", {
        method: 'POST',
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `query pokeAPIquery {
                species: pokemon_v2_pokemonspecies(order_by: {id: asc}) {
                    id
                    name
                    is_baby
                    is_legendary
                    is_mythical
                    pokemon_v2_evolutionchain {
                        pokemon_v2_pokemonspecies(order_by: {id: asc}) {
                            id
                            name
                            evolves_from_species_id
                        }
                    }
                    pokemon_v2_generation {
                        id
                        name
                    }
                    pokemon_v2_pokemons {
                        pokemon_v2_pokemonforms {
                            name
                            form_name
                            pokemon_v2_pokemon {
                                pokemon_v2_pokemonsprites {
                                    sprites
                                }
                            }
                        }
                        pokemon_v2_pokemontypes {
                            pokemon_v2_type {
                                name
                            }
                        }
                    }
                }
            }`
        })
    })
        .then(async response => {
            if (!response.ok) {
                console.log(response);
                //TODO: Handle
            } else {
                const res = await response.json();
                json = res["data"]["species"];
                selectionPool = json;
                console.log(json) //TODO: Delete this
            }
        });
    
    generate();
}

function generate() {

    const pokemon = selectionPool[randInt(selectionPool.length)];

    const pokemonForm = selectForm(pokemon);

    const sprite = selectSprite(pokemonForm);

    setSprite(sprite);
}

function randInt(max) {
    return Math.floor(Math.random() * max);
}

function selectForm(pokemon) {
    //TODO: Implement selection logic
    const pokemonForms = pokemon["pokemon_v2_pokemons"];
    const formIdx = randInt(pokemonForms.length);
    return pokemonForms[formIdx];
}

function selectSprite(pokemonForm) {
    //TODO: Implement selection logic
    //const spriteSource = 
    return pokemonForm["pokemon_v2_pokemonforms"][0]["pokemon_v2_pokemon"]["pokemon_v2_pokemonsprites"][0]["sprites"]["other"]["official-artwork"]["front_default"];
}

function setSprite(sprite) {
    pokemon_img.src = sprite;
}