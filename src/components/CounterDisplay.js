import { StyleSheet, View, Text, TextInput, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useCounter } from '../context/CounterContext';
import { useThemeContext } from '../context/ThemeContext';
import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';

const MAX_VALUE = 999999;

export default function CounterDisplay() {
    const {
        count,
        calculateBinomialProbability,
        setCount,
        probabilityNumerator,
        probabilityDenominator,
        counters = [],
        selectedCounterIndex,
        getHomeCounters
    } = useCounter();
    const { colors } = useTheme();
    const { theme, getThemeColors } = useThemeContext();
    const themeColors = getThemeColors();
    const [modalVisible, setModalVisible] = useState(false);
    const [tempCount, setTempCount] = useState('');
    const [selectedCounterId, setSelectedCounterId] = useState(null);

    // Force re-render when theme changes
    useEffect(() => {
        // This empty effect will cause the component to re-render when theme changes
    }, [theme]);

    const handleOpenModal = (counterId) => {
        const counter = counters.find(c => c.id === counterId);
        if (counter) {
            setTempCount(counter.count.toString());
            setSelectedCounterId(counterId);
            setModalVisible(true);
        }
    };

    const handleCountChange = (text) => {
        // Remove any non-numeric characters
        const numericText = text.replace(/[^0-9]/g, '');
        setTempCount(numericText);
    };

    const handleSave = () => {
        if (selectedCounterId !== null) {
            const counter = counters.find(c => c.id === selectedCounterId);
            if (counter) {
                if (tempCount === '') {
                    setCount(0);
                } else {
                    const num = parseInt(tempCount);
                    if (!isNaN(num)) {
                        if (num > MAX_VALUE) {
                            setCount(MAX_VALUE);
                        } else {
                            setCount(num);
                        }
                    }
                }
            }
        }
        setModalVisible(false);
        setSelectedCounterId(null);
    };

    const handleCancel = () => {
        setModalVisible(false);
        setSelectedCounterId(null);
    };

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            marginBottom: 20,
        },
        countDisplay: {
            fontSize: 48,
            fontWeight: 'bold',
            color: themeColors.text,
            textAlign: 'center',
            minWidth: 220,
            maxWidth: 220,
            paddingHorizontal: 15,
            paddingVertical: 5,
            borderWidth: 2,
            borderColor: themeColors.text + '20',
            borderRadius: 12,
            backgroundColor: themeColors.text + '05',
        },
        probability: {
            fontSize: 18,
            color: themeColors.text,
            opacity: 0.7,
            marginTop: 10,
        },
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            backgroundColor: themeColors.background,
            padding: 20,
            borderRadius: 12,
            minWidth: '250px',
            width: '20%',
            alignItems: 'center',
        },
        modalInput: {
            fontSize: 24,
            color: themeColors.text,
            textAlign: 'center',
            width: '100%',
            padding: 10,
            borderWidth: 2,
            borderColor: themeColors.text + '20',
            borderRadius: 8,
            marginBottom: 20,
        },
        buttonContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            width: '100%',
        },
        button: {
            padding: 10,
            borderRadius: 8,
            minWidth: 100,
            alignItems: 'center',
        },
        saveButton: {
            backgroundColor: themeColors.primary,
        },
        cancelButton: {
            backgroundColor: themeColors.text + '20',
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
        modalTitle: {
            color: themeColors.text,
            fontSize: 24,
            fontWeight: 'bold',
            marginBottom: 20,
        },
        noCountersMsg: {
            fontSize: 26,
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
            width: 40,
            height: 40,
            borderRadius: 20,
            backgroundColor: themeColors.primary,
            alignItems: 'center',
            justifyContent: 'center',
        },
        homeCounterItem: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            backgroundColor: themeColors.background,
            borderRadius: 8,
            marginBottom: 10,
            borderWidth: 1,
            borderColor: themeColors.text + '20',
            width: '100%',
            maxWidth: 300,
        },
        homeCounterName: {
            flex: 1,
            fontSize: 16,
            color: themeColors.text,
        },
        homeCounterCount: {
            fontSize: 24,
            fontWeight: 'bold',
            color: themeColors.text,
            marginRight: 10,
        },
    });

    if (selectedCounterIndex === -1) {
        const homeCounters = getHomeCounters();
        // if (homeCounters.length === 0) {
        //     return (
        //         <View style={styles.warningContainer}>
        //             <Text style={styles.noCountersMsg}>
        //                 Click
        //             </Text>
        //             <View style={styles.addButton}>
        //                 <Ionicons name="add" size={24} color="#fff" />
        //             </View>
        //             <Text style={styles.noCountersMsg}>
        //                 to add counters to home view
        //             </Text>
        //         </View>
        //     );
        // }

        return (
            <ScrollView contentContainerStyle={styles.container}>
                {homeCounters.map(counter => (
                    <TouchableOpacity
                        key={counter.id}
                        style={styles.homeCounterItem}
                        onPress={() => handleOpenModal(counter.id)}
                    >
                        <Text style={styles.homeCounterName}>
                            {counter.customName || counter.pokemonName || `Counter ${counter.id}`}
                        </Text>
                        <Text style={styles.homeCounterCount}>{counter.count}</Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        );
    }

    if (!counters || counters.length === 0) {
        return (
            <View style={styles.warningContainer}>
                <Text style={styles.noCountersMsg}>
                    Click
                </Text>
                <View style={styles.addButton}>
                    <Ionicons name="add" size={24} color="#fff" />
                </View>
                <Text style={styles.noCountersMsg}>
                    to add a new counter.
                </Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => handleOpenModal(counters[selectedCounterIndex].id)}>
                <Text style={styles.countDisplay}>{count}</Text>
            </TouchableOpacity>
            <Text style={styles.probability}>
                Probability: {calculateBinomialProbability(count, probabilityNumerator, probabilityDenominator).toFixed(2)}%
            </Text>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleCancel}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter a new count</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={tempCount}
                            onChangeText={handleCountChange}
                            keyboardType="numeric"
                            selectTextOnFocus={true}
                            maxLength={6}
                        />
                        <View style={styles.buttonContainer}>
                            <TouchableOpacity
                                style={[styles.button, styles.cancelButton]}
                                onPress={handleCancel}
                            >
                                <Text style={styles.buttonText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.button, styles.saveButton]}
                                onPress={handleSave}
                            >
                                <Text style={styles.buttonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
} 