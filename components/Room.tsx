import React, { useState, useEffect, FunctionComponent } from 'react';
import { View, Text, TextInput, Button, Modal, Share, StyleSheet } from 'react-native';

import { Tempo } from '../tempo';
import { getRoomTempo } from '../sync';

interface Props {
    roomEndpoint: string;
    onRoomChange: (room: string) => void;
    tempo: Tempo;
    onRoomUpdate: (tempo: Tempo) => void;
}

const Room: FunctionComponent<Props> = (props: Props) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [roomText, setRoomText] = useState('');
    const { tempo, roomEndpoint, onRoomUpdate } = props;
    const updateRoom = (newRoom: string) => {
        props.onRoomChange(newRoom);
        setModalVisible(false);
    };

    useEffect(() => {
        const intervalID = setInterval(async () => {
            const roomTempo = await getRoomTempo(roomEndpoint);
            if (!tempo.equals(roomTempo)) {
                console.log('new room tempo', roomTempo);
                onRoomUpdate(roomTempo);
            }
        } , 1000);
        return () => { clearInterval(intervalID); };
    }, [tempo, roomEndpoint, onRoomUpdate]);

    const onShare = () => {
        Share.share({
            message: props.roomEndpoint,
        });
    };

    return <View style={styles.container}>
        <View style={styles.horizontal}>
            <View style={{flex: 3}}>
                <Text>Current room: </Text>
                <Text selectable={true}>{props.roomEndpoint}</Text>
            </View>
            <View style={{flex: 1}}>
                <Button title="Share room" onPress={onShare} />
            </View>
        </View>
        <Button title="Change room" onPress={() => { setModalVisible(true);}} />
        <Modal visible={modalVisible} onRequestClose={() => { setModalVisible(false); }}>
            <View style={{flex:1, justifyContent: 'center'}}>
                <TextInput
                    onSubmitEditing={(event) => { updateRoom(event.nativeEvent.text);}}
                    onChangeText={(text) => { setRoomText(text); }}
                    placeholder={'new room URL'}
                    autoFocus={true}
                />
                <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                    <Button title="Change" onPress={() => { updateRoom(roomText); }} />
                    <Button title="Cancel" onPress={() => { setModalVisible(false);}} />
                </View>
            </View>
        </Modal>
    </View>;
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    horizontal: {
        flexDirection: 'row',
    }
});

export default Room;
