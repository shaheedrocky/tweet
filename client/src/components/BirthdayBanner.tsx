import React from 'react';
import {
  View,
  Text,
  Image,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { fontSize } from '../utils/color';

interface User {
  id: string;
  avatar: string;
}

interface Props {
  data: User[];
  setToggleBirthday: React.Dispatch<React.SetStateAction<boolean>>;
}

const BirthdayBanner = ({ data, setToggleBirthday }: Props) => {
  return (
    <ImageBackground
      source={require('../assets/image/bg-birthday.png')}
      style={[
        styles.container,
        {
          backgroundColor: '#31503F',
        },
      ]}
    >
      <View style={styles.content}>
        {/* Avatars */}
        <View style={styles.avatarContainer}>
          {data.slice(0, 3).map((item, index) => (
            <Image
              key={item.id}
              source={{ uri: item.avatar }}
              style={[
                styles.avatar,
                {
                  marginLeft: index === 0 ? 0 : -14,
                  zIndex: 10 - index,
                },
              ]}
            />
          ))}
        </View>

        {/* Title */}
        <Text style={styles.title}>Recent birthdays</Text>

        {/* Plus Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setToggleBirthday(false)}
          style={styles.plusButton}
        >
          <Text style={styles.plusText}>×</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

export default BirthdayBanner;

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 50,
    paddingLeft: -16,
    borderRadius: 38,
    overflow: 'hidden',
    justifyContent: 'center',
    backgroundColor: 'red',
  },

  bgImage: {
    resizeMode: 'cover',
    backgroundColor: 'green',
  },

  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
  },

  avatarContainer: {
    flexDirection: 'row',
    marginRight: 12,
  },

  avatar: {
    width: 30,
    height: 30,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#2F5C4A',
  },

  title: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: fontSize.subtitle,
    fontFamily: 'Poppins-medium',
  },

  plusButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  plusText: {
    color: '#FFFFFF',
    fontSize: 24,
    marginTop: -2,
  },
});
