import { View, Text, TextInput, StyleSheet } from 'react-native';
import React, { useState, useEffect } from 'react';

import { Tempo } from '../index';

interface Props {
  onTempoChange: (tempo: Tempo) => void;
  tempo: Tempo;
}

const metronome = (props: Props) => {
  const [displayBpm, setDisplayBpm] = useState(props.tempo.bpm.toString());
  const updateTempo = (newBpm: string) => {
    setDisplayBpm(newBpm);
    const bpm = parseInt(newBpm, 10);
    if (validBpm(bpm)) {
      props.onTempoChange({
        bpm,
        startTime: new Date(),
      })
    }
  };
  useEffect(() => {
    setDisplayBpm(props.tempo.bpm.toString());
  }, [props.tempo]);

  return <View style={styles.row} >
    <View>
      <TextInput
        style={styles.bpmNumber}
        value={displayBpm}
        keyboardType={'numeric'}
        onChangeText={updateTempo}
      />
    </View>
    <View style={styles.bpmTextWrapper}>
      <Text style={styles.bpmText}>BPM</Text>
    </View>
  </View>
};

const validBpm = (bpm: number): boolean => bpm >=0 && bpm < 300;

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
