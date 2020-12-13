import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect, FunctionComponent } from 'react';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import ntpClient from 'react-native-ntp-client';

import Metronome from './components/Metronome';
import Room from './components/Room';
import {
    ServerTime,
    isoServerTime,
    convertToServerTime,
    tempoEquals,
    defaultTempo
} from './tempo';
import { createRoom, updateRoomTempo, getRoomTempo } from './sync';

const App: FunctionComponent = () => {
    const [tempo, setTempo] = useState(defaultTempo());
    const [roomEndpoint, setRoomEndpoint] = useState('');
    const [timeDelta, setTimeDelta] = useState(NaN);
    // server time = local time + time delta
    console.log(tempo);
    useEffect(() => {
        createRoom().then((room: string) => {
            setRoomEndpoint(room);
        });
    }, []);

    useEffect(() => {
        ntpClient.getNetworkTime(
            'pool.ntp.org',
            123,
            (error: any, serverDate: ServerTime) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                if (error) {
                    console.error(error);
                    return;
                }
                setTimeDelta(
                    isoServerTime.unwrap(serverDate).getTime() - new Date().getTime()
                );
            }
        );
    }, []);

    const setTempoWithLocalTime = (bpm: number) => {
        const newTempo = {
            bpm,
            startTime: convertToServerTime(new Date(), timeDelta)
        };
        if (roomEndpoint) {
            updateRoomTempo(roomEndpoint, newTempo);
        }
        setTempo(newTempo);
    };

    const onRoomChange = async (room: string) => {
        setRoomEndpoint(room);
        const roomTempo = await getRoomTempo(room);
        if (!tempoEquals(tempo, roomTempo)) {
            console.log('new room tempo', roomTempo);
            setTempo(roomTempo);
        }
    };

    return (
        <View style={styles.container}>
            {isNaN(timeDelta) ?
                <ActivityIndicator size={'large'} style={{flex: 2}} /> :
                <Metronome
                    timeDelta={timeDelta}
                    tempo={tempo}
                    onBpmChange={setTempoWithLocalTime}
                />}
            <View style={{flex: 1}}>
                {roomEndpoint == '' ?
                    <ActivityIndicator/> :
                    <Room
                        roomEndpoint={roomEndpoint}
                        onRoomChange={onRoomChange}
                        tempo={tempo}
                        onRoomUpdate={setTempo}
                    />}
            </View>
            <StatusBar style="auto" />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'stretch',
        justifyContent: 'center',
    },
});

export default App;
