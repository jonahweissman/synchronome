import { Audio } from 'expo-av';
import { Tempo, isoServerTime, convertToServerTime } from './tempo';

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

const setTock = (tempo: Tempo, timeDelta: number) => {
  console.log('timeDelta', timeDelta);
  let tockSound = new Audio.Sound();
  tockSound.loadAsync(require('./assets/tockAt10.162.mp3'));
  const tockPosition = 10000;
  const correction = 0;
  const interval = 150;
  let intervalID = setInterval(async () => {
    const playbackStatus = await tockSound.getStatusAsync();
    const runway = timeTilNextTock(tempo, timeDelta);
    if (playbackStatus.isLoaded && runway < interval) {
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
