import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Modal, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import pokemonListData from '../data/pokemonList.json';
import Svg, { Path } from 'react-native-svg';

const BASE_HOME_SHINY = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny';

export default function PokemonSelector() {
    const [isVisible, setIsVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [pokemonList, setPokemonList] = useState([]);
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [loading, setLoading] = useState(false);
    const [expandedPokemon, setExpandedPokemon] = useState({});
    const { getThemeColors } = useThemeContext();
    const themeColors = getThemeColors();

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            marginBottom: 20,
        },
        pokemonImage: {
            width: 200,
            height: 200,
            marginBottom: 10,
        },
        selectButton: {
            backgroundColor: themeColors.primary,
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
        },
        selectButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        modalContent: {
            backgroundColor: themeColors.background,
            padding: 20,
            borderRadius: 12,
            width: '90%',
            maxWidth: 500,
            maxHeight: '80%',
        },
        searchInput: {
            backgroundColor: themeColors.text + '10',
            padding: 10,
            borderRadius: 8,
            marginBottom: 10,
            color: themeColors.text,
        },
        pokemonList: {
            flex: 1,
        },
        pokemonItem: {
            padding: 10,
            borderBottomWidth: 1,
            borderBottomColor: themeColors.text + '20',
        },
        pokemonItemContent: {
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
        },
        pokemonName: {
            color: themeColors.text,
            fontSize: 16,
            textTransform: 'capitalize',
            marginBottom: 10,
        },
        expandButton: {
            padding: 5,
            marginLeft: 8,
        },
        formList: {
            marginLeft: 20,
            marginTop: 5,
        },
        formItem: {
            padding: 8,
            borderLeftWidth: 1,
            borderLeftColor: themeColors.text + '20',
            marginLeft: 10,
        },
        tagContainer: {
            backgroundColor: themeColors.text + '15',
            paddingHorizontal: 8,
            paddingVertical: 2,
            borderRadius: 12,
            marginLeft: 8,
        },
        tagText: {
            color: themeColors.text + 'CC',
            fontSize: 12,
            textTransform: 'capitalize',
        },
        genderIconContainer: {
            width: 30,
            height: 30,
            borderRadius: 5,
            justifyContent: 'center',
            alignItems: 'center',
            marginHorizontal: 4,
        },
        formLabel: {
            color: themeColors.text + '80',
            fontSize: 12,
            marginLeft: 5,
        }
    });

    const GenderIcon = ({ type, size = 20 }) => {
        const color = '#FFFFFF';
        const boxColor = type === 'male' ? '#2196f3' : '#e91e63';
        return (
            <View style={[styles.genderIconContainer, { backgroundColor: boxColor }]}>
                {type === 'male' ? (
                    <Svg width={size} height={size} viewBox="0 0 512 511.01" fill="none">
                        <Path
                            d="m456.72 96.62-115.49 115.5c22.46 31.03 35.72 69.17 35.72 110.41 0 52.04-21.1 99.17-55.2 133.27-34.11 34.1-81.23 55.21-133.28 55.21-52.03 0-99.17-21.11-133.27-55.21C21.1 421.7 0 374.57 0 322.53c0-52.04 21.1-99.17 55.2-133.27 34.1-34.1 81.23-55.21 133.27-55.21 42.91 0 82.47 14.35 114.16 38.5L419.89 55.28h-62.84V0H512v158.91h-55.28V96.62zM282.66 228.35c-24.1-24.1-57.41-39.02-94.19-39.02s-70.08 14.92-94.18 39.02c-24.1 24.1-39.01 57.4-39.01 94.18 0 36.78 14.91 70.09 39.01 94.19 24.1 24.1 57.4 39.01 94.18 39.01 36.78 0 70.09-14.91 94.19-39.01 24.1-24.1 39.01-57.41 39.01-94.19s-14.91-70.08-39.01-94.18z"
                            fill={color}
                        />
                    </Svg>
                ) : (
                    <Svg width={size} height={size} viewBox="0 0 361 511.42" fill="none">
                        <Path
                            d="M203.64 359.53v44.17h78.58v52.94h-78.58v54.78H150.7v-54.78H72.13V403.7h78.57v-45.15c-37.91-6.3-71.82-24.41-97.83-50.42C20.21 275.47 0 230.35 0 180.5c0-49.84 20.21-94.97 52.87-127.63S130.65 0 180.5 0c49.84 0 94.97 20.21 127.63 52.87S361 130.66 361 180.5c0 49.84-20.21 94.97-52.87 127.63-27.52 27.52-63.9 46.2-104.49 51.4zM270.7 90.3c-23.08-23.08-54.98-37.36-90.2-37.36-35.23 0-67.12 14.28-90.2 37.36s-37.36 54.98-37.36 90.2c0 35.23 14.28 67.12 37.36 90.2s54.97 37.36 90.2 37.36c35.22 0 67.12-14.28 90.2-37.36s37.36-54.97 37.36-90.2c0-35.22-14.28-67.12-37.36-90.2z"
                            fill={color}
                        />
                    </Svg>
                )}
            </View>
        );
    };

    const ExpandIcon = ({ expanded }) => (
        <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
            <Path
                d={expanded ? "M7 10l5 5 5-5" : "M9 5l6 7-6 7"}
                stroke={themeColors.text}
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );

    useEffect(() => {
        // Group Pokemon forms with their base Pokemon
        const groupedPokemon = {};
        pokemonListData.forEach(pokemon => {
            if (pokemon.isForm && pokemon.basePokemon) {
                if (!groupedPokemon[pokemon.basePokemon]) {
                    // Try to find the base entry in the list
                    const baseEntry = pokemonListData.find(p => p.name === pokemon.basePokemon) || {};
                    groupedPokemon[pokemon.basePokemon] = {
                        name: pokemon.basePokemon,
                        url: baseEntry.url || '',
                        hasFemale: baseEntry.hasFemale || false,
                        forms: []
                    };
                }
                groupedPokemon[pokemon.basePokemon].forms.push(pokemon);
            } else if (!pokemon.isForm) {
                if (!groupedPokemon[pokemon.name]) {
                    groupedPokemon[pokemon.name] = { ...pokemon, forms: [] };
                } else {
                    // Merge any forms if already created by a form
                    groupedPokemon[pokemon.name] = { ...pokemon, forms: groupedPokemon[pokemon.name].forms || [] };
                }
            }
        });
        setPokemonList(Object.values(groupedPokemon));
        loadSelectedPokemon();
    }, []);

    const loadSelectedPokemon = async () => {
        try {
            const name = await AsyncStorage.getItem('selected_pokemon_name');
            const image = await AsyncStorage.getItem('selected_pokemon_image');
            if (name && image) {
                setSelectedPokemon({ name, image });
            }
        } catch (error) { }
    };

    const handleSelectPokemon = async (pokemon, isFemale = false) => {
        setLoading(true);
        try {
            // If imageOverride is present, use it directly and skip API fetching
            if (pokemon.imageOverride) {
                await AsyncStorage.setItem('selected_pokemon_image', pokemon.imageOverride);
                await AsyncStorage.setItem('selected_pokemon_name', pokemon.name + (isFemale ? '-female' : ''));
                setSelectedPokemon({ name: pokemon.name + (isFemale ? '-female' : ''), image: pokemon.imageOverride, isForm: pokemon.isForm, basePokemon: pokemon.basePokemon, isFemale });
                setLoading(false);
                setIsVisible(false);
                return;
            }
            let details;
            // If femaleOverride is present and we're selecting female, use that URL instead
            const urlToFetch = (isFemale && pokemon.femaleOverride) ? pokemon.femaleOverride : pokemon.url;
            const response = await fetch(urlToFetch);
            details = await response.json();
            const imageUrl = getHomeShinyImageUrl(details, pokemon, isFemale, false);
            let imageToUse = imageUrl;
            try {
                const imageResponse = await fetch(imageUrl);
                const imageBlob = await imageResponse.blob();
                const reader = new FileReader();
                reader.readAsDataURL(imageBlob);
                reader.onloadend = async () => {
                    const base64data = reader.result;
                    await AsyncStorage.setItem('selected_pokemon_image', base64data);
                    await AsyncStorage.setItem('selected_pokemon_name', pokemon.name + (isFemale ? '-female' : ''));
                    setSelectedPokemon({ name: pokemon.name + (isFemale ? '-female' : ''), image: base64data, isForm: pokemon.isForm, basePokemon: pokemon.basePokemon, isFemale });
                    setLoading(false);
                    setIsVisible(false);
                };
                return;
            } catch (error) {
                imageToUse = imageUrl;
            }
            await AsyncStorage.setItem('selected_pokemon_image', imageToUse);
            await AsyncStorage.setItem('selected_pokemon_name', pokemon.name + (isFemale ? '-female' : ''));
            setSelectedPokemon({ name: pokemon.name + (isFemale ? '-female' : ''), image: imageToUse, isForm: pokemon.isForm, basePokemon: pokemon.basePokemon, isFemale });
            setIsVisible(false);
        } catch (error) {
            console.error('Error fetching Pokemon details:', error);
            setLoading(false);
        }
    };

    const toggleExpand = (pokemonName) => {
        setExpandedPokemon(prev => {
            // If already open, close it. Otherwise, open only this one.
            if (prev[pokemonName]) {
                return {};
            } else {
                return { [pokemonName]: true };
            }
        });
    };

    const getDisplayName = (pokemon) => {
        let name = pokemon.name;
        if (name.endsWith('-female')) {
            name = name.replace(/-female$/, '');
        }
        if (pokemon.isForm) {
            // Show the full form name (e.g., 'Gigantamax Venusaur')
            return name.replace(/-/g, ' ');
        }
        return name;
    };

    // Filtered list for search
    const filteredPokemon = pokemonList
        .map(pokemon => {
            // Check if base matches
            const baseMatch = pokemon.name.toLowerCase().includes(searchQuery.toLowerCase());
            // Check if any forms match
            const matchingForms = (pokemon.forms || []).filter(form =>
                form.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (form.tag && form.tag.toLowerCase().includes(searchQuery.toLowerCase()))
            );
            if (baseMatch) {
                // Show all forms if base matches
                return { ...pokemon };
            } else if (matchingForms.length > 0) {
                // Show only matching forms, and force expanded
                return { ...pokemon, forms: matchingForms };
            }
            // No match
            return null;
        })
        .filter(Boolean);

    const renderPokemonItem = ({ item }) => {
        const isExpanded = expandedPokemon[item.name];
        const hasForms = item.forms && item.forms.length > 0;

        return (
            <View style={styles.pokemonItem}>
                <View style={styles.pokemonItemContent}>
                    <TouchableOpacity
                        style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}
                        onPress={() => handleSelectPokemon(item, false)}
                    >
                        <Text style={styles.pokemonName}>{getDisplayName(item)}</Text>
                    </TouchableOpacity>
                    {item.hasFemale && (
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity onPress={() => handleSelectPokemon(item, false)}>
                                <GenderIcon type="male" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => handleSelectPokemon(item, true)}>
                                <GenderIcon type="female" />
                            </TouchableOpacity>
                        </View>
                    )}
                    {/* Always reserve space for the expand arrow for alignment */}
                    <View style={{ width: 32, alignItems: 'center', justifyContent: 'center' }}>
                        {hasForms ? (
                            <TouchableOpacity
                                style={styles.expandButton}
                                onPress={() => toggleExpand(item.name)}
                            >
                                <ExpandIcon expanded={isExpanded} />
                            </TouchableOpacity>
                        ) : (
                            <View style={{ width: 20, height: 20, opacity: 0, pointerEvents: 'none' }}>
                                <ExpandIcon expanded={false} />
                            </View>
                        )}
                    </View>
                </View>
                {isExpanded && hasForms && (
                    <View style={[styles.formList, { flexDirection: 'row', flexWrap: 'wrap', gap: 8 }]}>
                        {item.forms.map((form, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[styles.formItem, { padding: 0, borderLeftWidth: 0, marginLeft: 0, marginBottom: 8 }]}
                                onPress={() => handleSelectPokemon(form, false)}
                            >
                                {form.tag && (
                                    <View style={styles.tagContainer}>
                                        <Text style={styles.tagText}>{form.tag}</Text>
                                    </View>
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>
                )}
            </View>
        );
    };

    return (
        <View style={styles.container}>
            {selectedPokemon && (
                <>
                    <Image
                        source={{ uri: selectedPokemon.image }}
                        style={styles.pokemonImage}
                        resizeMode="contain"
                    />
                    <Text style={styles.pokemonName}>
                        {getDisplayName(selectedPokemon)}
                    </Text>
                </>
            )}
            <TouchableOpacity
                style={styles.selectButton}
                onPress={() => {
                    setIsVisible(true);
                }}
            >
                <Text style={styles.selectButtonText}>
                    {selectedPokemon ? 'Change Pokémon' : 'Select Pokémon'}
                </Text>
            </TouchableOpacity>

            <Modal
                visible={isVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setIsVisible(false)}
            >
                <TouchableOpacity
                    style={styles.modalContainer}
                    activeOpacity={1}
                    onPress={() => setIsVisible(false)}
                >
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={styles.modalContent}
                    >
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search Pokemon..."
                            placeholderTextColor={themeColors.text + '80'}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                        {loading ? (
                            <ActivityIndicator size="large" color={themeColors.text} />
                        ) : (
                            <FlatList
                                data={filteredPokemon}
                                keyExtractor={(item) => item.name}
                                renderItem={renderPokemonItem}
                            />
                        )}
                    </TouchableOpacity>
                </TouchableOpacity>
            </Modal>
        </View>
    );
}

function getHomeShinyImageUrl(details, pokemon, isFemale = false, forceMalePath = false) {
    const id = details.id;
    // If this is a female override case, don't append /female to the URL
    if (isFemale && pokemon.femaleOverride) {
        return `${BASE_HOME_SHINY}/${id}.png`;
    }
    if (isFemale) {
        return `${BASE_HOME_SHINY}/female/${id}.png`;
    }
    return `${BASE_HOME_SHINY}/${id}.png`;
}
