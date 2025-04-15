import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
            } catch (error) {
                console.error('Error loading saved values:', error);
            }
        };

        loadSavedValues();
    }, []);

    // Save values when they change
    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEYS.INTERVAL, interval.toString());
    }, [interval]);

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEYS.PROBABILITY_NUMERATOR, probabilityNumerator.toString());
    }, [probabilityNumerator]);

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEYS.PROBABILITY_DENOMINATOR, probabilityDenominator.toString());
    }, [probabilityDenominator]);

    useEffect(() => {
        AsyncStorage.setItem(STORAGE_KEYS.COUNT, count.toString());
    }, [count]);

    const calculateBinomialProbability = (trials) => {
        const p = probabilityNumerator / probabilityDenominator;
        const q = 1 - p;
        let probability = 1;

        for (let i = 0; i < trials; i++) {
            probability *= q;
        }

        return (1 - probability) * 100;
    };

    const increment = () => {
        setCount(prev => Math.min(prev + interval, MAX_VALUE));
    };

    const decrement = () => {
        setCount(prev => Math.max(prev - interval, 0));
    };

    const reset = () => {
        setCount(0);
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
            calculateBinomialProbability
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