import { Newtype, iso } from 'newtype-ts';

export interface Tempo {
  bpm: number;
  startTime: ServerTime;
}


export const tempoEquals = (t1: Tempo, t2: Tempo) =>
  t1.bpm == t2.bpm && t1.startTime.valueOf() == t2.startTime.valueOf();

export interface ServerTime extends Newtype<{ readonly ServerTime: unique symbol }, Date> {}

export const isoServerTime = iso<ServerTime>();

export const convertToServerTime = (time: Date, timeDelta: number): ServerTime => 
  isoServerTime.wrap(new Date(time.getTime() + timeDelta));
