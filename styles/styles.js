import { StyleSheet, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

export const COLORS = {
  bg: '#0A0C10',
  surface: '#111318',
  surfaceHover: '#1A1D24',
  surfaceBorder: '#1E2128',
  border: '#2A2D35',
  borderLight: '#363A44',

  accent: '#6C8EFF',
  accentSoft: '#3D5AFE',
  accentGlow: 'rgba(108, 142, 255, 0.15)',

  green: '#4ADE80',
  greenSoft: 'rgba(74, 222, 128, 0.12)',
  red: '#FF5C5C',
  redSoft: 'rgba(255, 92, 92, 0.12)',
  yellow: '#FBBF24',

  text: '#F1F3F9',
  textSub: '#9CA3AF',
  textMuted: '#5C6370',
  white: '#FFFFFF',
};

const styles = StyleSheet.create({
  // ─── Root ───────────────────────────────────────────────
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },

  // ─── Header ─────────────────────────────────────────────
  header: {
    paddingTop: 52,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  headerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.3,
  },

  headerBadge: {
    backgroundColor: COLORS.surfaceBorder,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },

  headerBadgeText: {
    fontSize: 11,
    color: COLORS.textSub,
    fontWeight: '500',
  },

  // ─── Tabs ────────────────────────────────────────────────
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 4,
    gap: 6,
  },

  tabButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
  },

  tabButtonActive: {
    backgroundColor: COLORS.accentGlow,
    borderColor: COLORS.accent,
  },

  tabButtonInactive: {
    backgroundColor: 'transparent',
    borderColor: 'transparent',
  },

  tabIcon: {
    fontSize: 14,
  },

  tabText: {
    fontSize: 13,
    fontWeight: '600',
  },

  tabTextActive: {
    color: COLORS.accent,
  },

  tabTextInactive: {
    color: COLORS.textMuted,
  },

  tabCount: {
    fontSize: 11,
    fontWeight: '700',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 10,
  },

  tabCountActive: {
    backgroundColor: COLORS.accent,
    color: COLORS.white,
  },

  tabCountInactive: {
    backgroundColor: COLORS.surfaceBorder,
    color: COLORS.textMuted,
  },

  // ─── Layout ──────────────────────────────────────────────
  mainContent: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 20,
  },

  leftPanel: {
    width: 320,
  },

  rightPanel: {
    flex: 1,
    minWidth: 0,
  },

  // Mobile: ocupa tudo
  mobilePanel: {
    flex: 1,
  },

  mobilePanelContent: {
    paddingBottom: 24,
  },

  // ─── Mobile Sub-Nav ──────────────────────────────────────
  mobileSubNav: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    padding: 4,
    gap: 4,
  },

  mobileSubNavBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 7,
  },

  mobileSubNavBtnActive: {
    backgroundColor: COLORS.accentGlow,
  },

  mobileSubNavText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textMuted,
  },

  mobileSubNavTextActive: {
    color: COLORS.accent,
  },

  // ─── Section Header ──────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },

  sectionCount: {
    fontSize: 11,
    color: COLORS.textMuted,
    fontWeight: '500',
  },

  // ─── Form ────────────────────────────────────────────────
  form: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 14,
    padding: 20,
    gap: 12,
  },

  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },

  formIconBg: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: COLORS.accentGlow,
    alignItems: 'center',
    justifyContent: 'center',
  },

  formIcon: {
    fontSize: 14,
  },

  formTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.text,
  },

  formSubtitle: {
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 1,
  },

  inputGroup: {
    gap: 4,
  },

  inputLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: COLORS.textSub,
    letterSpacing: 0.3,
    marginLeft: 2,
  },

  input: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: COLORS.text,
    fontSize: 13,
  },

  inputFocused: {
    borderColor: COLORS.accent,
    backgroundColor: COLORS.bg,
  },

  inputError: {
    borderColor: COLORS.red,
  },

  errorText: {
    color: COLORS.red,
    fontSize: 11,
    marginLeft: 2,
  },

  // ─── Buttons ─────────────────────────────────────────────
  button: {
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 6,
  },

  buttonPrimary: {
    backgroundColor: COLORS.accent,
  },

  buttonSuccess: {
    backgroundColor: COLORS.green,
  },

  buttonDanger: {
    backgroundColor: COLORS.red,
  },

  buttonGhost: {
    backgroundColor: COLORS.surfaceBorder,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
    letterSpacing: 0.2,
  },

  buttonTextDark: {
    color: COLORS.bg,
    fontWeight: '700',
    fontSize: 13,
  },

  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },

  buttonFlex: {
    flex: 1,
  },

  // ─── Card ────────────────────────────────────────────────
  card: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  cardAvatar: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.accentGlow,
    borderWidth: 1,
    borderColor: COLORS.accent + '40',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  cardAvatarProduct: {
    backgroundColor: COLORS.greenSoft,
    borderColor: COLORS.green + '40',
  },

  cardAvatarText: {
    color: COLORS.accent,
    fontWeight: '700',
    fontSize: 13,
  },

  cardAvatarTextProduct: {
    color: COLORS.green,
  },

  cardInfo: {
    flex: 1,
    minWidth: 0,
    gap: 2,
  },

  cardId: {
    fontSize: 10,
    color: COLORS.textMuted,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  cardName: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  cardEmail: {
    fontSize: 12,
    color: COLORS.textSub,
  },

  cardPrice: {
    fontSize: 14,
    fontWeight: '700',
    color: COLORS.green,
  },

  cardDescription: {
    fontSize: 12,
    color: COLORS.textSub,
  },

  cardActions: {
    flexDirection: 'row',
    gap: 6,
    flexShrink: 0,
  },

  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },

  editButton: {
    backgroundColor: COLORS.accentGlow,
    borderColor: COLORS.accent + '50',
  },

  deleteButton: {
    backgroundColor: COLORS.redSoft,
    borderColor: COLORS.red + '50',
  },

  actionButtonText: {
    fontSize: 14,
  },

  // ─── Empty State ─────────────────────────────────────────
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 8,
  },

  emptyIcon: {
    fontSize: 36,
    marginBottom: 4,
  },

  emptyTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.textSub,
  },

  emptySubtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
  },

  // ─── Dropdown ────────────────────────────────────────────
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownPlaceholder: {
    color: COLORS.textMuted,
    fontSize: 13,
    flex: 1,
  },

  dropdownSelectedText: {
    color: COLORS.text,
    fontSize: 13,
    flex: 1,
  },

  dropdownChevron: {
    color: COLORS.textMuted,
    fontSize: 10,
    marginLeft: 8,
  },

  dropdownList: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.accent,
    borderRadius: 10,
    marginTop: 4,
    overflow: 'hidden',
    zIndex: 999,
  },

  dropdownSearch: {
    backgroundColor: COLORS.bg,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 12,
    paddingVertical: 8,
    color: COLORS.text,
    fontSize: 13,
  },

  dropdownItem: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surfaceBorder,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownItemActive: {
    backgroundColor: COLORS.accentGlow,
  },

  dropdownItemText: {
    color: COLORS.text,
    fontSize: 13,
  },

  dropdownItemTextActive: {
    color: COLORS.accent,
    fontWeight: '600',
  },

  dropdownItemSub: {
    color: COLORS.textMuted,
    fontSize: 11,
  },

  dropdownEmpty: {
    color: COLORS.textMuted,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 16,
  },

  // ─── Offline / Sync ─────────────────────────────────────
  offlineBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 8,
    marginBottom: 8,
  },

  offlineBarText: {
    fontSize: 12,
    fontWeight: '600',
  },

  pendingCount: {
    fontSize: 11,
    color: COLORS.yellow,
    fontWeight: '600',
  },

  syncStatus: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 2,
  },

  syncError: {
    fontSize: 11,
    color: COLORS.red,
    marginTop: 2,
  },

  retryButton: {
    marginTop: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    backgroundColor: COLORS.redSoft,
    borderWidth: 1,
    borderColor: COLORS.red + '50',
    borderRadius: 6,
    alignSelf: 'flex-start',
  },

  retryButtonText: {
    fontSize: 11,
    color: COLORS.red,
    fontWeight: '600',
  },

  // ─── List ────────────────────────────────────────────────
  listContainer: {
    flex: 1,
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.surfaceBorder,
    marginVertical: 8,
  },

  // ─── Toast ───────────────────────────────────────────────
  toastContainer: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    zIndex: 999,
  },

  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  toastSuccess: {
    backgroundColor: '#1a3a2a',
    borderWidth: 1,
    borderColor: COLORS.green,
  },

  toastError: {
    backgroundColor: '#3a1a1a',
    borderWidth: 1,
    borderColor: COLORS.red,
  },

  toastIcon: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },

  toastMessage: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },

  // ─── Login Screen ────────────────────────────────────────
  loginContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    padding: 24,
  },

  loginCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  loginTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },

  loginInput: {
    backgroundColor: COLORS.surfaceHover,
    color: COLORS.text,
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  loginErro: {
    color: COLORS.red,
    fontSize: 13,
    marginBottom: 12,
  },

  loginButton: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },

  loginButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },

  loginLink: {
    color: COLORS.accent,
    textAlign: 'center',
    fontSize: 14,
  },

  // ─── Register Screen ─────────────────────────────────────
  registerContainer: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    padding: 24,
  },

  registerCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 12,
    padding: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  registerTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },

  registerLabel: {
    color: COLORS.textSub,
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 4,
  },

  registerInput: {
    backgroundColor: COLORS.surfaceHover,
    color: COLORS.text,
    borderRadius: 8,
    padding: 12,
    marginBottom: 4,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  registerInputError: {
    borderColor: COLORS.red,
  },

  registerFieldErro: {
    color: COLORS.red,
    fontSize: 12,
    marginBottom: 8,
  },

  registerErro: {
    color: COLORS.red,
    fontSize: 13,
    marginBottom: 12,
  },

  registerPerfilRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },

  registerPerfilBtn: {
    flex: 1,
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
  },

  registerPerfilBtnActive: {
    backgroundColor: COLORS.accentSoft,
    borderColor: COLORS.accentSoft,
  },

  registerPerfilBtnText: {
    color: COLORS.textSub,
    fontWeight: '600',
  },

  registerPerfilBtnTextActive: {
    color: COLORS.white,
  },

  registerButton: {
    backgroundColor: COLORS.accentSoft,
    borderRadius: 8,
    padding: 14,
    alignItems: 'center',
    marginBottom: 16,
  },

  registerButtonText: {
    color: COLORS.white,
    fontWeight: '600',
    fontSize: 15,
  },

  registerLink: {
    color: COLORS.accent,
    textAlign: 'center',
    fontSize: 14,
  },
});

export default styles;
