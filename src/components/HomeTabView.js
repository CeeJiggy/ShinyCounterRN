import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Modal, FlatList, Image } from 'react-native';
import { useState } from 'react';
import { useCounter } from '../context/CounterContext';
import { useThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Menu from './Menu';

export default function HomeTabView() {
    const {
        counters,
        homeCounters,
        addCounterToHome,
        removeCounterFromHome,
        getHomeCounters,
        incrementHomeCounters,
        decrementHomeCounters,
        setCount
    } = useCounter();
    const { getThemeColors } = useThemeContext();
    const themeColors = getThemeColors();
    const [modalVisible, setModalVisible] = useState(false);

    // Helper to increment/decrement a specific counter
    const handleIncrement = (counter) => {
        setCount((counter.count + counter.interval) > 999999 ? 999999 : counter.count + counter.interval, counter.id);
    };
    const handleDecrement = (counter) => {
        setCount((counter.count - counter.interval) < 0 ? 0 : counter.count - counter.interval, counter.id);
    };

    const styles = StyleSheet.create({
        outer: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        },
        counterCard: {
            width: '100%',
            maxWidth: 400,
            alignItems: 'center',
            // borderRadius: 16,
            padding: 24,
            marginBottom: 24,
            elevation: 2,
        },
        counterList: {
            width: '100%',
            marginBottom: 10,
        },
        counterItem: {
            flexDirection: 'row',
            alignItems: 'center',
            position: 'relative',
            minHeight: 96,
            padding: 12,
            backgroundColor: themeColors.background,
            borderTopWidth: 1,
            borderBottomWidth: 1,
            marginBottom: 14,
            borderColor: themeColors.text + '20',
            shadowColor: '#000',
            shadowOpacity: 0.04,
            shadowRadius: 4,
            elevation: 2,
            width: '100%',
            alignSelf: 'center',
        },
        counterImageCol: {
            alignItems: 'center',
            justifyContent: 'center',
            width: 72,
            height: '100%',
        },
        pokeImage: {
            width: 100,
            height: 100,
            marginBottom: 0,
            resizeMode: 'contain',
            alignSelf: 'center',
        },
        xButton: {
            position: 'absolute',
            top: 12,
            right: 12,
            zIndex: 2,
        },
        counterContentCol: {
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            width: '100%',
            marginLeft: -32,
        },
        counterRow: {
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            marginBottom: 2,
            justifyContent: 'center',
        },
        counterNameCol: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
        },
        counterActions: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 8,
            width: '100%',
        },
        counterName: {
            fontSize: 16,
            color: themeColors.text,
            fontWeight: 'bold',
            flex: 1,
        },
        counterCount: {
            fontSize: 20,
            fontWeight: 'bold',
            color: themeColors.text,
            marginHorizontal: 10,
        },
        removeButton: {
            padding: 4,
        },
        controls: {
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 10,
            marginTop: 10,
            marginBottom: 10,
        },
        controlButton: {
            flex: 1,
            padding: 15,
            borderRadius: 8,
            alignItems: 'center',
            minWidth: 100,
            maxWidth: 120,
        },
        decrementButton: {
            backgroundColor: themeColors.decrementButton,
        },
        incrementButton: {
            backgroundColor: themeColors.incrementButton,
        },
        addButton: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 12,
            backgroundColor: themeColors.primary,
            borderRadius: 8,
            marginBottom: 0,
            minWidth: 160,
            alignSelf: 'center',
            justifyContent: 'center',
        },
        addButtonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            marginLeft: 10,
        },
        noCountersMsg: {
            fontSize: 16,
            color: themeColors.text,
            textAlign: 'center',
            marginTop: 20,
        },
        modalOverlay: {
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.3)',
            justifyContent: 'center',
            alignItems: 'center',
        },
        modalContent: {
            backgroundColor: themeColors.background,
            borderRadius: 12,
            padding: 20,
            minWidth: 260,
            maxWidth: 340,
            alignItems: 'center',
        },
        modalTitle: {
            fontSize: 18,
            fontWeight: 'bold',
            color: themeColors.text,
            marginBottom: 16,
        },
        modalItem: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 8,
            paddingHorizontal: 4,
            width: '100%',
        },
        modalItemText: {
            fontSize: 16,
            color: themeColors.text,
            marginLeft: 10,
        },
        modalClose: {
            marginTop: 16,
            padding: 8,
            backgroundColor: themeColors.primary,
            borderRadius: 8,
        },
        modalCloseText: {
            color: '#fff',
            fontWeight: 'bold',
            fontSize: 16,
        },
        cardButton: {
            width: 28,
            height: 28,
            borderRadius: 4,
            alignItems: 'center',
            justifyContent: 'center',
            marginHorizontal: 2,
        },
        cardDecrement: {
            backgroundColor: themeColors.decrementButton,
        },
        cardIncrement: {
            backgroundColor: themeColors.incrementButton,
        },
        cardButtonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
        },
        buttonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
        },
    });

    const availableCounters = counters.filter(counter => !homeCounters.includes(counter.id));
    const selectedCounters = getHomeCounters();

    return (
        <View style={styles.outer}>
            {/* Settings/Menu button in top right */}
            <View style={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}>
                <Menu showThemeOnly={true} />
            </View>
            <View style={styles.counterCard}>
                <ScrollView style={styles.counterList} contentContainerStyle={{ alignItems: 'center' }}>
                    {selectedCounters.map(counter => (
                        <View key={counter.id} style={styles.counterItem}>
                            {/* X button absolutely positioned top right */}
                            <TouchableOpacity
                                onPress={() => removeCounterFromHome(counter.id)}
                                style={styles.xButton}
                            >
                                <Ionicons name="close-circle" size={24} color={themeColors.text} />
                            </TouchableOpacity>
                            {/* Left column: image */}
                            <View style={styles.counterImageCol}>
                                {counter.pokemonImage ? (
                                    <Image source={{ uri: counter.pokemonImage }} style={styles.pokeImage} />
                                ) : (
                                    <Ionicons name="ellipsis-horizontal-circle" size={40} color={themeColors.text} style={{ marginRight: 14 }} />
                                )}
                            </View>
                            {/* Right column: name, count, controls (all centered) */}
                            <View style={styles.counterContentCol}>
                                <View style={{ width: '100%', alignItems: 'center', marginTop: 2 }}>
                                    <Text style={styles.counterName}>
                                        {counter.customName || counter.pokemonName || `Counter ${counter.id}`}
                                    </Text>
                                </View>
                                <View style={{ width: '100%', alignItems: 'center', marginTop: 4 }}>
                                    <Text style={styles.counterCount}>{counter.count}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: 4 }}>
                                    <TouchableOpacity
                                        style={[styles.cardButton, styles.cardDecrement]}
                                        onPress={() => handleDecrement(counter)}
                                    >
                                        <Text style={styles.cardButtonText}>-</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.cardButton, styles.cardIncrement, { marginLeft: 8 }]}
                                        onPress={() => handleIncrement(counter)}
                                    >
                                        <Text style={styles.cardButtonText}>+</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
                {selectedCounters.length === 0 && (
                    <Text style={styles.noCountersMsg}>
                        Add counters from your other tabs to see them here!
                    </Text>
                )}
            </View>
            {/* Add Counter button outside the card, with margin to match menu/settings button spacing */}
            {availableCounters.length > 0 && (
                <TouchableOpacity
                    style={[styles.addButton, { marginTop: 16, marginBottom: 24 }]}
                    onPress={() => setModalVisible(true)}
                >
                    <Ionicons name="add" size={24} color="#fff" />
                    <Text style={styles.addButtonText}>Add Counter</Text>
                </TouchableOpacity>
            )}
            {/* Controls at the bottom, with margin to match individual tab */}
            {selectedCounters.length > 0 && (
                <View style={[styles.controls, { marginBottom: 16 }]}>
                    <TouchableOpacity
                        style={[styles.controlButton, styles.decrementButton]}
                        onPress={decrementHomeCounters}
                    >
                        <Text style={styles.buttonText}>-</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.controlButton, styles.incrementButton]}
                        onPress={incrementHomeCounters}
                    >
                        <Text style={styles.buttonText}>+</Text>
                    </TouchableOpacity>
                </View>
            )}
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Select a counter to add</Text>
                        <FlatList
                            data={availableCounters}
                            keyExtractor={item => item.id.toString()}
                            renderItem={({ item }) => (
                                <TouchableOpacity
                                    style={styles.modalItem}
                                    onPress={() => {
                                        addCounterToHome(item.id);
                                        setModalVisible(false);
                                    }}
                                >
                                    {item.pokemonImage ? (
                                        <Image source={{ uri: item.pokemonImage }} style={styles.pokeImage} />
                                    ) : (
                                        <Ionicons name="ellipsis-horizontal-circle" size={32} color={themeColors.text} />
                                    )}
                                    <Text style={styles.modalItemText}>
                                        {item.customName || item.pokemonName || `Counter ${item.id}`}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={<Text style={{ color: themeColors.text, marginVertical: 10 }}>No counters available</Text>}
                        />
                        <TouchableOpacity style={styles.modalClose} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalCloseText}>Close</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
} 