const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src/data/pokemonList.json');

// Read the JSON file
const pokemonList = JSON.parse(fs.readFileSync(filePath, 'utf8'));

// Group all Pokémon by their base name
const baseGroups = new Map();

for (const pkmn of pokemonList) {
    // Determine the base name
    const baseName = pkmn.isForm && pkmn.basePokemon ? pkmn.basePokemon : pkmn.name;
    if (!baseGroups.has(baseName)) baseGroups.set(baseName, []);
    baseGroups.get(baseName).push(pkmn);
}

// Sort each group: base first, then forms (optionally alphabetically by name)
const sortedList = [];
for (const [baseName, group] of baseGroups.entries()) {
    // Base form: isForm false or missing
    const base = group.find(p => !p.isForm || !p.basePokemon);
    if (base) sortedList.push(base);
    // Forms: isForm true
    const forms = group.filter(p => p.isForm && p.basePokemon);
    // Optionally sort forms by name for consistency
    forms.sort((a, b) => a.name.localeCompare(b.name));
    sortedList.push(...forms);
}

// Write back to the file
fs.writeFileSync(filePath, JSON.stringify(sortedList, null, 2));

console.log('pokemonList.json has been sorted with forms after their base forms.'); 