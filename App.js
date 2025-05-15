import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View, SafeAreaView, Platform, Text } from 'react-native';
import { CounterProvider } from './src/context/CounterContext';
import CounterDisplay from './src/components/CounterDisplay';
import CounterControls from './src/components/CounterControls';
import Menu from './src/components/Menu';
import CounterTabs from './src/components/CounterTabs';
import PokemonSelector from './src/components/PokemonSelector';

export default function App() {
    return (
        <SafeAreaView style={styles.container}>
            <DummyTabs />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        minHeight: '100vh', // for web
    },
    innerContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        minHeight: '100vh', // for web
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
        paddingBottom: Platform.OS === 'web' ? 100 : 20,
    },
});

function DummyTabs() {
    return (
        <View style={{ backgroundColor: 'red', height: 50, width: '100%' }}>
            <Text style={{ color: 'white' }}>DUMMY</Text>
        </View>
    );
} 