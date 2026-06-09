import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles, { COLORS } from '../../styles/styles';
import { useState, useEffect, useRef } from 'react';

export default function CreateUsers({
  onCreateUser,
  onUpdateUser,
  userEditando,
  onCancelEdit,
  podeGerenciar = true,
}) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [perfil, setPerfil] = useState('usuario');
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const emailRef = useRef(null);

  useEffect(() => {
    if (userEditando) {
      setNome(userEditando.name);
      setEmail(userEditando.email);
    } else {
      setNome('');
      setEmail('');
      setPerfil('usuario');
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
      onCreateUser({ name: nome.trim(), email: email.trim(), perfil });
    }

    setNome('');
    setEmail('');
    setPerfil('usuario');
    setErrors({});
  }

  function handleCancel() {
    setNome('');
    setEmail('');
    setPerfil('usuario');
    setErrors({});
    if (onCancelEdit) onCancelEdit();
  }

  const isEditing = !!userEditando;

  if (!podeGerenciar) return null;

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
            {isEditing ? 'Editando usuário' : 'Uma senha provisória será enviada por email'}
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
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
          onFocus={() => setFocusedField('nome')}
          onBlur={() => setFocusedField(null)}
        />
        {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
      </View>

      {/* Email */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>EMAIL</Text>
        <TextInput
          ref={emailRef}
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
          returnKeyType="go"
          onSubmitEditing={handleSubmit}
          onFocus={() => setFocusedField('email')}
          onBlur={() => setFocusedField(null)}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}
      </View>

      {/* Perfil — só na criação */}
      {!isEditing && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>PERFIL</Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {['usuario', 'admin'].map(p => (
              <TouchableOpacity
                key={p}
                style={[
                  styles.button,
                  { flex: 1, paddingVertical: 10 },
                  perfil === p ? styles.buttonPrimary : styles.buttonGhost,
                ]}
                onPress={() => setPerfil(p)}
              >
                <Text style={perfil === p ? styles.buttonText : styles.buttonText}>
                  {p === 'admin' ? 'Admin' : 'Usuário'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

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
