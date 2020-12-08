import { StatusBar } from 'expo-status-bar';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ActivityIndicator } from 'react-native';
import ntpClient from 'react-native-ntp-client';

import Metronome from './components/metronome';
import Room from './components/room';
import {
  Tempo,
  ServerTime,
  isoServerTime,
  convertToServerTime,
  tempoEquals
} from './tempo';
import { createRoom, updateRoomTempo, getRoomTempo } from './sync';

export default function App() {
  const [tempo, setTempo] = useState({
    bpm: 60,
    startTime: isoServerTime.wrap(new Date())
  });
  const [roomEndpoint, setRoomEndpoint] = useState("");
  const [timeDelta, setTimeDelta] = useState(NaN);
  // server time = local time + time delta

  useEffect(() => {
      createRoom().then((room: string) => {
        setRoomEndpoint(room);
        updateRoomTempo(room, tempo);
      });
  }, []);

  useEffect(() => {
    ntpClient.getNetworkTime(
      "pool.ntp.org",
      123,
      (error: any, serverDate: ServerTime) => {
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

  useEffect(() => {
    if (roomEndpoint != "") {
        updateRoomTempo(roomEndpoint, tempo);
    }
  }, [tempo, timeDelta]);

  const refreshFromRoom = async () => {
    const roomTempo = await getRoomTempo(roomEndpoint)
    if (!tempoEquals(tempo, roomTempo)) {
      console.log('new room tempo', roomTempo);
      setTempo(roomTempo)
    }
  };

  useEffect(() => {
    const intervalID = setInterval(refreshFromRoom, 1000);
    return () => {clearInterval(intervalID)}
  }, [tempo, roomEndpoint]);

  const setTempoWithLocalTime = (bpm: number) => {
    setTempo({
      bpm,
      startTime: convertToServerTime(new Date(), timeDelta)
    });
  };

  const onRoomChange = (room) => {
    setRoomEndpoint(room);
    refreshFromRoom();
  };

  return (
    <View style={styles.container}>
      {isNaN(timeDelta) ?
      <ActivityIndicator size={'large'} style={{flex: 2}} /> :
      <Metronome timeDelta={timeDelta} tempo={tempo} onBpmChange={setTempoWithLocalTime} />}
      <View style={{flex: 1}}>
        {roomEndpoint == "" ? <ActivityIndicator/> : <Room roomEndpoint={roomEndpoint} onRoomChange={onRoomChange} />}
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
