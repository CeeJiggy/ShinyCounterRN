import { StyleSheet, View, Text, Image, TouchableOpacity, Platform } from 'react-native';
import { useThemeContext } from '../../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import CounterControls from './CounterControls';
import { useState, useRef } from 'react';

export default function CounterItem({
    counter,
    onPress,
    onIncrement,
    onDecrement,
    onRemove,
    style,
    showControls = true,
    showRemoveButton = false,
    controlsSize = 'small',
    countStyle,
    showImage = true,
    showProbability = true,
    probability,
}) {
    const { getThemeColors } = useThemeContext();
    const themeColors = getThemeColors();
    const [showX, setShowX] = useState(false);
    const hideTimeout = useRef(null);

    // Handlers for hover/tap
    const handleMouseEnter = () => {
        setShowX(true);
    };
    const handleMouseLeave = () => {
        setShowX(false);
    };
    const handleCardPress = () => {
        if (Platform.OS === 'web') return; // On web, handled by hover
        setShowX(true);
        if (hideTimeout.current) clearTimeout(hideTimeout.current);
        hideTimeout.current = setTimeout(() => setShowX(false), 2000);
    };

    const styles = StyleSheet.create({
        container: {
            backgroundColor: themeColors.background,
            borderBottomWidth: 1,
            borderTopWidth: 1,
            borderColor: themeColors.text + '20',
            padding: 16,
            margin: 0,
            width: '100%',
            // minHeight: 180,
            justifyContent: 'flex-start',
            alignItems: 'center',
            position: 'relative',
            ...style,
        },
        imageContainer: {
            alignItems: 'center',
            justifyContent: 'center',
            width: 70,
            height: 70,
            marginBottom: 8,
        },
        image: {
            width: 80,
            height: 80,
            resizeMode: 'contain',
        },
        nameContainer: {
            width: '100%',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 4,
        },
        name: {
            fontSize: 16,
            color: themeColors.text,
            fontWeight: 'bold',
            textAlign: 'center',
        },
        countContainer: {
            width: 'auto',
            alignSelf: 'center',
            alignItems: 'center',
            marginVertical: 4,
            minWidth: 100,
            maxWidth: 140,
        },
        count: {
            fontSize: 20,
            fontWeight: 'bold',
            color: themeColors.text,
            textAlign: 'center',
        },
        probabilityContainer: {
            width: '100%',
            alignItems: 'center',
            marginBottom: 8,
        },
        probability: {
            fontSize: 14,
            color: themeColors.text,
            textAlign: 'center',
        },
        removeButton: {
            position: 'absolute',
            top: 10,
            right: 10,
            zIndex: 2,
        },
        controlsWrapper: {
            width: '100%',
            marginTop: 8,
            alignItems: 'center',
        },
    });

    // Card wrapper props for web hover
    const cardViewProps = Platform.OS === 'web'
        ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }
        : {
            onStartShouldSetResponder: () => true,
            onResponderRelease: (e) => {
                // Only show X if the tap was NOT on the count container
                if (e?.nativeEvent?.target && countContainerRef.current) {
                    if (e.nativeEvent.target === countContainerRef.current) return;
                }
                handleCardPress();
            }
        };

    // Ref for the count container
    const countContainerRef = useRef(null);

    return (
        <View {...cardViewProps} style={styles.container}>
            {showRemoveButton && onRemove && showX && (
                <TouchableOpacity
                    onPress={() => onRemove(counter.id)}
                    style={styles.removeButton}
                >
                    <Ionicons name="close-circle" size={22} color={themeColors.text} />
                </TouchableOpacity>
            )}
            {showImage && (
                <View style={styles.imageContainer}>
                    {counter.pokemonImage ? (
                        <Image source={{ uri: counter.pokemonImage }} style={styles.image} />
                    ) : (
                        <Ionicons name="ellipsis-horizontal-circle" size={40} color={themeColors.text} />
                    )}
                </View>
            )}
            <View style={styles.nameContainer}>
                <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                    {counter.customName || counter.pokemonName || `Counter ${counter.id}`}
                </Text>
            </View>
            {onPress ? (
                <TouchableOpacity
                    ref={countContainerRef}
                    style={styles.countContainer}
                    onPress={(e) => {
                        e.stopPropagation && e.stopPropagation();
                        onPress();
                    }}
                >
                    <Text style={[styles.count, countStyle]}>{counter.count}</Text>
                </TouchableOpacity>
            ) : (
                <View style={styles.countContainer}>
                    <Text style={[styles.count, countStyle]}>{counter.count}</Text>
                </View>
            )}
            {showProbability && probability !== undefined && (
                <View style={styles.probabilityContainer}>
                    <Text style={styles.probability}>Probability: {probability.toFixed(2)}%</Text>
                </View>
            )}
            {showControls && (
                <View style={styles.controlsWrapper}>
                    <CounterControls
                        onIncrement={() => onIncrement(counter)}
                        onDecrement={() => onDecrement(counter)}
                        size={controlsSize}
                    />
                </View>
            )}
        </View>
    );
} 