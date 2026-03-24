import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../../styles/styles';
import { useEffect, useState } from 'react';

export default function CreateUsers({ onCreateUser, nextIdUser }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(response => response.json())
      .then(data => console.log('Usuários existentes:', data))
      .catch(error => console.error('Erro ao buscar usuários:', error));
  }, []);

  function validate() {
    const newErrors = {};

    if (!nome.trim())
      newErrors.nome = 'Nome é obrigatório.';
    else if (nome.trim().length < 3)
      newErrors.nome = 'Nome deve ter pelo menos 3 caracteres.';

    if (!email.trim())
      newErrors.email = 'Email é obrigatório.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      newErrors.email = 'Email inválido.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleCreateUser() {
    if (!validate()) return;

    const newUser = 
    { id: nextIdUser, name: nome.trim(), email: email.trim() };
    onCreateUser(newUser);
    setNome('');
    setEmail('');
    setErrors({});
    
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
    
    .then(response => {
      if (!response.ok) throw new Error('Erro ao criar usuário');
      return response.json();
    })
    .then(data => console.log('Usuário criado:', data))
    .catch(error => Alert.alert('Erro', error.message));
  }

  return (
    <View style={styles.form}>
      <Text style={styles.formTitle}>Novo Usuário</Text>

      <TextInput
        style={[styles.input, errors.nome && styles.inputError]}
        placeholder="Nome"
        placeholderTextColor="#555D7A"
        value={nome}
        onChangeText={(text) => {
          setNome(text);
          if (errors.nome) setErrors(prev => ({ ...prev, nome: null }));
        }}
      />
      {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}

      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        placeholderTextColor="#555D7A"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) setErrors(prev => ({ ...prev, email: null }));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TouchableOpacity style={styles.button} onPress={handleCreateUser}>
        <Text style={styles.buttonText}>Criar Usuário</Text>
      </TouchableOpacity>
    </View>
  );
}