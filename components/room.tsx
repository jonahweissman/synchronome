import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface Props {
  roomEndpoint: string;
  onRoomChange: (arg0: string) => void;
}

export default function(props: Props) {
  const updateRoom = (event: any) => {
    props.onRoomChange(event.nativeEvent.text);
  };

  return <View>
    <Text selectable={true}>In room {props.roomEndpoint}</Text>
    <Text> Join a different room:</Text>
    <TextInput
      onSubmitEditing={updateRoom}
      placeholder={"Room URL"}
    />
  </View>
}
