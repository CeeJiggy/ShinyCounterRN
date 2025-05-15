import { useCounter } from '../context/CounterContext';
import { useThemeContext } from '../context/ThemeContext';
import { StyleSheet, View, Text, TouchableOpacity, Image, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Menu from './Menu';
import { useState } from 'react';

export default function IndividualCounterTabView() {
    const {
        counters,
        selectedCounterIndex,
        increment,
        decrement,
        count,
        pokemonName,
        pokemonImage,
        setCount,
        probabilityNumerator,
        probabilityDenominator,
        calculateBinomialProbability
    } = useCounter();
    const { getThemeColors } = useThemeContext();
    const themeColors = getThemeColors();
    const counter = counters[selectedCounterIndex];
    const [modalVisible, setModalVisible] = useState(false);
    const [tempCount, setTempCount] = useState('');

    if (!counter) return null;

    const handleOpenModal = () => {
        setTempCount(count.toString());
        setModalVisible(true);
    };
    const handleCountChange = (text) => {
        const numericText = text.replace(/[^0-9]/g, '');
        setTempCount(numericText);
    };
    const handleSave = () => {
        if (tempCount === '') {
            setCount(0);
        } else {
            const num = parseInt(tempCount);
            if (!isNaN(num)) {
                setCount(num);
            }
        }
        setModalVisible(false);
    };
    const handleCancel = () => {
        setModalVisible(false);
    };

    const styles = StyleSheet.create({
        outer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            paddingHorizontal: 16,
        },
        counterCard: {
            width: '100%',
            maxWidth: 400,
            alignItems: 'center',
            padding: 24,
            marginBottom: 24,
            // elevation: 2,
            borderRadius: 16,
        },
        pokeImage: {
            width: 200,
            height: 200,
            marginBottom: 12,
            resizeMode: 'contain',
            alignSelf: 'center',
        },
        counterName: {
            fontSize: 20,
            fontWeight: 'bold',
            color: themeColors.text,
            marginBottom: 8,
            textAlign: 'center',
        },
        counterCount: {
            fontSize: 48,
            fontWeight: 'bold',
            color: themeColors.text,
            marginVertical: 8,
            textAlign: 'center',
            minWidth: 200,
            padding: 16,
            backgroundColor: themeColors.background,
            borderRadius: 12,
            borderWidth: 2,
            borderColor: themeColors.text + '20',
        },
        cardButton: {
            width: 56,
            height: 56,
            borderRadius: 12,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 8,
            padding: 0,
        },
        cardDecrement: {
            backgroundColor: themeColors.decrementButton,
        },
        cardIncrement: {
            backgroundColor: themeColors.incrementButton,
        },
        cardButtonText: {
            color: '#fff',
            fontSize: 32,
            fontWeight: 'bold',
            textAlign: 'center',
            textAlignVertical: 'center',
            includeFontPadding: false,
            lineHeight: 52,
            height: 56,
            marginTop: -2,
        },
        controls: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginTop: 8,
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
    });

    return (
        <View style={styles.outer}>
            {/* Settings/Menu button in top right */}
            <View style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                <Menu />
            </View>
            <View style={styles.counterCard}>
                {pokemonImage ? (
                    <Image source={{ uri: pokemonImage }} style={styles.pokeImage} />
                ) : (
                    <Ionicons name="ellipsis-horizontal-circle" size={80} color={themeColors.text} style={{ marginBottom: 12 }} />
                )}
                <Text style={styles.counterName}>
                    {counter.customName || counter.pokemonName || `Counter ${selectedCounterIndex + 1}`}
                </Text>
                <TouchableOpacity
                    onPress={handleOpenModal}
                    style={({ pressed }) => [
                        {
                            opacity: pressed ? 0.7 : 1,
                            transform: [{ scale: pressed ? 0.98 : 1 }]
                        }
                    ]}
                >
                    <Text style={styles.counterCount}>{count}</Text>
                </TouchableOpacity>
                <View style={styles.controls}>
                    <TouchableOpacity
                        style={[styles.cardButton, styles.cardDecrement]}
                        onPress={decrement}
                    >
                        <Text style={styles.cardButtonText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.cardButton, styles.cardIncrement]}
                        onPress={increment}
                    >
                        <Text style={styles.cardButtonText}>+</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.probability}>
                    Probability: {calculateBinomialProbability(count, probabilityNumerator, probabilityDenominator).toFixed(2)}%
                </Text>
            </View>
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