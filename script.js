// Data JSONs
var pokemonJson;
var typesJson;

// Current pokemon info
var currentPokemon;
var currentGender; // TODO: currentShiny ??
var isCurrentShiny;
var currentGenderShiny;
var currentFormIdx;
var currentVariantIdx;

// Filter variables
var hasFilterChanges = true;

var fullFilterPool;
var filterPool;

var allGens;
var validGens;

var excludedVariations;

var excludedKinds;

var validNTypes
var allTypes;
var validTypes;

var pokemonNameList;

// Filters elements
const filter_panel = document.getElementById("filter_panel");
const button_filter_panel = document.getElementById("button_filter_panel");
const button_filter_panel_close = document.getElementById("button_filter_panel_close");

const input_name = document.getElementById("input_name");
const datalist_name = document.getElementById("datalist_name");

const gen_grid = document.getElementById("gen_grid");
const button_all_gens = document.getElementById("button_all_gens");
const button_no_gens = document.getElementById("button_no_gens");

const checkbox_default = document.getElementById("checkbox_default");
const checkbox_regional = document.getElementById("checkbox_regional");
const checkbox_unique = document.getElementById("checkbox_unique");
const checkbox_mega = document.getElementById("checkbox_mega");
const checkbox_gmax = document.getElementById("checkbox_gmax");

const checkbox_ordinary = document.getElementById("checkbox_ordinary");
const checkbox_baby = document.getElementById("checkbox_baby");
const checkbox_legendary = document.getElementById("checkbox_legendary");
const checkbox_mythical = document.getElementById("checkbox_mythical");

const checkbox_unevolved = document.getElementById("checkbox_unevolved");
const checkbox_not_fully_evo = document.getElementById("checkbox_not_fully_evo");
const checkbox_fully_evo = document.getElementById("checkbox_fully_evo");
const checkbox_first_evo = document.getElementById("checkbox_first_evo");
const checkbox_second_evo = document.getElementById("checkbox_second_evo");
const button_all_evos = document.getElementById("button_all_evos");
const button_no_evos = document.getElementById("button_no_evos");

const checkbox_single_type = document.getElementById("checkbox_single_type");
const checkbox_dual_type = document.getElementById("checkbox_dual_type");
const radio_one_type = document.getElementById("radio_one_type");
const radio_two_types = document.getElementById("radio_two_types");
const type_grid = document.getElementById("type_grid");
const button_all_types = document.getElementById("button_all_types");
const button_no_types = document.getElementById("button_no_types");

// Randomizer elements
const main = document.getElementById("main");
const pokemon_img_container = document.getElementById("pokemon_img_container");
const pokemon_img = document.getElementById("pokemon_img");
const pokemon_name = document.getElementById("pokemon_name");
const types_container = document.getElementById("types_container");
const forms_container = document.getElementById("forms_container");

const sprite_source_dropdown = document.getElementById("sprite_source_dropdown");

const button_gender = document.getElementById("button_gender");
const img_button_gender = document.getElementById("img_button_gender");
const label_gender = document.getElementById("label_gender");

const button_shiny = document.getElementById("button_shiny");
const shiny_chance_container = document.getElementById("shiny_chance_container");
const label_shiny = document.getElementById("label_shiny");
const img_button_shiny = document.getElementById("img_button_shiny");
const shiny_chance = document.getElementById("shiny_chance");

// External links elements
const external_panel = document.getElementById("external_panel");
const button_external_panel = document.getElementById("button_external_panel");
const button_external_panel_close = document.getElementById("button_external_panel_close");

const link_pokedex = document.getElementById("link_pokedex");
const link_bulba_wiki = document.getElementById("link_bulba_wiki");
const link_serebii = document.getElementById("link_serebii");
const link_pokemondb = document.getElementById("link_pokemondb");
const link_serebii_tcg = document.getElementById("link_serebii_tcg");
const link_bulba_tcg = document.getElementById("link_bulba_tcg");
const link_bulba_archive = document.getElementById("link_bulba_archive");
const link_spriters_resource = document.getElementById("link_spriters_resource");
const link_models_resource = document.getElementById("link_models_resource");

