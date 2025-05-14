import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '../utils/asyncStorage';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const systemColorScheme = useColorScheme();
    const [theme, setTheme] = useState('light');
    const [isSystemTheme, setIsSystemTheme] = useState(true);

    // Load saved theme preferences
    useEffect(() => {
        const loadThemePreferences = async () => {
            try {
                const savedPreferences = await AsyncStorage.getItem('themePreferences');
                if (savedPreferences) {
                    const { isSystem, theme: savedTheme } = JSON.parse(savedPreferences);
                    console.log('Loading saved theme preferences:', { isSystem, savedTheme });
                    setIsSystemTheme(isSystem);
                    setTheme(savedTheme);
                } else {
                    console.log('No saved theme preferences, using system theme:', systemColorScheme);
                    setTheme(systemColorScheme || 'light');
                }
            } catch (error) {
                console.error('Error loading theme preferences:', error);
                setTheme(systemColorScheme || 'light');
            }
        };
        loadThemePreferences();
    }, [systemColorScheme]);

    // Save theme preferences when they change
    useEffect(() => {
        const saveThemePreferences = async () => {
            try {
                console.log('Saving theme preferences:', { isSystem: isSystemTheme, theme });
                await AsyncStorage.setItem('themePreferences', JSON.stringify({
                    isSystem: isSystemTheme,
                    theme: theme
                }));
            } catch (error) {
                console.error('Error saving theme preferences:', error);
            }
        };
        saveThemePreferences();
    }, [isSystemTheme, theme]);

    // Update theme when system theme changes and system theme is enabled
    useEffect(() => {
        if (isSystemTheme) {
            console.log('System theme changed to:', systemColorScheme);
            setTheme(systemColorScheme || 'light');
        }
    }, [systemColorScheme, isSystemTheme]);

    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            console.log('Toggling theme from', prevTheme, 'to', newTheme);
            return newTheme;
        });
    };

    const setThemeWithLogging = (newTheme) => {
        console.log('Setting theme to:', newTheme);
        setTheme(newTheme);
    };

    const getThemeColors = () => {
        const isDark = theme === 'dark' || (isSystemTheme && systemColorScheme === 'dark');
        const defaultButtonColor = isDark ? '#2196F3' : '#2196F3';

        return {
            primary: defaultButtonColor,
            secondary: defaultButtonColor,
            tertiary: defaultButtonColor,
            background: isDark ? '#242424' : '#ffffff',
            card: isDark ? '#1e1e1e' : '#f5f5f5',
            text: isDark ? '#ffffff' : '#000000',
            border: isDark ? '#333333' : '#e0e0e0',
            notification: isDark ? '#ff4081' : '#f50057',
            incrementButton: isDark ? '#4CAF50' : '#4CAF50',
            decrementButton: isDark ? '#f44336' : '#f44336',
            resetButton: isDark ? '#2196F3' : '#2196F3',
            settingsButton: isDark ? '#1565C0' : '#1565C0',
        };
    };

    const getSystemThemeColors = () => {
        const systemTheme = systemColorScheme === 'dark' ? 'dark' : 'light';
        if (systemTheme === 'dark') {
            return {
                background: '#1a1a1a',
                text: '#ffffff',
                incrementButton: '#4CAF50',
                decrementButton: '#f44336',
                resetButton: '#2196F3',
                settingsButton: '#9c27b0'
            };
        }
        return {
            background: '#ffffff',
            text: '#000000',
            incrementButton: '#4CAF50',
            decrementButton: '#f44336',
            resetButton: '#2196F3',
            settingsButton: '#9c27b0'
        };
    };

    return (
        <ThemeContext.Provider value={{
            theme,
            setTheme: setThemeWithLogging,
            isSystemTheme,
            setIsSystemTheme,
            toggleTheme,
            getThemeColors,
            getSystemThemeColors,
        }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useThemeContext() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useThemeContext must be used within a ThemeProvider');
    }
    return context;
} 