import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#0F1117',
  surface: '#1A1D27',
  surfaceAlt: '#222636',
  border: '#2E3347',
  accent: '#6C63FF',
  accentLight: '#8B85FF',
  textPrimary: '#F0F0FF',
  textSecondary: '#8890AA',
  textMuted: '#555D7A',
  success: '#4ECCA3',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.textPrimary,
    letterSpacing: 1.5,
    marginBottom: 24,
    textTransform: 'uppercase',
  },

  // --- Card de usuário ---
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 14,
    padding: 16,
    marginVertical: 6,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },

  cardAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardAvatarText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 16,
  },

  cardId: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 2,
  },

  cardName: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.textPrimary,
  },

  cardEmail: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 2,
  },

  // --- Formulário de criação ---
  form: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 20,
    width: '100%',
    marginTop: 16,
    marginBottom: 32,
    gap: 12,
  },

  formTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  input: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: COLORS.textPrimary,
    fontSize: 14,
  },

  button: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  inputError: {
  borderColor: '#FF6B6B',
},

errorText: {
  color: '#FF6B6B',
  fontSize: 11,
  marginTop: -6,
  marginLeft: 4,
},

});

export { COLORS };
export default styles;