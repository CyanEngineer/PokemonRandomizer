var json;
var types;
var selectionPool;
const pokemon_img = document.getElementById("pokemon_img");
const pokemon_name = document.getElementById("pokemon_name");
const forms_container = document.getElementById("forms_container");
// Species > variety > form > gender > shiny > artworks

setup();

async function setup() {

    /* Figure out what I'm gonna do with types...
    fetch("https://pokeapi.co/api/v2/type?limit=100")
        .then(async response => {
            if (!response.ok) {
                console.log(response);
                //TODO: Handle
            } else {
                const res = await response.json();
                console.log(res["results"]) //TODO: Delete this
            }
        });
    */

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

    setPokemon(pokemon);
}

function randInt(max) {
    return Math.floor(Math.random() * max);
}

function setPokemon(pokemon, formIdx=-1) {
    forms_container.innerHTML = ""

    const pokemonForms = pokemon["pokemon_v2_pokemons"];
    if (formIdx == -1) {
        formIdx = selectFormIdx(pokemonForms)
    }
    const pokemonForm = pokemonForms[formIdx];

    const sprite = selectSprite(pokemonForm);

    setSprite(sprite);

    setName(pokemon["id"], pokemonForm, pokemon["name"]);

    setAlternateForms(pokemon, formIdx);
}

function selectFormIdx(pokemonForms) {
    //TODO: Implement selection filtering
    const formIdx = randInt(pokemonForms.length);
    return formIdx;
}

function capitalizeFirstLetter(str) {
    return str.substring(0,1).toUpperCase() + str.substring(1);
}

function selectSprite(pokemonForm) {
    //TODO: Implement selection logic
    //const spriteSource = 
    return pokemonForm["pokemon_v2_pokemonforms"][0]["pokemon_v2_pokemon"]["pokemon_v2_pokemonsprites"][0]["sprites"]["other"]["official-artwork"]["front_default"];
}

function setSprite(sprite) {
    pokemon_img.src = sprite;
}

function setName(dexNumber, pokemonForm, pokemonName) {
    const dexDigits = Math.floor(Math.log10(json.length) + 1);
    const dexString = dexNumber.toString().padStart(dexDigits, "0");

    var fullName;

    const pokemonNameParts = pokemonName.split("-"); // In case of two-word names
    for (let i = 0; i < pokemonNameParts.length; i++) {
        pokemonNameParts[i] = capitalizeFirstLetter(pokemonNameParts[i]);
    }
    const pokemonPrettyName = pokemonNameParts.join(" ");

    const formNameParts = pokemonForm["pokemon_v2_pokemonforms"][0]["form_name"].split("-");
    for (let i = 0; i < formNameParts.length; i++) {
        formNameParts[i] = capitalizeFirstLetter(formNameParts[i]);
    }

    if (formNameParts.length == 0) {
        fullName = pokemonPrettyName;
    } else if (formNameParts.length == 1) {
        fullName = formNameParts[0] + " " + pokemonPrettyName;
    } else {
        if (formNameParts[0] == "Mega") { // "X"/"Y" comes after the pokemon name
            fullName = formNameParts[0] + " " + pokemonPrettyName + " " + formNameParts[1];
        } else {
            
            fullName = formNameParts.join(" ") + " " + pokemonPrettyName;
        }
    }

    pokemon_name.innerHTML = "#" + dexString + " " + fullName;
}

function setAlternateForms(pokemon, formIdx) {
    const pokemonForms = pokemon["pokemon_v2_pokemons"];
    for (const form in pokemonForms) {
        const form_img = document.createElement("img");
        form_img.classList.add("form_img");
        if ((pokemonForms.length > 1) && (form == formIdx)) {
            form_img.classList.add("current_form");
        }
        form_img.src = selectSprite(pokemonForms[form]);
        forms_container.appendChild(form_img);
    }
}