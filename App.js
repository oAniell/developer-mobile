import { useState, useEffect } from 'react';
import {
  Text, View, FlatList, TouchableOpacity,
  StatusBar, useWindowDimensions, ScrollView, Alert,
} from 'react-native';
import styles, { COLORS } from './styles/styles';
import CardUser from './components/users/cardUser';
import CreateUsers from './components/users/createUsers';
import CardProduct from './components/products/cardProduct';
import CreateProduct from './components/products/createProduct';
import ConfirmModal from './components/ConfirmModal';


export default function App() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('user');
  const [mobileView, setMobileView] = useState('list');
  const [userEditando, setUserEditando] = useState(null);
  const [productEditando, setProductEditando] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ visible: false, message: '', onConfirm: null });

  useEffect(() => {
    fetch('http://localhost:3000/users')
      .then(res => res.json())
      .then(data => setUsers(data))
      .catch(err => console.error('Erro ao carregar usuários:', err));

    fetch('http://localhost:3000/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => console.error('Erro ao carregar produtos:', err));
  }, []);

  // ─── Handlers ────────────────────────────────────────────

  function handleCreateUser(newUser) {
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
      .then(r => { if (!r.ok) throw new Error('Erro ao criar usuário'); return r.json(); })
      .then(created => {
        setUsers(prev => [...prev, created]);
        if (!isDesktop) setMobileView('list');
      })
      .catch(err => Alert.alert('Erro', err.message));
  }

  function handleUpdateUser(userAtualizado) {
    fetch(`http://localhost:3000/users/${userAtualizado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userAtualizado),
    })
      .then(r => { if (!r.ok) throw new Error('Erro ao atualizar usuário'); return r.json(); })
      .then(updated => {
        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
        setUserEditando(null);
        if (!isDesktop) setMobileView('list');
      })
      .catch(err => Alert.alert('Erro', err.message));
  }

  function handleDeleteUser(id) {
    setConfirmModal({
      visible: true,
      message: 'Tem certeza que deseja excluir este usuário?',
      onConfirm: () => {
        setConfirmModal(m => ({ ...m, visible: false }));
        fetch(`http://localhost:3000/users/${id}`, { method: 'DELETE' })
          .then(r => { if (!r.ok) throw new Error('Erro ao excluir usuário'); })
          .then(() => setUsers(prev => prev.filter(u => u.id !== id)))
          .catch(err => console.error('Erro delete user:', err));
      },
    });
  }

  function handleEditUser(user) {
    setUserEditando(user);
    if (!isDesktop) setMobileView('form');
  }

  function handleCreateProduct(newProduct) {
    fetch('http://localhost:3000/products', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newProduct),
    })
      .then(r => { if (!r.ok) throw new Error('Erro ao criar produto'); return r.json(); })
      .then(created => {
        setProducts(prev => [...prev, created]);
        if (!isDesktop) setMobileView('list');
      })
      .catch(err => Alert.alert('Erro', err.message));
  }

  function handleUpdateProduct(productAtualizado) {
    fetch(`http://localhost:3000/products/${productAtualizado.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productAtualizado),
    })
      .then(r => { if (!r.ok) throw new Error('Erro ao atualizar produto'); return r.json(); })
      .then(updated => {
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        setProductEditando(null);
        if (!isDesktop) setMobileView('list');
      })
      .catch(err => Alert.alert('Erro', err.message));
  }

  function handleDeleteProduct(id) {
    setConfirmModal({
      visible: true,
      message: 'Tem certeza que deseja excluir este produto?',
      onConfirm: () => {
        setConfirmModal(m => ({ ...m, visible: false }));
        fetch(`http://localhost:3000/products/${id}`, { method: 'DELETE' })
          .then(r => { if (!r.ok) throw new Error('Erro ao excluir produto'); })
          .then(() => setProducts(prev => prev.filter(p => p.id !== id)))
          .catch(err => console.error('Erro delete product:', err));
      },
    });
  }

  function handleEditProduct(product) {
    setProductEditando(product);
    if (!isDesktop) setMobileView('form');
  }

  function handleCancelEdit() {
    setUserEditando(null);
    setProductEditando(null);
    if (!isDesktop) setMobileView('list');
  }

  function switchTab(tab) {
    setActiveTab(tab);
    setUserEditando(null);
    setProductEditando(null);
    setMobileView('list');
  }

  // ─── Derived ─────────────────────────────────────────────

  const isUser = activeTab === 'user';
  const listCount = isUser ? users.length : products.length;

  // ─── Render ──────────────────────────────────────────────

  const formContent = isUser ? (
    <CreateUsers
      onCreateUser={handleCreateUser}
      onUpdateUser={handleUpdateUser}
      userEditando={userEditando}
      onCancelEdit={handleCancelEdit}
    />
  ) : (
    <CreateProduct
      onCreateProduct={handleCreateProduct}
      onUpdateProduct={handleUpdateProduct}
      productEditando={productEditando}
      onCancelEdit={handleCancelEdit}
    />
  );

  const listContent = (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>
          {isUser ? 'Usuários Cadastrados' : 'Produtos Cadastrados'}
        </Text>
        <Text style={styles.sectionCount}>
          {listCount} {listCount === 1 ? 'registro' : 'registros'}
        </Text>
      </View>

      {isUser ? (
        <FlatList
          data={users}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <CardUser
              props={item}
              onEdit={() => handleEditUser(item)}
              onDelete={() => handleDeleteUser(item.id)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>👤</Text>
              <Text style={styles.emptyTitle}>Nenhum usuário ainda</Text>
              <Text style={styles.emptySubtitle}>
                {isDesktop ? 'Crie o primeiro pelo formulário ao lado' : 'Toque em "+ Novo" para começar'}
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => String(item.id)}
          renderItem={({ item }) => (
            <CardProduct
              props={item}
              onDelete={() => handleDeleteProduct(item.id)}
              onEdit={() => handleEditProduct(item)}
            />
          )}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Text style={styles.emptyIcon}>📦</Text>
              <Text style={styles.emptyTitle}>Nenhum produto ainda</Text>
              <Text style={styles.emptySubtitle}>
                {isDesktop ? 'Crie o primeiro pelo formulário ao lado' : 'Toque em "+ Novo" para começar'}
              </Text>
            </View>
          }
        />
      )}
    </>
  );

  
  
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.headerDot} />
          <Text style={styles.title}>Cadastros</Text>
        </View>
        <View style={styles.headerBadge}>
          <Text style={styles.headerBadgeText}>
            {users.length} usuários · {products.length} produtos
          </Text>
        </View>
      </View>

      {/* Tabs principais */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, isUser ? styles.tabButtonActive : styles.tabButtonInactive]}
          onPress={() => switchTab('user')}
        >
          <Text style={styles.tabIcon}>👤</Text>
          <Text style={[styles.tabText, isUser ? styles.tabTextActive : styles.tabTextInactive]}>
            Usuários
          </Text>
          <Text style={[styles.tabCount, isUser ? styles.tabCountActive : styles.tabCountInactive]}>
            {users.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, !isUser ? styles.tabButtonActive : styles.tabButtonInactive]}
          onPress={() => switchTab('product')}
        >
          <Text style={styles.tabIcon}>📦</Text>
          <Text style={[styles.tabText, !isUser ? styles.tabTextActive : styles.tabTextInactive]}>
            Produtos
          </Text>
          <Text style={[styles.tabCount, !isUser ? styles.tabCountActive : styles.tabCountInactive]}>
            {products.length}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Mobile: sub-nav Lista / Formulário */}
      {!isDesktop && (
        <View style={styles.mobileSubNav}>
          <TouchableOpacity
            style={[styles.mobileSubNavBtn, mobileView === 'list' && styles.mobileSubNavBtnActive]}
            onPress={() => { setMobileView('list'); setUserEditando(null); setProductEditando(null); }}
          >
            <Text style={[styles.mobileSubNavText, mobileView === 'list' && styles.mobileSubNavTextActive]}>
              Lista
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.mobileSubNavBtn, mobileView === 'form' && styles.mobileSubNavBtnActive]}
            onPress={() => setMobileView('form')}
          >
            <Text style={[styles.mobileSubNavText, mobileView === 'form' && styles.mobileSubNavTextActive]}>
              {userEditando || productEditando ? '✏️ Editar' : '+ Novo'}
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Conteúdo principal */}
      {isDesktop ? (
        <View style={styles.mainContent}>
          {/* Painel esquerdo — formulário */}
          <ScrollView
            style={styles.leftPanel}
            contentContainerStyle={styles.mobilePanelContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {isUser
                  ? (userEditando ? 'Editar Usuário' : 'Novo Usuário')
                  : (productEditando ? 'Editar Produto' : 'Novo Produto')}
              </Text>
            </View>
            {formContent}
          </ScrollView>

          {/* Painel direito — lista */}
          <View style={styles.rightPanel}>
            {listContent}
          </View>
        </View>
      ) : (
        <View style={styles.mainContent}>
          {mobileView === 'list' ? (
            <View style={styles.mobilePanel}>
              {listContent}
            </View>
          ) : (
            <ScrollView
              style={styles.mobilePanel}
              contentContainerStyle={styles.mobilePanelContent}
              showsVerticalScrollIndicator={false}
            >
              {formContent}
            </ScrollView>
          )}
        </View>
      )}

      <ConfirmModal
        visible={confirmModal.visible}
        title="Confirmar Exclusão"
        message={confirmModal.message}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal(m => ({ ...m, visible: false }))}
      />
    </View>
  );
}
