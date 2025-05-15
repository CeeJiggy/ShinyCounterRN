import { StyleSheet, View, TouchableOpacity, Text, Platform, Image, ScrollView } from 'react-native';
import { useCounter } from '../context/CounterContext';
import { useThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

function capitalizeName(name) {
    if (!name) return '';
    // Remove -female or other suffixes for display
    let base = name.replace(/-female$/, '');
    // Capitalize each word (handles hyphens and spaces)
    return base.replace(/\b\w/g, c => c.toUpperCase()).replace(/-/g, ' ');
}

export default function CounterTabs() {
    const { counters, selectedCounterIndex, setSelectedCounterIndex, addCounter, setShowPokemonSelector } = useCounter();
    const { getThemeColors } = useThemeContext();
    const themeColors = getThemeColors();

    const handleAddCounter = () => {
        addCounter();
        setShowPokemonSelector(true);
    };

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
        addButton: {
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: themeColors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        pokeImage: {
            width: 32,
            height: 32,
            resizeMode: 'contain',
        },
        contentContainer: {
            // flex: 1,
            paddingBottom: Platform.OS === 'web' ? 80 : 0,
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

                    {counters.map((counter, index) => (
                        <TouchableOpacity
                            key={counter.id}
                            style={[
                                styles.tab,
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
                    <TouchableOpacity
                        style={styles.addTab}
                        onPress={handleAddCounter}
                    >
                        <View style={styles.addButton}>
                            <Ionicons name="add" size={24} color="#fff" />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        </View>
    );
} 