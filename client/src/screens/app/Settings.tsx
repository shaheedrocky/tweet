import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Switch,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '../../providers/ThemeProvider';
import { useAuth } from '../../hooks/useAuth';
import VectorIcon from '../../components/common/VectorIcon';
import { fontSize } from '../../utils/color';

const Settings = ({ navigation }: { navigation: any }) => {
  const { theme, mode, setMode, toggleTheme } = useTheme();
  const { logout } = useAuth();

  const [pushEnabled, setPushEnabled] = React.useState(true);
  const [emailEnabled, setEmailEnabled] = React.useState(false);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <VectorIcon type="Ionicons" name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Section: Display/Theme */}
        <View style={[styles.section, { borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Display</Text>

          <View style={styles.settingRow}>
            <View>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Dark Mode</Text>
              <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
                Adjust the look of your application
              </Text>
            </View>
            <TouchableOpacity onPress={toggleTheme} style={[styles.themeBtn, { borderColor: theme.border, backgroundColor: theme.surface }]}>
              <Text style={{ color: theme.text, fontSize: 13, fontWeight: '700' }}>
                {mode === 'dark' ? 'Dark' : mode === 'light' ? 'Light' : 'System'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Theme choices */}
          <View style={styles.themeRow}>
            {(['light', 'dark', 'system'] as const).map(tMode => {
              const active = mode === tMode;
              return (
                <TouchableOpacity
                  key={tMode}
                  onPress={() => setMode(tMode)}
                  style={[
                    styles.themeOption,
                    {
                      borderColor: active ? theme.primary : theme.border,
                      backgroundColor: active ? `${theme.primary}10` : theme.surface,
                    },
                  ]}
                >
                  <Text style={[styles.themeOptionText, { color: active ? theme.primary : theme.text }]}>
                    {tMode.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Section: Notifications */}
        <View style={[styles.section, { borderBottomColor: theme.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.primary }]}>Notifications</Text>

          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Push Notifications</Text>
              <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
                Receive alerts on mentions, likes, and messages
              </Text>
            </View>
            <Switch
              value={pushEnabled}
              onValueChange={setPushEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#fff'}
            />
          </View>

          <View style={styles.settingRow}>
            <View style={{ flex: 1, marginRight: 16 }}>
              <Text style={[styles.settingLabel, { color: theme.text }]}>Email Notifications</Text>
              <Text style={[styles.settingDesc, { color: theme.textMuted }]}>
                Receive weekly digests and updates via email
              </Text>
            </View>
            <Switch
              value={emailEnabled}
              onValueChange={setEmailEnabled}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={Platform.OS === 'ios' ? undefined : '#fff'}
            />
          </View>
        </View>

        {/* Section: Account Actions */}
        <View style={[styles.section, {
          borderBottomColor: theme.border
        }]}>
          <Text onPress={() => navigation.navigate('Profile')} style={[styles.sectionTitle, {
            color: theme.primary, borderBottomColor: theme.border
            , borderBottomWidth: 1, paddingBottom: 16
          }]}>Account</Text>

          <View style={{
            flexDirection: 'row', alignItems: 'center', paddingBottom: 16, gap: 4, borderBottomColor: theme.border
            , borderBottomWidth: 1
          }}>
            <VectorIcon type="Ionicons" name="logo-twitter" size={28} color={'#EFBF04'} />

            <Text onPress={() => navigation.navigate('Subscription')} style={[styles.sectionTitle, {
              color: '#EFBF04', marginBottom: 0
            }]}>Premium MEMBERSHIP</Text>

          </View>

          <TouchableOpacity onPress={logout} style={styles.logoutRow}>
            <VectorIcon type="Feather" name="log-out" size={20} color={theme.error} />
            <Text style={[styles.logoutLabel, { color: theme.error }]}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Settings;

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
  section: {
    padding: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    marginBottom: 16,
    textTransform: 'uppercase',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '700',
  },
  settingDesc: {
    fontSize: 13,
    marginTop: 2,
    lineHeight: 18,
  },
  themeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
  },
  themeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    gap: 8,
  },
  themeOption: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeOptionText: {
    fontSize: 12,
    fontWeight: '700',
  },
  logoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  logoutLabel: {
    fontSize: 15,
    fontWeight: '700',
    marginLeft: 12,
  },
});
