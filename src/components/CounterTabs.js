import { StyleSheet, View, TouchableOpacity, Text, Platform, Image, ScrollView } from 'react-native';
import { useCounter } from '../context/CounterContext';
import { useThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Button from './common/Button';
import { useState } from 'react';

function capitalizeName(name) {
    if (!name) return '';
    // Remove -female or other suffixes for display
    let base = name.replace(/-female$/, '');
    // Capitalize each word (handles hyphens and spaces)
    return base.replace(/\b\w/g, c => c.toUpperCase()).replace(/-/g, ' ');
}

export default function CounterTabs({ onExpandAllChange } = {}) {
    const { counters, selectedCounterIndex, setSelectedCounterIndex, addCounter, setShowPokemonSelector } = useCounter();
    const { getThemeColors, theme } = useThemeContext();
    const themeColors = getThemeColors();
    const isDark = theme === 'dark';
    const [expandAll, setExpandAll] = useState(false);

    const handleAddCounter = () => {
        addCounter();
        setShowPokemonSelector(true);
    };

    const handleExpandAll = () => {
        setExpandAll(prev => {
            const next = !prev;
            if (onExpandAllChange) onExpandAllChange(next);
            return next;
        });
    };

    const counterTabTint = isDark
        ? { backgroundColor: '#212121' }
        : { backgroundColor: '#eeeeee' };

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            backgroundColor: themeColors.background,
            borderTopWidth: 1,
            borderTopColor: themeColors.text + '20',
            paddingBottom: Platform.OS === 'ios' ? 20 : 0,
            minHeight: Platform.OS === 'web' ? 80 : 'auto',
            width: '100%',
            ...(Platform.OS === 'web'
                ? {
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1000,
                    boxShadow: '0 -2px 8px rgba(0,0,0,0.08)',
                }
                : { position: 'relative' }),
        },
        tab: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: 10,
            borderTopWidth: 2,
            borderTopColor: 'transparent',
            minWidth: Platform.OS === 'web' ? 80 : 'auto',
        },
        selectedTab: {
            borderTopColor: themeColors.primary,
        },
        tabText: {
            color: themeColors.text,
            fontSize: 12,
            marginTop: 4,
            textAlign: 'center',
            maxWidth: '100%',
            overflow: 'hidden',
        },
        selectedTabText: {
            color: themeColors.primary,
        },
        addTab: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: 10,
            minWidth: Platform.OS === 'web' ? 80 : 'auto',
        },
        expandTab: {
            flex: 1,
            alignItems: 'center',
            paddingVertical: 10,
            minWidth: Platform.OS === 'web' ? 80 : 'auto',
        },
        pokeImage: {
            width: 32,
            height: 32,
            resizeMode: 'contain',
        },
        contentContainer: {
            paddingBottom: Platform.OS === 'web' ? 80 : 0,
        },
        addButtonContainer: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: themeColors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
    });

    return (
        <View style={styles.contentContainer}>
            <View style={styles.container}>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexGrow: 1 }}
                    style={{ flex: 1 }}
                >
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            selectedCounterIndex === -1 && styles.selectedTab
                        ]}
                        onPress={() => setSelectedCounterIndex(-1)}
                    >
                        <Ionicons
                            name="home"
                            size={28}
                            color={selectedCounterIndex === -1 ? themeColors.primary : themeColors.text}
                        />
                        <Text
                            style={[
                                styles.tabText,
                                selectedCounterIndex === -1 && styles.selectedTabText
                            ]}
                        >
                            Home
                        </Text>
                    </TouchableOpacity>

                    {/* Settings Tab (always visible, between Home and Expand/Collapse) */}
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            selectedCounterIndex === -2 && styles.selectedTab
                        ]}
                        onPress={() => setSelectedCounterIndex(-2)}
                    >
                        <Ionicons
                            name="settings"
                            size={28}
                            color={selectedCounterIndex === -2 ? themeColors.primary : themeColors.text}
                        />
                        <Text
                            style={[
                                styles.tabText,
                                selectedCounterIndex === -2 && styles.selectedTabText
                            ]}
                        >
                            Settings
                        </Text>
                    </TouchableOpacity>

                    {/* Expand/Collapse All Tab */}
                    <TouchableOpacity
                        style={[
                            styles.tab,
                            styles.expandTab,
                            expandAll && styles.selectedTab
                        ]}
                        onPress={handleExpandAll}
                    >
                        <Ionicons
                            name={expandAll ? 'chevron-forward-circle' : 'chevron-down-circle'}
                            size={28}
                            color={expandAll ? themeColors.primary : themeColors.text}
                        />
                        <Text
                            style={[
                                styles.tabText,
                                expandAll && styles.selectedTabText
                            ]}
                        >
                            {expandAll ? 'Hide' : 'Show'}
                        </Text>
                    </TouchableOpacity>

                    {/* Only show counter tabs if expandAll is true, or show the selected one if not Home */}
                    {expandAll && counters.length > 0
                        ? <>
                            {counters.map((counter, index) => (
                                <TouchableOpacity
                                    key={counter.id}
                                    style={[
                                        styles.tab,
                                        counterTabTint,
                                        selectedCounterIndex === index && styles.selectedTab
                                    ]}
                                    onPress={() => setSelectedCounterIndex(index)}
                                >
                                    {counter.pokemonImage ? (
                                        <Image
                                            source={{ uri: counter.pokemonImage }}
                                            style={styles.pokeImage}
                                        />
                                    ) : (
                                        <Ionicons
                                            name="ellipsis-horizontal-circle"
                                            size={28}
                                            color={selectedCounterIndex === index ? themeColors.primary : themeColors.text}
                                        />
                                    )}
                                    <Text
                                        style={[
                                            styles.tabText,
                                            selectedCounterIndex === index && styles.selectedTabText
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {counter.customName ? counter.customName : (counter.pokemonName ? capitalizeName(counter.pokemonName) : `Counter ${index + 1}`)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </>
                        : (selectedCounterIndex > -1 && counters[selectedCounterIndex] ? (
                            <TouchableOpacity
                                key={counters[selectedCounterIndex].id}
                                style={[
                                    styles.tab,
                                    counterTabTint,
                                    styles.selectedTab
                                ]}
                                onPress={() => setSelectedCounterIndex(selectedCounterIndex)}
                            >
                                {counters[selectedCounterIndex].pokemonImage ? (
                                    <Image
                                        source={{ uri: counters[selectedCounterIndex].pokemonImage }}
                                        style={styles.pokeImage}
                                    />
                                ) : (
                                    <Ionicons
                                        name="ellipsis-horizontal-circle"
                                        size={28}
                                        color={themeColors.primary}
                                    />
                                )}
                                <Text
                                    style={[styles.tabText, styles.selectedTabText]}
                                    numberOfLines={1}
                                >
                                    {counters[selectedCounterIndex].customName ? counters[selectedCounterIndex].customName : (counters[selectedCounterIndex].pokemonName ? capitalizeName(counters[selectedCounterIndex].pokemonName) : `Counter ${selectedCounterIndex + 1}`)}
                                </Text>
                            </TouchableOpacity>
                        ) : null)
                    }

                    {/* Always show Add Counter tab as a tab with label */}
                    <TouchableOpacity
                        style={styles.tab}
                        onPress={handleAddCounter}
                    >
                        <Ionicons name="add" size={24} color={themeColors.primary} />
                        <Text style={[styles.tabText, { color: themeColors.primary }]}>Add</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
} 