// CSS variables
const style = window.getComputedStyle(document.body);
const pxPrRem = parseFloat(getComputedStyle(document.documentElement).fontSize);
const panelWidth = style.getPropertyValue("--panel-width");
const buttonPanelWidth = style.getPropertyValue("--button-panel-width");
const pokemonImgDefaultDim = style.getPropertyValue("--pokemon-img-default-dim");


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

resetFilters();

setup();

function resetFilters() {
    input_name.value = "";

    checkbox_default.checked = true;
    checkbox_regional.checked = true;
    checkbox_unique.checked = true;
    checkbox_mega.checked = true;
    checkbox_gmax.checked = true;

    checkbox_ordinary.checked = true;
    checkbox_baby.checked = true;
    checkbox_legendary.checked = true;
    checkbox_mythical.checked = true;

    checkbox_single_type.checked = true;
    checkbox_dual_type.checked = true;
    radio_one_type.checked = true;
}

async function setup() {
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
                    evolves_from_species_id
                    pokemon_v2_evolutionchain {
                        pokemon_v2_pokemonspecies(order_by: {id: asc}) {
                            id
                            evolves_from_species_id
                        }
                    }
                    pokemon_v2_pokemons {
                        is_default
                        pokemon_v2_pokemontypes {
                            pokemon_v2_type {
                                name
                            }
                        }
                        pokemon_v2_pokemonforms {
                            name
                            form_name
                            pokemon_v2_pokemonformtypes {
                                pokemon_v2_type {
                                    name
                                }
                            }
                            pokemon_v2_versiongroup {
                                generation_id
                            }
                            pokemon_v2_pokemon {
                                pokemon_v2_pokemonsprites {
                                    sprites
                                }
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
            }
        })
        .catch(error => {
            if (error instanceof TypeError && error.message.includes('NetworkError when attempting to fetch resource')) {
                console.log("Unable to fetch pokemon resources from PokeAPI. Try reloading the page in a minute.");
            }
        });
    
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
            }
        })
        .catch(error => {
            if (error instanceof TypeError && error.message.includes('NetworkError when attempting to fetch resource')) {
                console.log("Unable to fetch types resources from PokeAPI. Try reloading the page in a minute.");
            }
        });

    modPokemonJson();

    console.log("Pokemon JSON:");
    console.log(pokemonJson);

    console.log("Types JSON:");
    console.log(typesJson);

    // Set up filters
    fullFilterPool = [...Array(pokemonJson.length).keys()];
    filterPool = fullFilterPool;

    const nGens = pokemonJson[pokemonJson.length - 1]['pokemon_v2_pokemons'][0]['pokemon_v2_pokemonforms'][0]['pokemon_v2_versiongroup']['generation_id'];
    allGens = new Set(Array.from({length: nGens}, (_, i) => i+1));
    validGens = new Set(allGens);

    excludedVariations = new Set();

    excludedKinds = new Set();

    allTypes = new Set(Object.keys(typesJson));
    validTypes = new Set(allTypes);

    populateDataList();
    populateGenGrid();
    populateTypeGrid();
    
    generate();
}

// Make a few changes to the data
function modPokemonJson() {
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

    pokemonJson[743]["pokemon_v2_pokemons"].splice(1); // Rockruff

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

    // Turn the Arceus and Silvally types into forms (sorry, it's just easier this way...)
    for (const idx of [492, 772]) {
        for (let i=1; i < pokemonJson[idx]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].length; i++) {
            pokemonJson[idx]["pokemon_v2_pokemons"][i] = {
                "is_default": false,
                "pokemon_v2_pokemonforms": [pokemonJson[idx]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][i]],
                "pokemon_v2_pokemontypes": pokemonJson[idx]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"][i]["pokemon_v2_pokemonformtypes"]
            }
        }
        pokemonJson[idx]["pokemon_v2_pokemons"][0]["pokemon_v2_pokemonforms"].splice(1);
    }

    // Put style into Urshifu gmax
    pokemonJson[891]['pokemon_v2_pokemons'][2]["pokemon_v2_pokemonforms"][0]["form_name"] =
        "gmax-" + pokemonJson[891]['pokemon_v2_pokemons'][0]["pokemon_v2_pokemonforms"][0]["form_name"];
    pokemonJson[891]['pokemon_v2_pokemons'][3]["pokemon_v2_pokemonforms"][0]["form_name"] =
        "gmax-" + pokemonJson[891]['pokemon_v2_pokemons'][1]["pokemon_v2_pokemonforms"][0]["form_name"];
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

