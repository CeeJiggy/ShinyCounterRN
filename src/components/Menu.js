import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, Switch, ScrollView, Platform } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useCounter } from '../context/CounterContext';
import { useThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function Menu() {
    const [isVisible, setIsVisible] = useState(false);
    const [showResetConfirm, setShowResetConfirm] = useState(false);
    const [tempInterval, setTempInterval] = useState('');
    const [tempNumerator, setTempNumerator] = useState('');
    const [tempDenominator, setTempDenominator] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('light');
    const [initialSettings, setInitialSettings] = useState({
        theme: 'light',
        interval: '',
        numerator: '',
        denominator: ''
    });
    const [initialTheme, setInitialTheme] = useState('light');

    const { colors, dark } = useTheme();
    const { isSystemTheme, setIsSystemTheme, theme, setTheme, getThemeColors, getSystemThemeColors } = useThemeContext();

    // Get theme colors for the menu UI
    const getMenuColors = () => {
        if (isSystemTheme) {
            return getSystemThemeColors();
        }
        return getThemeColors();
    };

    const menuColors = getMenuColors();
    const themeColors = getThemeColors();

    const {
        interval,
        probabilityNumerator,
        probabilityDenominator,
        setInterval,
        setProbabilityNumerator,
        setProbabilityDenominator,
        reset
    } = useCounter();

    // Force re-render when theme changes
    useEffect(() => {
        // This empty effect will cause the component to re-render when theme changes
    }, [theme]);

    // Update selected theme when theme changes
    useEffect(() => {
        if (!isSystemTheme) {
            setSelectedTheme(theme);
        }
    }, [theme, isSystemTheme]);

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
        buttonText: {
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
        resetCounterButton: {
            backgroundColor: menuColors.resetButton,
            padding: 10,
            borderRadius: 5,
            alignItems: 'center',
            marginTop: 15,
            marginBottom: 5,
        },
        resetCounterButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
        confirmationModal: {
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
        },
        confirmationContent: {
            backgroundColor: menuColors.background,
            padding: 20,
            borderRadius: 10,
            width: '80%',
            maxWidth: 300,
        },
        confirmationTitle: {
            fontSize: 18,
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
            justifyContent: 'space-around',
        },
        confirmButton: {
            backgroundColor: menuColors.decrementButton,
            padding: 10,
            borderRadius: 5,
            minWidth: 100,
            alignItems: 'center',
        },
        cancelConfirmButton: {
            backgroundColor: menuColors.incrementButton,
            padding: 10,
            borderRadius: 5,
            minWidth: 100,
            alignItems: 'center',
        },
        confirmButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
    });

    const openMenu = () => {
        console.log('Opening menu with theme:', theme);

        // Store initial settings when opening the modal
        setInitialSettings({
            theme: theme,
            interval: interval.toString(),
            numerator: probabilityNumerator.toString(),
            denominator: probabilityDenominator.toString()
        });

        // Set the initial theme to the current theme ONLY when opening
        setInitialTheme(theme);
        setSelectedTheme(theme);

        setTempInterval(interval.toString());
        setTempNumerator(probabilityNumerator.toString());
        setTempDenominator(probabilityDenominator.toString());

        setIsVisible(true);
    };

    const handleCancel = () => {
        console.log('Canceling with initialTheme:', initialTheme);

        // Restore initial settings when canceling
        setSelectedTheme(initialSettings.theme);
        setTempInterval(initialSettings.interval);
        setTempNumerator(initialSettings.numerator);
        setTempDenominator(initialSettings.denominator);

        // Revert to the initial theme immediately
        if (!isSystemTheme) {
            console.log('Reverting to initial theme:', initialTheme);
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

        // Theme changes are already applied, just close the modal
        setIsVisible(false);
    };

    const handleThemeChange = (newTheme) => {
        console.log('Changing theme to:', newTheme);
        setSelectedTheme(newTheme);

        // Immediately apply the theme change
        if (!isSystemTheme) {
            setTheme(newTheme);
        }
    };

    const handleResetPress = () => {
        setShowResetConfirm(true);
    };

    const handleConfirmReset = () => {
        reset();
        setShowResetConfirm(false);
    };

    return (
        <>
            <TouchableOpacity style={styles.menuButton} onPress={openMenu}>
                <Ionicons name="settings-outline" size={24} color="#fff" />
            </TouchableOpacity>

            <Modal
                visible={isVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={handleCancel}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <ScrollView>
                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Counter Settings</Text>

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
                                    style={styles.resetCounterButton}
                                    onPress={handleResetPress}
                                >
                                    <Text style={styles.resetCounterButtonText}>Reset Counter</Text>
                                </TouchableOpacity>
                            </View>

                            <View style={styles.section}>
                                <Text style={styles.sectionTitle}>Theme</Text>
                                <View style={styles.row}>
                                    <Text style={styles.label}>Use System Theme</Text>
                                    <Switch
                                        value={isSystemTheme}
                                        onValueChange={setIsSystemTheme}
                                        trackColor={{ false: '#989799', true: menuColors.text + '40' }}
                                        thumbColor={isSystemTheme ? 'rgba(33,150,243,1.00)' : '#4a4a4a'}
                                        activeThumbColor={isSystemTheme ? 'rgba(33,150,243,1.00)' : '#4a4a4a'}
                                    />
                                </View>

                                {!isSystemTheme && (
                                    <View style={styles.radioContainer}>
                                        <View style={styles.radioOption}>
                                            <TouchableOpacity
                                                style={styles.radioButton}
                                                onPress={() => handleThemeChange('light')}
                                            >
                                                {selectedTheme === 'light' && <View style={styles.radioButtonSelected} />}
                                            </TouchableOpacity>
                                            <Text style={styles.radioLabel}>Light</Text>
                                        </View>

                                        <View style={styles.radioOption}>
                                            <TouchableOpacity
                                                style={styles.radioButton}
                                                onPress={() => handleThemeChange('dark')}
                                            >
                                                {selectedTheme === 'dark' && <View style={styles.radioButtonSelected} />}
                                            </TouchableOpacity>
                                            <Text style={styles.radioLabel}>Dark</Text>
                                        </View>
                                    </View>
                                )}
                            </View>
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
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal
                visible={showResetConfirm}
                transparent={true}
                animationType="fade"
                onRequestClose={() => setShowResetConfirm(false)}
            >
                <View style={styles.confirmationModal}>
                    <View style={styles.confirmationContent}>
                        <Text style={styles.confirmationTitle}>Reset Counter?</Text>
                        <Text style={styles.confirmationText}>
                            Are you sure you want to reset the counter to 0? This action cannot be undone.
                        </Text>
                        <View style={styles.confirmationButtons}>
                            <TouchableOpacity
                                style={styles.cancelConfirmButton}
                                onPress={() => setShowResetConfirm(false)}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.confirmButton}
                                onPress={handleConfirmReset}
                            >
                                <Text style={styles.buttonText}>Reset</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    );
} 