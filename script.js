// Data JSONs
var pokemonJson;
var typesJson;

// Current pokemon info
var currentPokemon;
var currentGender; // TODO: currentShiny ??
var currentGenderShiny;
var currentFormIdx;
var currentVariantIdx;

// Filter variables
var fullFilterPool;
var filterPool;

var validNTypes
var allTypes;
var validTypes;

var pokemonNameList;

// Filters elements
const input_name = document.getElementById("input_name");
const datalist_name = document.getElementById("datalist_name");

const checkbox_single_type = document.getElementById("checkbox_single_type");
const checkbox_dual_type = document.getElementById("checkbox_dual_type");
const radio_one_type = document.getElementById("radio_one_type");
const radio_two_types = document.getElementById("radio_two_types");
const type_grid = document.getElementById("type_grid");
const button_all_types = document.getElementById("button_all_types");
const button_no_types = document.getElementById("button_no_types");

// Randomizer elements
const pokemon_img_container = document.getElementById("pokemon_img_container");
const pokemon_img = document.getElementById("pokemon_img");
const pokemon_name = document.getElementById("pokemon_name");
const types_container = document.getElementById("types_container");
const forms_container = document.getElementById("forms_container");

const sprite_source_dropdown = document.getElementById("sprite_source_dropdown");

const button_gender = document.getElementById("button_gender");
const label_gender = document.getElementById("label_gender");
const shiny_checkbox = document.getElementById("switch_checkbox_shiny");
const shiny_chance = document.getElementById("shiny_chance");

// External links elements
const link_pokedex = document.getElementById("link_pokedex");
const link_bulba_wiki = document.getElementById("link_bulba_wiki");
const link_serebii = document.getElementById("link_serebii");
const link_pokemondb = document.getElementById("link_pokemondb");
const link_serebii_tcg = document.getElementById("link_serebii_tcg");
const link_bulba_tcg = document.getElementById("link_bulba_tcg");
const link_bulba_archive = document.getElementById("link_bulba_archive");
const link_spriters_resource = document.getElementById("link_spriters_resource");
const link_models_resource = document.getElementById("link_models_resource");

const Genders = Object.freeze({
    FEMALE: 0,
    MALE: 1,
    GENDERLESS: 2
});

const nameCorrections = {
    "Nidoran F": "Nidoran♀",
    "Nidoran M": "Nidoran♂",
    "Ho Oh": "Ho-Oh",
    "Jangmo O": "Jangmo-o",
    "Hakamo O": "Hakamo-o",
    "Kommo O": "Kommo-o",
    "Type Null": "Type: Null",
    "Flabebe": "Flabébé",
    "Wo Chien": "Wo-Chien",
    "Chien Pao": "Chien-Pao",
    "Ting Lu": "Ting-Lu",
    "Chi Yu": "Chi-Yu"
}

const formCorrections = {
    "Gmax": "Gigantamax",
    "Alola": "Alolan",
    "Galar": "Galarian",
    "Hisui": "Hisuian",
    "Paldea": "Paldean"
}

console.log('hello');

resetFilters();

setup();

function resetFilters() {
    input_name.value = "";
    checkbox_single_type.checked = true;
    checkbox_dual_type.checked = true;
    radio_one_type.checked = true;
}

