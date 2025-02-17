var json;
var types;
var selectionPool;

var currentPokemon;
var currentGender; // TODO: currentShiny ??
var currentFormIdx;
var currentVariantIdx;

const pokemon_img = document.getElementById("pokemon_img");
const pokemon_name = document.getElementById("pokemon_name");
const types_container = document.getElementById("types_container");
const forms_container = document.getElementById("forms_container");

const sprite_source_dropdown = document.getElementById("sprite_source_dropdown");

const button_gender = document.getElementById("button_gender");
const label_gender = document.getElementById("label_gender");
const shiny_checkbox = document.getElementById("switch_checkbox_shiny");
const shiny_chance = document.getElementById("shiny_chance");

const Genders = Object.freeze({
    FEMALE: 0,
    MALE: 1,
    GENDERLESS: 2
});

const nameCorrections = {
    "Nidoran F": "Nidoran♀",
    "Nidoran M": "Nidoran♂",
    "Jangmo O": "Jangmo-o",
    "Hakamo O": "Hakamo-o",
    "Kommo O": "Kommo-o",
    "Type Null": "Type: Null",
    "Flabebe": "Flabébé"
}

const formCorrections = {
    "Gmax": "Gigantamax",
    "Alola": "Alolan",
    "Galar": "Galarian",
    "Hisui": "Hisuian",
    "Paldea": "Paldean"
}

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
                    gender_rate
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
    
    modJson();
    
    generate();
}

// Make a few changes to the data
function modJson() {
    // Remove Totem forms
    json[19]["pokemon_v2_pokemons"].splice(2); // Raticate
    json[104]["pokemon_v2_pokemons"].splice(2); // Marowak
    json[734]["pokemon_v2_pokemons"].splice(1); // Gumshoos
    json[737]["pokemon_v2_pokemons"].splice(1); // Vikavolt
    json[742]["pokemon_v2_pokemons"].splice(1); // Ribombee
    json[751]["pokemon_v2_pokemons"].splice(1); // Araquanid
    json[753]["pokemon_v2_pokemons"].splice(1); // Lurantis
    json[757]["pokemon_v2_pokemons"].splice(1); // Salazzle
    json[776]["pokemon_v2_pokemons"].splice(1); // Togedemaru
    json[777]["pokemon_v2_pokemons"].splice(2); // Mimikyu
    json[783]["pokemon_v2_pokemons"].splice(1); // Kommo-o

    // Merge Pokemon where genders are sperate forms
    const offenders = [677, 875, 901, 915] // Meowstic, Indeedee, Basculegion, Oinkologne
    for (const offender in offenders) {
        const i = offenders[offender];
        const name = json[i]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"];
        json[i]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = name.replace("-male", "");
        json[i]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
        const sprites1 = json[i]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["pokemon_v2_pokemon"]["pokemon_v2_pokemonsprites"][0]["sprites"];
        const sprites2 = json[i]["pokemon_v2_pokemons"][1]["pokemon_v2_pokemonforms"][0]["pokemon_v2_pokemon"]["pokemon_v2_pokemonsprites"][0]["sprites"];
        
        sprites1["front_female"] = sprites2["front_default"];
        sprites1["front_shiny_female"] = sprites2["front_shiny"];
    
        sprites1["other"]["official-artwork"]["front_female"] = sprites2["other"]["official-artwork"]["front_default"];
        sprites1["other"]["official-artwork"]["front_shiny_female"] = sprites2["other"]["official-artwork"]["front_shiny"];
        sprites1["other"]["home"]["front_female"] = sprites2["other"]["home"]["front_default"];
        sprites1["other"]["home"]["front_shiny_female"] = sprites2["other"]["home"]["front_shiny"];
        sprites1["other"]["showdown"]["front_female"] = sprites2["other"]["showdown"]["front_default"];
        sprites1["other"]["showdown"]["front_shiny_female"] = sprites2["other"]["showdown"]["front_shiny"];
    
        sprites1["versions"]["generation-v"]["black-white"]["front_female"] = sprites2["versions"]["generation-v"]["black-white"]["front_default"];
        sprites1["versions"]["generation-v"]["black-white"]["front_shiny_female"] = sprites2["versions"]["generation-v"]["black-white"]["front_shiny"];
        sprites1["versions"]["generation-vi"]["x-y"]["front_female"] = sprites2["versions"]["generation-vi"]["x-y"]["front_default"];
        sprites1["versions"]["generation-vi"]["x-y"]["front_shiny_female"] = sprites2["versions"]["generation-vi"]["x-y"]["front_shiny"];
        sprites1["versions"]["generation-vi"]["omegaruby-alphasapphire"]["front_female"] = sprites2["versions"]["generation-vi"]["omegaruby-alphasapphire"]["front_default"];
        sprites1["versions"]["generation-vi"]["omegaruby-alphasapphire"]["front_shiny_female"] = sprites2["versions"]["generation-vi"]["omegaruby-alphasapphire"]["front_shiny"];
        sprites1["versions"]["generation-vii"]["ultra-sun-ultra-moon"]["front_female"] = sprites2["versions"]["generation-vii"]["ultra-sun-ultra-moon"]["front_default"];
        sprites1["versions"]["generation-vii"]["ultra-sun-ultra-moon"]["front_shiny_female"] = sprites2["versions"]["generation-vii"]["ultra-sun-ultra-moon"]["front_shiny"];    
    
        json[i]["pokemon_v2_pokemons"].splice(1);
    }

    // Remove forms without visual differences
    json[413]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "mothim";
    json[413]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    json[413]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);

    json[648]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1); // Genesect

    json[663]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "scatterbug";
    json[663]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    json[663]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);

    json[664]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "spewpa";
    json[664]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    json[664]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);

    json[709]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "pumpkaboo";
    json[709]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    json[709]["pokemon_v2_pokemons"].splice(1);

    json[710]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "gourgeist";
    json[710]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    json[710]["pokemon_v2_pokemons"].splice(1);

    json[715]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "xerneas";
    json[715]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    json[715]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);

    json[717]["pokemon_v2_pokemons"].splice(1, 2); // Zygarde

    json[773]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "minior-meteor";
    json[773]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "meteor";
    json[773]["pokemon_v2_pokemons"].splice(1, 6);

    json[848]["pokemon_v2_pokemons"][2]["pokemon_v2_pokemonforms"][0]["name"] = "toxtricity-gmax";
    json[848]["pokemon_v2_pokemons"].splice(3);

    json[853]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "sinistea";
    json[853]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    json[853]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);

    json[854]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "polteageist";
    json[854]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    json[854]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);

    json[1006]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "koraidon";
    json[1006]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    json[1006]["pokemon_v2_pokemons"].splice(1);

    json[1007]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "miraidon";
    json[1007]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    json[1007]["pokemon_v2_pokemons"].splice(1);

    json[1011]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "poltchageist";
    json[1011]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    json[1011]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);

    json[1012]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "sinistcha";
    json[1012]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    json[1012]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);
}

