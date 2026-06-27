import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../../providers/ThemeProvider';
import { useAuth } from '../../hooks/useAuth';
import VectorIcon from '../../components/common/VectorIcon';
import { HEIGHT, fontSize } from '../../utils/color';

const EditProfile = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { user, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [website, setWebsite] = useState(user?.website || '');
  const [location, setLocation] = useState(user?.location || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [cover, setCover] = useState(user?.cover || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }
    setSaving(true);
    try {
      await updateProfile({
        name,
        bio,
        website,
        location,
        avatar,
        cover,
      });
      navigation.goBack();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to save profile updates.');
    } finally {
      setSaving(false);
    }
  };

  const handleMockAvatarChange = () => {
    // Cycles through a pool of cartoon avatars
    const avatars = [
      'https://randomuser.me/api/portraits/women/44.jpg',
      'https://randomuser.me/api/portraits/men/32.jpg',
      'https://randomuser.me/api/portraits/women/65.jpg',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    ];
    const index = avatars.indexOf(avatar);
    const nextIndex = (index + 1) % avatars.length;
    setAvatar(avatars[nextIndex]);
  };

  const handleMockCoverChange = () => {
    const covers = [
      'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600',
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=600',
    ];
    const index = covers.indexOf(cover);
    const nextIndex = (index + 1) % covers.length;
    setCover(covers[nextIndex]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Text style={{ color: theme.text, fontSize: 16 }}>Cancel</Text>
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Edit Profile</Text>
        </View>
        <TouchableOpacity onPress={handleSave} disabled={saving} style={[styles.saveBtn, { backgroundColor: theme.text }]}>
          <Text style={{ color: theme.background, fontWeight: '700', fontSize: 14 }}>Save</Text>
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Images Section */}
          <View style={styles.imagesContainer}>
            {/* Cover */}
            <TouchableOpacity onPress={handleMockCoverChange} activeOpacity={0.9} style={styles.coverWrapper}>
              <Image source={{ uri: cover || 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=600' }} style={[styles.cover, { backgroundColor: theme.border }]} />
              <View style={styles.cameraOverlay}>
                <VectorIcon type="Feather" name="camera" size={24} color="#fff" />
              </View>
            </TouchableOpacity>

            {/* Avatar */}
            <View style={styles.avatarWrapper}>
              <TouchableOpacity onPress={handleMockAvatarChange} activeOpacity={0.9} style={[styles.avatarTouch, { borderColor: theme.background }]}>
                <Image source={{ uri: avatar }} style={styles.avatar} />
                <View style={styles.cameraOverlay}>
                  <VectorIcon type="Feather" name="camera" size={20} color="#fff" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* Form Fields */}
          <View style={styles.formContainer}>
            {/* Display Name */}
            <View style={[styles.fieldWrapper, { borderBottomColor: theme.border }]}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Name</Text>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={name}
                onChangeText={setName}
                placeholder="Enter name"
                placeholderTextColor={theme.textMuted}
              />
            </View>

            {/* Bio */}
            <View style={[styles.fieldWrapper, { borderBottomColor: theme.border }]}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Bio</Text>
              <TextInput
                style={[styles.input, { color: theme.text, height: 80 }]}
                value={bio}
                onChangeText={setBio}
                placeholder="Describe yourself"
                placeholderTextColor={theme.textMuted}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
              />
            </View>

            {/* Location */}
            <View style={[styles.fieldWrapper, { borderBottomColor: theme.border }]}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Location</Text>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={location}
                onChangeText={setLocation}
                placeholder="Add location"
                placeholderTextColor={theme.textMuted}
              />
            </View>

            {/* Website */}
            <View style={[styles.fieldWrapper, { borderBottomColor: theme.border }]}>
              <Text style={[styles.fieldLabel, { color: theme.textMuted }]}>Website</Text>
              <TextInput
                style={[styles.input, { color: theme.text }]}
                value={website}
                onChangeText={setWebsite}
                placeholder="Add your website"
                placeholderTextColor={theme.textMuted}
                autoCapitalize="none"
                keyboardType="url"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  closeBtn: {
    paddingRight: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  saveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  imagesContainer: {
    height: HEIGHT * 0.24,
    position: 'relative',
    marginBottom: 20,
  },
  coverWrapper: {
    width: '100%',
    height: HEIGHT * 0.18,
    position: 'relative',
  },
  cover: {
    width: '100%',
    height: '100%',
  },
  cameraOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 16,
  },
  avatarTouch: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    position: 'relative',
    overflow: 'hidden',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  formContainer: {
    paddingHorizontal: 16,
  },
  fieldWrapper: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  input: {
    fontSize: 15,
    paddingVertical: 4,
  },
});
