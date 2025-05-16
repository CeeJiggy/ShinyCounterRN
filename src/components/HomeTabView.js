import { StyleSheet, View, Text, ScrollView, FlatList, Image, TouchableOpacity, TextInput } from 'react-native';
import { useState } from 'react';
import { useCounter } from '../context/CounterContext';
import { useThemeContext } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import Menu from './Menu';
import CounterItem from './common/CounterItem';
import Modal from './common/Modal';
import Button from './common/Button';
import CounterControls from './common/CounterControls';

export default function HomeTabView() {
    const {
        counters,
        homeCounters,
        addCounterToHome,
        removeCounterFromHome,
        getHomeCounters,
        incrementHomeCounters,
        decrementHomeCounters,
        setCount,
        homeCounterDisplayMode,
        showHomeProbability,
        calculateBinomialProbability
    } = useCounter();
    const { getThemeColors } = useThemeContext();
    const themeColors = getThemeColors();
    const [modalVisible, setModalVisible] = useState(false);
    const [editCountModal, setEditCountModal] = useState({ visible: false, counterId: null, tempCount: '' });

    // Helper to increment/decrement a specific counter
    const handleIncrement = (counter) => {
        setCount((counter.count + counter.interval) > 999999 ? 999999 : counter.count + counter.interval, counter.id);
    };
    const handleDecrement = (counter) => {
        setCount((counter.count - counter.interval) < 0 ? 0 : counter.count - counter.interval, counter.id);
    };

    const handleOpenEditCountModal = (counter) => {
        setEditCountModal({ visible: true, counterId: counter.id, tempCount: counter.count.toString() });
    };

    const handleEditCountChange = (text) => {
        // Remove any non-numeric characters
        const numericText = text.replace(/[^0-9]/g, '');
        setEditCountModal((prev) => ({ ...prev, tempCount: numericText }));
    };

    const handleEditCountSave = () => {
        const { counterId, tempCount } = editCountModal;
        const num = parseInt(tempCount);
        if (!isNaN(num)) {
            setCount(num, counterId);
        }
        setEditCountModal({ visible: false, counterId: null, tempCount: '' });
    };

    const handleEditCountCancel = () => {
        setEditCountModal({ visible: false, counterId: null, tempCount: '' });
    };

    const styles = StyleSheet.create({
        outer: {
            flex: 1,
            alignItems: 'center',
            width: '100%',
            justifyContent: 'center',

        },
        counterCard: {
            width: '100%',
            // maxWidth: 400,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 24,
            paddingTop: 24,
            flex: 1,
        },
        counterList: {
            width: '100%',
            flex: 1,
        },
        noCountersMsg: {
            fontSize: 16,
            color: themeColors.text,
            textAlign: 'center',
            marginTop: 20,
        },
        addButton: {
            marginTop: 16,
            marginBottom: 24,
            width: '100%',
        },
        controls: {
            marginBottom: 16,
            width: '100%',
            alignItems: 'center',
        },
        addCounterItem: {
            marginBottom: 10,
            marginTop: 10,
            width: '100%',
        },
        bottomContainer: {
            width: '100%',
            paddingHorizontal: 24,
            paddingBottom: 16,
            paddingTop: 16,
            borderTopWidth: 3,
            borderTopColor: themeColors.text + '20',
        },
    });

    // Style for count display to match IndividualCounterTabView, but smaller for HomeTabView
    const countDisplayStyle = {
        fontSize: 24,
        fontWeight: 'bold',
        color: themeColors.text,
        textAlign: 'center',
        minWidth: 120,
        maxWidth: 120,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 2,
        borderColor: themeColors.text + '20',
        borderRadius: 12,
        backgroundColor: themeColors.text + '05',
    };

    const availableCounters = counters.filter(counter => !homeCounters.includes(counter.id));
    const selectedCounters = getHomeCounters();

    return (
        <View style={styles.outer}>
            <View style={styles.counterCard}>
                {counters.length === 0 ? (
                    <View style={{ alignItems: 'center', marginTop: 32 }}>
                        <Text style={styles.noCountersMsg}>
                            No counters exist yet. Use the + button below to create your first counter!
                        </Text>
                    </View>
                ) : (
                    <>
                        {selectedCounters.length > 0 && (
                            <ScrollView
                                style={[
                                    styles.counterList,
                                    {
                                        scrollbarColor: `${themeColors.primary} ${themeColors.background}`,
                                        scrollbarWidth: 'thin',
                                        paddingHorizontal: 10,
                                    }
                                ]}
                                contentContainerStyle={{
                                    flexDirection: 'row',
                                    flexWrap: 'wrap',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: 16,
                                    paddingBottom: 16

                                }}
                                showsVerticalScrollIndicator={true}
                                contentInsetAdjustmentBehavior="automatic"
                                persistentScrollbar={true}
                            >
                                {selectedCounters.map(counter => (
                                    <CounterItem
                                        key={counter.id}
                                        counter={counter}
                                        onPress={() => handleOpenEditCountModal(counter)}
                                        onIncrement={handleIncrement}
                                        onDecrement={handleDecrement}
                                        onRemove={removeCounterFromHome}
                                        showRemoveButton={true}
                                        showControls={homeCounterDisplayMode === 'full'}
                                        showImage={homeCounterDisplayMode !== 'minimal'}
                                        showProbability={showHomeProbability}
                                        probability={calculateBinomialProbability(counter.count, counter.probabilityNumerator, counter.probabilityDenominator)}
                                        style={{
                                            width: 220,
                                            margin: 8,
                                        }}
                                        countStyle={countDisplayStyle}
                                    />
                                ))}
                            </ScrollView>
                        )}
                        {selectedCounters.length === 0 && (
                            <View style={{ alignItems: 'center', marginTop: 32 }}>
                                <Text style={styles.noCountersMsg}>
                                    Add counters from your other tabs to see them here!
                                </Text>
                                {availableCounters.length > 0 && (
                                    <Button
                                        title="Add Counter"
                                        variant="primary"
                                        icon={<Ionicons name="add" size={24} color="#fff" />}
                                        style={{ marginTop: 16, minWidth: 180 }}
                                        onPress={() => setModalVisible(true)}
                                    />
                                )}
                            </View>
                        )}
                    </>
                )}
            </View>

            {counters.length > 0 && selectedCounters.length > 0 && (
                <View style={styles.bottomContainer}>
                    {selectedCounters.length > 0 && (
                        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 16, width: '100%' }}>
                            <Button
                                title="-"
                                variant="decrement"
                                onPress={decrementHomeCounters}
                                style={{ flex: 1, minWidth: 60, maxWidth: 120 }}
                            />
                            {availableCounters.length > 0 && (
                                <Button
                                    title="Add Counter"
                                    variant="primary"
                                    icon={<Ionicons name="add" size={24} color="#fff" />}
                                    style={{ flex: 2, minWidth: 155, maxWidth: 155, height: 45 }}
                                    onPress={() => setModalVisible(true)}
                                />
                            )}
                            <Button
                                title="+"
                                variant="increment"
                                onPress={incrementHomeCounters}
                                style={{ flex: 1, minWidth: 60, maxWidth: 120 }}
                            />
                        </View>
                    )}
                </View>
            )}

            <Modal
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
                title="Select a counter to add"
                footer={
                    <Button
                        title="Close"
                        variant="primary"
                        onPress={() => setModalVisible(false)}
                    />
                }
            >
                <FlatList
                    style={{ width: '100%', }}
                    data={availableCounters}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({ item }) => {
                        const fallbackName = item.customName || item.pokemonName || `Counter ${counters.findIndex(c => c.id === item.id) + 1}`;
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    addCounterToHome(item.id);
                                    setModalVisible(false);
                                }}
                                style={styles.addCounterItem}
                            >
                                <CounterItem
                                    counter={{ ...item, customName: fallbackName }}
                                    showControls={false}
                                />
                            </TouchableOpacity>
                        );
                    }}
                    ListEmptyComponent={
                        <Text style={{ color: themeColors.text, marginVertical: 10 }}>
                            No counters available
                        </Text>
                    }
                    showsVerticalScrollIndicator={true}
                />
            </Modal>

            {/* Edit Count Modal */}
            <Modal
                visible={editCountModal.visible}
                onRequestClose={handleEditCountCancel}
                title="Edit Count"
            >
                <Text style={{ fontSize: 18, color: themeColors.text, marginBottom: 16, textAlign: 'center' }}>Enter a new count</Text>
                <TextInput
                    style={{
                        fontSize: 24,
                        color: themeColors.text,
                        textAlign: 'center',
                        width: '100%',
                        padding: 10,
                        borderWidth: 2,
                        borderColor: themeColors.text + '20',
                        borderRadius: 8,
                        marginBottom: 20,
                    }}
                    value={editCountModal.tempCount}
                    onChangeText={handleEditCountChange}
                    keyboardType="numeric"
                    selectTextOnFocus={true}
                    maxLength={6}
                />
                <View style={{ flexDirection: 'row', gap: 10, justifyContent: 'center' }}>
                    <Button
                        title="Cancel"
                        variant="cancel"
                        onPress={handleEditCountCancel}
                    />
                    <Button
                        title="Save"
                        variant="primary"
                        onPress={handleEditCountSave}
                    />
                </View>
            </Modal>
        </View>
    );
} 