import React, { useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ActivityIndicator } from 'react-native';
import { CounterProvider } from '../src/context/CounterContext';
import CounterDisplay from '../src/components/CounterDisplay';
import CounterControls from '../src/components/CounterControls';
import Menu from '../src/components/Menu';
import PokemonSelector from '../src/components/PokemonSelector';
import { useCounter } from '../src/context/CounterContext';
import { ThemeProvider, useThemeContext } from '../src/context/ThemeContext';
import { ColorPaletteProvider, useColorPalette } from '../src/context/ColorPaletteContext';

// Set initial background color in index.html instead

function CounterApp() {
    const { getThemeColors, theme } = useThemeContext();
    const { customColors, useSameButtonColor } = useColorPalette();
    const themeColors = getThemeColors();
    const { isLoading } = useCounter();

    // Force re-render when theme or custom colors change
    useEffect(() => {
        // Update document body background color when theme changes
        if (typeof document !== 'undefined') {
            document.body.style.backgroundColor = themeColors.background;
        }
    }, [theme, customColors, useSameButtonColor, themeColors.background]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
            <View style={styles.content}>
                {isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={themeColors.text} />
                    </View>
                ) : (
                    <>
                        <PokemonSelector />
                        <CounterDisplay />
                        <CounterControls />
                        <Menu />
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}

export default function App() {
    return (
        <ColorPaletteProvider>
            <ThemeProvider>
                <CounterProvider>
                    <CounterApp />
                </CounterProvider>
            </ThemeProvider>
        </ColorPaletteProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
}); 