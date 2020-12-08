import { View, Text, TextInput, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useKeepAwake } from 'expo-keep-awake';
import { Audio } from 'expo-av';

import { Tempo, isoServerTime, convertToServerTime } from '../tempo';

interface Props {
  onBpmChange: (bpm: number) => void;
  tempo: Tempo;
  timeDelta: number;
}


const timeTilNextTock = (tempo: Tempo, timeDelta: number) => {
  // ms til next beat = period - ms since last beat
  return bpmToMillisPerBeat(tempo.bpm)
    - ((
        // miliseconds since startTime
        isoServerTime.unwrap(convertToServerTime(new Date(), timeDelta)).getTime()
        - isoServerTime.unwrap(tempo.startTime).getTime()
       // after mod becomes milliseonds since last beat
      ) % bpmToMillisPerBeat(tempo.bpm));
};

const bpmToMillisPerBeat = (bpm: number) => {
  return 60000 / bpm;
};

const validBpm = (bpm: number): boolean => bpm >=0 && bpm < 300;

const metronome = (props: Props) => {
  useKeepAwake();
  const [displayBpm, setDisplayBpm] = useState(props.tempo.bpm.toString());

  const updateBpm = (newBpm: string) => {
    setDisplayBpm(newBpm);
    const bpm = parseInt(newBpm, 10);
    if (validBpm(bpm)) {
      props.onBpmChange(bpm)
    }
  };

  useEffect(() => {
    setDisplayBpm(props.tempo.bpm.toString());
  }, [props.tempo]);

  useEffect(() => {
    console.log('timeDelta', props.timeDelta);
    let tockSound = new Audio.Sound();
    tockSound.loadAsync(require('../assets/tockAt10.162.mp3'));
    const tockPosition = 10000;
    const correction = 0;
    const interval = 200;
    let intervalID = setInterval(async () => {
      const playbackStatus = await tockSound.getStatusAsync();
      const runway = timeTilNextTock(props.tempo, props.timeDelta);
      if (playbackStatus.isLoaded && runway < interval) {
        tockSound.playFromPositionAsync(
          Math.max(0, tockPosition - (runway - correction))
        );
      }
    }, interval);
    return () => {
      clearTimeout(intervalID);
      tockSound.unloadAsync();
    }
  }, [props.tempo, props.timeDelta]);

  return <View style={styles.row} >
    <View>
      <TextInput
        style={styles.bpmNumber}
        value={displayBpm}
        keyboardType={'numeric'}
        onChangeText={updateBpm}
      />
    </View>
    <View style={styles.bpmTextWrapper}>
      <Text style={styles.bpmText}>BPM</Text>
    </View>
  </View>
};

const styles = StyleSheet.create({
  row: {
    flex: 2,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center"
  },
  bpmNumber: {
    fontSize: 50
  },
  bpmTextWrapper: {
  },
  bpmText: {
    fontSize: 20
 }
});

export default metronome;
