import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView } from 'react-native';
import { CounterProvider } from './src/context/CounterContext';
import CounterDisplay from './src/components/CounterDisplay';
import CounterControls from './src/components/CounterControls';
import Menu from './src/components/Menu';

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <CounterProvider>
                <View style={styles.content}>
                    <CounterDisplay />
                    <CounterControls />
                    <Menu />
                </View>
                <StatusBar style="auto" />
            </CounterProvider>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
}); 