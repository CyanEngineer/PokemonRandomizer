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
- ~~Gender chance (I forgot to query has_gender_differences)~~
- ~~Shiny chance~~
- Link to Bulbapedia images archive for pokemon
- Have standard sprite-container size and allow resize?

### Evolution tree?
- Bulbapedia-style table of the evolution tree of current pokemon (selectable)
- How should I deal with regional-only evolutions? Maybe only include in the relevant form?
- Check ordering (baby pokemon)

### Linked list (history)?

### Other todos
- Indeterminate issues
  - Something with Politoed
  - Something with Arbok
- Arceus and Silvally types are only in pokemon_v2_pokemonformtypes (except for normal)
- Figure out what to do with Alcremie and Vivillon forms
- Handle missing images
- Maybe Home sprite for form list? Official is missing Broken Mimikyu
- Edge cases
  - ~~Naming~~
    - ~~Zygarde add "%"~~
    - ~~Nidoran use gender symbols~~
    - ~~Jangemo-o + Hakamo-o + Kommo-o~~
    - ~~Type-null -> Type: Null~~
    - ~~X Shaymin -> X Forme Shaymin~~
    - ~~Paldea X Breed Tauros -> X Breed Paldean Tauros~~
    - ~~X Shellos/Gastrodon -> X Sea Shellos/Gastrodon~~
    - ~~Flabebe -> Flabébé~~
  - Gender
    - Separate forms
      - Oinkologne
      - Meowstic
      - Indeedee
      - Basculegion
    - Single-gendered variations
      - Pikachu (Do I care enough to fix this?)
  - Forms missing sprites
    - Unown
    - Arceus
    - Silvally
  - Ignore forms:
    - Totem Pokemon
    - Mothim
    - Pompkaboo + Gourgeist
    - Scatterbug + Spewpa 
    - Koraidon + Miraidon
    - Toxtricity 2nd Gmax form
    - Genesect
    - Xerneas
    - Zygarde Power Construct
    - Minior meteor colors
  - Arceus + Silvally types
  - Stellar type??

### Stuff I should report
- Frillish + Jellicent have forms that shouldn't be there (probably for females)
- Arceus and Silvally are 
- Ogerpon form sprites are misaligned
- Incorrect gender rate
  - Fezandipiti
  - Munkidori
- Missing form sprites
  - Deerling + Sawsbuck
  - Pichu
  - Vivillon
  - Floette + Florges colors
  - Cherrim
  - Unown
  - Shellos (+ Gastrodon?)
  - Squawkabilly (blue, yellow and white "official art" are 3D)
  - Burmy (not Wormadam)
  - Flabebe + Floette
  - Busted Mimikyu doesn't have official artwork. May be enough reason to use HOME in alternate form list
- Arceus + Silvally
  - Types are only in pokemon_v2_pokemonformtypes (except normal)
  - Missing Dream World sprites (Silvally - not sure about Arceus)
  - All alternate forms use standard sprite
- Poor shiny spritework
  - Ancient misdreavous