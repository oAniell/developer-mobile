import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import styles, { COLORS } from '../../styles/styles';

export default function CreatePedido({ onCreatePedido }) {
  const [produto, setProduto] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  function validate() {
    const newErrors = {};
    if (!produto.trim()) newErrors.produto = 'Produto é obrigatório';
    if (!quantidade.trim()) newErrors.quantidade = 'Quantidade é obrigatória';
    else if (isNaN(quantidade) || Number(quantidade) <= 0) newErrors.quantidade = 'Quantidade inválida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onCreatePedido({
      id: String(Date.now()),
      produto: produto.trim(),
      quantidade: Number(quantidade),
    });
    setProduto('');
    setQuantidade('');
    setErrors({});
  }

  return (
    <View style={styles.form}>
      <View style={styles.formHeader}>
        <View style={styles.formIconBg}>
          <Text style={styles.formIcon}>🛒</Text>
        </View>
        <View>
          <Text style={styles.formTitle}>Novo Pedido</Text>
          <Text style={styles.formSubtitle}>Preencha os dados abaixo</Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>PRODUTO</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === 'produto' && styles.inputFocused,
            errors.produto && styles.inputError,
          ]}
          placeholder="Ex: Notebook"
          placeholderTextColor={COLORS.textMuted}
          value={produto}
          onChangeText={(text) => { setProduto(text); if (errors.produto) setErrors(p => ({ ...p, produto: null })); }}
          onFocus={() => setFocusedField('produto')}
          onBlur={() => setFocusedField(null)}
        />
        {errors.produto && <Text style={styles.errorText}>{errors.produto}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>QUANTIDADE</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === 'quantidade' && styles.inputFocused,
            errors.quantidade && styles.inputError,
          ]}
          placeholder="Ex: 2"
          placeholderTextColor={COLORS.textMuted}
          value={quantidade}
          onChangeText={(text) => { setQuantidade(text); if (errors.quantidade) setErrors(p => ({ ...p, quantidade: null })); }}
          onFocus={() => setFocusedField('quantidade')}
          onBlur={() => setFocusedField(null)}
          keyboardType="numeric"
        />
        {errors.quantidade && <Text style={styles.errorText}>{errors.quantidade}</Text>}
      </View>

      <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Criar Pedido</Text>
      </TouchableOpacity>
    </View>
  );
}
