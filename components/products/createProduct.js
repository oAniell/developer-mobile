import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../../styles/styles';
import { useEffect, useState } from 'react';

export default function CreateProduct({ onCreateProduct, onUpdateProduct, productEditando, onCancelEdit, nextIdProduct }) {
    const [nome, setNome] = useState('');
    const [preco, setPreco] = useState('');
    const [descricao, setDescricao] = useState('');
    const [errors, setErrors] = useState({});

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
    }, [productEditando]);

    useEffect(() => {
        fetch('http://localhost:3000/products')
            .then(response => response.json())
            .then(data => console.log('Produtos existentes:', data))
            .catch(error => console.error('Erro ao buscar produtos:', error));
    }, []);

    function validate() {
        const newErrors = {};
        if (!nome.trim())
            newErrors.nome = 'Nome é obrigatório.';

        if (!preco.trim())
            newErrors.preco = 'Preço é obrigatório.';
        else if (isNaN(preco.trim()))
            newErrors.preco = 'Preço inválido.';

        if (!descricao.trim())
            newErrors.descricao = 'Descrição é obrigatória.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }

    function handleSubmit() {
        if (!validate()) return;

        if (productEditando) {
            const updatedProduct = { 
                id: productEditando.id, 
                name: nome.trim(), 
                price: parseFloat(preco.trim()), 
                description: descricao.trim() 
            };
            onUpdateProduct(updatedProduct);
            setNome('');
            setPreco('');
            setDescricao('');
            setErrors({});
        } else {
            const newProduct = { id: nextIdProduct, name: nome.trim(), price: parseFloat(preco.trim()), description: descricao.trim() };
            onCreateProduct(newProduct);
            setNome('');
            setPreco('');
            setDescricao('');
            setErrors({});

            fetch('http://localhost:3000/products', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newProduct)
            })

                .then(response => {
                    if (!response.ok) throw new Error('Erro ao criar produto');
                    return response.json();
                })
                .then(data => console.log('Produto criado:', data))
                .catch(error => Alert.alert('Erro', error.message));
        }
    }

    function handleCancel() {
        setNome('');
        setPreco('');
        setDescricao('');
        setErrors({});
        if (onCancelEdit) onCancelEdit();
    }

    return (
        <View style={styles.form}>
            <Text style={styles.formTitle}>
                {productEditando ? 'Editar Produto' : 'Novo Produto'}
            </Text>

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
                style={[styles.input, errors.preco && styles.inputError]}
                placeholder="Preço"
                placeholderTextColor="#555D7A"
                value={preco}
                onChangeText={(text) => {
                    setPreco(text);
                    if (errors.preco) setErrors(prev => ({ ...prev, preco: null }));
                }}
                keyboardType="numeric"
                autoCapitalize="none"
            />
            {errors.preco && <Text style={styles.errorText}>{errors.preco}</Text>}

            <TextInput
                style={[styles.input, errors.descricao && styles.inputError]}
                placeholder="Descrição"
                placeholderTextColor="#555D7A"
                value={descricao}
                onChangeText={(text) => {
                    setDescricao(text);
                    if (errors.descricao) setErrors(prev => ({ ...prev, descricao: null }));
                }}
            />
            {errors.descricao && <Text style={styles.errorText}>{errors.descricao}</Text>}


            {productEditando ? (
                <>
                    <TouchableOpacity style={[styles.button, styles.updateButton]} onPress={handleSubmit}>
                        <Text style={styles.buttonText}>Atualizar Produto</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={handleCancel}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                    <Text style={styles.buttonText}>Criar Produto</Text>
                </TouchableOpacity>
            )}
        </View>
    );
}