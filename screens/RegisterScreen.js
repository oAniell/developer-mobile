import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import styles, { COLORS } from '../styles/styles';

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
    <View style={styles.registerContainer}>
      <View style={styles.registerCard}>
        <Text style={styles.registerTitle}>Cadastro</Text>

        <TextInput
          style={[styles.registerInput, errors.nome && styles.registerInputError]}
          placeholder="Nome"
          placeholderTextColor={COLORS.textMuted}
          value={nome}
          onChangeText={v => { setNome(v); setErrors(p => ({ ...p, nome: null })); }}
        />
        {errors.nome ? <Text style={styles.registerFieldErro}>{errors.nome}</Text> : null}

        <TextInput
          style={[styles.registerInput, errors.email && styles.registerInputError]}
          placeholder="Email"
          placeholderTextColor={COLORS.textMuted}
          value={email}
          onChangeText={v => { setEmail(v); setErrors(p => ({ ...p, email: null })); }}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email ? <Text style={styles.registerFieldErro}>{errors.email}</Text> : null}

        <TextInput
          style={[styles.registerInput, errors.senha && styles.registerInputError]}
          placeholder="Senha (mínimo 8 caracteres)"
          placeholderTextColor={COLORS.textMuted}
          value={senha}
          onChangeText={v => { setSenha(v); setErrors(p => ({ ...p, senha: null })); }}
          secureTextEntry
        />
        {errors.senha ? <Text style={styles.registerFieldErro}>{errors.senha}</Text> : null}

        <Text style={styles.registerLabel}>Perfil</Text>
        <View style={styles.registerPerfilRow}>
          {['usuario', 'admin'].map(p => (
            <TouchableOpacity
              key={p}
              style={[styles.registerPerfilBtn, perfil === p && styles.registerPerfilBtnActive]}
              onPress={() => setPerfil(p)}
            >
              <Text style={[styles.registerPerfilBtnText, perfil === p && styles.registerPerfilBtnTextActive]}>
                {p === 'admin' ? 'Admin' : 'Usuário'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {erroApi ? <Text style={styles.registerErro}>{erroApi}</Text> : null}

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={carregando}>
          {carregando
            ? <ActivityIndicator color={COLORS.white} />
            : <Text style={styles.registerButtonText}>Cadastrar</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={onNavigateToLogin}>
          <Text style={styles.registerLink}>Já tem conta? Entrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