async function setup() {
    // Fetch pokemon types
    await fetch("https://beta.pokeapi.co/graphql/v1beta", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            query: `query pokeAPIquery {
                types: pokemon_v2_type(
                    where: {
                        _and: [ 
                            {_not: {name: {_eq: "stellar"}}},
                            {_not: {name: {_eq: "unknown"}}},
                            {_not: {name: {_eq: "shadow"}}}
                        ]
                    }
                ) {
                    id
                    name
                    pokemonV2TypeefficaciesByTargetTypeId {
                        damage_factor
                        pokemon_v2_type {
                            name
                        }
                    }
                }
            }
            `
        })
    })
        .then(async response => {
            if (!response.ok) {
                console.log("An error occurred while fetching pokemon types");
                console.log(response);
            } else {
                const res = await response.json();
                const types = res['data']['types'];
                typesJson = {};
                for (const type of types) {
                    const efficacies = {};
                    for (const attackingType of type['pokemonV2TypeefficaciesByTargetTypeId']) {
                        efficacies[attackingType['pokemon_v2_type']['name']] = attackingType['damage_factor'];
                    }
                    typesJson[type['name']] = {
                        'icon': `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/types/generation-ix/scarlet-violet/${type['id']}.png`,
                        'efficacies': efficacies
                    }
                }

                allTypes = new Set(Object.keys(typesJson));
                validTypes = new Set(allTypes);

                populatePokemonTypes();
            }
        });

    // fetch pokemon
    await fetch("https://beta.pokeapi.co/graphql/v1beta", {
        method: "POST",
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
                console.log("We got an error:");
                console.log(response);
                //TODO: Handle
            } else {
                const res = await response.json();
                pokemonJson = res["data"]["species"];
                fullFilterPool = [...Array(pokemonJson.length).keys()];
                filterPool = fullFilterPool;
            }
        });
    
    modJson();

    console.log("Types JSON:");
    console.log(typesJson);
    
    console.log("Pokemon JSON:");
    console.log(pokemonJson);

    populateDataList();
    
    generate();
}

// Make a few changes to the data
function modJson() {
    // Inject pretty_name
    for (pokemon of pokemonJson) {
        pokemon["pretty_name"] = getPrettyName(pokemon["name"]);
    }

    // Remove Totem forms
    pokemonJson[19]["pokemon_v2_pokemons"].splice(2); // Raticate
    pokemonJson[104]["pokemon_v2_pokemons"].splice(2); // Marowak
    pokemonJson[734]["pokemon_v2_pokemons"].splice(1); // Gumshoos
    pokemonJson[737]["pokemon_v2_pokemons"].splice(1); // Vikavolt
    pokemonJson[742]["pokemon_v2_pokemons"].splice(1); // Ribombee
    pokemonJson[751]["pokemon_v2_pokemons"].splice(1); // Araquanid
    pokemonJson[753]["pokemon_v2_pokemons"].splice(1); // Lurantis
    pokemonJson[757]["pokemon_v2_pokemons"].splice(1); // Salazzle
    pokemonJson[776]["pokemon_v2_pokemons"].splice(1); // Togedemaru
    pokemonJson[777]["pokemon_v2_pokemons"].splice(2); // Mimikyu
    pokemonJson[783]["pokemon_v2_pokemons"].splice(1); // Kommo-o

    // Merge Pokemon where genders are sperate forms
    const offenders = [677, 875, 901, 915] // Meowstic, Indeedee, Basculegion, Oinkologne
    for (const offender of offenders) {
        const name = pokemonJson[offender]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"];
        pokemonJson[offender]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = name.replace("-male", "");
        pokemonJson[offender]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
        const sprites1 = pokemonJson[offender]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["pokemon_v2_pokemon"]["pokemon_v2_pokemonsprites"][0]["sprites"];
        const sprites2 = pokemonJson[offender]["pokemon_v2_pokemons"][1]["pokemon_v2_pokemonforms"][0]["pokemon_v2_pokemon"]["pokemon_v2_pokemonsprites"][0]["sprites"];
        
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
    
        pokemonJson[offender]["pokemon_v2_pokemons"].splice(1);
    }

    // Remove forms without visual differences
    pokemonJson[413]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "mothim";
    pokemonJson[413]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    pokemonJson[413]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);

    pokemonJson[648]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1); // Genesect

    pokemonJson[663]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "scatterbug";
    pokemonJson[663]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    pokemonJson[663]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);

    pokemonJson[664]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "spewpa";
    pokemonJson[664]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    pokemonJson[664]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);

    pokemonJson[709]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "pumpkaboo";
    pokemonJson[709]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    pokemonJson[709]["pokemon_v2_pokemons"].splice(1);

    pokemonJson[710]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "gourgeist";
    pokemonJson[710]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    pokemonJson[710]["pokemon_v2_pokemons"].splice(1);

    pokemonJson[715]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "xerneas";
    pokemonJson[715]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    pokemonJson[715]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);

    pokemonJson[717]["pokemon_v2_pokemons"].splice(1, 2); // Zygarde

    pokemonJson[773]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "minior-meteor";
    pokemonJson[773]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "meteor";
    pokemonJson[773]["pokemon_v2_pokemons"].splice(1, 6);

    pokemonJson[848]["pokemon_v2_pokemons"][2]["pokemon_v2_pokemonforms"][0]["name"] = "toxtricity-gmax";
    pokemonJson[848]["pokemon_v2_pokemons"].splice(3);

    pokemonJson[853]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "sinistea";
    pokemonJson[853]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    pokemonJson[853]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);

    pokemonJson[854]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "polteageist";
    pokemonJson[854]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    pokemonJson[854]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);

    pokemonJson[1006]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "koraidon";
    pokemonJson[1006]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    pokemonJson[1006]["pokemon_v2_pokemons"].splice(1);

    pokemonJson[1007]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "miraidon";
    pokemonJson[1007]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    pokemonJson[1007]["pokemon_v2_pokemons"].splice(1);

    pokemonJson[1011]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "poltchageist";
    pokemonJson[1011]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    pokemonJson[1011]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);

    pokemonJson[1012]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["name"] = "sinistcha";
    pokemonJson[1012]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][0]["form_name"] = "";
    pokemonJson[1012]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);
}

