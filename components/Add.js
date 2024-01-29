import * as React from 'react';
import { IconButton } from 'react-native-paper';

const style = {
  borderRadius: 50,
  height: 50,
  width: 50,
  justifyContent: 'center',
  alignItems: 'center',
  alignSelf: 'center', // Add this line to center horizontally
  backgroundColor: "#8ebbff",
  color: "#f4f4fc",
  margin: 10, 
};

const Add = ({onclick}) => (
  <IconButton
    icon="plus"
    size={20}
    color='#f4f4fc'
    style={style} 
    onPress={onclick}
  />
);

export default Add;
