import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import { useThemeContext } from '../../context/ThemeContext';

export default function Button({
    onPress,
    title,
    variant = 'primary', // primary, decrement, increment, cancel
    size = 'medium', // small, medium, large
    style,
    textStyle,
    disabled = false,
    icon,
    iconPosition = 'left' // left, right
}) {
    const { getThemeColors } = useThemeContext();
    const themeColors = getThemeColors();

    const getVariantStyles = () => {
        switch (variant) {
            case 'decrement':
                return { backgroundColor: themeColors.decrementButton };
            case 'increment':
                return { backgroundColor: themeColors.incrementButton };
            case 'cancel':
                return { backgroundColor: themeColors.text + '20' };
            case 'primary':
            default:
                return { backgroundColor: themeColors.primary };
        }
    };

    const getSizeStyles = () => {
        switch (size) {
            case 'small':
                return {
                    padding: 8,
                    minWidth: 80,
                    borderRadius: 6,
                };
            case 'large':
                return {
                    padding: 16,
                    minWidth: 120,
                    borderRadius: 10,
                };
            case 'medium':
            default:
                return {
                    padding: 12,
                    minWidth: 100,
                    borderRadius: 8,
                };
        }
    };

    const styles = StyleSheet.create({
        button: {
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            opacity: disabled ? 0.5 : 1,
            ...getVariantStyles(),
            ...getSizeStyles(),
            ...style,
        },
        text: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
            ...textStyle,
        },
        iconContainer: {
            marginRight: iconPosition === 'left' ? 8 : 0,
            marginLeft: iconPosition === 'right' ? 8 : 0,
        },
    });

    return (
        <TouchableOpacity
            style={styles.button}
            onPress={onPress}
            disabled={disabled}
        >
            {icon && iconPosition === 'left' && (
                <View style={styles.iconContainer}>{icon}</View>
            )}
            <Text style={styles.text}>{title}</Text>
            {icon && iconPosition === 'right' && (
                <View style={styles.iconContainer}>{icon}</View>
            )}
        </TouchableOpacity>
    );
} 