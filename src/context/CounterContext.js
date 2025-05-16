import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '../utils/asyncStorage';

export const CounterContext = createContext();

const MAX_VALUE = 999999;
const STORAGE_KEYS = {
    COUNTERS: 'shinyCounter_counters',
    SELECTED_COUNTER: 'shinyCounter_selectedCounter',
    HOME_COUNTERS: 'shinyCounter_homeCounters',
    SHOW_PROBABILITY: 'shinyCounter_showProbability',
    HOME_COUNTER_DISPLAY_MODE: 'shinyCounter_homeCounterDisplayMode',
    SHOW_HOME_PROBABILITY: 'shinyCounter_showHomeProbability',
};

export const CounterProvider = ({ children }) => {
    const [counters, setCounters] = useState([]);
    const [selectedCounterIndex, setSelectedCounterIndex] = useState(-1);
    const [homeCounters, setHomeCounters] = useState([]); // Array of counter IDs to show in home tab
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showPokemonSelector, setShowPokemonSelector] = useState(false);
    const [showProbability, setShowProbability] = useState(true);
    const [showHomeCounterControls, setShowHomeCounterControls] = useState(true);
    const [homeCounterDisplayMode, setHomeCounterDisplayMode] = useState('full');
    const [showHomeProbability, setShowHomeProbability] = useState(true);

    // Load saved values on mount
    useEffect(() => {
        const loadSavedValues = async () => {
            try {
                const savedCounters = await AsyncStorage.getItem(STORAGE_KEYS.COUNTERS);
                const savedSelectedCounter = await AsyncStorage.getItem(STORAGE_KEYS.SELECTED_COUNTER);
                const savedHomeCounters = await AsyncStorage.getItem(STORAGE_KEYS.HOME_COUNTERS);
                const savedShowProbability = await AsyncStorage.getItem(STORAGE_KEYS.SHOW_PROBABILITY);
                const savedShowHomeCounterControls = await AsyncStorage.getItem(STORAGE_KEYS.SHOW_HOME_COUNTER_CONTROLS);
                const savedHomeCounterDisplayMode = await AsyncStorage.getItem(STORAGE_KEYS.HOME_COUNTER_DISPLAY_MODE);
                const savedShowHomeProbability = await AsyncStorage.getItem(STORAGE_KEYS.SHOW_HOME_PROBABILITY);

                if (savedCounters) {
                    setCounters(JSON.parse(savedCounters));
                } else {
                    // Start with no counters
                    setCounters([]);
                }

                if (savedSelectedCounter) {
                    setSelectedCounterIndex(Number(savedSelectedCounter));
                }

                if (savedHomeCounters) {
                    setHomeCounters(JSON.parse(savedHomeCounters));
                }

                if (savedShowProbability !== null) {
                    setShowProbability(savedShowProbability === 'true');
                }

                if (savedShowHomeCounterControls !== null) {
                    setShowHomeCounterControls(savedShowHomeCounterControls === 'true');
                }

                if (savedHomeCounterDisplayMode !== null) {
                    setHomeCounterDisplayMode(savedHomeCounterDisplayMode);
                }

                if (savedShowHomeProbability !== null) {
                    setShowHomeProbability(savedShowHomeProbability === 'true');
                }

                setIsInitialized(true);
            } catch (error) {
                console.error('Error loading saved values:', error);
                setIsInitialized(true);
            } finally {
                setIsLoading(false);
            }
        };

        loadSavedValues();
    }, []);

    // Save values when they change, but only after initial load
    useEffect(() => {
        if (!isInitialized) return;

        const saveValues = async () => {
            try {
                await AsyncStorage.setItem(STORAGE_KEYS.COUNTERS, JSON.stringify(counters));
                await AsyncStorage.setItem(STORAGE_KEYS.SELECTED_COUNTER, selectedCounterIndex.toString());
                await AsyncStorage.setItem(STORAGE_KEYS.HOME_COUNTERS, JSON.stringify(homeCounters));
                await AsyncStorage.setItem(STORAGE_KEYS.SHOW_PROBABILITY, showProbability.toString());
                await AsyncStorage.setItem(STORAGE_KEYS.SHOW_HOME_COUNTER_CONTROLS, showHomeCounterControls.toString());
                await AsyncStorage.setItem(STORAGE_KEYS.HOME_COUNTER_DISPLAY_MODE, homeCounterDisplayMode);
                await AsyncStorage.setItem(STORAGE_KEYS.SHOW_HOME_PROBABILITY, showHomeProbability.toString());
            } catch (error) {
                console.error('Error saving values:', error);
            }
        };

        saveValues();
    }, [counters, selectedCounterIndex, homeCounters, showProbability, showHomeCounterControls, homeCounterDisplayMode, showHomeProbability, isInitialized]);

    const calculateBinomialProbability = (trials, numerator, denominator) => {
        const p = numerator / denominator;

        // If p is 0, probability is always 0
        if (p === 0) return 0;

        // If p is 1, probability is 100% unless trials is 0
        if (p === 1) return trials > 0 ? 100 : 0;

        const q = 1 - p;

        // For very large numbers of trials, we can use the normal approximation
        if (trials * p > 5 && trials * q > 5) {
            const mean = trials * p;
            const stdDev = Math.sqrt(trials * p * q);
            const z = mean / (stdDev * Math.SQRT2);
            const probability = (1 + Math.erf(z)) / 2;
            return probability * 100;
        }

        const probability = Math.exp(trials * Math.log(q));
        return (1 - probability) * 100;
    };

    // Add Math.erf if it's not available
    if (!Math.erf) {
        Math.erf = function (x) {
            const a1 = 0.254829592;
            const a2 = -0.284496736;
            const a3 = 1.421413741;
            const a4 = -1.453152027;
            const a5 = 1.061405429;
            const p = 0.3275911;

            const sign = x < 0 ? -1 : 1;
            x = Math.abs(x);

            const t = 1.0 / (1.0 + p * x);
            const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

            return sign * y;
        };
    }

    const getCurrentCounter = () => counters[selectedCounterIndex] || null;

    const updateCounter = (index, updates) => {
        setCounters(prev => prev.map((counter, i) =>
            i === index ? { ...counter, ...updates } : counter
        ));
    };

    const addCounter = () => {
        const newCounter = {
            id: Date.now(),
            count: 0,
            interval: 1,
            probabilityNumerator: 1,
            probabilityDenominator: 4096,
            pokemonName: null,
            pokemonImage: null
        };
        setCounters(prev => [...prev, newCounter]);
        setSelectedCounterIndex(counters.length);
    };

    const removeCounter = (index) => {
        setCounters(prev => {
            const newCounters = prev.filter((_, i) => i !== index);
            // If this was the last counter, switch to home tab
            if (newCounters.length === 0) {
                setSelectedCounterIndex(-1);
            } else if (selectedCounterIndex >= index) {
                setSelectedCounterIndex(Math.max(0, selectedCounterIndex - 1));
            }
            return newCounters;
        });
    };

    const increment = () => {
        const counter = getCurrentCounter();
        if (counter) {
            updateCounter(selectedCounterIndex, {
                count: Math.min(counter.count + counter.interval, MAX_VALUE)
            });
        }
    };

    const decrement = () => {
        const counter = getCurrentCounter();
        if (counter) {
            updateCounter(selectedCounterIndex, {
                count: Math.max(counter.count - counter.interval, 0)
            });
        }
    };

    const reset = () => {
        updateCounter(selectedCounterIndex, { count: 0 });
    };

    const setCount = (newCount, counterId = null) => {
        const validCount = Math.min(Math.max(0, isNaN(newCount) ? 0 : newCount), MAX_VALUE);
        setCounters(prev =>
            prev.map((counter, i) =>
                (counterId ? counter.id === counterId : i === selectedCounterIndex)
                    ? { ...counter, count: validCount }
                    : counter
            )
        );
    };

    const setInterval = (newInterval) => {
        updateCounter(selectedCounterIndex, { interval: newInterval });
    };

    const setProbabilityNumerator = (newNumerator) => {
        updateCounter(selectedCounterIndex, { probabilityNumerator: newNumerator });
    };

    const setProbabilityDenominator = (newDenominator) => {
        updateCounter(selectedCounterIndex, { probabilityDenominator: newDenominator });
    };

    const setPokemon = (name, image) => {
        updateCounter(selectedCounterIndex, { pokemonName: name, pokemonImage: image });
    };

    const setCounterName = (index, name) => {
        setCounters(prev => prev.map((counter, i) =>
            i === index ? { ...counter, customName: name } : counter
        ));
    };

    const addCounterToHome = (counterId) => {
        if (!homeCounters.includes(counterId)) {
            setHomeCounters(prev => [...prev, counterId]);
        }
    };

    const removeCounterFromHome = (counterId) => {
        setHomeCounters(prev => prev.filter(id => id !== counterId));
    };

    const getHomeCounters = () => {
        return counters.filter(counter => homeCounters.includes(counter.id));
    };

    const incrementHomeCounters = () => {
        setCounters(prev => prev.map(counter => {
            if (homeCounters.includes(counter.id)) {
                return {
                    ...counter,
                    count: Math.min(counter.count + counter.interval, MAX_VALUE)
                };
            }
            return counter;
        }));
    };

    const decrementHomeCounters = () => {
        setCounters(prev => prev.map(counter => {
            if (homeCounters.includes(counter.id)) {
                return {
                    ...counter,
                    count: Math.max(counter.count - counter.interval, 0)
                };
            }
            return counter;
        }));
    };

    const currentCounter = getCurrentCounter();

    return (
        <CounterContext.Provider value={{
            counters,
            selectedCounterIndex,
            setSelectedCounterIndex,
            addCounter,
            removeCounter,
            count: currentCounter?.count || 0,
            interval: currentCounter?.interval || 1,
            probabilityNumerator: currentCounter?.probabilityNumerator || 1,
            probabilityDenominator: currentCounter?.probabilityDenominator || 4096,
            pokemonName: currentCounter?.pokemonName,
            pokemonImage: currentCounter?.pokemonImage,
            setInterval,
            setProbabilityNumerator,
            setProbabilityDenominator,
            increment,
            decrement,
            reset,
            calculateBinomialProbability,
            setCount,
            setPokemon,
            isLoading,
            showPokemonSelector,
            setShowPokemonSelector,
            setCounterName,
            homeCounters,
            addCounterToHome,
            removeCounterFromHome,
            getHomeCounters,
            incrementHomeCounters,
            decrementHomeCounters,
            showProbability,
            setShowProbability,
            showHomeCounterControls,
            setShowHomeCounterControls,
            homeCounterDisplayMode,
            setHomeCounterDisplayMode,
            showHomeProbability,
            setShowHomeProbability
        }}>
            {children}
        </CounterContext.Provider>
    );
};

export const useCounter = () => {
    const context = useContext(CounterContext);
    if (!context) {
        throw new Error('useCounter must be used within a CounterProvider');
    }
    return context;
}; 