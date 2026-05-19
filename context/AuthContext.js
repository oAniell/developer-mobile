import { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

const API = 'http://localhost:3000';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    async function restaurarSessao() {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        if (!storedToken) { setCarregando(false); return; }

        const payload = jwtDecode(storedToken);
        if (payload.exp * 1000 < Date.now()) {
          await AsyncStorage.removeItem('token');
          setCarregando(false);
          return;
        }

        setToken(storedToken);
        setUsuario({ id: payload.id, nome: payload.nome, perfil: payload.perfil });
      } catch (err) {
        console.error('Erro ao restaurar sessão:', err);
        await AsyncStorage.removeItem('token').catch(() => {});
      } finally {
        setCarregando(false);
      }
    }
    restaurarSessao();
  }, []);

  async function login(email, senha) {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.mensagem || 'Erro ao fazer login');

    const payload = jwtDecode(data.token);
    await AsyncStorage.setItem('token', data.token);
    setToken(data.token);
    setUsuario({ id: payload.id, nome: payload.nome, perfil: payload.perfil });
  }

  async function logout() {
    await AsyncStorage.removeItem('token');
    setToken(null);
    setUsuario(null);
  }

  async function registrar(dados) {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });
    const data = await res.json();
    if (!res.ok) throw Object.assign(new Error(data.mensagem || 'Erro ao cadastrar'), { status: res.status });
    return data;
  }

  return (
    <AuthContext.Provider value={{ token, usuario, carregando, login, logout, registrar }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
