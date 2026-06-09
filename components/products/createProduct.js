import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles, { COLORS } from '../../styles/styles';
import { useEffect, useRef, useState } from 'react';

export default function CreateProduct({
  onCreateProduct,
  onUpdateProduct,
  productEditando,
  onCancelEdit,
}) {
  const [nome, setNome] = useState('');
  const [precoCentavos, setPrecoCentavos] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const precoRef = useRef(null);
  const descricaoRef = useRef(null);
  const quantidadeRef = useRef(null);

  useEffect(() => {
    if (productEditando) {
      setNome(productEditando.name);
      setPrecoCentavos(Math.round(productEditando.price * 100).toString());
      setDescricao(productEditando.description);
    } else {
      setNome('');
      setPrecoCentavos('');
      setDescricao('');
      setQuantidade('');
    }
    setErrors({});
  }, [productEditando]);

  function formatarPreco(centavos) {
    if (!centavos) return '';
    const padded = centavos.padStart(3, '0');
    const inteiro = parseInt(padded.slice(0, -2), 10).toString();
    const decimal = padded.slice(-2);
    return `${inteiro},${decimal}`;
  }

  function handlePrecoChange(text) {
    const digits = text.replace(/\D/g, '').replace(/^0+/, '');
    if (digits.length > 10) return; // limite: 99.999.999,99
    setPrecoCentavos(digits);
    if (errors.preco) setErrors(p => ({ ...p, preco: null }));
  }

  function precoNumerico() {
    if (!precoCentavos) return 0;
    return parseInt(precoCentavos, 10) / 100;
  }

  function validate() {
    const newErrors = {};
    if (!nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!precoCentavos) newErrors.preco = 'Preço é obrigatório';
    else if (precoNumerico() <= 0) newErrors.preco = 'Preço deve ser maior que zero';
    if (!descricao.trim()) newErrors.descricao = 'Descrição é obrigatória';
    if (!isEditing) {
      if (!quantidade.trim()) newErrors.quantidade = 'Quantidade inicial é obrigatória';
      else if (isNaN(quantidade) || Number(quantidade) < 0) newErrors.quantidade = 'Quantidade inválida';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    if (isEditing) {
      onUpdateProduct({
        id: productEditando.id,
        name: nome.trim(),
        price: precoNumerico(),
        description: descricao.trim(),
      });
    } else {
      onCreateProduct({
        name: nome.trim(),
        price: precoNumerico(),
        description: descricao.trim(),
        quantidadeInicial: Number(quantidade),
      });
    }

    setNome('');
    setPrecoCentavos('');
    setDescricao('');
    setQuantidade('');
    setErrors({});
  }

  function handleCancel() {
    setNome('');
    setPrecoCentavos('');
    setDescricao('');
    setQuantidade('');
    setErrors({});
    if (onCancelEdit) onCancelEdit();
  }

  const isEditing = !!productEditando;

  return (
    <View style={styles.form}>
      <View style={styles.formHeader}>
        <View style={styles.formIconBg}>
          <Text style={styles.formIcon}>{isEditing ? '✏️' : '➕'}</Text>
        </View>
        <View>
          <Text style={styles.formTitle}>{isEditing ? 'Editar Produto' : 'Novo Produto'}</Text>
          <Text style={styles.formSubtitle}>
            {isEditing ? 'Editando produto' : 'Preencha os dados abaixo'}
          </Text>
        </View>
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>NOME</Text>
        <TextInput
          style={[styles.input, focusedField === 'nome' && styles.inputFocused, errors.nome && styles.inputError]}
          placeholder="Ex: Camiseta Básica"
          placeholderTextColor={COLORS.textMuted}
          value={nome}
          onChangeText={t => { setNome(t); if (errors.nome) setErrors(p => ({ ...p, nome: null })); }}
          returnKeyType="next"
          onSubmitEditing={() => precoRef.current?.focus()}
          onFocus={() => setFocusedField('nome')}
          onBlur={() => setFocusedField(null)}
        />
        {errors.nome && <Text style={styles.errorText}>{errors.nome}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>PREÇO (R$)</Text>
        <TextInput
          ref={precoRef}
          style={[styles.input, focusedField === 'preco' && styles.inputFocused, errors.preco && styles.inputError]}
          placeholder="0,00"
          placeholderTextColor={COLORS.textMuted}
          value={formatarPreco(precoCentavos)}
          onChangeText={handlePrecoChange}
          returnKeyType="next"
          onSubmitEditing={() => descricaoRef.current?.focus()}
          onFocus={() => setFocusedField('preco')}
          onBlur={() => setFocusedField(null)}
          keyboardType="numeric"
        />
        {errors.preco && <Text style={styles.errorText}>{errors.preco}</Text>}
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>DESCRIÇÃO</Text>
        <TextInput
          ref={descricaoRef}
          style={[styles.input, focusedField === 'descricao' && styles.inputFocused, errors.descricao && styles.inputError]}
          placeholder="Ex: Produto de alta qualidade"
          placeholderTextColor={COLORS.textMuted}
          value={descricao}
          onChangeText={t => { setDescricao(t); if (errors.descricao) setErrors(p => ({ ...p, descricao: null })); }}
          returnKeyType={isEditing ? 'go' : 'next'}
          onSubmitEditing={isEditing ? handleSubmit : () => quantidadeRef.current?.focus()}
          onFocus={() => setFocusedField('descricao')}
          onBlur={() => setFocusedField(null)}
        />
        {errors.descricao && <Text style={styles.errorText}>{errors.descricao}</Text>}
      </View>

      {!isEditing && (
        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>QUANTIDADE INICIAL NO ESTOQUE</Text>
          <TextInput
            ref={quantidadeRef}
            style={[styles.input, focusedField === 'quantidade' && styles.inputFocused, errors.quantidade && styles.inputError]}
            placeholder="Ex: 10"
            placeholderTextColor={COLORS.textMuted}
            value={quantidade}
            onChangeText={t => { setQuantidade(t); if (errors.quantidade) setErrors(p => ({ ...p, quantidade: null })); }}
            returnKeyType="go"
            onSubmitEditing={handleSubmit}
            onFocus={() => setFocusedField('quantidade')}
            onBlur={() => setFocusedField(null)}
            keyboardType="numeric"
          />
          {errors.quantidade && <Text style={styles.errorText}>{errors.quantidade}</Text>}
        </View>
      )}

      {isEditing ? (
        <View style={styles.buttonGroup}>
          <TouchableOpacity style={[styles.button, styles.buttonSuccess, styles.buttonFlex]} onPress={handleSubmit}>
            <Text style={styles.buttonTextDark}>Salvar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.buttonGhost, styles.buttonFlex]} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={[styles.button, styles.buttonPrimary]} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Criar Produto</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
