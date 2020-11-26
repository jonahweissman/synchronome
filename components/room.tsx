import React from 'react';
import { View, Text, TextInput } from 'react-native';

interface Props {
  roomEndpoint: string;
  onRoomChange: (arg0: string) => void;
}

export default function(props: Props) {
  const updateRoom = (event: any) => {
    props.onRoomChange(event.nativeEvent.text);
    console.log(event.nativeEvent.text);
  };

  return <View>
    <Text>In room {props.roomEndpoint}</Text>
    <Text> Join a different room: <TextInput onSubmitEditing={updateRoom} /> </Text>
  </View>
}
