import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';

import Metronome from './components/metronome';
import Room from './components/room';
import setTock from './sound';
import { Tempo } from './index';
import { createRoom, updateRoomTempo, getRoomTempo } from './sync';

export default function App() {
  const [tempo, setTempo] = useState({bpm: 60, startTime: new Date()});
  const [roomEndpoint, setRoomEndpoint] = useState("");

  useEffect(() => {
    return setTock(tempo);
  }, [tempo]);

  useEffect(() => {
      createRoom().then((room: string) => {
        setRoomEndpoint(room);
        updateRoomTempo(room, tempo);
      });
  }, []);

  useEffect(() => {
    if (roomEndpoint != "") {
        updateRoomTempo(roomEndpoint, tempo);
    }
  }, [tempo]);

  useEffect(() => {
    const intervalID = setInterval(() => {
      getRoomTempo(roomEndpoint)
        .then((roomTempo) => {
          if (tempo.bpm != roomTempo.bpm) {
            setTempo(roomTempo)
          }
        });
    }, 1000);
    return () => {clearInterval(intervalID)}
  });

  return (
    <View style={styles.container}>
      <Metronome tempo={tempo} onTempoChange={setTempo} />
      {roomEndpoint == "" ? <ActivityIndicator/> : <Room roomEndpoint={roomEndpoint} onRoomChange={setRoomEndpoint} />}
      <StatusBar style="auto" />
    </View>
  );
}

const tempoEquals = (t1: Tempo, t2: Tempo) =>
  t1.bpm == t2.bpm && t1.startTime == t2.startTime;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
