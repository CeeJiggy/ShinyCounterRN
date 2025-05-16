import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useCounter } from '../context/CounterContext';
import { useThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Menu from './Menu';
import { useState } from 'react';
import CounterDisplay from './common/CounterDisplay';
import CounterControls from './common/CounterControls';
import Modal from './common/Modal';
import Button from './common/Button';

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
        calculateBinomialProbability,
        showProbability
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
    });

    return (
        <View style={styles.outer}>
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
                <CounterDisplay
                    count={count}
                    probability={calculateBinomialProbability(count, probabilityNumerator, probabilityDenominator)}
                    onPress={handleOpenModal}
                    showProbability={showProbability}
                />
                <CounterControls
                    onIncrement={increment}
                    onDecrement={decrement}
                />
            </View>

            <Modal
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                title="Enter a new count"
            >
                <TextInput
                    style={styles.modalInput}
                    value={tempCount}
                    onChangeText={handleCountChange}
                    keyboardType="numeric"
                    selectTextOnFocus={true}
                    maxLength={6}
                />
                <View style={{ flexDirection: 'row', gap: 10 }}>
                    <Button
                        title="Cancel"
                        variant="cancel"
                        onPress={() => setModalVisible(false)}
                    />
                    <Button
                        title="Save"
                        variant="primary"
                        onPress={handleSave}
                    />
                </View>
            </Modal>
        </View>
    );
} 