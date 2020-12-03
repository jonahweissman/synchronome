import { Text, TextInput } from 'react-native';
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

  return <>
    <TextInput
      value={displayBpm}
      keyboardType={'numeric'}
      onChangeText={updateTempo}
    />
    <Text>bpm</Text>
  </>
};

const validBpm = (bpm: number): boolean => bpm >=0 && bpm < 300;
export default metronome;
