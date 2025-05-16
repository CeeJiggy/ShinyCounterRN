import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, Switch, ScrollView, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useCounter } from '../context/CounterContext';
import { useThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import PokemonSelector from './PokemonSelector';

export default function Menu({ showThemeOnly = false }) {
    const [isVisible, setIsVisible] = useState(false);
    const [tempInterval, setTempInterval] = useState('');
    const [tempNumerator, setTempNumerator] = useState('');
    const [tempDenominator, setTempDenominator] = useState('');
    const [tempCounterName, setTempCounterName] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('light');
    const [initialSettings, setInitialSettings] = useState({
        theme: 'light',
        interval: '',
        numerator: '',
        denominator: ''
    });
    const [initialTheme, setInitialTheme] = useState('light');
    const [showNoCountersMsg, setShowNoCountersMsg] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);

    const { colors, dark } = useTheme();
    const { isSystemTheme, setIsSystemTheme, theme, setTheme, getThemeColors, getSystemThemeColors } = useThemeContext();

    // Use showPokemonSelector from context
    const {
        counters = [],
        selectedCounterIndex = 0,
        setSelectedCounterIndex,
        interval,
        probabilityNumerator,
        probabilityDenominator,
        setInterval,
        setProbabilityNumerator,
        setProbabilityDenominator,
        reset,
        removeCounter,
        showPokemonSelector,
        setShowPokemonSelector,
        setCounterName
    } = useCounter();

    // Get theme colors for the menu UI
    const getMenuColors = () => {
        if (isSystemTheme) {
            return getSystemThemeColors();
        }
        return getThemeColors();
    };

    const menuColors = getMenuColors();
    const themeColors = getThemeColors();

    // Force re-render when theme changes
    useEffect(() => {
        // This empty effect will cause the component to re-render when theme changes
    }, [theme]);

    useEffect(() => {
        setShowNoCountersMsg(counters.length === 0);
        if (counters && counters[selectedCounterIndex]) {
            setTempCounterName(counters[selectedCounterIndex].customName || '');
        }
    }, [counters, selectedCounterIndex]);

    // Pre-populate name field with Pokémon name if empty and a Pokémon is selected
    useEffect(() => {
        if (
            counters &&
            counters[selectedCounterIndex] &&
            (!counters[selectedCounterIndex].customName || counters[selectedCounterIndex].customName.trim() === '') &&
            counters[selectedCounterIndex].pokemonName
        ) {
            const pokeName = counters[selectedCounterIndex].pokemonName;
            const capName = pokeName.replace(/-female$/, '').replace(/\b\w/g, c => c.toUpperCase()).replace(/-/g, ' ');
            setTempCounterName(capName);
        }
    }, [counters && counters[selectedCounterIndex]?.pokemonName]);

    const handleOpenMenu = () => {
        // Store initial settings when opening the modal
        setInitialSettings({
            theme: theme,
            interval: interval?.toString() || '',
            numerator: probabilityNumerator?.toString() || '',
            denominator: probabilityDenominator?.toString() || ''
        });

        // Set the initial theme to the current theme ONLY when opening
        setInitialTheme(theme);
        setSelectedTheme(theme);

        setTempInterval(interval?.toString() || '');
        setTempNumerator(probabilityNumerator?.toString() || '');
        setTempDenominator(probabilityDenominator?.toString() || '');

        setIsVisible(true);
    };

    const handleCancel = () => {
        // Restore initial settings when canceling
        setSelectedTheme(initialSettings.theme);
        setTempInterval(initialSettings.interval);
        setTempNumerator(initialSettings.numerator);
        setTempDenominator(initialSettings.denominator);

        // Revert to the initial theme immediately
        if (!isSystemTheme) {
            setTheme(initialTheme);
        }

        setIsVisible(false);
    };

    const saveSettings = () => {
        const newInterval = parseInt(tempInterval) || 1;
        const newNumerator = parseInt(tempNumerator) || 1;
        const newDenominator = parseInt(tempDenominator) || 4096;

        setInterval(newInterval);
        setProbabilityNumerator(newNumerator);
        setProbabilityDenominator(newDenominator);
        if (setCounterName && counters[selectedCounterIndex]) {
            if (tempCounterName.trim() !== '') {
                setCounterName(selectedCounterIndex, tempCounterName.trim());
            } else {
                // Fallback to Pokémon name or default
                const pokeName = counters[selectedCounterIndex].pokemonName;
                if (pokeName) {
                    // Capitalize like in CounterTabs
                    const capName = pokeName.replace(/-female$/, '').replace(/\b\w/g, c => c.toUpperCase()).replace(/-/g, ' ');
                    setCounterName(selectedCounterIndex, capName);
                } else {
                    setCounterName(selectedCounterIndex, `Counter ${selectedCounterIndex + 1}`);
                }
            }
        }

        // Theme changes are already applied, just close the modal
        setIsVisible(false);
    };

    const handleThemeChange = (newTheme) => {
        setSelectedTheme(newTheme);
        if (!isSystemTheme) {
            setTheme(newTheme);
        }
    };

    const handleDeleteCounter = () => {
        setShowDeleteConfirmation(true);
    };

    const confirmDeleteCounter = () => {
        if (counters.length > 1) {
            removeCounter(selectedCounterIndex);
            setSelectedCounterIndex(0);
            setIsVisible(false);
        } else if (counters.length === 1) {
            removeCounter(selectedCounterIndex);
            setShowNoCountersMsg(true);
            setIsVisible(false);
        }
        setShowDeleteConfirmation(false);
    };

    const cancelDeleteCounter = () => {
        setShowDeleteConfirmation(false);
    };

    const styles = StyleSheet.create({
        menuButton: {
            backgroundColor: themeColors.settingsButton,
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            position: 'absolute',
            top: 20,
            right: 20,
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        menuButtonText: {
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
            backgroundColor: menuColors.background,
            padding: 0,
            paddingTop: 20,
            borderRadius: 10,
            width: '90%',
            maxWidth: 500,
            maxHeight: Platform.OS === 'web' ? '80vh' : '80%',
        },
        modalTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
            textAlign: 'center',
            color: menuColors.text,
            paddingHorizontal: 20,
        },
        section: {
            marginBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: menuColors.text,
            paddingBottom: 15,
            paddingHorizontal: 20,
        },
        sectionTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: menuColors.text,
            marginBottom: 10,
            textAlign: 'center',
        },
        row: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
        },
        label: {
            fontSize: 16,
            marginBottom: 5,
            color: menuColors.text,
            textAlign: 'center',
        },
        divider: {
            height: 1,
            backgroundColor: menuColors.text,
            marginVertical: 10,
        },
        inputContainer: {
            marginBottom: 15,
        },
        input: {
            borderWidth: 1,
            borderColor: menuColors.text,
            borderRadius: 5,
            padding: 10,
            fontSize: 16,
            textAlign: 'center',
            color: menuColors.text,
            backgroundColor: menuColors.background,
        },
        oddsContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 15,
        },
        oddsInput: {
            borderWidth: 1,
            borderColor: menuColors.text,
            borderRadius: 5,
            padding: 10,
            fontSize: 16,
            color: menuColors.text,
            backgroundColor: menuColors.background,
            width: '45%',
            textAlign: 'center',
        },
        oddsSeparator: {
            fontSize: 24,
            color: menuColors.text,
            marginHorizontal: 10,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 20,
            paddingHorizontal: 20,
            paddingBottom: 20,
            backgroundColor: menuColors.background,
            borderBottomLeftRadius: 10,
            borderBottomRightRadius: 10,
        },
        button: {
            padding: 10,
            borderRadius: 5,
            minWidth: 100,
            alignItems: 'center',
        },
        cancelButton: {
            backgroundColor: menuColors.decrementButton,
        },
        saveButton: {
            backgroundColor: menuColors.incrementButton,
        },
        deleteButton: {
            backgroundColor: 'red',
            marginTop: 10,
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
        },
        deleteButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
        resetButton: {
            backgroundColor: menuColors.resetButton,
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 10,
        },
        resetButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
        radioContainer: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: 10,
        },
        radioOption: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
        },
        radioButton: {
            height: 24,
            width: 24,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: menuColors.text,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 10,
        },
        radioButtonSelected: {
            height: 12,
            width: 12,
            borderRadius: 6,
            backgroundColor: menuColors.text,
        },
        radioLabel: {
            fontSize: 16,
            color: menuColors.text,
        },
        noCountersMsg: {
            color: menuColors.text,
            fontSize: 16,
            fontWeight: 'bold',
            textAlign: 'center',
            marginVertical: 20,
        },
        warningContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
        },
        addButton: {
            width: 25,
            height: 25,
            borderRadius: 20,
            backgroundColor: themeColors.primary,
            alignItems: 'center',
            justifyContent: 'center',
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
        confirmationModal: {
            backgroundColor: menuColors.background,
            padding: 20,
            borderRadius: 10,
            width: '80%',
            maxWidth: 400,
        },
        confirmationTitle: {
            fontSize: 20,
            fontWeight: 'bold',
            color: menuColors.text,
            marginBottom: 15,
            textAlign: 'center',
        },
        confirmationText: {
            fontSize: 16,
            color: menuColors.text,
            marginBottom: 20,
            textAlign: 'center',
        },
        confirmationButtons: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
        },
        confirmationButton: {
            flex: 1,
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
        },
        cancelDeleteButton: {
            backgroundColor: menuColors.decrementButton,
        },
        confirmDeleteButton: {
            backgroundColor: 'red',
        },
        confirmationButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

    return (
        <>
            <TouchableOpacity style={styles.menuButton} onPress={handleOpenMenu}>
                <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>

            {/* Only render the modal for selecting/changing Pokemon here */}
            <PokemonSelector />

            <Modal
                visible={isVisible}
                animationType="fade"
                transparent={true}
                onRequestClose={handleCancel}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            {!showThemeOnly && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Counter Settings</Text>
                                    {showNoCountersMsg || counters.length === 0 ? (
                                        <View style={styles.warningContainer}>
                                            <Text style={styles.noCountersMsg}>
                                                Click
                                            </Text>
                                            <View style={styles.addButton}>
                                                <Ionicons name="add" size={16} color="#fff" />
                                            </View>
                                            <Text style={styles.noCountersMsg}>
                                                to add a new counter.
                                            </Text>
                                        </View>
                                    ) : (
                                        <>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.label}>Counter Name</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    value={tempCounterName}
                                                    onChangeText={setTempCounterName}
                                                    placeholder="Enter counter name"
                                                    placeholderTextColor={menuColors.text + '80'}
                                                    maxLength={32}
                                                />
                                            </View>
                                            <View style={{ alignItems: 'center', marginBottom: 20 }}>
                                                <TouchableOpacity
                                                    style={styles.selectButton}
                                                    onPress={() => {
                                                        setIsVisible(false);
                                                        setTimeout(() => setShowPokemonSelector(true), 300);
                                                    }}
                                                >
                                                    <Text style={styles.selectButtonText}>
                                                        {counters[selectedCounterIndex]?.pokemonImage ? 'Change Pokémon' : 'Select Pokémon'}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                            <View style={styles.inputContainer}>
                                                <Text style={styles.label}>Counter Interval</Text>
                                                <TextInput
                                                    style={styles.input}
                                                    value={tempInterval}
                                                    onChangeText={setTempInterval}
                                                    keyboardType="numeric"
                                                    placeholder="Enter interval"
                                                    placeholderTextColor={menuColors.text + '80'}
                                                />
                                            </View>

                                            <View style={styles.inputContainer}>
                                                <Text style={styles.label}>Odds</Text>
                                                <View style={styles.oddsContainer}>
                                                    <TextInput
                                                        style={styles.oddsInput}
                                                        value={tempNumerator}
                                                        onChangeText={setTempNumerator}
                                                        keyboardType="numeric"
                                                        placeholder="Numerator"
                                                        placeholderTextColor={menuColors.text + '80'}
                                                    />
                                                    <Text style={styles.oddsSeparator}>/</Text>
                                                    <TextInput
                                                        style={styles.oddsInput}
                                                        value={tempDenominator}
                                                        onChangeText={setTempDenominator}
                                                        keyboardType="numeric"
                                                        placeholder="Denominator"
                                                        placeholderTextColor={menuColors.text + '80'}
                                                    />
                                                </View>
                                            </View>

                                            <TouchableOpacity
                                                style={styles.deleteButton}
                                                onPress={handleDeleteCounter}
                                            >
                                                <Text style={styles.deleteButtonText}>Delete Counter</Text>
                                            </TouchableOpacity>
                                        </>
                                    )}
                                </View>
                            )}
                        </ScrollView>

                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleCancel}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={saveSettings}
                                disabled={showNoCountersMsg || counters.length === 0}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Delete Confirmation Modal */}
            {!showThemeOnly && (
                <Modal
                    visible={showDeleteConfirmation}
                    transparent={true}
                    animationType="fade"
                    onRequestClose={cancelDeleteCounter}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.confirmationModal}>
                            <Text style={styles.confirmationTitle}>Delete Counter</Text>
                            <Text style={styles.confirmationText}>
                                Are you sure you want to delete this counter? This action cannot be undone.
                            </Text>
                            <View style={styles.confirmationButtons}>
                                <TouchableOpacity
                                    style={[styles.confirmationButton, styles.cancelDeleteButton]}
                                    onPress={cancelDeleteCounter}
                                >
                                    <Text style={styles.confirmationButtonText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.confirmationButton, styles.confirmDeleteButton]}
                                    onPress={confirmDeleteCounter}
                                >
                                    <Text style={styles.confirmationButtonText}>Delete</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
} 