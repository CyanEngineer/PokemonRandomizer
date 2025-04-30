# Pokémon Randomizer
A tool for selecting a random Pokémon.

## Game plan
~~I guess we can allow the user to just select a Pokémon too...~~

### Filtering
Based on
- ~~Name~~
- ~~Generation~~
- ~~Type~~
- Type efficacy???
- ~~Not fully evolved~~
  - ~~Unevolved~~
  - ~~1st evolution~~
  - ~~2nd evolution~~
  - ~~Not fully evolved~~
  - ~~Fully evolved~~
- Variants
  - ~~Default~~
  - ~~Regional~~ (can we make this rely on fetching all region names?)
  - ~~Mega~~
  - ~~Gigantamax~~
  - Unique
    - Issues:
      - Darmanital Standard Galarian
      - Urshifu?? Should Gmax Single Strike be considered not-unique?
- Etc.
  - ~~Baby~~
  - ~~Legendary~~
  - ~~Mythical~~
  - Starter?

Try extending json with filtering parameters

### Form selection
- ~~If forms are enabled, display a random one of them.~~
- ~~Also show a list of all the alternative forms to choose from (selectable)~~
- Try to see if I can postpone displaying until all images are loaded (form border too)
- Consider using pokemon_v2_pokemon instead of pokemon_v2_pokemonspecies
  - Pros
    - More modular filtering (go back and check the valid forms function if it all even makes sense)
  - Cons
    - Pokemon with many forms are more likely to show up (e.g. charizard has 4)
      - This can probably be remedied somehow
    - Managing the connection between forms
      - Dex number?
  - Ooooor perhaps restructure so the pokemonjson (or separate variable) is a list of dex numbers, each element containing the default and variations
    - Then loop over each form of each dex when filtering
    - This will keep the list at 1025, while making the default variation equal to the others

### ~~Sprite selection~~
- ~~Choose a sprite to display out of the sprites available in PokéAPI~~
  - ~~Choose a preferred sprite source~~
    - ~~Disable sprite sources without the sprite~~
- ~~Gender chance (I forgot to query has_gender_differences)~~
- ~~Shiny chance~~
- ~~Link to Bulbapedia images archive for pokemon~~
- ~~Have standard sprite-container size and allow resize?~~

### Linked list (history)?

### Other todos
- ~~Arceus and Silvally types are only in pokemon_v2_pokemonformtypes (except for normal)~~
- Handle when there are missing images
- Dream World doesn't have shinies
- Automatic read artwork sources?
- ~~Link to other resources (Bulbapedia, Bulbapedia img archive, Pokemondb, Official Pokedex)~~
- ~~Maybe Home sprite for form list? Official is missing 27 Unown and Broken Mimikyu (look for more examples)~~
- ~~Do something about gender placeholder text and such~~
- Edge cases
  - ~~Naming~~
    - ~~Zygarde add "%"~~
    - ~~Nidoran use gender symbols~~
    - ~~Jangemo-o + Hakamo-o + Kommo-o~~
    - ~~Type-null -> Type: Null~~
    - ~~X Shaymin -> X Forme Shaymin~~
    - ~~Paldea X Breed Tauros -> X Breed Paldean Tauros~~
    - ~~Flabebe -> Flabébé~~
    - ~~Gmax Urshifu has same name for both versions (also add "Style")~~
  - Gender
    - ~~Separate forms~~
      - ~~Oinkologne~~
      - ~~Meowstic~~
      - ~~Basculegion~~
    - Single-gendered variations
      - Pikachu (Do I care enough to fix this?)
    - Gender differences were added in gen IV (so Gen I-III games don't have them)
    - ~~I guess I made available artwork sources dependent on gender...~~
  - Forms without official sprites
    - Unown
    - Broken Mimikyu
    - Arceus
    - Silvally
    - Squawkabilly
    - Vivillon
    - Alcremie
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
    - ~~Own Tempo Rockruff~~
  - Arceus + Silvally types
  - ~~Ho-Oh on Models Resource lol~~

### Stuff I should report
- Frillish + Jellicent have forms that shouldn't be there (probably for females)
- No Showdown gen 9 sprites
- Type: Null should have is_legendary true
- Incorrect gender rate
  - Fezandipiti
  - Munkidori
- Incorrect sprites
  - PokeAPI Mega Venusaur shouldn't have female sprite
  - Official Zen Darmanitan???
  - PokeAPI Shiny Zygarde 50
  - There are fan sprites in Black White
  - Many missing 
- Missing sprites
  - Deerling + Sawsbuck
  - Spiky-eared Pichu
  - Floette + Florges
  - Cherrim 
  - Unown (all sources)
  - Shellos + Gastrodon
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
  - Showdown Hisuian Electrode
- Arceus + Silvally
  - Types are only in pokemon_v2_pokemonformtypes (except normal)
    - Could we, like, always put the type in formtype, regardless of it being extraordinary or not?
    - Arceus form order is not the same as the general type order
  - Missing Dream World sprites (Silvally - not sure about Arceus)
  - All alternate forms use standard sprite