import { StyleSheet } from 'react-native';

const COLORS = {
  background: '#0D1117',
  surface: '#161B22',
  surfaceAlt: '#1C2128',
  border: '#30363D',
  accent: '#58A6FF',
  accentLight: '#79C0FF',
  accentDark: '#388BFD',
  textPrimary: '#E6EDF3',
  textSecondary: '#8B949E',
  textMuted: '#6E7681',
  success: '#3FB950',
  white: '#FFFFFF',
  error: '#F85149',
  warning: '#D29922',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    paddingTop: 50,
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: 20,
  },

  // --- Layout Principal ---
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    gap: 24,
  },

  leftPanel: {
    width: '35%',
  },

  rightPanel: {
    flex: 1,
  },

  // --- Abas/Navegação ---
  tabContainer: {
    flexDirection: 'row',
    width: '100%',
    marginBottom: 16,
    gap: 8,
  },

  tabButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  tabButtonActive: {
    backgroundColor: COLORS.accent,
    borderColor: COLORS.accent,
  },

  tabButtonInactive: {
    backgroundColor: COLORS.surface,
  },

  tabText: {
    fontSize: 12,
    fontWeight: '600',
  },

  tabTextActive: {
    color: COLORS.white,
  },

  tabTextInactive: {
    color: COLORS.textSecondary,
  },

  // --- Card de usuário ---
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 12,
    marginVertical: 4,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  cardAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cardAvatarProduct: {
    backgroundColor: COLORS.accentDark,
  },

  cardAvatarText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 14,
  },

  cardId: {
    fontSize: 9,
    color: COLORS.textMuted,
    fontWeight: '500',
  },

  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },

  cardEmail: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  cardPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.success,
  },

  cardDescription: {
    fontSize: 11,
    color: COLORS.textSecondary,
  },

  // --- Formulário de criação ---
  form: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    padding: 16,
    width: '100%',
    gap: 10,
  },

  formTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.accent,
    marginBottom: 4,
  },

  input: {
    backgroundColor: COLORS.surfaceAlt,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.textPrimary,
    fontSize: 13,
  },

  button: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 13,
  },
  inputError: {
    borderColor: COLORS.error,
  },

  errorText: {
    color: COLORS.error,
    fontSize: 11,
    marginTop: -6,
    marginLeft: 4,
  },

  // --- Seções ---
  sectionTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textMuted,
    marginBottom: 8,
  },

  listContainer: {
    flex: 1,
  },

});

export { COLORS };
export default styles;