function getPrettyName(dataName) {
    const pokemonNameParts = dataName.split("-");
    for (let i = 0; i < pokemonNameParts.length; i++) {
        pokemonNameParts[i] = capitalizeFirstLetter(pokemonNameParts[i]);
    }
    const pokemonName = pokemonNameParts.join(" ");

    return nameCorrections[pokemonName] ?? pokemonName;
}

async function populateDataList() {
    
    pokemonNameList = Array(pokemonJson.length);
    const dexDigits = Math.floor(Math.log10(pokemonJson.length) + 1);

    for (let i=0; i<pokemonJson.length; i++) {
        const pokemon = pokemonJson[i];
        const dexString = pokemon["id"].toString().padStart(dexDigits, "0");
        const displayName = `#${dexString} ${pokemon["pretty_name"]}`;

        pokemonNameList[i] = displayName;

        const option = document.createElement("option");
        option.value = displayName;
        datalist_name.appendChild(option);
    }
}

async function populatePokemonTypes() {
    for (type of Object.entries(typesJson)) {
        const typeName = type[0];

        const type_checkbox = document.createElement("div");
        type_checkbox.classList = ["type_checkbox"];

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        const id = `checkbox_${typeName}`
        checkbox.id = id;
        checkbox.value = typeName;
        checkbox.classList = ["hidden_checkbox"];
        checkbox.onclick = () => togglePokemonType(checkbox);
        checkbox.checked = true;
        type_checkbox.appendChild(checkbox);

        const label = document.createElement("label");
        label.htmlFor = id;
        label.innerHTML = `<img class="type_img" src=${type[1]['icon']}>`;
        type_checkbox.appendChild(label);

        type_grid.appendChild(type_checkbox);
    }
}

function togglePokemonType(checkbox) {

    if (checkbox.checked) {
        validTypes.add(checkbox.value);
    } else {
        validTypes.delete(checkbox.value);
    }
}

function generate() {
    updateFilterPool();

    currentPokemon = pokemonJson[filterPool[randInt(filterPool.length)]];

    console.log(`Generated pokemon:`);
    console.log(currentPokemon);

    currentGender = decideGender();
    shiny_checkbox.checked = decideShiny();

    setPokemon();
}

