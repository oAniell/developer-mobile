import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Chaves do AsyncStorage
const KEYS = {
  pedidos: '@offline:pedidos',
  produtos: '@offline:produtos',
};

// ─── Web: AsyncStorage ────────────────────────────────────────

async function readJSON(key) {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function writeJSON(key, data) {
  await AsyncStorage.setItem(key, JSON.stringify(data));
}

// ─── Interface unificada ──────────────────────────────────────

export const storage = {
  async init() {
    // AsyncStorage não precisa de inicialização
  },

  // Pedidos
  async insertPedido(pedido) {
    const todos = await readJSON(KEYS.pedidos);
    todos.push(pedido);
    await writeJSON(KEYS.pedidos, todos);
  },

  async getAllPedidos() {
    const todos = await readJSON(KEYS.pedidos);
    return todos.sort((a, b) => a.created_at - b.created_at);
  },

  async getPedidosPendentes() {
    const todos = await readJSON(KEYS.pedidos);
    return todos
      .filter(p => p.status === 'PENDENTE' || p.status === 'ERRO')
      .sort((a, b) => a.created_at - b.created_at);
  },

  async updateStatusPedido(id, status, erroMsg) {
    const todos = await readJSON(KEYS.pedidos);
    const idx = todos.findIndex(p => p.id === id);
    if (idx >= 0) {
      todos[idx].status = status;
      todos[idx].erro_msg = erroMsg ?? null;
      await writeJSON(KEYS.pedidos, todos);
    }
  },

  // Produtos
  async saveProductsCache(produtos) {
    await writeJSON(KEYS.produtos, produtos);
  },

  async getProductsCache() {
    return readJSON(KEYS.produtos);
  },

  async isProductsCacheEmpty() {
    const produtos = await readJSON(KEYS.produtos);
    return produtos.length === 0;
  },
};
