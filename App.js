import { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import styles from './styles/styles';
import CardUser from './components/users/cardUser';
import CreateUsers from './components/users/createUsers';
import CardProduct from './components/products/cardProduct';
import CreateProduct from './components/products/createProduct';

const initialDb = [
];

const initialProducts = [
];

export default function App() {
  const [users, setUsers] = useState(initialDb);
  const [products, setProducts] = useState(initialProducts);
  const [nextIdUser, setNextIdUser] = useState(1);
  const [nextIdProduct, setNextIdProduct] = useState(1);
  const [activeTab, setActiveTab] = useState('user'); // 'user' ou 'product'
  const [userEditando, setUserEditando] = useState(null); // Usuário sendo editado
  const [productEditando, setProductEditando] = useState(null); // Produto sendo editado

  function handleCreateUser(newUser) {
    setUsers([...users, newUser]);
    setNextIdUser(nextIdUser + 1);
  }

  function handleUpdateUser(userAtualizado) {
    setUsers(users.map(u => u.id === userAtualizado.id ? userAtualizado : u));
    setUserEditando(null);

    fetch(`http://localhost:3000/users/${userAtualizado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userAtualizado)
    })
      .then(response => {
        if (!response.ok) throw new Error('Erro ao atualizar usuário');
        return response.json();
      })
      .then(data => console.log('Usuário atualizado:', data))
      .catch(error => Alert.alert('Erro', error.message));
  }

  function handleDeleteUser(id) {
    Alert.alert(
      'Confirmar Exclusão',
      'Tem certeza que deseja excluir este usuário?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setUsers(users.filter(u => u.id !== id));

            fetch(`http://localhost:3000/users/${id}`, {
              method: 'DELETE'
            })
              .then(response => {
                if (!response.ok) throw new Error('Erro ao excluir usuário');
                return response.json();
              })
              .then(data => console.log('Usuário excluído:', data))
              .catch(error => Alert.alert('Erro', error.message));
          }
        }
      ]
    );
  }

  function hadleDeleteProduto(id) {
    const lista = products.filter(filtro => filtro.id !== id)
    setProducts(lista)

  }
  function hadleDeleteUser(id) {
    const lista = users.filter(filtro => filtro.id !== id)
    setUsers(lista)

  }

  function handleEditUser(user) {
    setUserEditando(user);
  }

  function handleCancelEdit() {
    setUserEditando(null);
  }

  function handleEditProduct(product) {
    setProductEditando(product);
  }

  function handleCancelEditProduct() {
    setProductEditando(null);
  }

  function handleUpdateProduct(productAtualizado) {
    setProducts(products.map(p => p.id === productAtualizado.id ? productAtualizado : p));
    setProductEditando(null);
  }

  function handleCreateProduct(newProduct) {
    setProducts([...products, newProduct]);
    setNextIdProduct(nextIdProduct + 1);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastros</Text>

      {/* Abas de Navegação */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'user' ? styles.tabButtonActive : styles.tabButtonInactive]}
          onPress={() => setActiveTab('user')}
        >
          <Text style={[styles.tabText, activeTab === 'user' ? styles.tabTextActive : styles.tabTextInactive]}>
            Usuários
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'product' ? styles.tabButtonActive : styles.tabButtonInactive]}
          onPress={() => setActiveTab('product')}
        >
          <Text style={[styles.tabText, activeTab === 'product' ? styles.tabTextActive : styles.tabTextInactive]}>
            Produtos
          </Text>
        </TouchableOpacity>
      </View>

      {/* Layout lado a lado */}
      <View style={styles.mainContent}>
        {/* Painel Esquerdo - Formulário */}
        <View style={styles.leftPanel}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'user'
              ? (userEditando ? 'Editar Usuário' : 'Novo Usuário')
              : (productEditando ? 'Editar Produto' : 'Novo Produto')}
          </Text>
          {activeTab === 'user' ? (
            <CreateUsers
              onCreateUser={handleCreateUser}
              onUpdateUser={handleUpdateUser}
              userEditando={userEditando}
              onCancelEdit={handleCancelEdit}
              nextIdUser={nextIdUser}
            />
          ) : (
            <CreateProduct 
              onCreateProduct={handleCreateProduct} 
              onUpdateProduct={handleUpdateProduct}
              productEditando={productEditando}
              onCancelEdit={handleCancelEditProduct}
              nextIdProduct={nextIdProduct} 
            />
          )}
        </View>

        {/* Painel Direito - Lista */}
        <View style={styles.rightPanel}>
          <Text style={styles.sectionTitle}>
            {activeTab === 'user' ? 'Usuários Cadastrados' : 'Produtos Cadastrados'}
          </Text>
          {activeTab === 'user' ? (
            <FlatList
              data={users}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <CardUser
                  props={item}
                  onEdit={() => handleEditUser(item)}
                  onDelete={() => hadleDeleteUser(item.id)}
                />
              )}
              style={styles.listContainer}
            />
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => (
                <CardProduct 
                  props={item} 
                  onDelete={() => hadleDeleteProduto(item.id)}
                  onEdit={() => handleEditProduct(item)}
                />
              )}
              style={styles.listContainer}
            />
          )}
        </View>
      </View>
    </View>
  );
}