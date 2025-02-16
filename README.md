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
- Indeterminate issues
  - Something with Politoed
  - Something with Arbok
- Burmy and Flabebe forms are further inside the JSON (perhaps cosmetic forms are placed in there??)
- Same with Genesect and Xerneas (but I don't think PokéAPI has the different colors (the difference is minor anyways))
- Same with Shellos and Gastrodon (they are missing "sea" too)
- Same with Arceus and Silvally, and the types are only in pokemon_v2_pokemonformtypes (except for normal)
- Figure out what to do with Alcremie forms
- Handle missing images
- Maybe Home sprite for form list? I should get something that pref has everything...
- Correct some form names
  - Alola -> Alolan
  - Galar -> Galarian
  - Hisui -> Hisuian
  - Paldea -> Paldean
  - Gmax -> Gigantamax
- Edge cases
  - Naming
    - Zygarde add "%"
    - Nidoran use gender symbols
    - Jangemo-o + Hakamo-o + Kommo-o
    - Type-null -> Type: Null
    - X Shaymin -> X Forme Shaymin
    - Paldea X Breed Tauros -> X Breed Paldean Tauros
    - X Shellos/Gastrodon -> X Sea Shellos/Gastrodon
    - Arceus + Silvally use form name as type
    - Flabebe -> Flabébé
  - Gender
    - Separate forms
      - Oinkologne
      - Meowstic
      - Indeedee
      - Basculegion
    - Single-gendered variations (maybe I should just let the gender-slider status depend on the available sprites for current source "This sprite is used for both genders". Implement gender-ratio to manage gender-slider (female, male, no difference, genderless))
      - Pikachu
      - Mega
      - Gmax
      - Alolan forms (ratatta, raichu, wooper)
  - Ignore forms:
    - Totem Pokemon
    - Mothim
    - Pompkaboo + Gourgeist
    - Scatterbug + Spewpa 
    - Koraidon + Miraidon
    - Toxtricity 2nd Gmax form
    - Genesect
    - Minior meteor colors
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
  - The only Pokemon using the pokemon_v2_pokemonformtypes. Their Normal forms do not, though
  - Missing Dream World sprites (Silvally - not sure about Arceus)
  - All alternate forms use standard sprite
- Poor shiny spritework
  - Ancient misdreavous