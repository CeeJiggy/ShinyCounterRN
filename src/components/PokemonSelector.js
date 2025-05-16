import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Image, Modal, TextInput, FlatList, ActivityIndicator } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { useCounter } from '../context/CounterContext';
import pokemonListData from '../data/pokemonList.json';
import Svg, { Path } from 'react-native-svg';
import { Ionicons } from '@expo/vector-icons';

const BASE_HOME_SHINY = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/home/shiny';

export default function PokemonSelector() {
    const {
        counters = [],
        selectedCounterIndex = 0,
        setPokemon,
        showPokemonSelector,
        setShowPokemonSelector,
        setInterval,
        setProbabilityNumerator,
        setProbabilityDenominator,
        setCounterName
    } = useCounter();

    const [searchQuery, setSearchQuery] = useState('');
    const [pokemonList, setPokemonList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [expandedPokemon, setExpandedPokemon] = useState({});
    const [selectedPokemon, setSelectedPokemon] = useState(null);
    const [tempCounterName, setTempCounterName] = useState('');
    const [tempInterval, setTempInterval] = useState('1');
    const [tempNumerator, setTempNumerator] = useState('1');
    const [tempDenominator, setTempDenominator] = useState('4096');
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
        },
        setupTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: themeColors.text,
            marginBottom: 20,
            textAlign: 'center',
        },
        setupInput: {
            backgroundColor: themeColors.text + '10',
            padding: 10,
            borderRadius: 8,
            marginBottom: 15,
            color: themeColors.text,
        },
        setupLabel: {
            color: themeColors.text,
            fontSize: 16,
            marginBottom: 5,
            textAlign: 'center',
        },
        oddsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 15,
        },
        oddsInput: {
            flex: 1,
            backgroundColor: themeColors.text + '10',
            padding: 10,
            borderRadius: 8,
            width: 50,
            color: themeColors.text,
        },
        oddsSeparator: {
            color: themeColors.text,
            fontSize: 20,
            marginHorizontal: 10,
        },
        setupButtonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
        },
        setupButton: {
            flex: 1,
            padding: 15,
            borderRadius: 8,
            marginHorizontal: 5,
            alignItems: 'center',
        },
        setupButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
        cancelButton: {
            backgroundColor: themeColors.text + '40',
        },
        confirmButton: {
            backgroundColor: themeColors.primary,
        },
        backButton: {
            position: 'absolute',
            top: 10,
            left: 10,
            zIndex: 1,
        },
        selectedPokemonPreview: {
            alignItems: 'center',
            marginBottom: 20,
        },
        selectedPokemonImage: {
            width: 100,
            height: 100,
            // marginBottom: 10,
        },
        selectedPokemonName: {
            fontSize: 18,
            color: themeColors.text,
            textTransform: 'capitalize',
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
    }, []);

    const formatPokemonName = (name) => {
        return name.replace(/-female$/, '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    };

    const handleSelectPokemon = async (pokemon, isFemale = false) => {
        setLoading(true);
        try {
            const pokemonName = pokemon.name + (isFemale ? '-female' : '');
            const isNewCounter = !counters[selectedCounterIndex]?.pokemonName;
            const formattedNewName = formatPokemonName(pokemonName);

            // If imageOverride is present, use it directly and skip API fetching
            if (pokemon.imageOverride) {
                if (isNewCounter) {
                    setSelectedPokemon({
                        name: pokemonName,
                        image: pokemon.imageOverride
                    });
                    // Pre-fill counter name
                    setTempCounterName(formattedNewName);
                } else {
                    // For existing counter, update Pokemon and possibly the name
                    setPokemon(pokemonName, pokemon.imageOverride);
                    const currentCounter = counters[selectedCounterIndex];
                    const currentPokemonName = formatPokemonName(currentCounter.pokemonName || '');
                    if (currentCounter.customName === currentPokemonName) {
                        setCounterName(selectedCounterIndex, formattedNewName);
                    }
                    setShowPokemonSelector(false);
                }
                setLoading(false);
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
                reader.onloadend = () => {
                    const base64data = reader.result;
                    if (isNewCounter) {
                        setSelectedPokemon({
                            name: pokemonName,
                            image: base64data
                        });
                        // Pre-fill counter name
                        setTempCounterName(formattedNewName);
                    } else {
                        // For existing counter, update Pokemon and possibly the name
                        setPokemon(pokemonName, base64data);
                        const currentCounter = counters[selectedCounterIndex];
                        const currentPokemonName = formatPokemonName(currentCounter.pokemonName || '');
                        if (currentCounter.customName === currentPokemonName) {
                            setCounterName(selectedCounterIndex, formattedNewName);
                        }
                        setShowPokemonSelector(false);
                    }
                    setLoading(false);
                };
                return;
            } catch (error) {
                imageToUse = imageUrl;
            }

            if (isNewCounter) {
                setSelectedPokemon({
                    name: pokemonName,
                    image: imageToUse
                });
                // Pre-fill counter name
                setTempCounterName(formattedNewName);
            } else {
                // For existing counter, update Pokemon and possibly the name
                setPokemon(pokemonName, imageToUse);
                const currentCounter = counters[selectedCounterIndex];
                const currentPokemonName = formatPokemonName(currentCounter.pokemonName || '');
                if (currentCounter.customName === currentPokemonName) {
                    setCounterName(selectedCounterIndex, formattedNewName);
                }
                setShowPokemonSelector(false);
            }
        } catch (error) {
            console.error('Error fetching Pokemon details:', error);
            setLoading(false);
        }
    };

    const handleSetupComplete = () => {
        if (selectedPokemon) {
            setPokemon(selectedPokemon.name, selectedPokemon.image);
            setInterval(parseInt(tempInterval) || 1);
            setProbabilityNumerator(parseInt(tempNumerator) || 1);
            setProbabilityDenominator(parseInt(tempDenominator) || 4096);
            if (tempCounterName.trim()) {
                setCounterName(selectedCounterIndex, tempCounterName.trim());
            }
        }
        setShowPokemonSelector(false);
        setSelectedPokemon(null);
        setTempCounterName('');
        setTempInterval('1');
        setTempNumerator('1');
        setTempDenominator('4096');
    };

    const handleSetupCancel = () => {
        setSelectedPokemon(null);
        setTempCounterName('');
        setTempInterval('1');
        setTempNumerator('1');
        setTempDenominator('4096');
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

    const renderSetupContent = () => (
        <>
            <TouchableOpacity
                style={styles.backButton}
                onPress={handleSetupCancel}
            >
                <Ionicons name="arrow-back" size={24} color={themeColors.text} />
            </TouchableOpacity>
            <Text style={styles.setupTitle}>Configure Counter</Text>
            <View style={styles.selectedPokemonPreview}>
                {selectedPokemon?.image && (
                    <Image
                        source={{ uri: selectedPokemon.image }}
                        style={styles.selectedPokemonImage}
                    />
                )}
            </View>



            <Text style={styles.setupLabel}>Counter Name</Text>
            <TextInput
                style={styles.setupInput}
                value={tempCounterName}
                onChangeText={setTempCounterName}
                placeholder="Enter counter name"
                placeholderTextColor={themeColors.text + '80'}
                maxLength={32}
            />

            <Text style={styles.setupLabel}>Counter Interval</Text>
            <TextInput
                style={styles.setupInput}
                value={tempInterval}
                onChangeText={setTempInterval}
                keyboardType="numeric"
                placeholder="Enter interval"
                placeholderTextColor={themeColors.text + '80'}
            />

            <Text style={styles.setupLabel}>Odds</Text>
            <View style={styles.oddsContainer}>
                <TextInput
                    style={styles.oddsInput}
                    value={tempNumerator}
                    onChangeText={setTempNumerator}
                    keyboardType="numeric"
                    placeholder="Numerator"
                    placeholderTextColor={themeColors.text + '80'}
                />
                <Text style={styles.oddsSeparator}>/</Text>
                <TextInput
                    style={styles.oddsInput}
                    value={tempDenominator}
                    onChangeText={setTempDenominator}
                    keyboardType="numeric"
                    placeholder="Denominator"
                    placeholderTextColor={themeColors.text + '80'}
                />
            </View>

            <View style={styles.setupButtonContainer}>
                <TouchableOpacity
                    style={[styles.setupButton, styles.cancelButton]}
                    onPress={handleSetupCancel}
                >
                    <Text style={styles.setupButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.setupButton, styles.confirmButton]}
                    onPress={handleSetupComplete}
                >
                    <Text style={styles.setupButtonText}>Confirm</Text>
                </TouchableOpacity>
            </View>
        </>
    );

    const renderPokemonSelectorContent = () => (
        <>
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
                    style={{
                        scrollbarColor: `${themeColors.primary} ${themeColors.background}`,
                        scrollbarWidth: 'thin',
                        paddingHorizontal: 10
                    }}
                />
            )}
        </>
    );

    return (
        <Modal
            visible={showPokemonSelector}
            animationType="fade"
            transparent={true}
            onRequestClose={() => setShowPokemonSelector(false)}
        >
            <TouchableOpacity
                style={styles.modalContainer}
                activeOpacity={1}
                onPress={() => setShowPokemonSelector(false)}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    onPress={(e) => e.stopPropagation()}
                    style={styles.modalContent}
                >
                    {selectedPokemon ? renderSetupContent() : renderPokemonSelectorContent()}
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
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
