import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal } from 'react-native';

interface Props {
  roomEndpoint: string;
  onRoomChange: (room: string) => void;
}

export default function(props: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const [room, setRoom] = useState("");
  const updateRoom = (newRoom: string) => {
    props.onRoomChange(newRoom);
    setModalVisible(false);
  };
  console.log(room);
  return <View>
    <Text>Current room: </Text><Text selectable={true}>{props.roomEndpoint}</Text>
    <Button title="Change room" onPress={() => { setModalVisible(true)}} />
    <Modal visible={modalVisible} onRequestClose={() => { setModalVisible(false) }}>
      <View style={{flex:1, justifyContent: "center"}}>
        <TextInput
          onSubmitEditing={(event) => { updateRoom(event.nativeEvent.text)}}
          onChangeText={(text) => { setRoom(text) }}
          placeholder={"new room URL"}
          autoFocus={true}
        />
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <Button title="Change" onPress={() => { updateRoom(room) }} />
          <Button title="Cancel" onPress={() => { setModalVisible(false)}} />
        </View>
      </View>
    </Modal>
  </View>
}