async function populateGenGrid() {
    
    for (let i=1; i<=allGens.size; i++) {
        const gen_checkbox = document.createElement("div");
        gen_checkbox.classList = ["gen_checkbox"];

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        const id = `checkbox_gen_${i}`;
        checkbox.id = id;
        checkbox.value = i;
        checkbox.onclick = () => toggleGeneration(checkbox);
        checkbox.checked = true;
        gen_checkbox.appendChild(checkbox);

        const label = document.createElement("label");
        label.htmlFor = id;
        label.innerHTML = `Generation ${i}`;
        gen_checkbox.appendChild(label);

        gen_grid.appendChild(gen_checkbox);
    }
}

function toggleGeneration(checkbox) {
    hasFilterChanges = true;

    if (checkbox.checked) {
        validGens.add(Number(checkbox.value));
    } else {
        validGens.delete(Number(checkbox.value));
    }
}

async function populateTypeGrid() {
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
    hasFilterChanges = true;

    if (checkbox.checked) {
        validTypes.add(checkbox.value);
    } else {
        validTypes.delete(checkbox.value);
    }
}

function generate() {
    if (hasFilterChanges) {
        hasFilterChanges = false;
        updateFilterPool();
    }

    currentPokemon = pokemonJson[filterPool[randInt(filterPool.length)]];

    console.log(`Generated pokemon:`);
    console.log(currentPokemon);

    currentGender = decideGender();
    isCurrentShiny = decideShiny();

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

        // Kind
        if(!checkbox_ordinary.checked) {
            filterPool = filterPool.filter((dexIdx) => 
                pokemonJson[dexIdx].is_baby ||
                pokemonJson[dexIdx].is_legendary ||
                pokemonJson[dexIdx].is_mythical
            );
        }
        if(!checkbox_baby.checked) {
            filterPool = filterPool.filter((dexIdx) => !pokemonJson[dexIdx].is_baby);
        }
        if(!checkbox_legendary.checked) {
            filterPool = filterPool.filter((dexIdx) => !pokemonJson[dexIdx].is_legendary);
        }
        if(!checkbox_mythical.checked) {
            filterPool = filterPool.filter((dexIdx) => !pokemonJson[dexIdx].is_mythical);
        }

        // Evolution chain
        if (!checkbox_unevolved.checked) {
            filterPool = filterPool.filter((dexIdx) => pokemonJson[dexIdx]['evolves_from_species_id'] != null);
        }
        if (!checkbox_not_fully_evo.checked) {
            filterPool = filterPool.filter((dexIdx) => pokemonJson[dexIdx]['pokemon_v2_evolutionchain']['pokemon_v2_pokemonspecies']
                .every((pokemon) => pokemon['evolves_from_species_id'] != dexIdx+1)
            );
        }
        if (!checkbox_fully_evo.checked) {
            filterPool = filterPool.filter((dexIdx) => pokemonJson[dexIdx]['pokemon_v2_evolutionchain']['pokemon_v2_pokemonspecies']
                .some((pokemon) => pokemon['evolves_from_species_id'] == dexIdx+1)
            );
        }
        if (!checkbox_first_evo.checked) {
            filterPool = filterPool.filter((dexIdx) => (
                (pokemonJson[dexIdx]['evolves_from_species_id'] == null) ||
                (pokemonJson[pokemonJson[dexIdx]['evolves_from_species_id']-1]['evolves_from_species_id'] != null)
            )
            );
        }
        if (!checkbox_second_evo.checked) {
            filterPool = filterPool.filter((dexIdx) => (
                (pokemonJson[dexIdx]['evolves_from_species_id'] == null) ||
                (pokemonJson[pokemonJson[dexIdx]['evolves_from_species_id']-1]['evolves_from_species_id'] == null)
            ));
        }

        // Pokemon variations, typing and generation
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

        filterPool = filterPool.filter((dexIdx) => getValidForms(pokemonJson[dexIdx]['pokemon_v2_pokemons']).length > 0);

        console.log("Dex indices passing filter (add 1 for dex number):");
        console.log(filterPool);
    }
}