function generate() {
    currentPokemon = selectionPool[randInt(selectionPool.length)];

    currentGender = decideGender();
    //gender_checkbox.checked = currentGender != Genders.FEMALE;
    //gender_checkbox.indeterminate = currentGender == Genders.GENDERLESS; // Not yet! Do this in setPokemon when sprite is being set
    shiny_checkbox.checked = decideShiny();

    setPokemon();
}

function randInt(max) {
    return Math.floor(Math.random() * max);
}

function decideGender() {
    const genderRate = currentPokemon["gender_rate"];

    if (genderRate == -1) { 
        return Genders.GENDERLESS;
    } else {
        const genderRoll = randInt(8);

        if (genderRoll < genderRate) {
            return Genders.FEMALE;
        } else {
            return Genders.MALE;
        }
    } 

    if (getVariant(currentFormIdx, currentVariantIdx)["form_name"] == "mega" ||
        getVariant(currentFormIdx, currentVariantIdx)["form_name"] == "gmax"
    ) {
        return true; //TODO: Implement indeterminate option
    } else {
        const lskdjflj = randInt(2);
        console.log(lskdjflj);
        return lskdjflj == 1;
    }
}

function decideShiny() {
    const shinyThresh = shiny_chance.valueAsNumber;
    const shinyRoll = randInt(4096);
    return shinyRoll < shinyThresh;
}

