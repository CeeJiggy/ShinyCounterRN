import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Create a web-specific AsyncStorage implementation
const createWebStorage = () => {
    return {
        getItem: async (key) => {
            try {
                const value = localStorage.getItem(key);
                return value;
            } catch (error) {
                console.error('Error reading from localStorage:', error);
                return null;
            }
        },
        setItem: async (key, value) => {
            try {
                localStorage.setItem(key, value);
                return null;
            } catch (error) {
                console.error('Error writing to localStorage:', error);
                return null;
            }
        },
        removeItem: async (key) => {
            try {
                localStorage.removeItem(key);
                return null;
            } catch (error) {
                console.error('Error removing from localStorage:', error);
                return null;
            }
        },
    };
};

// Export the appropriate storage implementation based on platform
export default Platform.OS === 'web' ? createWebStorage() : AsyncStorage; 