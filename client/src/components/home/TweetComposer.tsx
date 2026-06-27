import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { useTweets } from '../../hooks/useTweets';
import { useAuth } from '../../hooks/useAuth';
import VectorIcon from '../common/VectorIcon';

const MOCK_PHOTOS = [
  { id: 'p1', url: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=600&auto=format&fit=crop' }, // Dog
  { id: 'p2', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=600&auto=format&fit=crop' }, // Valley
  { id: 'p3', url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=600&auto=format&fit=crop' }, // Space
  { id: 'p4', url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&auto=format&fit=crop' }, // Code
  { id: 'p5', url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop' }, // Coffee
  { id: 'p6', url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=600&auto=format&fit=crop' }, // City
];

const MOCK_VIDEOS = [
  { id: 'v1', thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop', title: 'Paris Tour', url: 'mock_paris_drone.mp4' },
  { id: 'v2', thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&auto=format&fit=crop', title: 'Waterfall', url: 'mock_waterfall.mp4' },
  { id: 'v3', thumbnail: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?w=600&auto=format&fit=crop', title: 'Matrix Rain', url: 'mock_coding.mp4' },
];

interface TweetComposerProps {
  onClose?: () => void;
  onPostSuccess?: () => void;
}

const TweetComposer: React.FC<TweetComposerProps> = ({ onClose, onPostSuccess }) => {
  const { theme } = useTheme();
  const { createTweet } = useTweets();
  const { user } = useAuth();

  const [content, setContent] = useState('');
  const [media, setMedia] = useState<string[]>([]);
  const [attachedVideoUri, setAttachedVideoUri] = useState<string | null>(null);
  const [recordedAudioUri, setRecordedAudioUri] = useState<string | null>(null);
  
  // Polls & Links
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [pollOptions, setPollOptions] = useState<string[]>(['', '']);
  const [linkUrl, setLinkUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Custom Pickers & Recording State
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState<'photos' | 'videos'>('photos');
  const [showRecorderPanel, setShowRecorderPanel] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordingIntervalId, setRecordingIntervalId] = useState<any>(null);
  const [waveHeights, setWaveHeights] = useState([10, 25, 40, 25, 10]);

  // Handle pulsating audio wave
  useEffect(() => {
    let interval: any;
    if (isRecording) {
      interval = setInterval(() => {
        setWaveHeights([
          Math.floor(Math.random() * 40) + 10,
          Math.floor(Math.random() * 45) + 10,
          Math.floor(Math.random() * 50) + 10,
          Math.floor(Math.random() * 45) + 10,
          Math.floor(Math.random() * 40) + 10,
          Math.floor(Math.random() * 30) + 10,
          Math.floor(Math.random() * 40) + 10,
        ]);
      }, 150);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const handlePost = async () => {
    if (!content.trim() && media.length === 0 && !attachedVideoUri && !recordedAudioUri) return;
    setIsSubmitting(true);
    try {
      const activePollOptions = showPollCreator
        ? pollOptions.filter(o => o.trim() !== '')
        : undefined;

      await createTweet(
        content.trim(),
        media.length > 0 ? media : undefined,
        activePollOptions,
        linkUrl.trim() || undefined,
        attachedVideoUri || undefined,
        recordedAudioUri || undefined
      );

      // Reset states
      setContent('');
      setMedia([]);
      setAttachedVideoUri(null);
      setRecordedAudioUri(null);
      setShowPollCreator(false);
      setPollOptions(['', '']);
      setLinkUrl('');
      
      if (onPostSuccess) onPostSuccess();
      if (onClose) onClose();
    } catch (e) {
      console.error(e);
      Alert.alert('Error', 'Failed to publish post.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Recording functions
  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins}:${remainingSecs < 10 ? '0' : ''}${remainingSecs}`;
  };

  const toggleRecording = () => {
    if (isRecording) {
      if (recordingIntervalId) {
        clearInterval(recordingIntervalId);
        setRecordingIntervalId(null);
      }
      setIsRecording(false);
    } else {
      setIsRecording(true);
      const id = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
      setRecordingIntervalId(id);
    }
  };

  const handleCancelRecording = () => {
    if (recordingIntervalId) {
      clearInterval(recordingIntervalId);
      setRecordingIntervalId(null);
    }
    setIsRecording(false);
    setRecordingSeconds(0);
    setShowRecorderPanel(false);
  };

  const handleSaveRecording = () => {
    if (recordingIntervalId) {
      clearInterval(recordingIntervalId);
      setRecordingIntervalId(null);
    }
    setIsRecording(false);
    setRecordedAudioUri(`mock_audio_${Date.now()}.m4a`);
    setShowRecorderPanel(false);
  };

  const addPollOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, '']);
    }
  };

  const updatePollOptionText = (text: string, index: number) => {
    const updated = [...pollOptions];
    updated[index] = text;
    setPollOptions(updated);
  };

  const removePollOption = (index: number) => {
    if (pollOptions.length > 2) {
      setPollOptions(pollOptions.filter((_, idx) => idx !== index));
    }
  };

  const charLimit = 280;
  const charsRemaining = charLimit - content.length;
  const isOverLimit = charsRemaining < 0;

  const isPostDisabled =
    (!content.trim() && media.length === 0 && !attachedVideoUri && !recordedAudioUri) ||
    isOverLimit ||
    isSubmitting;

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      {/* Top action row */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
          <Text style={{ color: theme.text, fontSize: 16 }}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePost}
          disabled={isPostDisabled}
          style={[
            styles.postBtn,
            {
              backgroundColor: theme.primary,
              opacity: isPostDisabled ? 0.5 : 1,
            },
          ]}
        >
          <Text style={styles.postBtnText}>Post</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.composerBody}>
        {/* Avatar */}
        <Image source={{ uri: user?.avatar }} style={styles.avatar} />

        {/* Input area */}
        <View style={styles.inputArea}>
          <ScrollView
            style={styles.scrollArea}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <TextInput
              placeholder="What's happening?!"
              placeholderTextColor={theme.textMuted}
              style={[styles.input, { color: theme.text }]}
              multiline
              value={content}
              onChangeText={setContent}
              autoFocus
            />

            {/* Attached photo preview */}
            {media.map((uri, idx) => (
              <View key={idx} style={styles.imagePreviewContainer}>
                <Image source={{ uri }} style={styles.imagePreview} />
                <TouchableOpacity onPress={() => setMedia([])} style={styles.removeMediaBtn}>
                  <VectorIcon type="Ionicons" name="close-circle" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}

            {/* Attached video preview */}
            {attachedVideoUri && (
              <View style={styles.videoPreviewContainer}>
                <Image
                  source={{ uri: MOCK_VIDEOS.find(v => v.url === attachedVideoUri)?.thumbnail || MOCK_VIDEOS[0].thumbnail }}
                  style={styles.videoPreview}
                />
                <View style={styles.playOverlay}>
                  <VectorIcon type="Ionicons" name="play-circle" size={52} color="#fff" />
                </View>
                <TouchableOpacity onPress={() => setAttachedVideoUri(null)} style={styles.removeMediaBtn}>
                  <VectorIcon type="Ionicons" name="close-circle" size={24} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            {/* Attached audio preview */}
            {recordedAudioUri && (
              <View style={[styles.audioPreviewCard, { borderColor: theme.border, backgroundColor: theme.surface }]}>
                <VectorIcon type="Ionicons" name="mic" size={20} color={theme.primary} />
                <Text style={[styles.audioText, { color: theme.text }]}>Recorded Voice Post (0:{recordingSeconds < 10 ? '0' : ''}{recordingSeconds || 12})</Text>
                <TouchableOpacity onPress={() => setRecordedAudioUri(null)} style={styles.removeAudioBtn}>
                  <VectorIcon type="Ionicons" name="trash-outline" size={18} color={theme.error} />
                </TouchableOpacity>
              </View>
            )}

            {/* Link URL input */}
            {(linkUrl !== '' || content.includes('http')) && (
              <View style={[styles.linkInputWrapper, { borderColor: theme.border }]}>
                <VectorIcon type="Feather" name="link" size={14} color={theme.textMuted} />
                <TextInput
                  placeholder="Attach preview URL"
                  placeholderTextColor={theme.textMuted}
                  style={[styles.linkInput, { color: theme.text }]}
                  value={linkUrl}
                  onChangeText={setLinkUrl}
                  autoCapitalize="none"
                />
              </View>
            )}

            {/* Poll Creator */}
            {showPollCreator && (
              <View style={[styles.pollCreator, { borderColor: theme.border }]}>
                <View style={styles.pollHeader}>
                  <Text style={[styles.pollTitle, { color: theme.text }]}>Create Poll</Text>
                  <TouchableOpacity onPress={() => setShowPollCreator(false)}>
                    <VectorIcon type="Ionicons" name="close" size={18} color={theme.textMuted} />
                  </TouchableOpacity>
                </View>
                {pollOptions.map((opt, index) => (
                  <View key={index} style={styles.pollOptionRow}>
                    <TextInput
                      placeholder={`Option ${index + 1}`}
                      placeholderTextColor={theme.textMuted}
                      style={[styles.pollOptionInput, { color: theme.text, borderColor: theme.border }]}
                      value={opt}
                      onChangeText={txt => updatePollOptionText(txt, index)}
                    />
                    {pollOptions.length > 2 && (
                      <TouchableOpacity onPress={() => removePollOption(index)} style={styles.pollRemoveBtn}>
                        <VectorIcon type="Ionicons" name="trash-outline" size={16} color={theme.error} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                {pollOptions.length < 4 && (
                  <TouchableOpacity onPress={addPollOption} style={styles.addOptionBtn}>
                    <Text style={{ color: theme.primary, fontSize: 13, fontWeight: '700' }}>+ Add Option</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Interactive Sound Recorder Panel */}
      {showRecorderPanel && (
        <View style={[styles.recorderPanel, { borderTopColor: theme.border, backgroundColor: theme.surface }]}>
          <View style={styles.recorderHeader}>
            <Text style={[styles.recorderTitle, { color: theme.text }]}>Record Voice Tweet</Text>
            <TouchableOpacity onPress={handleCancelRecording}>
              <VectorIcon type="Ionicons" name="close" size={20} color={theme.textMuted} />
            </TouchableOpacity>
          </View>

          <View style={styles.recorderBody}>
            {isRecording ? (
              <View style={styles.waveWrapper}>
                {waveHeights.map((h, i) => (
                  <View key={i} style={[styles.waveBar, { height: h, backgroundColor: theme.primary }]} />
                ))}
              </View>
            ) : (
              <View style={styles.waveWrapperPlaceholder}>
                <Text style={{ color: theme.textMuted, fontSize: 13 }}>Tap microphone to start recording</Text>
              </View>
            )}

            <Text style={[styles.recordingTimer, { color: theme.text }]}>
              {formatTime(recordingSeconds)}
            </Text>

            <View style={styles.recorderActions}>
              <TouchableOpacity onPress={handleCancelRecording} style={[styles.actionRoundBtn, { backgroundColor: theme.border }]}>
                <VectorIcon type="Ionicons" name="trash-outline" size={20} color={theme.error} />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={toggleRecording}
                style={[styles.recordMainBtn, { backgroundColor: isRecording ? theme.error : theme.primary }]}
              >
                <VectorIcon type="Ionicons" name={isRecording ? 'pause' : 'mic'} size={28} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSaveRecording}
                disabled={recordingSeconds === 0}
                style={[
                  styles.actionRoundBtn,
                  {
                    backgroundColor: theme.primary,
                    opacity: recordingSeconds > 0 ? 1 : 0.4,
                  },
                ]}
              >
                <VectorIcon type="Ionicons" name="checkmark" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* Sticky Toolbar and char counter */}
      <View style={[styles.toolbar, { borderTopColor: theme.border }]}>
        <View style={{ flex: 1, marginRight: 8 }}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.toolsScrollContent}
          >
            {/* Photo/Video Chip */}
            <TouchableOpacity
              onPress={() => setShowMediaPicker(true)}
              style={[styles.toolChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <VectorIcon type="Feather" name="image" size={16} color={theme.primary} />
              <Text style={[styles.toolChipText, { color: theme.text }]}>Photo/Video</Text>
            </TouchableOpacity>

            {/* Voice Audio Chip */}
            <TouchableOpacity
              onPress={() => {
                if (recordedAudioUri) {
                  Alert.alert('Attached', 'You have already attached an audio recording.');
                } else {
                  setShowRecorderPanel(true);
                }
              }}
              style={[styles.toolChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <VectorIcon type="Feather" name="mic" size={16} color={theme.primary} />
              <Text style={[styles.toolChipText, { color: theme.text }]}>Voice Audio</Text>
            </TouchableOpacity>

            {/* Poll Chip */}
            <TouchableOpacity
              onPress={() => setShowPollCreator(true)}
              style={[styles.toolChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <VectorIcon type="MaterialCommunityIcons" name="poll" size={16} color={theme.primary} />
              <Text style={[styles.toolChipText, { color: theme.text }]}>Poll</Text>
            </TouchableOpacity>

            {/* Link Chip */}
            <TouchableOpacity
              onPress={() => setLinkUrl('https://')}
              style={[styles.toolChip, { backgroundColor: theme.surface, borderColor: theme.border }]}
            >
              <VectorIcon type="Feather" name="link" size={16} color={theme.primary} />
              <Text style={[styles.toolChipText, { color: theme.text }]}>Link</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Character limit counter */}
        <View style={styles.counter}>
          <Text
            style={[
              styles.counterText,
              { color: isOverLimit ? theme.error : charsRemaining <= 20 ? theme.warning : theme.textMuted },
            ]}
          >
            {charsRemaining}
          </Text>
        </View>
      </View>

      {/* Custom Media Picker Modal */}
      <Modal visible={showMediaPicker} animationType="slide" transparent>
        <SafeAreaView style={[styles.pickerModalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.pickerHeader, { borderBottomColor: theme.border }]}>
            <TouchableOpacity onPress={() => setShowMediaPicker(false)} style={styles.pickerCloseBtn}>
              <Text style={{ color: theme.text, fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.pickerTitle, { color: theme.text }]}>Select Media</Text>
            <View style={{ width: 60 }} />
          </View>

          <View style={[styles.pickerTabs, { borderBottomColor: theme.border }]}>
            <TouchableOpacity
              onPress={() => setPickerTab('photos')}
              style={[styles.pickerTab, pickerTab === 'photos' && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]}
            >
              <Text style={[styles.pickerTabText, { color: pickerTab === 'photos' ? theme.primary : theme.textMuted }]}>Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setPickerTab('videos')}
              style={[styles.pickerTab, pickerTab === 'videos' && { borderBottomColor: theme.primary, borderBottomWidth: 2 }]}
            >
              <Text style={[styles.pickerTabText, { color: pickerTab === 'videos' ? theme.primary : theme.textMuted }]}>Videos</Text>
            </TouchableOpacity>
          </View>

          {pickerTab === 'photos' ? (
            <ScrollView contentContainerStyle={styles.pickerGrid}>
              {MOCK_PHOTOS.map(p => (
                <TouchableOpacity
                  key={p.id}
                  onPress={() => {
                    setMedia([p.url]);
                    setAttachedVideoUri(null);
                    setShowMediaPicker(false);
                  }}
                  style={styles.pickerGridItem}
                >
                  <Image source={{ uri: p.url }} style={styles.pickerImage} />
                </TouchableOpacity>
              ))}
            </ScrollView>
          ) : (
            <ScrollView contentContainerStyle={styles.pickerGrid}>
              {MOCK_VIDEOS.map(v => (
                <TouchableOpacity
                  key={v.id}
                  onPress={() => {
                    setAttachedVideoUri(v.url);
                    setMedia([]);
                    setShowMediaPicker(false);
                  }}
                  style={styles.pickerGridItem}
                >
                  <Image source={{ uri: v.thumbnail }} style={styles.pickerImage} />
                  <View style={styles.videoOverlayIcon}>
                    <VectorIcon type="Ionicons" name="play" size={28} color="#fff" />
                  </View>
                  <Text style={styles.videoDurationBadge}>0:15</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </SafeAreaView>
      </Modal>
    </View>
  );
};

export default TweetComposer;

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
  cancelBtn: {
    paddingVertical: 8,
  },
  postBtn: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 20,
  },
  postBtnText: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 14,
  },
  composerBody: {
    flex: 1,
    flexDirection: 'row',
    padding: 16,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 12,
  },
  inputArea: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  input: {
    fontSize: 16,
    lineHeight: 22,
    minHeight: 120,
    textAlignVertical: 'top',
    padding: 0,
    marginBottom: 12,
  },
  imagePreviewContainer: {
    position: 'relative',
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
  },
  imagePreview: {
    width: '100%',
    height: '100%',
  },
  videoPreviewContainer: {
    position: 'relative',
    marginTop: 8,
    borderRadius: 12,
    overflow: 'hidden',
    height: 200,
  },
  videoPreview: {
    width: '100%',
    height: '100%',
  },
  playOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  removeMediaBtn: {
    position: 'absolute',
    top: 8,
    right: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  audioPreviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  audioText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginLeft: 10,
  },
  removeAudioBtn: {
    padding: 6,
  },
  linkInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 36,
    marginTop: 8,
  },
  linkInput: {
    flex: 1,
    fontSize: 12,
    marginLeft: 6,
    padding: 0,
  },
  pollCreator: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12,
    marginTop: 12,
  },
  pollHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  pollTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  pollOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  pollOptionInput: {
    flex: 1,
    height: 36,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 13,
  },
  pollRemoveBtn: {
    padding: 8,
  },
  addOptionBtn: {
    paddingVertical: 6,
  },
  toolbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 0.5,
    borderTopColor: '#ccc',
  },
  toolsScrollContent: {
    paddingRight: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  toolChip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  toolChipText: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 6,
  },
  counter: {
    justifyContent: 'center',
  },
  counterText: {
    fontSize: 13,
    fontWeight: '600',
  },
  recorderPanel: {
    borderTopWidth: 1,
    padding: 16,
    paddingBottom: 24,
  },
  recorderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  recorderTitle: {
    fontSize: 14,
    fontWeight: '700',
  },
  recorderBody: {
    alignItems: 'center',
  },
  waveWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60,
    width: '100%',
    marginBottom: 8,
  },
  waveWrapperPlaceholder: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  waveBar: {
    width: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  recordingTimer: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  recorderActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '70%',
  },
  actionRoundBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordMainBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  pickerModalContainer: {
    flex: 1,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
  },
  pickerCloseBtn: {
    paddingVertical: 8,
  },
  pickerTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  pickerTabs: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
  },
  pickerTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
  },
  pickerTabText: {
    fontSize: 14,
    fontWeight: '700',
  },
  pickerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 4,
  },
  pickerGridItem: {
    width: '33.33%',
    aspectRatio: 1,
    padding: 2,
    position: 'relative',
  },
  pickerImage: {
    width: '100%',
    height: '100%',
    borderRadius: 8,
  },
  videoOverlayIcon: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
  videoDurationBadge: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    fontSize: 10,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    fontWeight: '600',
  },
});