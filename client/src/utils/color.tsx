import { Dimensions } from "react-native";

export const lightTheme = {
  primary: '#22A8FF',

  background: '#F8FAFC',
  surface: '#FFFFFF',
  card: '#FFFFFF',

  text: '#0F172A',
  textMuted: '#64748B',
  textDisabled: '#94A3B8',

  border: '#E2E8F0',
  divider: '#F1F5F9',

  tabActive: '#22A8FF',
  tabInactive: '#94A3B8',

  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',

  online: '#22C55E',
  offline: '#CBD5E1',

  senderBubble: '#22A8FF',
  receiverBubble: '#FFFFFF',

  senderText: '#FFFFFF',
  receiverText: '#0F172A',

  inputBackground: '#F8FAFC',

  shadow: 'rgba(15,23,42,0.08)',
};

export const darkTheme = {
  primary: '#22A8FF',

  background: '#000000',
  surface: '#0D1B2A',
  card: '#102033',

  text: '#FFFFFF',
  textMuted: '#94A3B8',
  textDisabled: '#64748B',

  border: '#1E3348',
  divider: '#13263B',

  tabActive: '#22A8FF',
  tabInactive: '#64748B',

  success: '#22C55E',
  warning: '#F59E0B',
  error: '#EF4444',

  online: '#22C55E',
  offline: '#475569',

  senderBubble: '#22A8FF',
  receiverBubble: '#13263B',

  senderText: '#FFFFFF',
  receiverText: '#FFFFFF',

  inputBackground: '#13263B',

  shadow: 'rgba(0,0,0,0.35)',
};


export const fontSize = {
  caption: 12,
  body: 14,
  subtitle: 16,
  title: 20,
  heading: 24,

  tabLabel: 12,
  button: 14,

  chatMessage: 15,
  chatTime: 11,

  chatName: 16,
  lastMessage: 14,

  input: 16,

  profileName: 24,
  profileInfo: 14,
};

export const {height: HEIGHT, width: WIDTH} = Dimensions.get('screen')