import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform, TextInput } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { useCounter } from '../context/CounterContext';
import useObsSync from '../utils/useObsSync';
import { useObs } from '../context/ObsContext';
import { Picker } from '@react-native-picker/picker';


export default function SettingsTabView() {
    const { isSystemTheme, setIsSystemTheme, theme, setTheme, getThemeColors, getSystemThemeColors } = useThemeContext();
    const {
        showProbability, setShowProbability,
        homeCounterDisplayMode, setHomeCounterDisplayMode,
        showHomeProbability, setShowHomeProbability,
        count, pokemonImage, counters
    } = useCounter();
    console.log('SettingsTabView Counters', counters);

    const themeColors = getThemeColors();
    const menuColors = isSystemTheme ? getSystemThemeColors() : getThemeColors();
    const [selectedTheme, setSelectedTheme] = useState(theme);

    // OBS state from context
    const {
        obsRef,
        obsConnected,
        connectToOBS,
        disconnectFromOBS,
        obsAuthPending,
        obsPort,
        setObsPort,
        obsPassword,
        setObsPassword,
        showCounterInOBS,
        setShowCounterInOBS,
        showPokemonInOBS,
        setShowPokemonInOBS,
        obsSourceMappings,
        addObsSourceMapping,
        removeObsSourceMapping,
        updateObsSourceMapping,
    } = useObs();

    useObsSync({
        obsRef,
        obsConnected,
        obsSourceMappings,
        counters,
    });

    const handleThemeChange = (newTheme) => {
        setSelectedTheme(newTheme);
        if (!isSystemTheme) {
            setTheme(newTheme);
        }
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingTop: 40,
            backgroundColor: themeColors.background,
        },
        section: {
            marginBottom: 20,
            borderBottomWidth: 1,
            borderBottomColor: menuColors.text,
            paddingBottom: 15,
            paddingHorizontal: 20,
            width: '100%',
            maxWidth: 500,
        },
        sectionTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: menuColors.text,
            marginBottom: 20,
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
        probabilityRow: {
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 10,
            marginTop: 10,
        },
        input: {
            height: 40,
            borderWidth: 1,
            borderColor: menuColors.text,
            borderRadius: 5,
            paddingHorizontal: 10,
            color: menuColors.text,
            marginBottom: 10,
        },
        inputLabel: {
            fontSize: 14,
            color: menuColors.text,
            marginBottom: 5,
        },
        connectButton: {
            backgroundColor: obsConnected ? '#ff4444' : '#4CAF50',
            padding: 10,
            borderRadius: 5,
            marginTop: 10,
        },
        connectButtonText: {
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Theme</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Use System Theme</Text>
                    <Switch
                        value={isSystemTheme}
                        onValueChange={(value) => {
                            setIsSystemTheme(value);
                            if (!value) {
                                setTheme(selectedTheme);
                            }
                        }}
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
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Counter Display</Text>
                <View style={styles.probabilityRow}>
                    <Text style={styles.label}>Show Encounter Probability on Counters</Text>
                    <Switch
                        value={showProbability}
                        onValueChange={setShowProbability}
                        trackColor={{ false: '#989799', true: menuColors.text + '40' }}
                        thumbColor={showProbability ? 'rgba(33,150,243,1.00)' : '#4a4a4a'}
                        activeThumbColor={showProbability ? 'rgba(33,150,243,1.00)' : '#4a4a4a'}
                    />
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Home Counter Display Mode</Text>
                <View style={styles.radioContainer}>
                    <View style={styles.radioOption}>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => setHomeCounterDisplayMode('full')}
                        >
                            {homeCounterDisplayMode === 'full' && <View style={styles.radioButtonSelected} />}
                        </TouchableOpacity>
                        <Text style={styles.radioLabel}>Full</Text>
                    </View>
                    <View style={styles.radioOption}>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => setHomeCounterDisplayMode('less')}
                        >
                            {homeCounterDisplayMode === 'less' && <View style={styles.radioButtonSelected} />}
                        </TouchableOpacity>
                        <Text style={styles.radioLabel}>Less</Text>
                    </View>
                    <View style={styles.radioOption}>
                        <TouchableOpacity
                            style={styles.radioButton}
                            onPress={() => setHomeCounterDisplayMode('minimal')}
                        >
                            {homeCounterDisplayMode === 'minimal' && <View style={styles.radioButtonSelected} />}
                        </TouchableOpacity>
                        <Text style={styles.radioLabel}>Minimal</Text>
                    </View>
                </View>
                <View style={styles.probabilityRow}>
                    <Text style={styles.label}>Show Encounter Probability on Home Counters</Text>
                    <Switch
                        value={showHomeProbability}
                        onValueChange={setShowHomeProbability}
                        trackColor={{ false: '#989799', true: menuColors.text + '40' }}
                        thumbColor={showHomeProbability ? 'rgba(33,150,243,1.00)' : '#4a4a4a'}
                        activeThumbColor={showHomeProbability ? 'rgba(33,150,243,1.00)' : '#4a4a4a'}
                    />
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>OBS Integration</Text>
                <View style={styles.row}>
                    <Text style={styles.label}>Connect to OBS</Text>
                    <TouchableOpacity
                        style={styles.connectButton}
                        onPress={obsConnected || obsAuthPending ? disconnectFromOBS : connectToOBS}
                        disabled={obsAuthPending}
                    >
                        <Text style={styles.connectButtonText}>
                            {obsConnected ? 'Disconnect' : obsAuthPending ? 'Authenticating...' : 'Connect'}
                        </Text>
                    </TouchableOpacity>
                </View>
                {!obsConnected && !obsAuthPending && (
                    <>
                        <Text style={styles.inputLabel}>WebSocket Port</Text>
                        <TextInput
                            style={styles.input}
                            value={obsPort}
                            onChangeText={setObsPort}
                            keyboardType="numeric"
                            placeholder="4455"
                            placeholderTextColor={menuColors.text + '80'}
                        />
                        <Text style={styles.inputLabel}>Password (if required)</Text>
                        <TextInput
                            style={styles.input}
                            value={obsPassword}
                            onChangeText={setObsPassword}
                            secureTextEntry
                            placeholder="Enter OBS WebSocket password"
                            placeholderTextColor={menuColors.text + '80'}
                        />
                    </>
                )}
                {obsConnected && (
                    <>
                        <View style={{ marginTop: 20 }}>
                            <Text style={[styles.sectionTitle, { fontSize: 20 }]}>OBS Source Mappings</Text>
                            {obsSourceMappings.map((mapping, idx) => (
                                <View key={mapping.id} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
                                    <Text style={{ color: menuColors.text, marginRight: 8 }}>Counter:</Text>
                                    <View style={{ borderWidth: 1, borderColor: menuColors.text, borderRadius: 5, marginRight: 8, minWidth: 120 }}>
                                        <Picker
                                            selectedValue={mapping.counterId}
                                            style={{ color: menuColors.text, height: 36 }}
                                            onValueChange={val => updateObsSourceMapping(mapping.id, { counterId: val })}
                                        >
                                            <Picker.Item label="Select..." value={null} />
                                            {counters.map(counter => (
                                                <Picker.Item
                                                    key={counter.id}
                                                    label={counter.customName || counter.pokemonName || `Counter ${counter.id}`}
                                                    value={counter.id}
                                                />
                                            ))}
                                        </Picker>
                                    </View>
                                    <Text style={{ color: menuColors.text, marginRight: 8 }}>Source Prefix:</Text>
                                    <TextInput
                                        style={[styles.input, { width: 90, marginRight: 8 }]}
                                        value={mapping.sourcePrefix}
                                        onChangeText={val => updateObsSourceMapping(mapping.id, { sourcePrefix: val })}
                                    />
                                    <Text style={{ color: menuColors.text, fontSize: 12, marginRight: 8 }}>
                                        {mapping.sourcePrefix}Count / {mapping.sourcePrefix}Image
                                    </Text>
                                    {obsSourceMappings.length > 1 && (
                                        <TouchableOpacity onPress={() => removeObsSourceMapping(mapping.id)}>
                                            <Text style={{ color: '#ff4444', fontWeight: 'bold' }}>Remove</Text>
                                        </TouchableOpacity>
                                    )}
                                </View>
                            ))}
                            <TouchableOpacity onPress={addObsSourceMapping} style={[styles.connectButton, { backgroundColor: '#2196F3', marginTop: 10 }]}>
                                <Text style={styles.connectButtonText}>Add Source Mapping</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </View>
        </View>
    );
} 