function updateFilterPool() {
    filterPool = fullFilterPool;

    const pokemonNameListIdx = pokemonNameList.indexOf(input_name.value);

    // User has specified a specific pokemon
    if (pokemonNameListIdx > -1) { 
        filterPool = [pokemonNameListIdx];
        return;
    } else { // User has not specified a specific pokemon

        // Name
        const searchString = input_name.value.toLowerCase();
        filterPool = filterPool.filter((dexIdx) => pokemonJson[dexIdx]['pretty_name'].toLowerCase().includes(searchString));

        // Pokemon typing
        validNTypes = [];
        if (radio_one_type.checked) {
            if (checkbox_single_type.checked) {
                validNTypes.push(1);
            }
            if (checkbox_dual_type.checked) {
                validNTypes.push(2);
            }
        } else {
            validNTypes = [2];
        }

        if((validNTypes.length < 2) || (validTypes.size != allTypes.size)) {
            filterPool = filterPool.filter((dexIdx) => formsWithValidTyping(pokemonJson[dexIdx]['pokemon_v2_pokemons']).length > 0);
        }

        console.log("Dex indices passing filter (add 1 for dex number):");
        console.log(filterPool);
    }
}

function formsWithValidTyping(pokemonForms) {

    var validFormIndices = [...Array(pokemonForms.length).keys()];

    if (radio_one_type.checked) {
        validFormIndices = validFormIndices.filter((formIdx) => 
            validNTypes.includes(pokemonForms[formIdx]['pokemon_v2_pokemontypes'].length) && 
            pokemonForms[formIdx]['pokemon_v2_pokemontypes']
                .some((value, index, array) => validTypes.has(value['pokemon_v2_type']['name']))
        );
    } else {
        validFormIndices = validFormIndices.filter((formIdx) => 
            (pokemonForms[formIdx]['pokemon_v2_pokemontypes'].length == 2) && 
            pokemonForms[formIdx]['pokemon_v2_pokemontypes']
                .every((value, index, array) => validTypes.has(value['pokemon_v2_type']['name']))
        );
    }

    return validFormIndices;
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

    checkSpriteSources();

    setName();

    setTypes();

    setLinks();

    setAlternateForms();
}

function selectFormIdx(pokemonForms) {
    //TODO: Implement selection filtering
    const validFormIndices = formsWithValidTyping(pokemonForms);
    const idxIdx = randInt(validFormIndices.length);
    return validFormIndices[idxIdx];
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

    if (fetchSprite(pokemonVariant, "front_default", sprite_source_dropdown.value) == null) {
        pokemon_img.src = "No artwork.png"
    } else {
        currentGenderShiny = "front";
    
        if (shiny_checkbox.checked) {
            currentGenderShiny += "_shiny";
        }
    
        if (!button_gender.disabled) {
            if (fetchSprite(pokemonVariant, currentGenderShiny + "_female", sprite_source_dropdown.value) == null) {
                label_gender.innerHTML = "Sprite source only contains default gender";
            } else if (currentGender == Genders.FEMALE) {
                currentGenderShiny += "_female";
            }
        }
        
        if (currentGenderShiny == "front") {
            currentGenderShiny += "_default";
        }

        const source = sprite_source_dropdown.value;
    
        decideRenderingMethod(source);
        
        pokemon_img.src = fetchSprite(pokemonVariant, currentGenderShiny, source);
    }

}

function fetchSprite(pokemonVariant, genderShiny, source) {
    var spriteSource = pokemonVariant["pokemon_v2_pokemon"]["pokemon_v2_pokemonsprites"][0]["sprites"];
    const spritePath = source.split(" ");
    if (spritePath != "pokeapi") {
        for (const pathLvl of spritePath) {
            spriteSource = spriteSource[pathLvl];
        }
    }

    return spriteSource[genderShiny];
}

