import { useState } from 'react';
import { Text, View, FlatList, TouchableOpacity } from 'react-native';
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

  function handleCreateUser(newUser) {
    setUsers([...users, newUser]);
    setNextIdUser(nextIdUser + 1);
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
            {activeTab === 'user' ? 'Novo Usuário' : 'Novo Produto'}
          </Text>
          {activeTab === 'user' ? (
            <CreateUsers onCreateUser={handleCreateUser} nextIdUser={nextIdUser} />
          ) : (
            <CreateProduct onCreateProduct={handleCreateProduct} nextIdProduct={nextIdProduct} />
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
              renderItem={({ item }) => <CardUser props={item} />}
              style={styles.listContainer}
            />
          ) : (
            <FlatList
              data={products}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => <CardProduct props={item} />}
              style={styles.listContainer}
            />
          )}
        </View>
      </View>
    </View>
   );
}