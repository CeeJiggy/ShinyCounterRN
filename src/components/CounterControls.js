import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useCounter } from '../context/CounterContext';
import { useThemeContext } from '../context/ThemeContext';
import { useEffect } from 'react';

export default function CounterControls() {
    const {
        increment,
        decrement,
        counters = [],
        selectedCounterIndex = 0,
        incrementHomeCounters,
        decrementHomeCounters
    } = useCounter();
    const { colors } = useTheme();
    const { theme, getThemeColors } = useThemeContext();
    const themeColors = getThemeColors();

    // Hide controls if no counters exist or none is selected
    if (!counters || counters.length === 0 || selectedCounterIndex < -1 || selectedCounterIndex >= counters.length) {
        return null;
    }

    // Force re-render when theme changes
    useEffect(() => {
        // This empty effect will cause the component to re-render when theme changes
    }, [theme]);

    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
            width: 220,
        },
        button: {
            padding: 15,
            borderRadius: 8,
            minWidth: 100,
            alignItems: 'center',
        },
        decrementButton: {
            backgroundColor: themeColors.decrementButton,
        },
        incrementButton: {
            backgroundColor: themeColors.incrementButton,
        },
        buttonText: {
            color: '#fff',
            fontSize: 18,
            fontWeight: 'bold',
        },
    });

    // If we're in the home tab, use the home counter controls
    if (selectedCounterIndex === -1) {
        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={[styles.button, styles.decrementButton]}
                    onPress={decrementHomeCounters}
                >
                    <Text style={styles.buttonText}>-</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, styles.incrementButton]}
                    onPress={incrementHomeCounters}
                >
                    <Text style={styles.buttonText}>+</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={[styles.button, styles.decrementButton]}
                onPress={decrement}
            >
                <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, styles.incrementButton]}
                onPress={increment}
            >
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
} 