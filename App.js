import { useState, useEffect } from 'react';
import { Text, View, FlatList, TouchableOpacity, Alert } from 'react-native';
import styles from './styles/styles';
import CardUser from './components/users/cardUser';
import CreateUsers from './components/users/createUsers';
import CardProduct from './components/products/cardProduct';
import CreateProduct from './components/products/createProduct';

export default function App() {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [nextIdUser, setNextIdUser] = useState(1);
  const [nextIdProduct, setNextIdProduct] = useState(1);
  const [activeTab, setActiveTab] = useState('user');
  const [userEditando, setUserEditando] = useState(null);
  const [productEditando, setProductEditando] = useState(null);

  // Carrega dados da API ao iniciar
  useEffect(() => {
    fetch('http://localhost:3001/users')
      .then(r => r.json())
      .then(data => {
        setUsers(data);
        if (data.length > 0) setNextIdUser(Math.max(...data.map(u => u.id)) + 1);
      })
      .catch(() => {});

    fetch('http://localhost:3001/products')
      .then(r => r.json())
      .then(data => {
        setProducts(data);
        if (data.length > 0) setNextIdProduct(Math.max(...data.map(p => p.id)) + 1);
      })
      .catch(() => {});
  }, []);

  // --- Usuários ---
  function handleCreateUser(newUser) {
    setUsers([...users, newUser]);
    setNextIdUser(nextIdUser + 1);
  }

  function handleUpdateUser(userAtualizado) {
    setUsers(users.map(u => u.id === userAtualizado.id ? userAtualizado : u));
    setUserEditando(null);
    fetch(`http://localhost:3001/users/${userAtualizado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userAtualizado)
    })
      .then(r => { if (!r.ok) throw new Error('Erro ao atualizar usuário'); return r.json(); })
      .catch(error => Alert.alert('Erro', error.message));
  }

  function handleDeleteUser(id) {
    setUsers(users.filter(u => u.id !== id));
    fetch(`http://localhost:3001/users/${id}`, { method: 'DELETE' })
      .catch(error => Alert.alert('Erro', error.message));
  }

  function handleEditUser(user) { setUserEditando(user); }
  function handleCancelEdit() { setUserEditando(null); }

  // --- Produtos ---
  function handleCreateProduct(newProduct) {
    setProducts([...products, newProduct]);
    setNextIdProduct(nextIdProduct + 1);
  }

  function handleUpdateProduct(productAtualizado) {
    setProducts(products.map(p => p.id === productAtualizado.id ? productAtualizado : p));
    setProductEditando(null);
    fetch(`http://localhost:3001/products/${productAtualizado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productAtualizado)
    })
      .then(r => { if (!r.ok) throw new Error('Erro ao atualizar produto'); return r.json(); })
      .catch(error => Alert.alert('Erro', error.message));
  }

  function handleDeleteProduct(id) {
    setProducts(products.filter(p => p.id !== id));
    fetch(`http://localhost:3001/products/${id}`, { method: 'DELETE' })
      .catch(error => Alert.alert('Erro', error.message));
  }

  function handleEditProduct(product) { setProductEditando(product); }
  function handleCancelEditProduct() { setProductEditando(null); }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastros</Text>

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

      <View style={styles.mainContent}>
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
                  onDelete={() => handleDeleteUser(item.id)}
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
                  onDelete={() => handleDeleteProduct(item.id)}
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