function decideRenderingMethod(spriteSource) {
    const sourceName = spriteSource.split(" ").at(-1);
    
    if ((sourceName == "official-artwork") || (sourceName == "home") || (sourceName == "dream_world")) {
        pokemon_img.classList.remove("pixelated");
    } else if (!pokemon_img.classList.contains("pixelated")) {
        pokemon_img.classList.add("pixelated");
    }
}

function checkSpriteSources() {
    for (const group of sprite_source_dropdown.children) {
        for (const source of group.children) {
            const pokemonVariant = getVariant(currentFormIdx, currentVariantIdx);
            source.disabled = fetchSprite(pokemonVariant, "front_default", source.value) == null;
        }
    }
}

function setName() {
    const dexDigits = Math.floor(Math.log10(pokemonJson.length) + 1);
    const dexString = currentPokemon["id"].toString().padStart(dexDigits, "0");

    var fullName;

    // In case of two-word names
    const prettyName = currentPokemon["pretty_name"];

    const pokemonVariant = getVariant(currentFormIdx, currentVariantIdx);
    const formNameParts = pokemonVariant["form_name"].split("-");
    for (let i = 0; i < formNameParts.length; i++) {
        const formName = capitalizeFirstLetter(formNameParts[i]);
        formNameParts[i] = formCorrections[formName] ?? formName;
    }

    if (formNameParts.length == 0) {
        fullName = prettyName;
    } else if (formNameParts.length == 1) {
        if (prettyName == "Unown") {
            fullName = prettyName + " " + formNameParts[0];
        } else if ((prettyName == "Shellos") || (prettyName == "Gastrodon")) {
            fullName = formNameParts[0] + " Sea " + prettyName;
        } else if (prettyName == "Shaymin") {
            fullName = formNameParts[0] + " Forme " + prettyName;
        } else if (prettyName == "Zygarde") {
            if (formNameParts[0] == "Complete") {
                fullName = prettyName + " " + formNameParts[0] + " Forme"
            } else {
                fullName = prettyName + " " + formNameParts[0] + "% Forme"
            }
        } else {
            fullName = formNameParts[0] + " " + prettyName;
        }
    } else {
        if ((formNameParts[0] == "Mega") && 
            ((formNameParts[1] == "X") ||
             (formNameParts[1] == "Y"))) { // "X"/"Y" comes after the pokemon name
            fullName = formNameParts[0] + " " + prettyName + " " + formNameParts[1];
        } else if ((prettyName == "Tauros") && (formNameParts[0] == "Paldean")) {
            fullName = formNameParts[1] + " " + formNameParts[2] + " " + formNameParts[0] + prettyName;
        } else {
            fullName = formNameParts.join(" ") + " " + prettyName;
        }
    }

    pokemon_name.innerHTML = "#" + dexString + " " + fullName;
}

function setTypes() {
    const pokemonForm = getForm(currentFormIdx);
    const pokemonTypes = pokemonForm["pokemon_v2_pokemontypes"];
    for (const type of pokemonTypes) {
        const typeName = type["pokemon_v2_type"]["name"]
        const type_img = document.createElement("img");
        type_img.src = typesJson[typeName]['icon'];
        types_container.appendChild(type_img);
    }
}

