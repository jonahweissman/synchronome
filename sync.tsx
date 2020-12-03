import { Tempo } from './index';

const createRoom = () => {
  console.log('creating room');
  return fetch('https://jsonstorage.net/api/items', {
    method: 'POST',
    body: '{}',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
  })
    .then((response) => {
      return response.json();
    })
    .then((json) => {
      return json.uri;
    })
    .catch((error) => {
      console.error(error);
    })
};

const updateRoomTempo = (roomEndpoint: string, tempo: Tempo) => {
  console.log('updating room', roomEndpoint, tempo);
  return fetch(roomEndpoint, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    },
    body: JSON.stringify(tempo),
  })
    .catch((error) => {
      console.error(error);
    })
};

const getRoomTempo = (roomEndpoint: string): Promise<Tempo> => {
  console.log("getting tempo from", roomEndpoint);
  return new Promise((resolve, reject) => {
    fetch(roomEndpoint)
    .then((response) => {
      return response.json()
    })
    .then((tempo: Tempo) => {
      const { bpm, startTime } = tempo;
      resolve({ bpm, startTime: new Date(startTime) } as Tempo);
    })
    .catch((error) => {
      console.error(error);
      reject();
    })
  })
};

export { createRoom, updateRoomTempo, getRoomTempo };
