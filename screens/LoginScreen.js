import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../styles/styles';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  async function handleLogin() {
    setErro('');
    setCarregando(true);
    try {
      await login(email.trim(), senha);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={s.root}>
      <View style={s.card}>

        <View style={s.logoRow}>
          <View style={s.logoDot} />
          <Text style={s.logoText}>Cadastros</Text>
        </View>

        <Text style={s.title}>Entrar na conta</Text>
        <Text style={s.subtitle}>Preencha seus dados de acesso</Text>

        <View style={s.fieldGroup}>
          <Text style={s.label}>EMAIL</Text>
          <TextInput
            style={[s.input, focusedField === 'email' && s.inputFocused]}
            placeholder="seu@email.com"
            placeholderTextColor={COLORS.textMuted}
            value={email}
            onChangeText={t => { setEmail(t); setErro(''); }}
            keyboardType="email-address"
            autoCapitalize="none"
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        <View style={s.fieldGroup}>
          <Text style={s.label}>SENHA</Text>
          <TextInput
            style={[s.input, focusedField === 'senha' && s.inputFocused]}
            placeholder="••••••••"
            placeholderTextColor={COLORS.textMuted}
            value={senha}
            onChangeText={t => { setSenha(t); setErro(''); }}
            secureTextEntry
            onFocus={() => setFocusedField('senha')}
            onBlur={() => setFocusedField(null)}
          />
        </View>

        {erro ? <Text style={s.erro}>{erro}</Text> : null}

        <TouchableOpacity style={s.button} onPress={handleLogin} disabled={carregando}>
          {carregando
            ? <ActivityIndicator color={COLORS.white} size="small" />
            : <Text style={s.buttonText}>Entrar</Text>}
        </TouchableOpacity>

      </View>
    </View>
  );
}

const s = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  card: {
    width: '100%',
    maxWidth: 360,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.surfaceBorder,
    borderRadius: 16,
    padding: 28,
    gap: 12,
  },
  logoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  logoDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.accent,
  },
  logoText: {
    fontSize: 13,
    fontWeight: '700',
    color: COLORS.accent,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
    letterSpacing: 0.2,
  },
  subtitle: {
    fontSize: 12,
    color: COLORS.textMuted,
    marginBottom: 4,
  },
  fieldGroup: {
    gap: 4,
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.textSub,
    letterSpacing: 0.8,
  },
  input: {
    backgroundColor: COLORS.bg,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: COLORS.text,
    fontSize: 13,
  },
  inputFocused: {
    borderColor: COLORS.accent,
  },
  erro: {
    fontSize: 12,
    color: COLORS.red,
    marginTop: -4,
  },
  button: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 14,
  },
});
