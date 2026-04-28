import { View, Text, TouchableOpacity, Modal } from 'react-native';
import styles, { COLORS } from '../styles/styles';

export default function ConfirmModal({ visible, title, message, onConfirm, onCancel }) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onCancel}
    >
      <View style={modalStyles.overlay}>
        <View style={modalStyles.box}>
          <View style={modalStyles.iconWrap}>
            <Text style={modalStyles.icon}>🗑️</Text>
          </View>
          <Text style={modalStyles.title}>{title}</Text>
          <Text style={modalStyles.message}>{message}</Text>
          <View style={modalStyles.actions}>
            <TouchableOpacity style={modalStyles.btnCancel} onPress={onCancel}>
              <Text style={modalStyles.btnCancelText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={modalStyles.btnConfirm} onPress={onConfirm}>
              <Text style={modalStyles.btnConfirmText}>Excluir</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: 'center',
    gap: 8,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.redSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  icon: {
    fontSize: 22,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
    textAlign: 'center',
  },
  message: {
    fontSize: 13,
    color: COLORS.textSub,
    textAlign: 'center',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    width: '100%',
  },
  btnCancel: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: COLORS.surfaceBorder,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnCancelText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSub,
  },
  btnConfirm: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: COLORS.red,
  },
  btnConfirmText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
};
