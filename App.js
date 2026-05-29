import { useState, useEffect } from 'react';
import {
  Text, View, FlatList, TouchableOpacity,
  StatusBar, useWindowDimensions, ScrollView, ActivityIndicator,
} from 'react-native';
import styles, { COLORS } from './styles/styles';
import CardUser from './components/users/cardUser';
import CreateUsers from './components/users/createUsers';
import CardProduct from './components/products/cardProduct';
import CreateProduct from './components/products/createProduct';
import CreatePedido from './components/pedidos/createPedido';
import CardPedido from './components/pedidos/cardPedido';
import CardEstoque from './components/estoque/cardEstoque';
import ConfirmModal from './components/ConfirmModal';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginScreen from './screens/LoginScreen';
import Toast from './components/Toast';

const API = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';
const PEDIDO_API = process.env.EXPO_PUBLIC_PEDIDO_API_URL || 'http://localhost:3001';
const ESTOQUE_API = process.env.EXPO_PUBLIC_ESTOQUE_API_URL || 'http://localhost:3002';

function AppContent() {
  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;
  const { token, usuario, carregando, logout } = useAuth();

  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeTab, setActiveTab] = useState('user');
  const [mobileView, setMobileView] = useState('list');
  const [userEditando, setUserEditando] = useState(null);
  const [productEditando, setProductEditando] = useState(null);
  const [confirmModal, setConfirmModal] = useState({ visible: false, message: '', onConfirm: null });
  const [productError, setProductError] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [estoque, setEstoque] = useState([]);
  const [toast, setToast] = useState({ visible: false, type: 'success', message: '' });

  function showToast(type, message) {
    setToast({ visible: true, type, message });
  }

  const isAdmin = usuario?.perfil === 'admin';

  useEffect(() => {
    if (token && !isAdmin) setActiveTab('product');
  }, [token]);

  const authHeaders = token
    ? { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json' };

  async function safeFetch(url, options = {}) {
    const res = await fetch(url, options);
    if (res.status === 401) {
      await logout();
      showToast('error', 'Sessão expirada. Faça login novamente');
      return null;
    }
    return res;
  }

  useEffect(() => {
    if (!token) return;

    if (isAdmin) {
      fetch(`${API}/users`, { headers: authHeaders })
        .then(r => r.json())
        .then(data => setUsers(data))
        .catch(err => console.error('Erro ao carregar usuários:', err));
    }

    fetch(`${API}/products`)
      .then(r => { if (!r.ok) throw new Error('Erro ao carregar produtos'); return r.json(); })
      .then(data => setProducts(data))
      .catch(err => setProductError(err.message));

    fetch(`${PEDIDO_API}/pedidos`)
      .then(r => r.json())
      .then(data => setPedidos(data))
      .catch(() => {});

    fetch(`${ESTOQUE_API}/estoque`)
      .then(r => r.json())
      .then(data => setEstoque(data))
      .catch(() => {});
  }, [token]);

  // ─── Handlers de pedidos ─────────────────────────────────

  function handleCreatePedido(novoPedido) {
    fetch(`${PEDIDO_API}/pedidos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoPedido),
    })
      .then(async r => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.error || 'Erro ao criar pedido');
        return data;
      })
      .then(created => {
        setPedidos(prev => [...prev, created]);
        if (!isDesktop) setMobileView('list');
        showToast('success', 'Pedido criado com sucesso');
        setTimeout(() => {
          fetch(`${ESTOQUE_API}/estoque`).then(r => r.json()).then(data => setEstoque(data)).catch(() => {});
        }, 800);
      })
      .catch(err => showToast('error', err.message));
  }

  // ─── Handlers de usuários ────────────────────────────────

  function handleCreateUser(newUser) {
    safeFetch(`${API}/users`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(newUser),
    })
      .then(async r => {
        if (!r) return null;
        const data = await r.json();
        if (!r.ok) throw new Error(data.mensagem || data.error || 'Erro ao criar usuário');
        return data;
      })
      .then(created => {
        if (!created) return;
        setUsers(prev => [...prev, created]);
        if (!isDesktop) setMobileView('list');
        showToast('success', 'Usuário criado com sucesso');
      })
      .catch(err => showToast('error', err.message));
  }

  function handleUpdateUser(userAtualizado) {
    safeFetch(`${API}/users/${userAtualizado.id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(userAtualizado),
    })
      .then(async r => {
        if (!r) return null;
        const data = await r.json();
        if (!r.ok) throw new Error(data.mensagem || data.error || 'Erro ao atualizar usuário');
        return data;
      })
      .then(updated => {
        if (!updated) return;
        setUsers(prev => prev.map(u => u.id === updated.id ? updated : u));
        setUserEditando(null);
        if (!isDesktop) setMobileView('list');
        showToast('success', 'Usuário atualizado');
      })
      .catch(err => showToast('error', err.message));
  }

  function handleDeleteUser(id) {
    setConfirmModal({
      visible: true,
      message: 'Tem certeza que deseja excluir este usuário?',
      onConfirm: () => {
        setConfirmModal(m => ({ ...m, visible: false }));
        safeFetch(`${API}/users/${id}`, { method: 'DELETE', headers: authHeaders })
          .then(r => { if (!r) return; if (!r.ok) throw new Error('Erro ao excluir'); })
          .then(() => { setUsers(prev => prev.filter(u => u.id !== id)); showToast('success', 'Usuário excluído'); })
          .catch(err => showToast('error', err.message));
      },
    });
  }

  function handleEditUser(user) {
    setUserEditando(user);
    if (!isDesktop) setMobileView('form');
  }

  // ─── Handlers de produtos ────────────────────────────────

  function handleCreateProduct(newProduct) {
    safeFetch(`${API}/products`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify(newProduct),
    })
      .then(async r => {
        if (!r) return null;
        const data = await r.json();
        if (!r.ok) throw new Error(data.mensagem || data.error || 'Erro ao criar produto');
        return data;
      })
      .then(created => {
        if (!created) return;
        setProducts(prev => [...prev, created]);
        if (!isDesktop) setMobileView('list');
        showToast('success', 'Produto criado com sucesso');
      })
      .catch(err => showToast('error', err.message));
  }

  function handleUpdateProduct(productAtualizado) {
    safeFetch(`${API}/products/${productAtualizado.id}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify(productAtualizado),
    })
      .then(async r => {
        if (!r) return null;
        const data = await r.json();
        if (!r.ok) throw new Error(data.mensagem || data.error || 'Erro ao atualizar produto');
        return data;
      })
      .then(updated => {
        if (!updated) return;
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
        setProductEditando(null);
        if (!isDesktop) setMobileView('list');
        showToast('success', 'Produto atualizado');
      })
      .catch(err => showToast('error', err.message));
  }

  function handleDeleteProduct(id) {
    setConfirmModal({
      visible: true,
      message: 'Tem certeza que deseja excluir este produto?',
      onConfirm: () => {
        setConfirmModal(m => ({ ...m, visible: false }));
        safeFetch(`${API}/products/${id}`, { method: 'DELETE', headers: authHeaders })
          .then(r => { if (!r || !r.ok) throw new Error('Erro ao excluir'); })
          .then(() => { setProducts(prev => prev.filter(p => p.id !== id)); showToast('success', 'Produto excluído'); })
          .catch(err => showToast('error', err.message));
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

  // ─── Auth screens ─────────────────────────────────────────

  if (carregando) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={COLORS.accent} />
      </View>
    );
  }

  if (!token) {
    return <LoginScreen />;
  }

  // ─── App principal ────────────────────────────────────────

  const isUser = activeTab === 'user';
  const isPedido = activeTab === 'pedido';
  const listCount = isUser ? users.length : isPedido ? pedidos.length : products.length;

  const formContent = isUser ? (
    <CreateUsers
      onCreateUser={handleCreateUser}
      onUpdateUser={handleUpdateUser}
      userEditando={userEditando}
      onCancelEdit={handleCancelEdit}
      podeGerenciar={isAdmin}
    />
  ) : isPedido ? (
    <CreatePedido onCreatePedido={handleCreatePedido} />
  ) : (
    <CreateProduct
      onCreateProduct={handleCreateProduct}
      onUpdateProduct={handleUpdateProduct}
      productEditando={productEditando}
      onCancelEdit={handleCancelEdit}
    />
  );

  const pedidosContent = (
    <>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pedidos Realizados</Text>
        <Text style={styles.sectionCount}>{pedidos.length} {pedidos.length === 1 ? 'registro' : 'registros'}</Text>
      </View>
      <FlatList
        data={pedidos}
        keyExtractor={item => String(item.id)}
        renderItem={({ item }) => <CardPedido item={item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🛒</Text>
            <Text style={styles.emptyTitle}>Nenhum pedido ainda</Text>
            <Text style={styles.emptySubtitle}>Crie o primeiro pelo formulário</Text>
          </View>
        }
      />
      <View style={[styles.divider, { marginTop: 16 }]} />
      <View style={[styles.sectionHeader, { marginTop: 16 }]}>
        <Text style={styles.sectionTitle}>Estoque Atual</Text>
        <Text style={styles.sectionCount}>{estoque.length} produto{estoque.length !== 1 ? 's' : ''}</Text>
      </View>
      <FlatList
        data={estoque}
        keyExtractor={item => item.produto}
        renderItem={({ item }) => <CardEstoque item={item} />}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>📦</Text>
            <Text style={styles.emptyTitle}>Estoque indisponível</Text>
            <Text style={styles.emptySubtitle}>Verifique se o estoque-service está rodando</Text>
          </View>
        }
      />
    </>
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
              podeEditar={isAdmin}
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
        <>
          {productError ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Erro ao carregar produtos</Text>
              <Text style={styles.emptySubtitle}>{productError}</Text>
            </View>
          ) : (
            <FlatList
              data={products}
              keyExtractor={item => String(item.id)}
              renderItem={({ item }) => (
                <CardProduct
                  props={item}
                  onDelete={() => handleDeleteProduct(item.id)}
                  onEdit={() => handleEditProduct(item)}
                  ehProprietario={item.userId === usuario?.id}
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
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={styles.headerBadge}>
            <Text style={styles.headerBadgeText}>
              {usuario?.nome} · {usuario?.perfil}
            </Text>
          </View>
          <TouchableOpacity onPress={logout}>
            <Text style={{ color: COLORS.red, fontSize: 13 }}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs principais — admin vê ambas, usuario só produtos */}
      <View style={styles.tabContainer}>
        {isAdmin && (
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
        )}

        <TouchableOpacity
          style={[styles.tabButton, (activeTab === 'product') ? styles.tabButtonActive : styles.tabButtonInactive]}
          onPress={() => switchTab('product')}
        >
          <Text style={styles.tabIcon}>📦</Text>
          <Text style={[styles.tabText, (activeTab === 'product') ? styles.tabTextActive : styles.tabTextInactive]}>
            Produtos
          </Text>
          <Text style={[styles.tabCount, (activeTab === 'product') ? styles.tabCountActive : styles.tabCountInactive]}>
            {products.length}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, isPedido ? styles.tabButtonActive : styles.tabButtonInactive]}
          onPress={() => switchTab('pedido')}
        >
          <Text style={styles.tabIcon}>🛒</Text>
          <Text style={[styles.tabText, isPedido ? styles.tabTextActive : styles.tabTextInactive]}>
            Pedidos
          </Text>
          <Text style={[styles.tabCount, isPedido ? styles.tabCountActive : styles.tabCountInactive]}>
            {pedidos.length}
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
          <ScrollView
            style={styles.leftPanel}
            contentContainerStyle={styles.mobilePanelContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                {isUser
                  ? (userEditando ? 'Editar Usuário' : 'Novo Usuário')
                  : isPedido ? 'Novo Pedido'
                  : (productEditando ? 'Editar Produto' : 'Novo Produto')}
              </Text>
            </View>
            {formContent}
          </ScrollView>

          <ScrollView style={styles.rightPanel} showsVerticalScrollIndicator={false}>
            {isPedido ? pedidosContent : listContent}
          </ScrollView>
        </View>
      ) : (
        <View style={styles.mainContent}>
          {mobileView === 'list' ? (
            <ScrollView style={styles.mobilePanel} showsVerticalScrollIndicator={false}>
              {isPedido ? pedidosContent : listContent}
            </ScrollView>
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

      <Toast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        onHide={() => setToast(t => ({ ...t, visible: false }))}
      />
    </View>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
