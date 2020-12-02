import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import ntpClient from 'react-native-ntp-client';

import Metronome from './components/metronome';
import Room from './components/room';
import setTock from './sound';
import { Tempo } from './index';
import { createRoom, updateRoomTempo, getRoomTempo } from './sync';

export default function App() {
  const [tempo, setTempo] = useState({bpm: 60, startTime: new Date()});
  const [roomEndpoint, setRoomEndpoint] = useState("");
  const [offset, setOffset] = useState(NaN);

  useEffect(() => {
    ntpClient.getNetworkTime("pool.ntp.org", 123, (error: any, serverDate: Date) => {
      if (error) {
          console.error(error);
          return;
      }
      setOffset(new Date().getTime() - serverDate.getTime());
    });
  }, []);

  useEffect(() => {
      createRoom().then((room: string) => {
        setRoomEndpoint(room);
        updateRoomTempo(room, tempo);
      });
  }, []);

  useEffect(() => {
    if (offset != NaN) {
      return setTock(tempo, offset);
    }
  }, [tempo, offset]);

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
