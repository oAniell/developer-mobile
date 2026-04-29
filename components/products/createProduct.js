import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import styles, { COLORS } from '../../styles/styles';
import { useEffect, useState } from 'react';

export default function CreateProduct({
  onCreateProduct,
  onUpdateProduct,
  productEditando,
  onCancelEdit,
  nextIdProduct,
}) {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const [descricao, setDescricao] = useState('');
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  useEffect(() => {
    if (productEditando) {
      setNome(productEditando.name);
      setPreco(String(productEditando.price));
      setDescricao(productEditando.description);
    } else {
      setNome('');
      setPreco('');
      setDescricao('');
    }
    setErrors({});
  }, [productEditando]);

  function validate() {
    const newErrors = {};
    if (!nome.trim())
      newErrors.nome = 'Nome é obrigatório';

    if (!preco.trim())
      newErrors.preco = 'Preço é obrigatório';
    else if (isNaN(preco.trim()) || Number(preco.trim()) < 0)
      newErrors.preco = 'Preço inválido';

    if (!descricao.trim())
      newErrors.descricao = 'Descrição é obrigatória';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;

    if (productEditando) {
      onUpdateProduct({
        id: productEditando.id,
        name: nome.trim(),
        price: parseFloat(preco.trim()),
        description: descricao.trim(),
      });
    } else {
      onCreateProduct({
        id: nextIdProduct,
        name: nome.trim(),
        price: parseFloat(preco.trim()),
        description: descricao.trim(),
      });
    }

    setNome('');
    setPreco('');
    setDescricao('');
    setErrors({});
  }

  function handleCancel() {
    setNome('');
    setPreco('');
    setDescricao('');
    setErrors({});
    if (onCancelEdit) onCancelEdit();
  }

  const isEditing = !!productEditando;

  return (
    <View style={styles.form}>
      {/* Form header */}
      <View style={styles.formHeader}>
        <View style={styles.formIconBg}>
          <Text style={styles.formIcon}>{isEditing ? '✏️' : '➕'}</Text>
        </View>
        <View>
          <Text style={styles.formTitle}>{isEditing ? 'Editar Produto' : 'Novo Produto'}</Text>
          <Text style={styles.formSubtitle}>
            {isEditing ? `Editando #${productEditando.id}` : 'Preencha os dados abaixo'}
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
          placeholder="Ex: Camiseta Básica"
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

      {/* Preço */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>PREÇO (R$)</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === 'preco' && styles.inputFocused,
            errors.preco && styles.inputError,
          ]}
          placeholder="Ex: 49.90"
          placeholderTextColor={COLORS.textMuted}
          value={preco}
          onChangeText={(text) => {
            setPreco(text);
            if (errors.preco) setErrors(prev => ({ ...prev, preco: null }));
          }}
          onFocus={() => setFocusedField('preco')}
          onBlur={() => setFocusedField(null)}
          keyboardType="numeric"
        />
        {errors.preco && <Text style={styles.errorText}>{errors.preco}</Text>}
      </View>

      {/* Descrição */}
      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>DESCRIÇÃO</Text>
        <TextInput
          style={[
            styles.input,
            focusedField === 'descricao' && styles.inputFocused,
            errors.descricao && styles.inputError,
          ]}
          placeholder="Ex: Produto de alta qualidade"
          placeholderTextColor={COLORS.textMuted}
          value={descricao}
          onChangeText={(text) => {
            setDescricao(text);
            if (errors.descricao) setErrors(prev => ({ ...prev, descricao: null }));
          }}
          onFocus={() => setFocusedField('descricao')}
          onBlur={() => setFocusedField(null)}
        />
        {errors.descricao && <Text style={styles.errorText}>{errors.descricao}</Text>}
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
          <Text style={styles.buttonText}>Criar Produto</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
