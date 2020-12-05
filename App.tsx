import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import clockSync from 'react-native-clock-sync';

import Metronome from './components/metronome';
import Room from './components/room';
import setTock from './sound';
import { Tempo } from './index';
import { createRoom, updateRoomTempo, getRoomTempo } from './sync';

export default function App() {
  const [tempo, setTempo] = useState({bpm: 60, startTime: new Date()});
  const [roomEndpoint, setRoomEndpoint] = useState("");
  const [clock, setClock] = useState(new clockSync({
    syncDelay: 60
  }));

  useEffect(() => {
      createRoom().then((room: string) => {
        setRoomEndpoint(room);
        updateRoomTempo(room, tempo);
      });
  }, []);

  useEffect(() => {
    const offset = new Date().getTime() - clock.getTime();
    if (!isNaN(offset)) {
      return setTock(tempo, offset);
    }
  }, [tempo]);

  useEffect(() => {
    if (roomEndpoint != "") {
        updateRoomTempo(roomEndpoint, tempo);
    }
  }, [tempo]);

  useEffect(() => {
    const intervalID = setInterval(() => {
      getRoomTempo(roomEndpoint)
        .then((roomTempo) => {
          if (!tempoEquals(tempo, roomTempo)) {
            console.log('new room tempo', roomTempo);
            setTempo(roomTempo)
          }
        });
    }, 1000);
    return () => {clearInterval(intervalID)}
  }, [tempo, roomEndpoint]);

  return (
    <View style={styles.container}>
      <Metronome tempo={tempo} onTempoChange={setTempo} />
      <View style={{flex: 1}}>
        {roomEndpoint == "" ? <ActivityIndicator/> : <Room roomEndpoint={roomEndpoint} onRoomChange={setRoomEndpoint} />}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const tempoEquals = (t1: Tempo, t2: Tempo) =>
  t1.bpm == t2.bpm && t1.startTime.valueOf() == t2.startTime.valueOf();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
