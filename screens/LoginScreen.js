import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import styles, { COLORS } from '../styles/styles';

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
    <View style={styles.loginContainer}>
      <View style={styles.loginCard}>
        <Text style={styles.loginTitle}>Entrar</Text>

        <TextInput
          style={styles.loginInput}
          placeholder="Email"
          placeholderTextColor={COLORS.textMuted}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.loginInput}
          placeholder="Senha"
          placeholderTextColor={COLORS.textMuted}
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
        />

        {erro ? <Text style={styles.loginErro}>{erro}</Text> : null}

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={carregando}>
          {carregando
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={styles.loginButtonText}>Entrar</Text>}
        </TouchableOpacity>

      </View>
    </View>
  );
}