function setLinks() {
    const name = currentPokemon['name'];
    const prettyName = currentPokemon['pretty_name'];

    const bulbaName = prettyName.replaceAll(" ", "_");
    var serebiiName = name;
    if (!(["ho-oh", "jangmo-o", "hakamo-o", "komma-o", "wo-chien", "chien-pao", "ting-lu", "chi-yu"].includes(serebiiName))) {
        serebiiName = serebiiName.replace("-", "").replace("typenull", "type:null");
    }
    
    var xResourceName;
    if (prettyName == "Ho-Oh") { // Ho-Oh is the only name that gives no results with exact match...
        xResourceName = "Ho";
    } else {
        xResourceName = `"${prettyName}"`;
    }

    link_pokedex.href = `https://www.pokemon.com/us/pokedex/${currentPokemon['id']}`;
    link_bulba_wiki.href = `https://bulbapedia.bulbagarden.net/wiki/${bulbaName}_(Pokémon)`;
    link_bulba_archive.href = `https://archives.bulbagarden.net/wiki/Category:${bulbaName}`;
    link_serebii.href = `https://serebii.net/pokemon/${serebiiName}/`;
    link_serebii_tcg.href = `https://www.serebii.net/card/dex/${currentPokemon['id'].toString().padStart(3, "0")}.shtml`;
    link_bulba_tcg.href = `https://bulbapedia.bulbagarden.net/wiki/${bulbaName}_(TCG)`;
    link_pokemondb.href = `https://pokemondb.net/pokedex/${name}`;
    link_spriters_resource.href = `https://www.spriters-resource.com/search/?q=${xResourceName}`;
    link_models_resource.href = `https://www.models-resource.com/search/?q=${xResourceName}`;
}

function setAlternateForms() {
    const pokemonForms = currentPokemon["pokemon_v2_pokemons"];
    for (const formIdx in pokemonForms) {

        const pokemonVariants = pokemonForms[formIdx]["pokemon_v2_pokemonforms"];
        for (const variantIdx in pokemonVariants) {
            const form_img = document.createElement("img");
            form_img.classList = ["form_img"];

            if ((pokemonForms.length > 1) || (pokemonVariants.length > 1)) {
                if ((formIdx == currentFormIdx) && (variantIdx == currentVariantIdx)) {
                    form_img.classList.add("current_form");
                } else {
                    form_img.onclick = () => setPokemon(formIdx, variantIdx); // TODO: Perhaps I need to make a function that is more specialized
                    form_img.classList.add("clickable");
                }
            }

            const pokemonVariant = getVariant(formIdx, variantIdx);
            form_img.src = pokemonVariant["pokemon_v2_pokemon"]["pokemon_v2_pokemonsprites"][0]["sprites"]["other"]["official-artwork"]["front_default"];
            
            forms_container.appendChild(form_img);
        }
    }
}

// -------------------- Buttons -------------------- //

function oneXView() {
    pokemon_img.classList.remove("fill_view");
}

function fillView() {
    if (!pokemon_img.classList.contains("fill_view")) {
        pokemon_img.classList.add("fill_view");
    }
}

function resetView() {
    pokemon_img_container.style.height="512px";
    pokemon_img_container.style.width="512px";
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

input_name.addEventListener("input", () => {
    if (pokemonNameList.indexOf(input_name.value) > -1) {
        generate();
    }
});

checkbox_single_type.addEventListener("click", () => {
    if (!checkbox_single_type.checked && !checkbox_dual_type.checked) {
        checkbox_dual_type.checked = true;
    }
});

checkbox_dual_type.addEventListener("click", () => {
    if (!checkbox_dual_type.checked && !checkbox_single_type.checked) {
        checkbox_single_type.checked = true;
    }
});

radio_one_type.addEventListener("click", () => {
    if (radio_one_type.checked) {
        checkbox_single_type.disabled = false;
        checkbox_dual_type.disabled = false;
    }
});

radio_two_types.addEventListener("click", () => {
    if (radio_two_types.checked) {
        checkbox_single_type.disabled = true;
        checkbox_dual_type.disabled = true;
    }
});

button_all_types.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".type_checkbox input");
    for (const checkbox of checkboxes) {
        if (!checkbox.checked) {
            checkbox.click();
        }
    }
});

button_no_types.addEventListener("click", () => {
    const checkboxes = document.querySelectorAll(".type_checkbox input");
    for (const checkbox of checkboxes) {
        if (checkbox.checked) {
            checkbox.click();
        }
    }
});

sprite_source_dropdown.addEventListener("change", setSprite);

shiny_checkbox.addEventListener("change", () => {
    setSprite();
});
