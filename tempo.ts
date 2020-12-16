import { Newtype, iso } from 'newtype-ts';

export class Tempo {
  bpm: number;
  startTime: ServerTime;

  constructor(bpm: number, startTime: ServerTime) {
      this.bpm = bpm;
      this.startTime = startTime;
  }

  static defaultTempo(): Tempo {
      return new Tempo(60, isoServerTime.wrap(new Date()));
  }

  equals(other: Tempo): boolean {
      return this.bpm == other.bpm
          && this.startTime.valueOf() == other.startTime.valueOf();
  }
}

export type ServerTime = Newtype<{ readonly ServerTime: unique symbol }, Date>

export const isoServerTime = iso<ServerTime>();

export const convertToServerTime = (time: Date, timeDelta: number): ServerTime =>
    isoServerTime.wrap(new Date(time.getTime() + timeDelta));
