// src/utils/obsUtils.js
// Utility functions for interacting with OBS via obs-websocket-js

/**
 * Update a text source in OBS with the given value.
 * @param {OBSWebSocket} obs - The obs-websocket-js instance
 * @param {string} sourceName - The name of the text source in OBS
 * @param {string|number} value - The value to set as text
 */
export async function updateCounterInOBS(obs, sourceName, value) {
    console.log('Calling updateCounterInOBS', sourceName, value);
    if (!obs) return;
    try {
        await obs.call('SetInputSettings', {
            inputName: sourceName,
            inputSettings: { text: String(value) },
            overlay: true,
        });
    } catch (err) {
        console.error('Failed to update counter in OBS:', err);
    }
}

/**
 * Update an image source in OBS with the given file path.
 * @param {OBSWebSocket} obs - The obs-websocket-js instance
 * @param {string} sourceName - The name of the image source in OBS
 * @param {string} imagePath - The file path to set for the image
 */
export async function updatePokemonImageInOBS(obs, sourceName, imagePath) {
    console.log('Calling updatePokemonImageInOBS', sourceName, imagePath);
    if (!obs) return;
    try {
        await obs.call('SetInputSettings', {
            inputName: sourceName,
            inputSettings: { file: imagePath },
            overlay: true,
        });
    } catch (err) {
        console.error('Failed to update Pokémon image in OBS:', err);
    }
} 