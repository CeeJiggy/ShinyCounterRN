import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity, Platform } from 'react-native';
import { useThemeContext } from '../context/ThemeContext';
import { useCounter } from '../context/CounterContext';

export default function SettingsTabView() {
    const { isSystemTheme, setIsSystemTheme, theme, setTheme, getThemeColors, getSystemThemeColors } = useThemeContext();
    const { showProbability, setShowProbability, homeCounterDisplayMode, setHomeCounterDisplayMode, showHomeProbability, setShowHomeProbability } = useCounter();
    const themeColors = getThemeColors();
    const menuColors = isSystemTheme ? getSystemThemeColors() : getThemeColors();
    const [selectedTheme, setSelectedTheme] = useState(theme);

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
        </View>
    );
} 