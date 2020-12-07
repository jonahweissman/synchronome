import React, { useState } from 'react';
import { View, Text, TextInput, Button, Modal } from 'react-native';

interface Props {
  roomEndpoint: string;
  onRoomChange: (room: string) => void;
}

export default function(props: Props) {
  const [modalVisible, setModalVisible] = useState(false);
  const updateRoom = (event: any) => {
    props.onRoomChange(event.nativeEvent.text);
    setModalVisible(false);
  };

  return <View>
    <Text>Current room: </Text><Text selectable={true}>{props.roomEndpoint}</Text>
    <Button title="Change room" onPress={() => setModalVisible(true)} />
    <Modal visible={modalVisible} onRequestClose={() => { setModalVisible(false) }}>
      <View style={{flex:1, justifyContent: "center"}}>
        <TextInput
          onSubmitEditing={updateRoom}
          placeholder={"new room URL"}
          autoFocus={true}
        />
      </View>
    </Modal>
  </View>
}
