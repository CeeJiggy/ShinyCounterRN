import fetch from 'node-fetch';
import fs from 'fs';

const POKE_API_BASE = 'https://pokeapi.co/api/v2';
const OUTPUT_FILE = 'pokemonList.json';

async function fetchAllPokemon() {
    const response = await fetch(`${POKE_API_BASE}/pokemon?limit=2000`);
    const data = await response.json();
    return data.results;
}

async function fetchPokemonDetails(url) {
    const response = await fetch(url);
    return await response.json();
}

async function main() {
    const allPokemon = await fetchAllPokemon();
    const output = [];

    for (let i = 0; i < allPokemon.length; i++) {
        const pokemon = allPokemon[i];
        console.log(`Processing ${pokemon.name} (${i + 1}/${allPokemon.length})`);
        try {
            const details = await fetchPokemonDetails(pokemon.url);

            // Check for unique female sprite
            const hasFemale =
                details.sprites &&
                details.sprites.other &&
                details.sprites.other.home &&
                details.sprites.other.home.front_shiny_female !== null;

            // Add base Pokémon (only once)
            if (!output.some(p => p.name === pokemon.name)) {
                output.push({
                    name: pokemon.name,
                    url: pokemon.url,
                    hasFemale: !!hasFemale,
                });
            }

            // Add forms (only once per form)
            if (details.forms && details.forms.length > 1) {
                for (const form of details.forms) {
                    if (form.name !== pokemon.name && !output.some(p => p.name === form.name)) {
                        output.push({
                            name: form.name,
                            url: form.url,
                            hasFemale: !!hasFemale, // Forms usually follow base's female status
                            isForm: true,
                            basePokemon: pokemon.name,
                        });
                    }
                }
            }
        } catch (err) {
            console.error(`Failed to process ${pokemon.name}:`, err);
        }
    }

    // Remove duplicates (by name)
    const unique = [];
    const seen = new Set();
    for (const p of output) {
        if (!seen.has(p.name)) {
            unique.push(p);
            seen.add(p.name);
        }
    }

    // Group by basePokemon, output base first, then forms
    const grouped = [];
    // Map from base name to [base, ...forms]
    const baseMap = new Map();
    for (const p of unique) {
        const baseName = p.isForm && p.basePokemon ? p.basePokemon : p.name;
        if (!baseMap.has(baseName)) baseMap.set(baseName, []);
        baseMap.get(baseName).push(p);
    }
    for (const [baseName, group] of baseMap.entries()) {
        // Base: isForm false or missing
        const base = group.find(p => !p.isForm || !p.basePokemon);
        if (base) grouped.push(base);
        // Forms: isForm true
        const forms = group.filter(p => p.isForm && p.basePokemon);
        forms.sort((a, b) => a.name.localeCompare(b.name));
        grouped.push(...forms);
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(grouped, null, 4));
    console.log(`Done! Output written to ${OUTPUT_FILE}`);
}

main();