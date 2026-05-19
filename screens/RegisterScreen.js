import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COLORS } from '../styles/styles';

export default function RegisterScreen({ onNavigateToLogin }) {
  const { registrar } = useAuth();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [perfil, setPerfil] = useState('usuario');
  const [errors, setErrors] = useState({});
  const [erroApi, setErroApi] = useState('');
  const [carregando, setCarregando] = useState(false);

  function validate() {
    const e = {};
    if (!nome.trim()) e.nome = 'Nome é obrigatório';
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) e.email = 'Email inválido';
    if (senha.length < 8) e.senha = 'Senha deve ter no mínimo 8 caracteres';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleRegister() {
    setErroApi('');
    if (!validate()) return;
    setCarregando(true);
    try {
      await registrar({ nome: nome.trim(), email: email.trim(), senha, perfil });
      onNavigateToLogin();
    } catch (err) {
      if (err.status === 409) setErroApi('Email já cadastrado');
      else setErroApi(err.message);
    } finally {
      setCarregando(false);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Cadastro</Text>

        <TextInput
          style={[styles.input, errors.nome && styles.inputError]}
          placeholder="Nome"
          placeholderTextColor={COLORS.textMuted}
          value={nome}
          onChangeText={v => { setNome(v); setErrors(p => ({ ...p, nome: null })); }}
        />
        {errors.nome ? <Text style={styles.fieldErro}>{errors.nome}</Text> : null}

        <TextInput
          style={[styles.input, errors.email && styles.inputError]}
          placeholder="Email"
          placeholderTextColor={COLORS.textMuted}
          value={email}
          onChangeText={v => { setEmail(v); setErrors(p => ({ ...p, email: null })); }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.fieldErro}>{errors.email}</Text> : null}

        <TextInput
          style={[styles.input, errors.senha && styles.inputError]}
          placeholder="Senha (mínimo 8 caracteres)"
          placeholderTextColor={COLORS.textMuted}
          value={senha}
          onChangeText={v => { setSenha(v); setErrors(p => ({ ...p, senha: null })); }}
          secureTextEntry
        />
        {errors.senha ? <Text style={styles.fieldErro}>{errors.senha}</Text> : null}

        <Text style={styles.label}>Perfil</Text>
        <View style={styles.perfilRow}>
          {['usuario', 'admin'].map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.perfilBtn, perfil === p && styles.perfilBtnActive]}
              onPress={() => setPerfil(p)}
            >
              <Text style={[styles.perfilBtnText, perfil === p && styles.perfilBtnTextActive]}>
                {p === 'admin' ? 'Admin' : 'Usuário'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {erroApi ? <Text style={styles.erro}>{erroApi}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={carregando}>
          {carregando
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={styles.buttonText}>Cadastrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={onNavigateToLogin}>
          <Text style={styles.link}>Já tem conta? Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, justifyContent: 'center', padding: 24 },
  card: { backgroundColor: COLORS.surface, borderRadius: 12, padding: 24, borderWidth: 1, borderColor: COLORS.border },
  title: { color: COLORS.text, fontSize: 22, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  label: { color: COLORS.textSub, fontSize: 12, fontWeight: '600', marginBottom: 6, marginTop: 4 },
  input: {
    backgroundColor: COLORS.surfaceHover, color: COLORS.text, borderRadius: 8,
    padding: 12, marginBottom: 4, borderWidth: 1, borderColor: COLORS.border,
  },
  inputError: { borderColor: COLORS.red },
  fieldErro: { color: COLORS.red, fontSize: 12, marginBottom: 8 },
  erro: { color: COLORS.red, fontSize: 13, marginBottom: 12 },
  perfilRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  perfilBtn: {
    flex: 1, padding: 10, borderRadius: 8, borderWidth: 1,
    borderColor: COLORS.border, alignItems: 'center',
  },
  perfilBtnActive: { backgroundColor: COLORS.accentSoft, borderColor: COLORS.accentSoft },
  perfilBtnText: { color: COLORS.textSub, fontWeight: '600' },
  perfilBtnTextActive: { color: COLORS.white },
  button: {
    backgroundColor: COLORS.accentSoft, borderRadius: 8, padding: 14,
    alignItems: 'center', marginBottom: 16,
  },
  buttonText: { color: COLORS.white, fontWeight: '600', fontSize: 15 },
  link: { color: COLORS.accent, textAlign: 'center', fontSize: 14 },
});
