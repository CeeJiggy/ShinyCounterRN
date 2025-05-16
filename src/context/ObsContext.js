import React, { createContext, useContext, useRef, useState, useCallback } from 'react';
import OBSWebSocket from 'obs-websocket-js';

const ObsContext = createContext();

export function ObsProvider({ children }) {
    const [obsConnected, setObsConnected] = useState(false);
    const [obsPort, setObsPort] = useState('4455');
    const [obsPassword, setObsPassword] = useState('');
    const [showCounterInOBS, setShowCounterInOBS] = useState(false);
    const [showPokemonInOBS, setShowPokemonInOBS] = useState(false);
    const [obsAuthPending, setObsAuthPending] = useState(false);
    const obsRef = useRef(null);

    // New: OBS source mappings [{ id, counterId, sourcePrefix }]
    const [obsSourceMappings, setObsSourceMappings] = useState([
        { id: 1, counterId: null, sourcePrefix: 'Source1' }
    ]);

    const addObsSourceMapping = () => {
        setObsSourceMappings(prev => [
            ...prev,
            { id: Date.now(), counterId: null, sourcePrefix: `Source${prev.length + 1}` }
        ]);
    };
    const removeObsSourceMapping = (id) => {
        setObsSourceMappings(prev => prev.filter(m => m.id !== id));
    };
    const updateObsSourceMapping = (id, updates) => {
        setObsSourceMappings(prev => prev.map(m => m.id === id ? { ...m, ...updates } : m));
    };

    const connectToOBS = useCallback(async () => {
        setObsAuthPending(true);
        if (obsRef.current) {
            try { await obsRef.current.disconnect(); } catch (e) { }
        }
        const obs = new OBSWebSocket();
        obsRef.current = obs;
        try {
            await obs.connect(`ws://localhost:${obsPort}`, obsPassword || undefined);
            setObsConnected(true);
            setObsAuthPending(false);
            console.log('Connected to OBS via obs-websocket-js');
        } catch (err) {
            setObsConnected(false);
            setObsAuthPending(false);
            alert('Failed to connect to OBS: ' + (err?.message || err));
        }
        // Listen for disconnects
        obs.on('ConnectionClosed', () => {
            setObsConnected(false);
            setObsAuthPending(false);
            console.log('OBS connection closed');
        });
    }, [obsPort, obsPassword]);

    const disconnectFromOBS = useCallback(async () => {
        if (obsRef.current) {
            try {
                await obsRef.current.disconnect();
            } catch (e) { }
            obsRef.current = null;
        }
        setObsConnected(false);
        setObsAuthPending(false);
    }, []);

    return (
        <ObsContext.Provider value={{
            obsRef,
            obsConnected,
            connectToOBS,
            disconnectFromOBS,
            obsAuthPending,
            obsPort,
            setObsPort,
            obsPassword,
            setObsPassword,
            showCounterInOBS,
            setShowCounterInOBS,
            showPokemonInOBS,
            setShowPokemonInOBS,
            obsSourceMappings,
            setObsSourceMappings,
            addObsSourceMapping,
            removeObsSourceMapping,
            updateObsSourceMapping,
        }}>
            {children}
        </ObsContext.Provider>
    );
}

export function useObs() {
    const ctx = useContext(ObsContext);
    if (!ctx) throw new Error('useObs must be used within an ObsProvider');
    return ctx;
} 