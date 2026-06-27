import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  Switch,
  Image,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FlashList from '../../components/common/AppFlashList';
import { useTheme } from '../../providers/ThemeProvider';
import { useApp } from '../../providers/AppProvider';
import VectorIcon from '../../components/common/VectorIcon';
import EmptyState from '../../components/common/EmptyState';
import { fontSize } from '../../utils/color';

const Lists = () => {
  const { theme } = useTheme();
  const navigation = useNavigation<any>();
  const { lists, isListsLoading, fetchLists, createList } = useApp();

  const [modalVisible, setModalVisible] = useState(false);
  const [listName, setListName] = useState('');
  const [listDesc, setListDesc] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const handleCreateList = async () => {
    if (!listName.trim()) return;
    setCreating(true);
    try {
      await createList(listName.trim(), listDesc.trim(), isPrivate);
      setListName('');
      setListDesc('');
      setIsPrivate(false);
      setModalVisible(false);
    } catch (e) {
      console.error(e);
    } finally {
      setCreating(false);
    }
  };

  const renderListItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('ListDetails', { listId: item.id })}
      style={[styles.listRow, { borderBottomColor: theme.border }]}
    >
      <Image source={{ uri: item.avatar }} style={styles.listAvatar} />

      <View style={styles.listInfo}>
        <Text style={[styles.listName, { color: theme.text }]} numberOfLines={1}>
          {item.name}
        </Text>
        {item.description ? (
          <Text style={[styles.listDesc, { color: theme.textMuted }]} numberOfLines={1}>
            {item.description}
          </Text>
        ) : null}
        <Text style={[styles.listMeta, { color: theme.textMuted }]}>
          {item.memberCount} members · {item.followerCount} followers
        </Text>
      </View>

      {item.isPrivate && (
        <VectorIcon type="Feather" name="lock" size={16} color={theme.textMuted} />
      )}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <VectorIcon type="Ionicons" name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Lists</Text>
        <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.createBtn}>
          <VectorIcon type="Feather" name="plus" size={22} color={theme.primary} />
        </TouchableOpacity>
      </View>

      {/* Main Lists */}
      {isListsLoading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      ) : (
        <FlashList
          data={lists}
          keyExtractor={(item: any) => item.id}
          estimatedItemSize={75}
          renderItem={renderListItem}
          ListEmptyComponent={
            <EmptyState
              title="Pin your favorite Lists"
              subtitle="Create your own customized feeds of accounts you want to keep tabs on. Tap the '+' icon above to start."
              icon="list"
            />
          }
        />
      )}

      {/* Create List Modal */}
      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalClose}>
              <Text style={{ color: theme.text, fontSize: 16 }}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Create a new List</Text>
            <TouchableOpacity
              onPress={handleCreateList}
              disabled={!listName.trim() || creating}
              style={[
                styles.modalSaveBtn,
                { backgroundColor: theme.text, opacity: listName.trim() ? 1 : 0.6 },
              ]}
            >
              {creating ? (
                <ActivityIndicator size="small" color={theme.background} />
              ) : (
                <Text style={{ color: theme.background, fontWeight: '700' }}>Next</Text>
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.modalContent}>
            {/* Input Name */}
            <View style={[styles.inputGroup, { borderBottomColor: theme.border }]}>
              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>Name</Text>
              <TextInput
                placeholder="Give your List a name"
                placeholderTextColor={theme.textMuted}
                style={[styles.textInput, { color: theme.text }]}
                value={listName}
                onChangeText={setListName}
              />
            </View>

            {/* Input Description */}
            <View style={[styles.inputGroup, { borderBottomColor: theme.border }]}>
              <Text style={[styles.inputLabel, { color: theme.textMuted }]}>Description</Text>
              <TextInput
                placeholder="Briefly describe what this list is about"
                placeholderTextColor={theme.textMuted}
                style={[styles.textInput, { color: theme.text }]}
                value={listDesc}
                onChangeText={setListDesc}
                multiline
              />
            </View>

            {/* Switch Private */}
            <View style={styles.switchRow}>
              <View style={{ flex: 1 }}>
                <Text style={[styles.switchLabel, { color: theme.text }]}>Make Private</Text>
                <Text style={[styles.switchDesc, { color: theme.textMuted }]}>
                  When private, only you can see or access this list.
                </Text>
              </View>
              <Switch
                value={isPrivate}
                onValueChange={setIsPrivate}
                trackColor={{ false: theme.border, true: theme.primary }}
              />
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default Lists;

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
  backBtn: {
    padding: 8,
    marginLeft: -8,
  },
  headerTitle: {
    fontSize: fontSize.subtitle,
    fontWeight: '700',
  },
  createBtn: {
    padding: 8,
    marginRight: -8,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
  },
  listAvatar: {
    width: 48,
    height: 48,
    borderRadius: 12,
    marginRight: 14,
  },
  listInfo: {
    flex: 1,
  },
  listName: {
    fontSize: 15,
    fontWeight: '700',
  },
  listDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  listMeta: {
    fontSize: 12,
    marginTop: 4,
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
  },
  modalClose: {
    paddingVertical: 8,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  modalSaveBtn: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  inputGroup: {
    borderBottomWidth: 1,
    paddingVertical: 10,
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 4,
  },
  textInput: {
    fontSize: 15,
    paddingVertical: 4,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  switchLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  switchDesc: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
    marginRight: 20,
  },
});
