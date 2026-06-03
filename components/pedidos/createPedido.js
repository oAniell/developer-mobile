import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import styles, { COLORS } from '../../styles/styles';

export default function CreatePedido({ onCreatePedido, products = [] }) {
  const [produtoSelecionado, setProdutoSelecionado] = useState(null);
  const [quantidade, setQuantidade] = useState('');
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [busca, setBusca] = useState('');

  const produtosFiltrados = products.filter(p =>
    p.name.toLowerCase().includes(busca.toLowerCase())
  );

  function validate() {
    const newErrors = {};
    if (!produtoSelecionado) newErrors.produto = 'Selecione um produto';
    if (!quantidade.trim()) newErrors.quantidade = 'Quantidade é obrigatória';
    else if (isNaN(quantidade) || Number(quantidade) <= 0) newErrors.quantidade = 'Quantidade inválida';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    onCreatePedido({
      produto: produtoSelecionado.name,
      quantidade: Number(quantidade),
    });
    setProdutoSelecionado(null);
    setBusca('');
    setQuantidade('');
    setErrors({});
    setDropdownAberto(false);
  }

  function selecionarProduto(produto) {
    setProdutoSelecionado(produto);
    setBusca('');
    setDropdownAberto(false);
    if (errors.produto) setErrors(p => ({ ...p, produto: null }));
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

        <TouchableOpacity
          style={[styles.input, styles.dropdownTrigger, errors.produto && styles.inputError]}
          onPress={() => setDropdownAberto(v => !v)}
        >
          <Text style={produtoSelecionado ? styles.dropdownSelectedText : styles.dropdownPlaceholder}>
            {produtoSelecionado ? produtoSelecionado.name : 'Selecione um produto...'}
          </Text>
          <Text style={styles.dropdownChevron}>{dropdownAberto ? '▲' : '▼'}</Text>
        </TouchableOpacity>

        {errors.produto && <Text style={styles.errorText}>{errors.produto}</Text>}

        {dropdownAberto && (
          <View style={styles.dropdownList}>
            <TextInput
              style={styles.dropdownSearch}
              placeholder="Buscar produto..."
              placeholderTextColor={COLORS.textMuted}
              value={busca}
              onChangeText={setBusca}
              autoFocus
            />
            <ScrollView style={{ maxHeight: 180 }} keyboardShouldPersistTaps="handled">
              {products.length === 0 ? (
                <Text style={styles.dropdownEmpty}>Nenhum produto cadastrado</Text>
              ) : produtosFiltrados.length === 0 ? (
                <Text style={styles.dropdownEmpty}>Nenhum produto encontrado</Text>
              ) : (
                produtosFiltrados.map(p => (
                  <TouchableOpacity
                    key={p.id}
                    style={[styles.dropdownItem, produtoSelecionado?.id === p.id && styles.dropdownItemActive]}
                    onPress={() => selecionarProduto(p)}
                  >
                    <Text style={[styles.dropdownItemText, produtoSelecionado?.id === p.id && styles.dropdownItemTextActive]}>
                      {p.name}
                    </Text>
                    <Text style={styles.dropdownItemSub}>R$ {Number(p.price).toFixed(2)}</Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        )}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>QUANTIDADE</Text>
        <TextInput
          style={[styles.input, focusedField === 'quantidade' && styles.inputFocused, errors.quantidade && styles.inputError]}
          placeholder="Ex: 2"
          placeholderTextColor={COLORS.textMuted}
          value={quantidade}
          onChangeText={t => { setQuantidade(t); if (errors.quantidade) setErrors(p => ({ ...p, quantidade: null })); }}
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
