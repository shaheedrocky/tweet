import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '../providers/ThemeProvider';
import VectorIcon from './common/VectorIcon';

const UserItem = ({ item }: { item: any }) => {
  const { theme } = useTheme();

  return (
    <TouchableOpacity
    key={item.id}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: item.pinned && '#FFFFFF20',
      }}
    >
      {/* Avatar */}
      <View style={{ marginLeft: 16 }}>
        <Image
          source={{ uri: item.avatar }}
          style={{
            width: 40,
            height: 40,
            borderRadius: 28,
          }}
        />

        {item.online && (
          <View
            style={{
              position: 'absolute',
              right: 2,
              bottom: 2,
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: theme.online,
              borderWidth: 2,
              borderColor: theme.background,
            }}
          />
        )}
      </View>

      {/* Content */}
      <View
        style={{
          flex: 1,
          marginLeft: 14,
        }}
      >
        <Text
          style={{
            color: theme.text,
            fontSize: 15,
            fontWeight: '500',
          }}
        >
          {item.name}
        </Text>

        <Text
          numberOfLines={1}
          style={{
            marginTop: 2,
            color: theme.textMuted,
            fontSize: 13,
            fontWeight: '300',
          }}
        >
          {item.lastMessage}
        </Text>
      </View>

      {/* Right Side */}
      <View
        style={{
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          height: 48,
          marginRight: 16,
        }}
      >
        <Text
          style={{
            color: theme.textMuted,
            fontSize: 12,
            fontWeight: '500',
          }}
        >
          {item.time}
        </Text>
        {item.pinned && (
          <VectorIcon
            type="Fontisto"
            name="pinboard"
            color={theme.textMuted}
            size={18}
            style={{
              transform: [{ rotate: '90deg' }],
            }}
          />
        )}

        {item.unreadCount > 0 && (
          <View
            style={{
              minWidth: 22,
              height: 22,
              borderRadius: 11,
              backgroundColor: theme.primary,
              justifyContent: 'center',
              alignItems: 'center',
              paddingHorizontal: 6,
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontSize: 11,
                fontWeight: '800',
              }}
            >
              {item.unreadCount}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default UserItem;
