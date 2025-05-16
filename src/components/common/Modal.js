import { StyleSheet, View, Modal as RNModal, Text, ScrollView } from 'react-native';
import { useThemeContext } from '../../context/ThemeContext';

export default function Modal({
    visible,
    onRequestClose,
    title,
    children,
    style,
    contentStyle,
    titleStyle,
    animationType = 'fade',
    transparent = true,
    footer,
}) {
    const { getThemeColors } = useThemeContext();
    const themeColors = getThemeColors();

    const styles = StyleSheet.create({
        modalContainer: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
        modalContent: {
            backgroundColor: themeColors.background,
            padding: 20,
            borderRadius: 12,
            minWidth: 250,
            width: '90%',
            maxWidth: 500,
            maxHeight: '80%',
            alignItems: 'center',
            ...contentStyle,
        },
        modalTitle: {
            fontSize: 24,
            fontWeight: 'bold',
            color: themeColors.text,
            marginBottom: 20,
            textAlign: 'center',
            ...titleStyle,
        },
        scrollContent: {
            width: '100%',
            flex: 1,
            scrollbarColor: `${themeColors.primary} ${themeColors.background}`,
            scrollbarWidth: 'thin',
            paddingHorizontal: 10,
        },
        footer: {
            width: '100%',
            marginTop: 16,
        }
    });

    return (
        <RNModal
            visible={visible}
            animationType={animationType}
            transparent={transparent}
            onRequestClose={onRequestClose}
        >
            <View style={[styles.modalContainer, style]}>
                <View style={styles.modalContent}>
                    {title && <Text style={styles.modalTitle}>{title}</Text>}
                    <ScrollView
                        style={styles.scrollContent}
                        contentContainerStyle={{ alignItems: 'center' }}
                        showsVerticalScrollIndicator={true}
                    >
                        {children}
                    </ScrollView>
                    {footer && <View style={styles.footer}>{footer}</View>}
                </View>
            </View>
        </RNModal>
    );
} 