/*
  - reads/writes cXML representation of world
  - node selection
  - node traversal
  - add/move/delete nodes
  - edit node content
  

  what do people find easy? what is flexible and expressive?
  - search-replace
  - search-between-string
  - before-after
  - record changes (macro)

  How about a before/after window in HTML format?
  
  Acid-tests:
  - farmer/fox/chicken/grain puzzle
  - movement of chess pieces
  - multiple agents, taking turns
  - simple mathematical proofs
  
  Basic data structures:
  - basic:
    - names
    - values
    - identifier (each data structure can have only one of these)
  - sets:
    - layers
  - 2d:
    - grid
    - table (like a grid, but with headers or column names in tables, and row indices or record IDs)
  - collections:
    - list (see "links")
    - tree (nested lists)
    - unordered list (a set, no duplicates)(see "links")
    - bag (may hold duplicates)
    - stack
  - object:
    - object (with named properties)
    - map (a hash, name-value pairs)
  - links
    - edges (to create graphs, directed with labels)
    - groups (multi-edges, unordered)
    - lists
  wait a minute, all collections can be made with links! In fact, all data structures can be made with links.
  Properties of this model: 
  - Each name/value can be present in multiple link-based-data-structure. 
  - Links are skeleton structures, with pointers to entities. An entinty is either a name/value or another link (skeleton).
  - A link (skeleton) has a single entry/identity point, to which another link-entity can point.
  - a link structure can be defined as an array (with sub-arrays or other allowed element types), with a "behaviour".
  
  Can we define a structure in the language itself?????
    
  
  
  ** Each data structure can be nested in another (except names, values, identifiers and edges)
  
  How about a more object-oriented method? An object with properties and methods.
  
  
  example:
  
  <riverSide id='left'>
    <item>farmer</item>
    <item>fox</item>
    <item>chicken</item>
    <item>grain</item>
  </riverSide>
  <riverSide id='right'>
  </riverSide>
  
  world.select('riverSide').select('item').content('farmer').move('', '');
  
  world.moveToNext('item')
  
  
  Questions:
  - should we sandbox the scripts?
  

*/