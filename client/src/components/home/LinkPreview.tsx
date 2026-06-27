import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Linking, Alert } from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { LinkPreview as LinkPreviewType } from '../../types';

interface LinkPreviewProps {
  preview: LinkPreviewType;
}

const LinkPreview: React.FC<LinkPreviewProps> = ({ preview }) => {
  const { theme } = useTheme();

  const handlePress = () => {
    Alert.alert('Open URL', `Navigating to: ${preview.url}`);
  };

  // Get domain name from URL
  const getDomain = (urlStr: string) => {
    try {
      const match = urlStr.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
      if (match && match.length > 2) {
        return match[2];
      }
      return urlStr;
    } catch (e) {
      return urlStr;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={handlePress}
      style={[
        styles.container,
        { borderColor: theme.border, backgroundColor: theme.surface },
      ]}
    >
      {preview.image && (
        <Image source={{ uri: preview.image }} style={styles.image} resizeMode="cover" />
      )}
      <View style={styles.content}>
        <Text style={[styles.domain, { color: theme.textMuted }]}>
          {getDomain(preview.url)}
        </Text>
        <Text style={[styles.title, { color: theme.text }]} numberOfLines={1}>
          {preview.title}
        </Text>
        <Text style={[styles.description, { color: theme.textMuted }]} numberOfLines={2}>
          {preview.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default LinkPreview;

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 16,
    overflow: 'hidden',
    marginTop: 10,
    width: '100%',
  },
  image: {
    width: '100%',
    height: 150,
  },
  content: {
    padding: 12,
  },
  domain: {
    fontSize: 12,
    textTransform: 'lowercase',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
  },
});
