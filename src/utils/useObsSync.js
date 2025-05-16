import { useEffect } from 'react';
import { updateCounterInOBS, updatePokemonImageInOBS } from './obsUtils';

console.log('useObsSync');

/**
 * Custom hook to sync mapped counters and Pokémon images to OBS sources.
 * @param {Object} params
 * @param {object} params.obsRef - Ref to the OBSWebSocket instance
 * @param {boolean} params.obsConnected - Whether OBS is connected
 * @param {Array} params.obsSourceMappings - Array of { id, counterId, sourcePrefix }
 * @param {Array} params.counters - Array of all counters
 * @param {Function} params.calculateBinomialProbability - Function to calculate probability
 */
export default function useObsSync({
    obsRef,
    obsConnected,
    obsSourceMappings = [],
    counters = [],
    calculateBinomialProbability,
}) {
    // Create a key that changes when any mapped counter's count or image changes
    const mappedCountersKey = JSON.stringify(
        obsSourceMappings.map(mapping => {
            const counter = counters.find(c => String(c.id) === String(mapping.counterId));
            return counter ? { id: counter.id, count: counter.count, image: counter.pokemonImage } : {};
        })
    );

    useEffect(() => {
        console.log('useObsSync effect running', {
            obsConnected,
            obsRefCurrent: !!obsRef.current,
            obsSourceMappings,
            counters,
        });
        if (obsConnected && obsRef.current && obsSourceMappings.length > 0) {
            obsSourceMappings.forEach(mapping => {
                console.log('Checking mapping:', mapping);
                if (!mapping.counterId || !mapping.sourcePrefix) {
                    console.log('Skipping mapping: missing counterId or sourcePrefix', mapping);
                    return;
                }
                const counter = counters.find(c => String(c.id) === String(mapping.counterId));
                if (!counter) {
                    console.log('Skipping mapping: counter not found', mapping.counterId, counters);
                    return;
                }
                console.log('About to update OBS:', mapping.sourcePrefix, counter.count, counter.pokemonImage);
                updateCounterInOBS(obsRef.current, `${mapping.sourcePrefix}Count`, counter.count ?? 0);
                if (counter.pokemonImage) {
                    console.log('Updating OBS image with URL:', counter.pokemonImage);
                    updatePokemonImageInOBS(obsRef.current, `${mapping.sourcePrefix}Image`, counter.pokemonImage);
                }
                // Probability update
                if (calculateBinomialProbability && counter.count != null && counter.probabilityNumerator && counter.probabilityDenominator) {
                    const prob = calculateBinomialProbability(counter.count, counter.probabilityNumerator, counter.probabilityDenominator);
                    const probText = `${prob.toFixed(2)}%`;
                    updateCounterInOBS(obsRef.current, `${mapping.sourcePrefix}Probability`, probText);
                }
            });
        }
    }, [obsConnected, obsRef, obsSourceMappings, counters, mappedCountersKey, calculateBinomialProbability]);
} 