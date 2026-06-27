import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ActivityIndicator,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FlashList from '../../components/common/AppFlashList';
import { useTheme } from '../../providers/ThemeProvider';
import { useChats } from '../../hooks/useChats';
import VectorIcon from '../../components/common/VectorIcon';
import EmptyState from '../../components/common/EmptyState';
import { fontSize } from '../../utils/color';

const Messages = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { conversations, isConversationsLoading, fetchConversations, setActiveConversationId } = useChats();

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const sortedConversations = conversations
    .filter(c => c.participant.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      // Pinned conversations at top
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return 0;
    });

  const handleConversationPress = (item: any) => {
    setActiveConversationId(item.id);
    navigation.navigate('ChatConversation', {
      conversationId: item.id,
      participantName: item.participant.name,
      avatar: item.participant.avatar
    });
  };

  const renderConversationItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => handleConversationPress(item)}
      style={[
        styles.conversationItem,
        {
          borderBottomColor: theme.border,
          backgroundColor: item.pinned ? `${theme.primary}05` : 'transparent',
        },
      ]}
    >
      {/* Avatar Container */}
      <View style={styles.avatarContainer}>
        <Image source={{ uri: item.participant.avatar }} style={styles.avatar} />
        {item.participant.isFollowing && ( // mock online status if isFollowing
          <View style={[styles.onlineBadge, { backgroundColor: theme.success, borderColor: theme.background }]} />
        )}
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.row}>
          <Text style={[styles.name, { color: theme.text }]} numberOfLines={1}>
            {item.participant.name}
          </Text>
          <Text style={[styles.time, { color: theme.textMuted }]}>{item.lastUpdated}</Text>
        </View>
        <Text style={[styles.username, { color: theme.textMuted }]} numberOfLines={1}>
          @{item.participant.username}
        </Text>
        <Text style={[styles.lastMessage, { color: theme.textMuted }]} numberOfLines={1}>
          {item.lastMessage}
        </Text>
      </View>

      {/* Badges/Pins */}
      <View style={styles.rightSide}>
        {item.pinned && (
          <VectorIcon
            type="MaterialCommunityIcons"
            name="pin"
            size={16}
            color={theme.textMuted}
            style={styles.pinIcon}
          />
        )}
        {item.unreadCount > 0 && (
          <View style={[styles.unreadBadge, { backgroundColor: theme.primary }]}>
            <Text style={styles.unreadText}>{item.unreadCount}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Messages</Text>
        <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
          <VectorIcon type="Feather" name="settings" size={20} color={theme.text} />
        </TouchableOpacity>
      </View>

      {/* Search Messages */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.surface }]}>
          <VectorIcon type="Feather" name="search" size={16} color={theme.textMuted} style={styles.searchIcon} />
          <TextInput
            placeholder="Search Direct Messages"
            placeholderTextColor={theme.textMuted}
            style={[styles.searchInput, { color: theme.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />
        </View>
      </View>

      {/* Conversations */}
      {isConversationsLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlashList
          data={sortedConversations}
          keyExtractor={(item: any) => item.id}
          estimatedItemSize={80}
          renderItem={renderConversationItem}
          ListEmptyComponent={
            <EmptyState
              title="Welcome to your inbox!"
              subtitle="Drop a line, share posts and more with private conversations between you and others on X."
              icon="mail"
            />
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Messages;

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
  headerTitle: {
    fontSize: fontSize.title,
    fontWeight: '800',
  },
  settingsBtn: {
    padding: 6,
  },
  searchContainer: {
    padding: 12,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 38,
    borderRadius: 19,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    height: '100%',
    padding: 0,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e1e1e1"
  },
  onlineBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 2,
  },
  content: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    maxWidth: '70%',
  },
  time: {
    fontSize: 12,
  },
  username: {
    fontSize: 13,
    marginTop: 1,
  },
  lastMessage: {
    fontSize: 13,
    marginTop: 4,
  },
  rightSide: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: 8,
  },
  pinIcon: {
    marginBottom: 6,
  },
  unreadBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  unreadText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '800',
  },
});