function getValidForms(pokemonForms) {

    var validFormIndices = [...Array(pokemonForms.length).keys()];

    // Generation filtering
    if (validGens.size != allGens.size) {
        validFormIndices = validFormIndices.filter((formIdx) =>
            validGens.has(pokemonForms[formIdx]['pokemon_v2_pokemonforms'][0]['pokemon_v2_versiongroup']['generation_id']));
    }

    // Variation filtering
    if (!checkbox_default.checked) {
        validFormIndices = validFormIndices.filter((formIdx) => !pokemonForms[formIdx]['is_default']);
    }
    if (excludedVariations.size > 0) {
        validFormIndices = validFormIndices.filter((formIdx) => 
            excludedVariations.values().every((variation) => 
                !pokemonForms[formIdx]['pokemon_v2_pokemonforms'][0]['form_name'].includes(variation)));
    }
    if (!checkbox_unique.checked) {
        validFormIndices = validFormIndices.filter((formIdx) =>
            pokemonForms[formIdx]['is_default'] || (pokemonForms[formIdx]['pokemon_v2_pokemonforms'][0]['form_name'].replaceAll(
                /mega|mega-x|mega-y|gmax|alola|galar|hisui|paldea/gi, ""
            ).trim() == ""));
    }

    // Types filtering
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

    if (currentGender == Genders.FEMALE) {
        img_button_gender.src = "female_icon.svg";
    } else if (currentGender == Genders.MALE) {
        img_button_gender.src = "male_icon.svg";
    } else {
        img_button_gender.src = "circle_icon.svg";
    }

    if (isCurrentShiny) {
        img_button_shiny.src = "shiny_icon.png";
    } else {
        img_button_shiny.src = "circle_icon.svg";
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
    const validFormIndices = getValidForms(pokemonForms);
    const idxIdx = randInt(validFormIndices.length);
    return validFormIndices[idxIdx];
}

function getForm(formIdx) {
    return currentPokemon["pokemon_v2_pokemons"][formIdx];
}

function selectVariantIdx(pokemonVariants) {
    //TODO: Implement selection filtering
    if (checkbox_unique.checked) {
        return randInt(pokemonVariants.length);
    } else {
        return 0;
    }
}

function getVariant(formIdx, variantIdx) {
    return getForm(formIdx)["pokemon_v2_pokemonforms"][variantIdx];
}

function capitalizeFirstLetter(str) {
    return str.substring(0,1).toUpperCase() + str.substring(1);
}

function setSprite() {
    label_gender.innerHTML = "";
    const pokemonVariant = getVariant(currentFormIdx, currentVariantIdx);

    if (getVariant(currentFormIdx, currentVariantIdx)["pokemon_v2_pokemon"]["pokemon_v2_pokemonsprites"][0]["sprites"]["front_female"] == null) {
        button_gender.disabled = true;
    } else {
        button_gender.disabled = false;
    }

    if (fetchSprite(pokemonVariant, "front_default", sprite_source_dropdown.value) == null) {
        pokemon_img.src = "No artwork.png"
    } else {
        currentGenderShiny = "front";
    
        if(["other dream_world", "versions generation-i red-blue", "versions generation-i yellow"].includes(sprite_source_dropdown.value)) {
            shiny_chance_container.classList.add("hidden");
            label_shiny.classList.remove("hidden");
        } else {
            shiny_chance_container.classList.remove("hidden");
            label_shiny.classList.add("hidden");

            if (isCurrentShiny) {
                currentGenderShiny += "_shiny";
            }
        }
    
        if (!button_gender.disabled) {
            if ((fetchSprite(pokemonVariant, currentGenderShiny + "_female", sprite_source_dropdown.value) == null) ||
            ["versions generation-i red-blue", "versions generation-i yellow", "versions generation-ii gold", "versions generation-ii silver",
                "versions generation-ii crystal", "versions generation-iii ruby-sapphire", "versions generation-iii firered-leafgreen",
                "versions generation-iii emerald"].includes(sprite_source_dropdown.value)) {
                label_gender.innerHTML = "Artwork source only contains default gender";
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
        }  else {
            fullName = formNameParts[0] + " " + prettyName;
        }
    } else if (formNameParts.length == 2) {
        if ((formNameParts[0] == "Mega") && 
            ((formNameParts[1] == "X") ||
             (formNameParts[1] == "Y"))) { // "X"/"Y" comes after the pokemon name
            fullName = formNameParts[0] + " " + prettyName + " " + formNameParts[1];
        } else if ((prettyName == "Urshifu")) {
            fullName = formNameParts[0] + " " + formNameParts[1] + " Style " + prettyName;
        } else {
            fullName = formNameParts.join(" ") + " " + prettyName;
        }
    } else {
        if ((prettyName == "Tauros") && (formNameParts[0] == "Paldean")) {
            fullName = formNameParts[1] + " " + formNameParts[2] + " " + formNameParts[0] + " " + prettyName;
        } else if (prettyName == "Urshifu") {
            fullName = formNameParts[0] + " " + formNameParts[1] + " " + formNameParts[2] + " Style " + prettyName;
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
            form_img.src = pokemonVariant["pokemon_v2_pokemon"]["pokemon_v2_pokemonsprites"][0]["sprites"]["other"]["home"]["front_default"];
            
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
    pokemon_img_container.style.height=pokemonImgDefaultDim;
    pokemon_img_container.style.width=pokemonImgDefaultDim;
}

// -------------------- Event handlers -------------------- //

window.addEventListener("resize", handleResizeEvent);

new ResizeObserver(handleResizeEvent).observe(pokemon_img_container);

function handleResizeEvent() {
    const hasRoomForBothPanels = window.innerWidth >= 2*pxPrRem*parseFloat(panelWidth) + main.clientWidth;
    const hasRoomForOnePanel = window.innerWidth >= pxPrRem*(parseFloat(panelWidth) + parseFloat(buttonPanelWidth)) + main.clientWidth;
    const filterClassList = filter_panel.classList;
    const externalClassList = external_panel.classList;

    if (hasRoomForBothPanels) {
        if (filterClassList.contains("blade")) {
            main.style.left = panelWidth;
        }
        filterClassList.remove("blade", "collapsed");
        externalClassList.remove("blade", "collapsed");
        button_filter_panel_close.classList.add("hidden");
        button_external_panel_close.classList.add("hidden");
    } else if (hasRoomForOnePanel) {
        if (filterClassList.contains("blade")) {
            main.style.left = panelWidth;
        }
        filterClassList.remove("blade", "collapsed");
        button_filter_panel_close.classList.add("hidden");

        if (!externalClassList.contains("blade")) {
            externalClassList.add("blade", "collapsed");
        }
    } else {
        if (!filterClassList.contains("blade")) {
            filterClassList.add("blade", "collapsed");
            main.style.left = buttonPanelWidth;
        }
        if (!externalClassList.contains("blade")) {
            externalClassList.add("blade", "collapsed");
        }
    }
}

button_filter_panel.addEventListener("click", () => {
    filter_panel.classList.remove("collapsed");
    button_filter_panel_close.classList.remove("hidden");
})

button_external_panel.addEventListener("click", () => {
    external_panel.classList.remove("collapsed");
    button_external_panel_close.classList.remove("hidden");
})

button_filter_panel_close.addEventListener("click", () => {
    filter_panel.classList.add("collapsed");
    button_filter_panel_close.classList.add("hidden");
})

button_external_panel_close.addEventListener("click", () => {
    external_panel.classList.add("collapsed");
    button_external_panel_close.classList.add("hidden");
})

input_name.addEventListener("input", () => {
    hasFilterChanges = true;
    if (pokemonNameList.indexOf(input_name.value) > -1) {
        generate();
    }
});

input_name_reset.addEventListener("click", () => {
    hasFilterChanges = true;
});

button_all_gens.addEventListener("click", () => {
    hasFilterChanges = true;
    const checkboxes = document.querySelectorAll(".gen_checkbox input");
    for (const checkbox of checkboxes) {
        if (!checkbox.checked) {
            checkbox.click();
        }
    }
});

button_no_gens.addEventListener("click", () => {
    hasFilterChanges = true;
    const checkboxes = document.querySelectorAll(".gen_checkbox input");
    for (const checkbox of checkboxes) {
        if (checkbox.checked) {
            checkbox.click();
        }
    }
});

checkbox_default.addEventListener("click", () => {
    hasFilterChanges = true;
});

checkbox_regional.addEventListener("click", () => {
    hasFilterChanges = true;
    if (checkbox_regional.checked) {
        excludedVariations.delete("alola");
        excludedVariations.delete("galar");
        excludedVariations.delete("hisui");
        excludedVariations.delete("paldea");
    } else {
        excludedVariations.add("alola").add("galar").add("hisui").add("paldea");
    }
});

checkbox_unique.addEventListener("click", () => {
    hasFilterChanges = true;
});

checkbox_mega.addEventListener("click", () => {
    hasFilterChanges = true;
    if (checkbox_mega.checked) {
        excludedVariations.delete("mega");
        excludedVariations.delete("mega-x");
        excludedVariations.delete("mega-y");
    } else {
        excludedVariations.add("mega").add("mega-x").add("mega-y");
    }
});

checkbox_gmax.addEventListener("click", () => {
    hasFilterChanges = true;
    if (checkbox_gmax.checked) {
        excludedVariations.delete("gmax");
    } else {
        excludedVariations.add("gmax");
    }
});

checkbox_ordinary.addEventListener("click", () => {
    hasFilterChanges = true;
});

checkbox_baby.addEventListener("click", () => {
    hasFilterChanges = true;
});

checkbox_legendary.addEventListener("click", () => {
    hasFilterChanges = true;
});

checkbox_mythical.addEventListener("click", () => {
    hasFilterChanges = true;
});

checkbox_unevolved.addEventListener("click", () => {
    hasFilterChanges = true;
});

checkbox_not_fully_evo.addEventListener("click", () => {
    hasFilterChanges = true;
});

checkbox_fully_evo.addEventListener("click", () => {
    hasFilterChanges = true;
});

checkbox_first_evo.addEventListener("click", () => {
    hasFilterChanges = true;
});

checkbox_second_evo.addEventListener("click", () => {
    hasFilterChanges = true;
});

button_all_evos.addEventListener("click", () => {
    hasFilterChanges = true;
    checkbox_unevolved.checked = true;
    checkbox_not_fully_evo.checked = true;
    checkbox_fully_evo.checked = true;
    checkbox_first_evo.checked = true;
    checkbox_second_evo.checked = true;
});

button_no_evos.addEventListener("click", () => {
    hasFilterChanges = true;
    checkbox_unevolved.checked = false;
    checkbox_not_fully_evo.checked = false;
    checkbox_fully_evo.checked = false;
    checkbox_first_evo.checked = false;
    checkbox_second_evo.checked = false;
});

checkbox_single_type.addEventListener("click", () => {
    hasFilterChanges = true;
});

checkbox_dual_type.addEventListener("click", () => {
    hasFilterChanges = true;
});

radio_one_type.addEventListener("click", () => {
    hasFilterChanges = true;
    if (radio_one_type.checked) {
        checkbox_single_type.disabled = false;
        checkbox_dual_type.disabled = false;
    }
});

radio_two_types.addEventListener("click", () => {
    hasFilterChanges = true;
    if (radio_two_types.checked) {
        checkbox_single_type.disabled = true;
        checkbox_dual_type.disabled = true;
    }
});

button_all_types.addEventListener("click", () => {
    hasFilterChanges = true;
    const checkboxes = document.querySelectorAll(".type_checkbox input");
    for (const checkbox of checkboxes) {
        if (!checkbox.checked) {
            checkbox.click();
        }
    }
});

button_no_types.addEventListener("click", () => {
    hasFilterChanges = true;
    const checkboxes = document.querySelectorAll(".type_checkbox input");
    for (const checkbox of checkboxes) {
        if (checkbox.checked) {
            checkbox.click();
        }
    }
});

sprite_source_dropdown.addEventListener("change", setSprite);

button_gender.addEventListener("click", () => {
    if (currentGender == Genders.FEMALE) {
        currentGender = Genders.MALE;
    } else if (currentGender == Genders.MALE) {
        currentGender = Genders.FEMALE;
    }

    setPokemon(currentFormIdx, currentVariantIdx);
});

button_shiny.addEventListener("click", () => {
    isCurrentShiny = !isCurrentShiny;

    setPokemon(currentFormIdx, currentVariantIdx);
});
