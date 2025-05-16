import { StyleSheet, View } from 'react-native';
import Button from './Button';

export default function CounterControls({
    onIncrement,
    onDecrement,
    style,
    buttonStyle,
    size = 'medium',
}) {
    const styles = StyleSheet.create({
        container: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            gap: 10,
            width: 220,
            ...style,
        },
    });

    return (
        <View style={styles.container}>
            <Button
                title="-"
                variant="decrement"
                size={size}
                onPress={onDecrement}
                style={buttonStyle}
            />
            <Button
                title="+"
                variant="increment"
                size={size}
                onPress={onIncrement}
                style={buttonStyle}
            />
        </View>
    );
} 