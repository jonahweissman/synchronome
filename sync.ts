import { Tempo, isoServerTime } from './tempo';

const createRoom = (): Promise<string> => {
    console.log('creating room');
    return fetch('https://jsonstorage.net/api/items', {
        method: 'POST',
        body: JSON.stringify(Tempo.defaultTempo()),
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
        });
};

const updateRoomTempo = (roomEndpoint: string, tempo: Tempo): void => {
    console.log('updating room', roomEndpoint, tempo);
    fetch(roomEndpoint, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json; charset=utf-8'
        },
        body: JSON.stringify(tempo),
    })
        .catch((error) => {
            console.error(error);
        });
};

const getRoomTempo = (roomEndpoint: string): Promise<Tempo> => {
    return new Promise((resolve, reject) => {
        fetch(roomEndpoint)
            .then((response) => {
                return response.json();
            })
            .then((tempo: {bpm: number, startTime: string} ) => {
                const { bpm, startTime } = tempo;
                if (!(bpm && startTime)) {
                    reject('invalid room contents');
                }
                resolve(new Tempo(
                    bpm,
                    isoServerTime.wrap(new Date(startTime))
                ));
            })
            .catch((error) => {
                console.error(error);
                reject();
            });
    });
};

export { createRoom, updateRoomTempo, getRoomTempo };
