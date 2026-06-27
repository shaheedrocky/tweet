import React from 'react';
import { View, ViewStyle, StyleProp } from 'react-native';

import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Octicons from 'react-native-vector-icons/Octicons';
import Fontisto from 'react-native-vector-icons/Fontisto';

type IconType =
  | 'MaterialCommunityIcons'
  | 'FontAwesome'
  | 'FontAwesome5'
  | 'Feather'
  | 'AntDesign'
  | 'Entypo'
  | 'Ionicons'
  | 'EvilIcons'
  | 'Octicons'
  | 'Fontisto'
  | 'MaterialIcons';

interface VectorIconProps {
  name: string;
  size?: number;
  color?: string;
  type?: IconType;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

const VectorIcon: React.FC<VectorIconProps> = ({
  name,
  size = 24,
  color = '#000',
  type = 'MaterialIcons',
  onPress,
  style,
}) => {
  return (
    <View style={style}>
      {type === 'MaterialCommunityIcons' ? (
        <MaterialCommunityIcons
          name={name}
          size={size}
          color={color}
          onPress={onPress}
        />
      ) : type === 'FontAwesome' ? (
        <FontAwesome
          name={name}
          size={size}
          color={color}
          onPress={onPress}
        />
      ) : type === 'FontAwesome5' ? (
        <FontAwesome5
          name={name}
          size={size}
          color={color}
          onPress={onPress}
        />
      ) : type === 'Feather' ? (
        <Feather
          name={name}
          size={size}
          color={color}
          onPress={onPress}
        />
      ) : type === 'AntDesign' ? (
        <AntDesign
          name={name}
          size={size}
          color={color}
          onPress={onPress}
        />
      ) : type === 'Entypo' ? (
        <Entypo
          name={name}
          size={size}
          color={color}
          onPress={onPress}
        />
      ) : type === 'Ionicons' ? (
        <Ionicons
          name={name}
          size={size}
          color={color}
          onPress={onPress}
        />
      ) : type === 'EvilIcons' ? (
        <EvilIcons
          name={name}
          size={size}
          color={color}
          onPress={onPress}
        />
      ) : type === 'Octicons' ? (
        <Octicons
          name={name}
          size={size}
          color={color}
          onPress={onPress}
        />
      ) : type === 'Fontisto' ? (
        <Fontisto
          name={name}
          size={size}
          color={color}
          onPress={onPress}
        />
      ) : (
        <MaterialIcons
          name={name}
          size={size}
          color={color}
          onPress={onPress}
        />
      )}
    </View>
  );
};

export default VectorIcon;