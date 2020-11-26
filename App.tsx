import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import Metronome from './components/metronome';
import Room from './components/room';
import setTock from './sound';
import { Tempo } from './index';
import { createRoom, updateRoomTempo } from './sync';

export default function App() {
  const [tempo, setTempo] = useState({bpm: 60, startTime: new Date()});
  //  const [roomEndpoint, setRoomEndpoint] = useState("");
  // const [roomLoaded, setRoomLoaded] = useState(false);

  useEffect(() => {
    return setTock(tempo);
  }, [tempo]);

  /*
  useEffect(() => {
    if (!roomLoaded) {
      createRoom().then((room: string) => {
        setRoomLoaded(true);
        setRoomEndpoint(room);
        updateRoomTempo(room, tempo);
      });
    }
  });

  const updateTempo = (newTempo: Tempo) => {
    setTempo(newTempo);
    updateRoomTempo(roomEndpoint, newTempo);
  };
   */

  return (
    <View style={styles.container}>
      <Metronome tempo={tempo} onTempoChange={setTempo} />
      <StatusBar style="auto" />
    </View>
  );
}
// <Room roomEndpoint={roomEndpoint} onRoomChange={setRoomEndpoint} />
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
