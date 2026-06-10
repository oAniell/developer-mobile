import { View, Text, TouchableOpacity, Modal, Clipboard } from 'react-native';
import { COLORS } from '../styles/styles';

export default function SenhaProvModal({ visible, nome, email, senha, onFechar }) {
  function copiar() {
    Clipboard.setString(senha);
  }

  return (
    <Modal transparent animationType="fade" visible={visible} onRequestClose={onFechar}>
      <View style={s.overlay}>
        <View style={s.box}>
          <View style={s.iconWrap}>
            <Text style={s.icon}>🔑</Text>
          </View>

          <Text style={s.title}>Usuário criado!</Text>
          <Text style={s.subtitle}>
            Compartilhe as credenciais abaixo com <Text style={{ fontWeight: '700' }}>{nome}</Text>
          </Text>

          <View style={s.credencial}>
            <Text style={s.credencialLabel}>EMAIL</Text>
            <Text style={s.credencialValue}>{email}</Text>
          </View>

          <View style={s.credencial}>
            <Text style={s.credencialLabel}>SENHA PROVISÓRIA</Text>
            <Text style={s.senha}>{senha}</Text>
          </View>

          <TouchableOpacity style={s.btnCopiar} onPress={copiar}>
            <Text style={s.btnCopiarText}>Copiar senha</Text>
          </TouchableOpacity>

          <TouchableOpacity style={s.btnFechar} onPress={onFechar}>
            <Text style={s.btnFecharText}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = {
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
    width: 320,
    alignItems: 'center',
    gap: 10,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: COLORS.accentSoft || '#e8f4fd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  icon: { fontSize: 22 },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },
  subtitle: {
    fontSize: 13,
    color: COLORS.textSub,
    textAlign: 'center',
    lineHeight: 19,
  },
  credencial: {
    width: '100%',
    backgroundColor: COLORS.bg,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 12,
    gap: 3,
  },
  credencialLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textMuted,
    letterSpacing: 0.8,
  },
  credencialValue: {
    fontSize: 13,
    color: COLORS.text,
  },
  senha: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: 2,
  },
  btnCopiar: {
    width: '100%',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: COLORS.accent,
    marginTop: 4,
  },
  btnCopiarText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.white,
  },
  btnFechar: {
    width: '100%',
    paddingVertical: 11,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: COLORS.surfaceBorder || COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  btnFecharText: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.textSub,
  },
};
