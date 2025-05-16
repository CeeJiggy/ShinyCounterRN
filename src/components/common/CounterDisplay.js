import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useThemeContext } from '../../context/ThemeContext';

export default function CounterDisplay({
    count,
    probability,
    onPress,
    style,
    countStyle,
    probabilityStyle,
    showProbability = true,
}) {
    const { getThemeColors } = useThemeContext();
    const themeColors = getThemeColors();

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
            marginBottom: 20,
            ...style,
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
            ...countStyle,
        },
        probability: {
            fontSize: 18,
            color: themeColors.text,
            opacity: 0.7,
            marginTop: 10,
            ...probabilityStyle,
        },
    });

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onPress}
                style={({ pressed }) => [
                    {
                        opacity: pressed ? 0.7 : 1,
                        transform: [{ scale: pressed ? 0.98 : 1 }]
                    }
                ]}
            >
                <Text style={styles.countDisplay}>{count}</Text>
            </TouchableOpacity>
            {showProbability && probability !== undefined && (
                <Text style={styles.probability}>
                    Probability: {probability.toFixed(2)}%
                </Text>
            )}
        </View>
    );
} 