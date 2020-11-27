import { Audio } from 'expo-av';
import { Tempo } from './index';
import { Animated } from 'react-native';

const tock = (tockSound: Audio.Sound) => {
  tockSound.replayAsync();
};

const timeTilNextTock = (tempo: Tempo) => {
  return (tempo.startTime.valueOf()- new Date().valueOf())
    % bpmToMillisPerBeat(tempo.bpm);
};

const bpmToMillisPerBeat = (bpm: number) => {
  return 60000 / bpm;
};

const setTock = (tempo: Tempo) => {
  let tockSound = new Audio.Sound();
  tockSound.loadAsync(require('./assets/tock.mp3'));
  Animated.delay(timeTilNextTock(tempo));
  let intervalID = setInterval(() => { tock(tockSound)}, bpmToMillisPerBeat(tempo.bpm));
  return () => {
    clearTimeout(intervalID);
    tockSound.unloadAsync();
  };
};

export default setTock;
