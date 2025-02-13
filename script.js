var json;
var types;
var selectionPool;

var currentPokemon;
var currentFormIdx;
var currentVariantIdx;

const pokemon_img = document.getElementById("pokemon_img");
const pokemon_name = document.getElementById("pokemon_name");
const types_container = document.getElementById("types_container");
const forms_container = document.getElementById("forms_container");

const sprite_source_dropdown = document.getElementById("sprite_source_dropdown");

const gender_checkbox = document.getElementById("switch_checkbox_gender");
const shiny_checkbox = document.getElementById("switch_checkbox_shiny");
const shiny_chance = document.getElementById("shiny_chance");
// Species > variety > form > gender > shiny > artworks

setup();

async function setup() {

    fetch("types.json")
        .then(async response => {
            if (!response.ok) {
                console.log(response);
                //TODO: Handle
            } else {
                const res = await response.json();
                types = res;
            }
        });

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
                    has_gender_differences
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
    
    //TODO: Shiny chance
    shiny_checkbox.checked = decideShiny();

    currentPokemon = selectionPool[randInt(selectionPool.length)];

    setPokemon();
}

function decideShiny() {
    const shinyThresh = shiny_chance.valueAsNumber;
    const shinyValue = randInt(4096);
    return shinyValue < shinyThresh;
}

function randInt(max) {
    return Math.floor(Math.random() * max);
}

function setPokemon(formIdx=-1, variantIdx=-1) {
    types_container.innerHTML = "";
    forms_container.innerHTML = "";
    //sprite_source_dropdown.innerHTML = "";

    const pokemonForms = currentPokemon["pokemon_v2_pokemons"];
    if (formIdx == -1) {
        formIdx = selectFormIdx(pokemonForms);
    }
    currentFormIdx = formIdx;
    const pokemonForm = pokemonForms[currentFormIdx];

    const pokemonVariants = pokemonForm["pokemon_v2_pokemonforms"];
    if (variantIdx == -1) {
        variantIdx = selectVariantIdx(pokemonVariants);
    }
    currentVariantIdx = variantIdx;

    setSprite();

    setName();

    setTypes();

    //setSpriteSources();

    setAlternateForms();
}

function selectFormIdx(pokemonForms) {
    //TODO: Implement selection filtering
    const formIdx = randInt(pokemonForms.length);
    return formIdx;
}

function getForm(formIdx) {
    return currentPokemon["pokemon_v2_pokemons"][formIdx];
}

function selectVariantIdx(pokemonVariants) {
    //TODO: Implement selection filtering
    const variantIdx = randInt(pokemonVariants.length);
    return variantIdx;
}

function getVariant(formIdx, variantIdx) {
    return getForm(formIdx)["pokemon_v2_pokemonforms"][variantIdx];
}

function capitalizeFirstLetter(str) {
    return str.substring(0,1).toUpperCase() + str.substring(1);
}

function setSprite() {
    pokemon_img.src = selectSprite();
}

function selectSprite(formIdx=currentFormIdx, variantIdx=currentVariantIdx, defaultSprite=false) {
    //TODO: Implement selection logic
    const pokemonVariant = getVariant(formIdx, variantIdx);

    if (defaultSprite) {
        return pokemonVariant["pokemon_v2_pokemon"]["pokemon_v2_pokemonsprites"][0]["sprites"]["other"]["official-artwork"]["front_default"];
    } else {
        var genderShiny = "front";
        if (gender_checkbox.checked && !shiny_checkbox.checked) {
            genderShiny += "_default";
        } else {
            if (shiny_checkbox.checked) {
                genderShiny += "_shiny";
            }
            if (!gender_checkbox.checked) {
                genderShiny += "_female";
            }
        }

        var spriteSource = pokemonVariant["pokemon_v2_pokemon"]["pokemon_v2_pokemonsprites"][0]["sprites"];
        const spritePath = sprite_source_dropdown.value.split(" ");
        if (spritePath != "pokeapi") {
            for (const idk in spritePath) {
                spriteSource = spriteSource[spritePath[idk]];
            }
        }

        return spriteSource[genderShiny];
    }
}

function setName() {
    const dexDigits = Math.floor(Math.log10(json.length) + 1);
    const dexString = currentPokemon["id"].toString().padStart(dexDigits, "0");

    var fullName;

    const pokemonNameParts = currentPokemon["name"].split("-"); // In case of two-word names
    for (let i = 0; i < pokemonNameParts.length; i++) {
        pokemonNameParts[i] = capitalizeFirstLetter(pokemonNameParts[i]);
    }
    const pokemonPrettyName = pokemonNameParts.join(" ");

    const pokemonVariant = getVariant(currentFormIdx, currentVariantIdx);
    const formNameParts = pokemonVariant["form_name"].split("-");
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

function setTypes() {
    const pokemonForm = getForm(currentFormIdx);
    const pokemonTypes = pokemonForm["pokemon_v2_pokemontypes"];
    for (const type in pokemonTypes) {
        const typeName = pokemonTypes[type]["pokemon_v2_type"]["name"]
        const type_img = document.createElement("img");
        type_img.src = types[typeName];
        types_container.appendChild(type_img);
    }
}

function setAlternateForms() {
    const pokemonForms = currentPokemon["pokemon_v2_pokemons"];
    for (const form in pokemonForms) {

        const pokemonVariants = pokemonForms[form]["pokemon_v2_pokemonforms"];
        for (const variant in pokemonVariants) {
            const form_img = document.createElement("img");
            form_img.classList.add("form_img")

            if ((pokemonForms.length > 1) || (pokemonVariants.length > 1)) {
                if ((form == currentFormIdx) && (variant == currentVariantIdx)) {
                    form_img.classList.add("current_form");
                } else {
                    form_img.onclick = () => setPokemon(form, variant);
                    form_img.classList.add("clickable");
                }
            }

            form_img.src = selectSprite(form, variant, true);
            forms_container.appendChild(form_img);
        }
    }
}

// -------------------- Event handlers -------------------- //

sprite_source_dropdown.addEventListener("change", setSprite);

gender_checkbox.addEventListener("change", () => {
    setPokemon(currentFormIdx, currentVariantIdx);
})

shiny_checkbox.addEventListener("change", () => {
    setPokemon(currentFormIdx, currentVariantIdx);
})
