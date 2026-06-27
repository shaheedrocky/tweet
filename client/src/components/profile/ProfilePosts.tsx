import React from 'react';
import { FlatList, Image } from 'react-native';
import { WIDTH } from '../../utils/color';
import { ProfilePost } from '../../types/profile';
import { useTheme } from '../../providers/ThemeProvider';

interface ProfilePostsProps {
  posts: ProfilePost[];
}

const ProfilePosts: React.FC<ProfilePostsProps> = ({ posts }) => {
  const {theme} = useTheme()
  return (
    <FlatList
      scrollEnabled={false}
      data={posts}
      numColumns={3}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Image
          source={{ uri: item.image }}
          style={{
            width: WIDTH / 3,
            height: WIDTH / 3,
            borderWidth:1,
            borderColor: theme.border
          }}
        />
      )}
    />
  );
};

export default ProfilePosts;