import { StyleSheet, View, Text, TextInput } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useCounter } from '../context/CounterContext';
import { useThemeContext } from '../context/ThemeContext';
import { useEffect, useState } from 'react';

const MAX_VALUE = 999999;

export default function CounterDisplay() {
    const { count, calculateBinomialProbability, setCount } = useCounter();
    const { colors } = useTheme();
    const { theme, getThemeColors } = useThemeContext();
    const themeColors = getThemeColors();
    const probability = calculateBinomialProbability(count);
    const [tempCount, setTempCount] = useState(count.toString());
    const [isFocused, setIsFocused] = useState(false);

    // Force re-render when theme changes
    useEffect(() => {
        // This empty effect will cause the component to re-render when theme changes
    }, [theme]);

    // Update tempCount when count changes externally
    useEffect(() => {
        setTempCount(count.toString());
    }, [count]);

    const handleCountChange = (text) => {
        // Remove any non-numeric characters
        const numericText = text.replace(/[^0-9]/g, '');
        setTempCount(numericText);
    };

    const handleBlur = () => {
        setIsFocused(false);
        if (tempCount === '') {
            setTempCount('0');
            setCount(0);
        } else {
            const num = parseInt(tempCount);
            if (!isNaN(num)) {
                if (num > MAX_VALUE) {
                    setTempCount(MAX_VALUE.toString());
                    setCount(MAX_VALUE);
                } else {
                    setCount(num);
                }
            } else {
                setTempCount(count.toString());
            }
        }
    };

    const handleFocus = (e) => {
        setIsFocused(true);
        if (e.target) e.target.style.outline = 'none';
    };

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            marginBottom: 20,
        },
        inputContainer: {
            position: 'relative',
            marginBottom: 5,
            width: 'auto',
        },
        countInput: {
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
        countInputFocused: {
            borderColor: themeColors.text + '40',
            backgroundColor: themeColors.text + '10',
        },
        probability: {
            fontSize: 18,
            color: themeColors.text,
            opacity: 0.7,
            marginTop: 10,
        },
    });

    return (
        <View style={styles.container}>
            <View style={styles.inputContainer}>
                <TextInput
                    style={[
                        styles.countInput,
                        isFocused && styles.countInputFocused
                    ]}
                    value={tempCount}
                    onChangeText={handleCountChange}
                    keyboardType="numeric"
                    selectTextOnFocus={true}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    maxLength={6} // Limit input length to MAX_VALUE (999999)
                />
            </View>
            <Text style={styles.probability}>
                Probability: {probability.toFixed(2)}%
            </Text>
        </View>
    );
} 