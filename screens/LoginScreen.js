import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../styles/styles';

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

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
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Entrar</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor={COLORS.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor={COLORS.textMuted}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {erro ? <Text style={styles.erro}>{erro}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={carregando}>
          {carregando
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={styles.buttonText}>Entrar</Text>}
        </TouchableOpacity>

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', padding: 24 },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 24, borderWidth: 1, borderColor: COLORS.border },
  title: { color: COLORS.text, fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  input: {
    backgroundColor: COLORS.surfaceHover, color: COLORS.text, borderRadius: 8,
    padding: 12, marginBottom: 12, borderWidth: 1, borderColor: COLORS.border,
  },
  erro: { color: COLORS.red, fontSize: 13, marginBottom: 12 },
  button: {
    backgroundColor: COLORS.accentSoft, borderRadius: 8, padding: 14,
    alignItems: 'center', marginBottom: 16,
  },
  buttonText: { color: COLORS.white, fontWeight: '600', fontSize: 15 },
  link: { color: COLORS.accent, textAlign: 'center', fontSize: 14 },
});
