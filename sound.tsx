import { Audio } from 'expo-av';
import { Tempo } from './index';

const timeTilNextTock = (tempo: Tempo, offset: number) => {
  return bpmToMillisPerBeat(tempo.bpm)-(new Date().getTime() + offset - tempo.startTime.getTime())
    % bpmToMillisPerBeat(tempo.bpm);
};

const bpmToMillisPerBeat = (bpm: number) => {
  return 60000 / bpm;
};

const setTock = (tempo: Tempo, offset: number) => {
  let tockSound = new Audio.Sound();
  tockSound.loadAsync(require('./assets/tockAt10.162.mp3'));
  const tockPosition = 10000;
  const correction = 0;
  const interval = 250;
  let intervalID = setInterval(() => {
    const runway = timeTilNextTock(tempo, offset);
    if (runway < interval) {
      tockSound.playFromPositionAsync(
        Math.max(0, tockPosition - (runway - correction))
      );
    }
  }, interval);
  return () => {
    clearTimeout(intervalID);
    tockSound.unloadAsync();
  };
};

export default setTock;
