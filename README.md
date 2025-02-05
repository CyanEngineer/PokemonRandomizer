# Pokémon Randomizer
A tool for selecting a random Pokémon.

## Game plan
I guess we can allow the user to just select a Pokémon too...

### Filtering
Based on
- Generation
- Type
- Not fully evolved
- Etc.

### Form selection
- ~~If forms are enabled, display a random one of them.~~
- ~~Also show a list of all the alternative forms to choose from (selectable)~~
- Try to see if I can postpone displaying until all images are loaded (form border too)

### Sprite selection
- Choose a sprite to display out of the sprites available in PokéAPI
  - Choose a preferred sprite source
  - Choose a backup source if preferred doesn't exist
- Gender chance (I forgot to query has_gender_differences)
- Shiny chance
- Link to Bulbapedia images archive for pokemon
- Have standard sprite-container size and allow resize?

### Evolution tree?
- Bulbapedia-style table of the evolution tree of current pokemon (selectable)
- How should I deal with regional-only evolutions? Maybe only include in the relevant form?
- Check ordering (baby pokemon)

### Linked list (history)?

### Other todos
- Burmy and Flabebe forms are further inside the JSON (perhaps cosmetic forms are placed in there??)
- Same with Genesect and Xerneas (but I don't think PokéAPI has the different colors (the difference is minor anyways))
- Same with Shellos and Gastrodon (they are missing "sea" too)
- Same with Arceus and Silvally, and the types are only in pokemon_v2_pokemonformtypes (except for normal)
- Figure out what to do with Alcremie forms
- Correct some form names
  - Alola -> Alolan
  - Galar -> Galarian
  - Hisui -> Hisuian
  - Paldea -> Paldean
  - Gmax -> Gigantamax
- Edge cases
  - Zygarde add "%"
  - Nidoran use gender symbols?
  - Jangemo-o + Hakamo-o + Kommo-o
  - Ignore forms:
    - Totem Pokemon
    - Mothim
    - Pompkaboo + Gourgeist
    - Scatterbug + Spewpa 
    - Koraidon + Miraidon
    - Toxtricity 2nd Gmax form
    - Genesect
    - Minior meteor colors
  - Type-null -> Type: Null
  - X Shaymin -> X Forme Shaymin
  - Paldea X Breed Tauros -> X Breed Paldean Tauros
  - X Shellos/Gastrodon -> X Sea Shellos/Gastrodon
  - Arceus + Silvally use form name as type
  - Stellar type??

### Stuff I should report
- Frillish + Jellicent have forms that shouldn't be there (probably for females)
- Arceus and Silvally are the only Pokemon using the pokemon_v2_pokemonformtypes. Their Normal forms do not, though
- Ogerpon form sprites are misaligned
- Missing form sprites
  - Deerling + Sawsbuck
  - Pichu
  - Vivillon
  - Floette + Florges colors
  - Cherrim
  - Unown
  - Shellos (+ Gastrodon?)