import { Text, TextInput } from 'react-native';
import React, { useState } from 'react';

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
    if (bpm >= 0 && bpm < 300) {
      props.onTempoChange({
        bpm,
        startTime: new Date(),
      })
    }
  };
  return <>
    <TextInput
      value={displayBpm}
      keyboardType={'numeric'}
      onChangeText={updateTempo}
    />
    <Text>bpm</Text>
  </>
};

export default metronome;
