import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import FlashList from '../../components/common/AppFlashList';
import { useTheme } from '../../providers/ThemeProvider';
import { useChats } from '../../hooks/useChats';
import { useAuth } from '../../hooks/useAuth';
import VectorIcon from '../../components/common/VectorIcon';
import { fontSize } from '../../utils/color';

const ChatConversation = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { messages, isMessagesLoading, fetchMessages, sendChatMessage, setActiveConversationId } = useChats();

  const { conversationId, participantName, avatar } = route.params;
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const flashListRef = useRef<any>(null);

  useEffect(() => {
    fetchMessages(conversationId);
    return () => {
      setActiveConversationId(null);
    };
  }, [conversationId]);

  // Scroll to bottom when messages load or a new message is added
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flashListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages.length]);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    try {
      await sendChatMessage(conversationId, text.trim());
      setText('');
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const handleAttachImage = async () => {
    // Simulate attaching a photo by sending a mock message with an image URL
    setSending(true);
    try {
      const mockImageUrls = [
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?w=400',
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400',
        'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400',
      ];
      const randomImage = mockImageUrls[Math.floor(Math.random() * mockImageUrls.length)];
      await sendChatMessage(conversationId, '', randomImage);
    } catch (e) {
      console.error(e);
    } finally {
      setSending(false);
    }
  };

  const renderMessageItem = ({ item }: { item: any }) => {
    const isMe = item.senderId === user?.id || item.senderId === 'current_user';
    return (
      <View style={[styles.bubbleWrapper, isMe ? styles.myBubbleWrapper : styles.theirBubbleWrapper]}>
        <View
          style={[
            styles.bubble,
            {
              backgroundColor: isMe ? theme.senderBubble : theme.receiverBubble,
              borderTopRightRadius: isMe ? 4 : 16,
              borderTopLeftRadius: isMe ? 16 : 4,
            },
          ]}
        >
          {item.image && (
            <Image source={{ uri: item.image }} style={styles.bubbleImage} resizeMode="cover" />
          )}
          {item.text ? (
            <Text style={[styles.bubbleText, { color: isMe ? theme.senderText : theme.receiverText }]}>
              {item.text}
            </Text>
          ) : null}

          <View style={styles.bubbleFooter}>
            <Text style={[styles.bubbleTime, { color: isMe ? 'rgba(255,255,255,0.7)' : theme.textMuted }]}>
              {item.timestamp}
            </Text>
            {isMe && (
              <VectorIcon
                type="Ionicons"
                name="checkmark-done"
                size={14}
                color={item.status === 'read' ? '#fff' : 'rgba(255,255,255,0.5)'}
                style={styles.statusCheck}
              />
            )}
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Chat Header */}
      <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.surface }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <VectorIcon type="Ionicons" name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
          <Image source={{ uri: avatar }} style={styles.avatar} />
          <View style={styles.headerInfo}>

            <Text style={[styles.headerName, { color: theme.text }]} numberOfLines={1}>
              {participantName}
            </Text>
            <Text style={[styles.headerStatus, { color: theme.success }]}>Online</Text>
          </View>
    
        <TouchableOpacity style={styles.infoBtn}>
          <VectorIcon type="Feather" name="phone" size={20} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoBtn}>
          <VectorIcon type="Feather" name="video" size={20} color={theme.text} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoBtn}>
          <VectorIcon type="Feather" name="info" size={20} color={theme.text} />
        </TouchableOpacity>
           
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
        style={{ flex: 1 }}
      >
        {isMessagesLoading ? (
          <View style={styles.centerLoader}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <FlashList
            ref={flashListRef}
            data={messages}
            keyExtractor={(item: any) => item.id}
            estimatedItemSize={70}
            renderItem={renderMessageItem}
            contentContainerStyle={styles.listContent}
          />
        )}

        {/* Input Composer */}
        <View style={[styles.inputContainer, { borderTopColor: theme.border, backgroundColor: theme.surface }]}>
          <TouchableOpacity onPress={handleAttachImage} style={styles.actionBtn}>
            <VectorIcon type="Feather" name="image" size={22} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionBtn}>
            <VectorIcon type="Feather" name="camera" size={22} color={theme.primary} />
          </TouchableOpacity>

          <View style={[styles.textInputWrapper, { backgroundColor: theme.background, borderColor: theme.border }]}>
            <TextInput
              placeholder="Start a message"
              placeholderTextColor={theme.textMuted}
              style={[styles.textInput, { color: theme.text }]}
              value={text}
              onChangeText={setText}
              multiline
            />
          </View>

          <TouchableOpacity
            onPress={handleSend}
            disabled={!text.trim() || sending}
            style={[
              styles.sendBtn,
              { backgroundColor: theme.primary, opacity: text.trim() ? 1 : 0.6 },
            ]}
          >
            {sending && text.trim() ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <VectorIcon type="Ionicons" name="send" size={16} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ChatConversation;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    height: 56,
    borderBottomWidth: 1,
  },

  backBtn: {
    padding: 8,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e1e1e1"
  },
  headerInfo: {
    flex: 1,
    marginLeft: 8,
  },
  headerName: {
    fontSize: fontSize.chatName,
    fontWeight: '700',
  },
  headerStatus: {
    fontSize: 11,
    fontWeight: '500',
    marginTop: 1,
  },
  infoBtn: {
    padding: 8,
  },
  centerLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  bubbleWrapper: {
    flexDirection: 'row',
    marginBottom: 12,
    width: '100%',
  },
  myBubbleWrapper: {
    justifyContent: 'flex-end',
  },
  theirBubbleWrapper: {
    justifyContent: 'flex-start',
  },
  bubble: {
    maxWidth: '75%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 1,
    elevation: 1,
  },
  bubbleText: {
    fontSize: fontSize.chatMessage,
    lineHeight: 20,
  },
  bubbleImage: {
    width: 200,
    height: 150,
    borderRadius: 12,
    marginBottom: 6,
  },
  bubbleFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  bubbleTime: {
    fontSize: fontSize.chatTime,
  },
  statusCheck: {
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  actionBtn: {
    padding: 8,
  },
  textInputWrapper: {
    flex: 1,
    borderRadius: 20,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 6,
    marginHorizontal: 8,
  },
  textInput: {
    fontSize: 14,
    maxHeight: 100,
    padding: 0,
  },
  sendBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
