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
- If forms are enabled, display a random one of them.
- Also show a list of all the alternative forms to choose from (selectable)

### Sprite selection
- Choose a sprite to display out of the sprites available in PokéAPI
  - Choose a preferred sprite source
  - Choose a backup source if preferred doesn't exist
- Gender chance (I forgot to query has_gender_differences)
- Shiny chance
- Link to Bulbapedia images archive for pokemon

### Evolution tree
- Bulbapedia-style table of the evolution tree of current pokemon (selectable)