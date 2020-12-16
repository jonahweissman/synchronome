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
    Tempo,
} from './tempo';
import { createRoom, updateRoomTempo, getRoomTempo } from './sync';

const App: FunctionComponent = () => {
    const [tempo, setTempo] = useState(Tempo.defaultTempo());
    const [roomEndpoint, setRoomEndpoint] = useState('');
    const [timeDelta, setTimeDelta] = useState(NaN);
    // server time = local time + time delta

    useEffect(() => {
        createRoom().then((room: string) => {
            setRoomEndpoint(room);
        });
    }, []);

    useEffect(() => {
        const getTimeDelta = (): Promise<number> => {
            return new Promise((resolve, reject) => {
                ntpClient.getNetworkTime(
                    'pool.ntp.org',
                    123,
                    (error: any, serverDate: ServerTime) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                        if (error) {
                            reject(error);
                        }
                        const tD = isoServerTime.unwrap(serverDate).getTime() - new Date().getTime();
                        console.log(tD);
                        resolve(tD);
                    }
                );
            });
        };
        Promise.race(Array(5).fill(getTimeDelta()))
            .then((tD) => { setTimeDelta(tD); });
    }, []);

    const setTempoWithLocalTime = (bpm: number) => {
        const newTempo = new Tempo(
            bpm,
            convertToServerTime(new Date(), timeDelta)
        );
        if (roomEndpoint) {
            updateRoomTempo(roomEndpoint, newTempo);
        }
        setTempo(newTempo);
    };

    const onRoomChange = async (room: string) => {
        setRoomEndpoint(room);
        const roomTempo = await getRoomTempo(room);
        if (!tempo.equals(roomTempo)) {
            console.log('new room tempo', roomTempo);
            setTempo(roomTempo);
        }
    };

    return (
        <View style={styles.container}>
            <View style={{flex: 2, justifyContent: 'center'}}>
                {isNaN(timeDelta) ?
                    <ActivityIndicator size={'large'} color={'blue'}/> :
                    <Metronome
                        timeDelta={timeDelta}
                        tempo={tempo}
                        onBpmChange={setTempoWithLocalTime}
                    />}
            </View>
            <View style={{flex: 1}}>
                {roomEndpoint == '' ?
                    <ActivityIndicator color={'blue'}/> :
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
        justifyContent: 'center',
    },
});

export default App;