function setPokemon(formIdx=-1, variantIdx=-1) {
    types_container.innerHTML = "";
    forms_container.innerHTML = "";

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

    button_gender.classList = ["button_gender"]
    if (currentGender == Genders.FEMALE) {
        button_gender.classList.add("female");
    } else if (currentGender == Genders.MALE) {
        button_gender.classList.add("male");
    }

    if (getVariant(formIdx, variantIdx)["pokemon_v2_pokemon"]["pokemon_v2_pokemonsprites"][0]["sprites"]["front_female"] == null) {
        button_gender.disabled = true;
    } else {
        button_gender.disabled = false;
    }

    setSprite();

    setName();

    setTypes();

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
    label_gender.innerHTML = "Placeholder text";
    const pokemonVariant = getVariant(currentFormIdx, currentVariantIdx);

    var genderShiny = "front";

    if (shiny_checkbox.checked) {
        genderShiny += "_shiny";
    }

    if (!button_gender.disabled) {
        if (fetchSprite(pokemonVariant, genderShiny + "_female") == null) {
            label_gender.innerHTML = "Sprite source only contains default gender";
        } else if (currentGender == Genders.FEMALE) {
            genderShiny += "_female";
        }
    }
    
    if (genderShiny == "front") {
        genderShiny += "_default";
    }

    pokemon_img.src = fetchSprite(pokemonVariant, genderShiny);
}

function fetchSprite(pokemonVariant, genderShiny) {
    var spriteSource = pokemonVariant["pokemon_v2_pokemon"]["pokemon_v2_pokemonsprites"][0]["sprites"];
    const spritePath = sprite_source_dropdown.value.split(" ");
    if (spritePath != "pokeapi") {
        for (const idk in spritePath) {
            spriteSource = spriteSource[spritePath[idk]];
        }
    }

    return spriteSource[genderShiny];
}

function setName() {
    const dexDigits = Math.floor(Math.log10(json.length) + 1);
    const dexString = currentPokemon["id"].toString().padStart(dexDigits, "0");

    var fullName;

    // In case of two-word names
    const pokemonNameParts = currentPokemon["name"].split("-");
    for (let i = 0; i < pokemonNameParts.length; i++) {
        pokemonNameParts[i] = capitalizeFirstLetter(pokemonNameParts[i]);
    }
    const pokemonName = pokemonNameParts.join(" ");
    const pokemonPrettyName = nameCorrections[pokemonName] ?? pokemonName;

    const pokemonVariant = getVariant(currentFormIdx, currentVariantIdx);
    const formNameParts = pokemonVariant["form_name"].split("-");
    for (let i = 0; i < formNameParts.length; i++) {
        const formName = capitalizeFirstLetter(formNameParts[i]);
        formNameParts[i] = formCorrections[formName] ?? formName;
    }

    if (formNameParts.length == 0) {
        fullName = pokemonPrettyName;
    } else if (formNameParts.length == 1) {
        if (pokemonPrettyName == "Unown") {
            fullName = pokemonPrettyName + " " + formNameParts[0];
        } else if ((pokemonPrettyName == "Shellos") || (pokemonPrettyName == "Gastrodon")) {
            fullName = formNameParts[0] + " Sea " + pokemonPrettyName;
        } else if (pokemonPrettyName == "Shaymin") {
            fullName = formNameParts[0] + " Forme " + pokemonPrettyName;
        } else if (pokemonPrettyName == "Zygarde") {
            if (formNameParts[0] == "Complete") {
                fullName = pokemonPrettyName + " " + formNameParts[0] + " Forme"
            } else {
                fullName = pokemonPrettyName + " " + formNameParts[0] + "% Forme"
            }
        } else {
            fullName = formNameParts[0] + " " + pokemonPrettyName;
        }
    } else {
        if ((formNameParts[0] == "Mega") && 
            ((formNameParts[1] == "X") ||
             (formNameParts[1] == "Y"))) { // "X"/"Y" comes after the pokemon name
            fullName = formNameParts[0] + " " + pokemonPrettyName + " " + formNameParts[1];
        } else if ((pokemonPrettyName == "Tauros") && (formNameParts[0] == "Paldean")) {
            fullName = formNameParts[1] + " " + formNameParts[2] + " " + formNameParts[0] + pokemonPrettyName;
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
                    form_img.onclick = () => setPokemon(form, variant); // TODO: Perhaps I need to make a function that is more specialized
                    form_img.classList.add("clickable");
                }
            }

            const pokemonVariant = getVariant(form, variant);
            form_img.src = pokemonVariant["pokemon_v2_pokemon"]["pokemon_v2_pokemonsprites"][0]["sprites"]["other"]["official-artwork"]["front_default"];
            
            forms_container.appendChild(form_img);
        }
    }
}

function switchGender() {
    if (currentGender == Genders.FEMALE) {
        currentGender = Genders.MALE;
    } else if (currentGender == Genders.MALE) {
        currentGender = Genders.FEMALE;
    }

    setPokemon(currentFormIdx, currentVariantIdx);
}

// -------------------- Event handlers -------------------- //

sprite_source_dropdown.addEventListener("change", setSprite);

shiny_checkbox.addEventListener("change", () => {
    setSprite();
})
