import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '../utils/asyncStorage';

const ColorPaletteContext = createContext();

export function ColorPaletteProvider({ children }) {
    const [customColors, setCustomColors] = useState({
        background: '#ffffff',
        buttons: '#2196F3',
        text: '#000000',
        incrementButton: '#4CAF50',
        decrementButton: '#f44336',
        resetButton: '#2196F3',
        settingsButton: '#1565C0',
    });
    const [initialColors, setInitialColors] = useState(null);
    const [useSameButtonColor, setUseSameButtonColor] = useState(true);
    const [initialUseSameButtonColor, setInitialUseSameButtonColor] = useState(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // Load saved colors on startup
    useEffect(() => {
        const loadSavedColors = async () => {
            try {
                const savedColors = await AsyncStorage.getItem('customColors');
                const savedButtonSetting = await AsyncStorage.getItem('useSameButtonColor');

                if (savedColors) {
                    const parsedColors = JSON.parse(savedColors);
                    setCustomColors(parsedColors);
                    setInitialColors(parsedColors);
                } else {
                    setInitialColors({ ...customColors });
                }

                if (savedButtonSetting !== null) {
                    const parsedSetting = JSON.parse(savedButtonSetting);
                    setUseSameButtonColor(parsedSetting);
                    setInitialUseSameButtonColor(parsedSetting);
                } else {
                    setInitialUseSameButtonColor(useSameButtonColor);
                }
                setIsInitialized(true);
            } catch (error) {
                console.error('Error loading saved colors:', error);
                setInitialColors({ ...customColors });
                setInitialUseSameButtonColor(useSameButtonColor);
                setIsInitialized(true);
            }
        };
        loadSavedColors();
    }, []);

    // Save colors when they change, but only after initialization
    useEffect(() => {
        if (!isInitialized) return;

        const saveColors = async () => {
            try {
                await AsyncStorage.setItem('customColors', JSON.stringify(customColors));
            } catch (error) {
                console.error('Error saving colors:', error);
            }
        };
        saveColors();
    }, [customColors, isInitialized]);

    // Save button color setting when it changes, but only after initialization
    useEffect(() => {
        if (!isInitialized) return;

        const saveButtonSetting = async () => {
            try {
                await AsyncStorage.setItem('useSameButtonColor', JSON.stringify(useSameButtonColor));
            } catch (error) {
                console.error('Error saving button color setting:', error);
            }
        };
        saveButtonSetting();
    }, [useSameButtonColor, isInitialized]);

    const updateColor = (colorType, value) => {
        if (colorType === 'buttons' && useSameButtonColor) {
            // If using same color for all buttons, update all button colors
            setCustomColors(prev => ({
                ...prev,
                buttons: value,
                incrementButton: value,
                decrementButton: value,
                resetButton: value,
                settingsButton: value,
            }));
        } else {
            setCustomColors(prev => ({
                ...prev,
                [colorType]: value
            }));
        }
    };

    const setUseSameButtonColorWithUpdate = (value) => {
        setUseSameButtonColor(value);
        if (value) {
            // When enabling same color for all buttons, update all buttons to the current 'buttons' color
            setCustomColors(prev => ({
                ...prev,
                incrementButton: prev.buttons,
                decrementButton: prev.buttons,
                resetButton: prev.buttons,
                settingsButton: prev.buttons,
            }));
        }
    };

    const resetColors = () => {
        setCustomColors({
            background: '#ffffff',
            buttons: '#2196F3',
            text: '#000000',
            incrementButton: '#4CAF50',
            decrementButton: '#f44336',
            resetButton: '#2196F3',
            settingsButton: '#1565C0',
        });
    };

    const revertToInitialColors = () => {
        if (initialColors) {
            setCustomColors(initialColors);
        }
        if (initialUseSameButtonColor !== null) {
            setUseSameButtonColor(initialUseSameButtonColor);
        }
    };

    const setInitialState = () => {
        setInitialColors({ ...customColors });
        setInitialUseSameButtonColor(useSameButtonColor);
    };

    return (
        <ColorPaletteContext.Provider value={{
            customColors,
            updateColor,
            resetColors,
            revertToInitialColors,
            setInitialState,
            useSameButtonColor,
            setUseSameButtonColor: setUseSameButtonColorWithUpdate
        }}>
            {children}
        </ColorPaletteContext.Provider>
    );
}

export function useColorPalette() {
    const context = useContext(ColorPaletteContext);
    if (!context) {
        throw new Error('useColorPalette must be used within a ColorPaletteProvider');
    }
    return context;
} 