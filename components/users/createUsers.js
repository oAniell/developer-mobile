import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles, { COLORS } from '../../styles/styles';
import { useState, useEffect } from 'react';

export default function CreateUsers({
  onCreateUser,
  onUpdateUser,
  userEditando,
  onCancelEdit,
  nextIdUser,
}) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (userEditando) {
      setNome(userEditando.name);
      setEmail(userEditando.email);
    } else {
      setNome('');
      setEmail('');
    }
    setErrors({});
  }, [userEditando]);

  function validate() {
    const newErrors = {};
    if (!nome.trim())
      newErrors.nome = 'Nome é obrigatório';
    else if (nome.trim().length < 3)
      newErrors.nome = 'Mínimo 3 caracteres';

    if (!email.trim())
      newErrors.email = 'Email é obrigatório';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      newErrors.email = 'Email inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    if (userEditando) {
      onUpdateUser({ id: userEditando.id, name: nome.trim(), email: email.trim() });
    } else {
      onCreateUser({ id: nextIdUser, name: nome.trim(), email: email.trim() });
    }

    setNome('');
    setEmail('');
    setErrors({});
  }

  function handleCancel() {
    setNome('');
    setEmail('');
    setErrors({});
    if (onCancelEdit) onCancelEdit();
  }

  const isEditing = !!userEditando;

  return (
    <View style={styles.form}>
      {/* Form header */}
      <View style={styles.formHeader}>
        <View style={styles.formIconBg}>
          <Text style={styles.formIcon}>{isEditing ? '✏️' : '➕'}</Text>
        </View>
        <View>
          <Text style={styles.formTitle}>{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</Text>
          <Text style={styles.formSubtitle}>
            {isEditing ? `Editando #${userEditando.id}` : 'Preencha os dados abaixo'}
          </Text>
        </View>
      </View>

      {/* Nome */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>NOME</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === 'nome' && styles.inputFocused,
            errors.nome && styles.inputError,
          ]}
          placeholder="Ex: João Silva"
          placeholderTextColor={COLORS.textMuted}
          value={nome}
          onChangeText={(text) => {
            setNome(text);
            if (errors.nome) setErrors(prev => ({ ...prev, nome: null }));
          }}
          onFocus={() => setFocusedField('nome')}
          onBlur={() => setFocusedField(null)}
        />
        {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>EMAIL</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === 'email' && styles.inputFocused,
            errors.email && styles.inputError,
          ]}
          placeholder="Ex: joao@email.com"
          placeholderTextColor={COLORS.textMuted}
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            if (errors.email) setErrors(prev => ({ ...prev, email: null }));
          }}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      {/* Buttons */}
      {isEditing ? (
        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={[styles.button, styles.buttonSuccess, styles.buttonFlex]}
            onPress={handleSubmit}
          >
            <Text style={styles.buttonTextDark}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.buttonGhost, styles.buttonFlex]}
            onPress={handleCancel}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Criar Usuário</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
