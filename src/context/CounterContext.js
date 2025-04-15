import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '../utils/asyncStorage';

export const CounterContext = createContext();

const MAX_VALUE = 999999;
const STORAGE_KEYS = {
    INTERVAL: 'shinyCounter_interval',
    PROBABILITY_NUMERATOR: 'shinyCounter_probabilityNumerator',
    PROBABILITY_DENOMINATOR: 'shinyCounter_probabilityDenominator',
    COUNT: 'shinyCounter_count'
};

export const CounterProvider = ({ children }) => {
    const [interval, setInterval] = useState(1);
    const [probabilityNumerator, setProbabilityNumerator] = useState(1);
    const [probabilityDenominator, setProbabilityDenominator] = useState(4096);
    const [count, setCount] = useState(0);
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Load saved values on mount
    useEffect(() => {
        const loadSavedValues = async () => {
            try {
                const savedInterval = await AsyncStorage.getItem(STORAGE_KEYS.INTERVAL);
                const savedNumerator = await AsyncStorage.getItem(STORAGE_KEYS.PROBABILITY_NUMERATOR);
                const savedDenominator = await AsyncStorage.getItem(STORAGE_KEYS.PROBABILITY_DENOMINATOR);
                const savedCount = await AsyncStorage.getItem(STORAGE_KEYS.COUNT);

                if (savedInterval) setInterval(Number(savedInterval));
                if (savedNumerator) setProbabilityNumerator(Number(savedNumerator));
                if (savedDenominator) setProbabilityDenominator(Number(savedDenominator));
                if (savedCount) setCount(Number(savedCount));

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
                await AsyncStorage.setItem(STORAGE_KEYS.INTERVAL, interval.toString());
                await AsyncStorage.setItem(STORAGE_KEYS.PROBABILITY_NUMERATOR, probabilityNumerator.toString());
                await AsyncStorage.setItem(STORAGE_KEYS.PROBABILITY_DENOMINATOR, probabilityDenominator.toString());
                await AsyncStorage.setItem(STORAGE_KEYS.COUNT, count.toString());
            } catch (error) {
                console.error('Error saving values:', error);
            }
        };

        saveValues();
    }, [interval, probabilityNumerator, probabilityDenominator, count, isInitialized]);

    const calculateBinomialProbability = (trials) => {
        const p = probabilityNumerator / probabilityDenominator;

        // If p is 0, probability is always 0
        if (p === 0) return 0;

        // If p is 1, probability is 100% unless trials is 0
        if (p === 1) return trials > 0 ? 100 : 0;

        const q = 1 - p;

        // For very large numbers of trials, we can use the normal approximation
        // This is valid when n*p and n*q are both > 5
        if (trials * p > 5 && trials * q > 5) {
            // Using normal approximation for large numbers
            const mean = trials * p;
            const stdDev = Math.sqrt(trials * p * q);

            // The probability of at least one success is 1 minus the probability of zero successes
            // For large numbers, this is extremely close to 1 (100%)
            // We can use the error function (erf) to calculate this precisely
            const z = mean / (stdDev * Math.SQRT2);
            const probability = (1 + Math.erf(z)) / 2;

            return probability * 100;
        }

        // For smaller numbers, use the logarithmic method
        // This is more precise for small numbers and still works well for medium-sized numbers
        const probability = Math.exp(trials * Math.log(q));
        return (1 - probability) * 100;
    };

    // Add Math.erf if it's not available (some platforms might not have it)
    if (!Math.erf) {
        // Approximation of the error function
        Math.erf = function (x) {
            // Constants for approximation
            const a1 = 0.254829592;
            const a2 = -0.284496736;
            const a3 = 1.421413741;
            const a4 = -1.453152027;
            const a5 = 1.061405429;
            const p = 0.3275911;

            // Save the sign of x
            const sign = x < 0 ? -1 : 1;
            x = Math.abs(x);

            // Formula 7.1.26 from Abramowitz and Stegun
            const t = 1.0 / (1.0 + p * x);
            const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

            return sign * y;
        };
    }

    const increment = () => {
        setCount(prev => Math.min(prev + interval, MAX_VALUE));
    };

    const decrement = () => {
        setCount(prev => Math.max(prev - interval, 0));
    };

    const reset = () => {
        setCount(0);
    };

    const setCountSafe = (newCount) => {
        // Ensure the count stays within valid bounds and is a number
        const validCount = Math.min(Math.max(0, isNaN(newCount) ? 0 : newCount), MAX_VALUE);
        setCount(validCount);
    };

    return (
        <CounterContext.Provider value={{
            count,
            interval,
            probabilityNumerator,
            probabilityDenominator,
            setInterval,
            setProbabilityNumerator,
            setProbabilityDenominator,
            increment,
            decrement,
            reset,
            calculateBinomialProbability,
            setCount: setCountSafe,
            isLoading
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