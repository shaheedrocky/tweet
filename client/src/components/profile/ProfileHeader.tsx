import React from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';
import { HEIGHT } from '../../utils/color';
import { useTheme } from '../../providers/ThemeProvider';
import VectorIcon from '../common/VectorIcon';
import { ProfileData } from '../../types/profile';

interface ProfileHeaderProps {
  profile: ProfileData;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ profile }) => {
  const { theme } = useTheme();

  return (
    <View>
      {/* Cover */}
      <Image
        source={{ uri: profile.cover }}
        style={{
          width: '100%',
          height: HEIGHT * 0.18,
        }}
        resizeMode="cover"
      />

      {/* Profile Section */}
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: -40,
        }}
      >
        {/* Avatar + Actions */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Image
            source={{ uri: profile.avatar }}
            style={{
              width: 90,
              height: 90,
              borderRadius: 45,
              borderWidth: 4,
              borderColor: theme.background,
            }}
          />

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              marginTop: 48,
            }}
          >
            <TouchableOpacity
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                borderWidth: 1,
                borderColor: theme.border,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <VectorIcon
                type="Feather"
                name="more-horizontal"
                size={18}
                color={theme.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                borderWidth: 1,
                borderColor: theme.border,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <VectorIcon
                type="Feather"
                name="mail"
                size={18}
                color={theme.text}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={{
                height: 38,
                paddingHorizontal: 20,
                borderRadius: 20,
                backgroundColor: theme.text,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: theme.background,
                  fontWeight: '700',
                }}
              >
                Follow
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Info */}
        <View style={{ marginTop: 12 }}>
          <Text
            style={{
              color: theme.text,
              fontSize: 22,
              fontWeight: '700',
            }}
          >
            {profile.name} {profile.isVerified && (
              <Image
                source={require('../../assets/image/check.png')}
                style={{ height: 18, width: 18 }}
              />
            )}
          </Text>


          <Text
            style={{
              color: theme.textMuted,
              marginTop: 2,
            }}
          >
            {profile.username}
          </Text>
        </View>
        <Text
          style={{
            color: theme.text,
            marginTop: 12,
            lineHeight: 22,
          }}
        >
          {profile.bio}
        </Text>

        <Text
          style={{
            color: theme.primary,
            marginTop: 8,
          }}
        >
          {profile.website}
        </Text>
      </View>

      <View
        style={{
          flexDirection: 'row',
          paddingHorizontal: 16,
          marginTop: 16,
        }}
      >
        <Text
          style={{
            color: theme.text,
            fontWeight: '700',
          }}
        >
          {profile.following}
        </Text>

        <Text
          style={{
            color: theme.textMuted,
            marginLeft: 4,
          }}
        >
          Following
        </Text>

        <Text
          style={{
            color: theme.text,
            fontWeight: '700',
            marginLeft: 20,
          }}
        >
          {profile.followers}
        </Text>

        <Text
          style={{
            color: theme.textMuted,
            marginLeft: 4,
          }}
        >
          Followers
        </Text>
      </View>
    </View>
  );
};

export default ProfileHeader;
