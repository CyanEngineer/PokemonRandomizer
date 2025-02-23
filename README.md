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
    - ~~Disable sprite sources without the sprite~~
  - Choose a backup source if preferred doesn't exist
- ~~Gender chance (I forgot to query has_gender_differences)~~
- ~~Shiny chance~~
- Link to Bulbapedia images archive for pokemon
- Have standard sprite-container size and allow resize?

### Linked list (history)?

### Other todos
- Indeterminate issues
  - Something with Politoed
  - Something with Arbok
- Arceus and Silvally types are only in pokemon_v2_pokemonformtypes (except for normal)
- Handle missing images
- Link to other resources (Bulbapedia, Bulbapedia img archive, Pokemondb, Official Pokedex)
- Maybe Home sprite for form list? Official is missing 27 Unown and Broken Mimikyu (look for more examples)
- Edge cases
  - ~~Naming~~
    - ~~Zygarde add "%"~~
    - ~~Nidoran use gender symbols~~
    - ~~Jangemo-o + Hakamo-o + Kommo-o~~
    - ~~Type-null -> Type: Null~~
    - ~~X Shaymin -> X Forme Shaymin~~
    - ~~Paldea X Breed Tauros -> X Breed Paldean Tauros~~
    - ~~Flabebe -> Flabébé~~
  - Gender
    - ~~Separate forms~~
      - ~~Oinkologne~~
      - ~~Meowstic~~
      - ~~Basculegion~~
    - Single-gendered variations
      - Pikachu (Do I care enough to fix this?)
    - Gender differences were added in gen IV
    - I guess I made available artwork sources dependent on gender...
  - Forms missing sprites
    - Unown
    - Broken Mimikyu
    - Arceus
    - Silvally
  - ~~Ignore forms:~~
    - ~~Totem Pokemon~~
    - ~~Mothim~~
    - ~~Pompkaboo + Gourgeist~~
    - ~~Scatterbug + Spewpa~~
    - ~~Koraidon + Miraidon~~
    - ~~Toxtricity 2nd Gmax form~~
    - ~~Genesect~~
    - ~~Xerneas~~
    - ~~Zygarde Power Construct~~
    - ~~Minior meteor colors~~
  - Arceus + Silvally types
  - Stellar type??

### Stuff I should report
- Frillish + Jellicent have forms that shouldn't be there (probably for females)
- Ogerpon form sprites are misaligned
- No Showdown gen 9 sprites
- Incorrect gender rate
  - Fezandipiti
  - Munkidori
- Incorrect sprites
  - PokeAPI Mega Venusaur shouldn't have female sprite
  - Official Zen Darmanitan???
  - PokeAPI Shiny Zygarde 50
- Missing sprites
  - Deerling + Sawsbuck
  - Spiky-eared Pichu
  - Floette + Florges
  - Cherrim 
  - Unown (all sources)
  - Shellos (+ Gastrodon?)
  - Squawkabilly (blue, yellow and white "official art" are 3D)
  - Burmy (not Wormadam)
  - Flabebe + Floette
  - Unfeazant, Frillish, Jellicent and Pyroar female official
  - Many gen II and III pokemon are missing in Firered/Leafgreen
  - Furfrou
  - Vivillon
  - Alcremie
  - PokeAPI Zygarde 10 (it exists in power construct)
- Bad sprites
  - Official Shiny Ancient misdreavous
  - Showdown Hisuian Electrode
- Arceus + Silvally
  - Types are only in pokemon_v2_pokemonformtypes (except normal)
  - Missing Dream World sprites (Silvally - not sure about Arceus)
  - All alternate forms use standard sprite