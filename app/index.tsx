import React, { useEffect } from 'react';
import { StyleSheet, View, SafeAreaView, ActivityIndicator, Image, Text } from 'react-native';
import { CounterProvider, useCounter } from '../src/context/CounterContext';
import CounterDisplay from '../src/components/CounterDisplay';
import CounterControls from '../src/components/CounterControls';
import Menu from '../src/components/Menu';
import { ThemeProvider, useThemeContext } from '../src/context/ThemeContext';
import CounterTabs from '../src/components/CounterTabs';
import HomeTabView from '../src/components/HomeTabView';
import IndividualCounterTabView from '../src/components/IndividualCounterTabView';
import SettingsTabView from '../src/components/SettingsTabView';
import { ObsProvider, useObs } from '../src/context/ObsContext';
import useObsSync from '../src/utils/useObsSync';
// Set initial background color in index.html instead

function capitalizeName(name: string): string {
    if (!name) return '';
    let base = name.replace(/-female$/, '');
    return base.replace(/\b\w/g, (c: string) => c.toUpperCase()).replace(/-/g, ' ');
}

function PokemonDisplay() {
    const { pokemonImage, pokemonName, counters, selectedCounterIndex } = useCounter();
    if (!counters || counters.length === 0 || selectedCounterIndex < 0 || selectedCounterIndex >= counters.length) {
        return null;
    }
    if (!pokemonImage) return null;
    return (
        <View style={{ alignItems: 'center', marginBottom: 10 }}>
            <Image source={{ uri: pokemonImage }} style={{ width: 200, height: 200, marginBottom: 10 }} resizeMode="contain" />
            <Text style={{ fontSize: 18, fontWeight: '500', textAlign: 'center', textTransform: 'capitalize' }}>
                {capitalizeName(pokemonName)}
            </Text>
        </View>
    );
}

function AppObsSyncer() {
    const { obsRef, obsConnected, obsSourceMappings } = useObs();
    const { counters, calculateBinomialProbability } = useCounter();
    useObsSync({ obsRef, obsConnected, obsSourceMappings, counters, calculateBinomialProbability });
    return null;
}

function CounterApp() {
    const { getThemeColors, theme } = useThemeContext();
    const themeColors = getThemeColors();
    const { isLoading, selectedCounterIndex } = useCounter();

    // Force re-render when theme or custom colors change
    useEffect(() => {
        // Update document body background color when theme changes
        if (typeof document !== 'undefined') {
            document.body.style.backgroundColor = themeColors.background;
        }
    }, [theme, themeColors.background]);

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
            {selectedCounterIndex === -2 ? (
                <SettingsTabView />
            ) : selectedCounterIndex === -1 ? (
                <HomeTabView />
            ) : (
                <IndividualCounterTabView />
            )}
            <CounterTabs />
        </SafeAreaView>
    );
}

export default function App() {
    return (
        <ThemeProvider>
            <CounterProvider>
                <ObsProvider>
                    <AppObsSyncer />
                    <CounterApp />
                </ObsProvider>
            </CounterProvider>
        </ThemeProvider>
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
    centeredContent: {
        flex: 1,
        alignItems: 'center',
    },
    counterCard: {
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
        // backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        marginBottom: 24,
        elevation: 2,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
}); 