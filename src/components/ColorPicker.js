import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Dimensions } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useColorPalette } from '../context/ColorPaletteContext';
import ColorPicker from 'react-native-wheel-color-picker';

export default function CustomColorPicker({ colorType, label }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedColor, setSelectedColor] = useState('');
    const { colors } = useTheme();
    const { customColors, updateColor } = useColorPalette();
    const windowWidth = Dimensions.get('window').width;
    const windowHeight = Dimensions.get('window').height;

    const handleColorChange = (color) => {
        setSelectedColor(color);
    };

    const handleColorSelected = () => {
        updateColor(colorType, selectedColor);
        setModalVisible(false);
    };

    const styles = StyleSheet.create({
        container: {
            alignItems: 'center',
        },
        label: {
            fontSize: 14,
            marginBottom: 8,
            color: colors.text,
            textAlign: 'center',
        },
        colorPreview: {
            width: 40,
            height: 40,
            borderRadius: 20,
            borderWidth: 2,
            borderColor: colors.border,
        },
        modalOverlay: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContainer: {
            width: Math.min(380, windowWidth * 0.9),
            maxHeight: Math.min(480, windowHeight * 0.7),
            backgroundColor: colors.background,
            borderRadius: 15,
            padding: 25,
            alignItems: 'center',
            shadowColor: '#000',
            shadowOffset: {
                width: 0,
                height: 2,
            },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
        },
        pickerContainer: {
            width: '100%',
            height: 280,
            marginBottom: 20,
        },
        button: {
            backgroundColor: colors.primary,
            paddingVertical: 8,
            paddingHorizontal: 20,
            borderRadius: 8,
            marginTop: 5,
        },
        buttonText: {
            color: '#fff',
            fontSize: 16,
            fontWeight: 'bold',
        },
        modalTitle: {
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 15,
            color: colors.text,
        },
    });

    return (
        <View style={styles.container}>
            <Text style={styles.label}>{label}</Text>
            <TouchableOpacity
                style={[styles.colorPreview, { backgroundColor: customColors[colorType] }]}
                onPress={() => {
                    setSelectedColor(customColors[colorType]);
                    setModalVisible(true);
                }}
            />

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Select {label} Color</Text>
                        <View style={styles.pickerContainer}>
                            <ColorPicker
                                color={selectedColor}
                                onColorChange={handleColorChange}
                                thumbSize={35}
                                sliderSize={35}
                                noSnap={true}
                                row={false}
                            />
                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleColorSelected}>
                            <Text style={styles.buttonText}>Apply</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
} 