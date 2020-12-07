import { Newtype, iso } from 'newtype-ts';

export interface Tempo {
  bpm: number;
  startTime: ServerTime;
}

export interface ServerTime extends Newtype<{ readonly ServerTime: unique symbol }, Date> {}

export const isoServerTime = iso<ServerTime>();

export const convertToServerTime = (time: Date, timeDelta: number): ServerTime => 
  isoServerTime.wrap(new Date(time.getTime() + timeDelta));
