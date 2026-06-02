import { useRef, useState } from 'react';
import { getPedidosPendentes, updateStatusPedido } from '../database/pedidosRepository';

const PEDIDO_API = process.env.EXPO_PUBLIC_PEDIDO_API_URL || 'http://localhost:3001';

export function useSincronizador({ isConnected, showToast, onPedidosUpdated }) {
  const [sincronizando, setSincronizando] = useState(false);
  const sincronizandoRef = useRef(false);

  async function sincronizar() {
    if (sincronizandoRef.current) return;
    sincronizandoRef.current = true;
    setSincronizando(true);

    let sucessos = 0;
    try {
      const pendentes = await getPedidosPendentes();

      for (const pedido of pendentes) {
        await updateStatusPedido(pedido.id, 'SINCRONIZANDO').catch(() => {});

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 10000);

        try {
          const res = await fetch(`${PEDIDO_API}/pedidos`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              produto: pedido.produto,
              quantidade: pedido.quantidade,
            }),
            signal: controller.signal,
          });
          clearTimeout(timeout);

          if (res.status === 201) {
            await updateStatusPedido(pedido.id, 'SINCRONIZADO');
            sucessos++;
          } else {
            let erroMsg = 'Erro do servidor';
            try {
              const data = await res.json();
              erroMsg = data.error || data.mensagem || erroMsg;
            } catch (_) {}
            await updateStatusPedido(pedido.id, 'ERRO', erroMsg);
          }
        } catch (err) {
          clearTimeout(timeout);
          const erroMsg = err.name === 'AbortError' ? 'Timeout na requisição' : err.message;
          await updateStatusPedido(pedido.id, 'ERRO', erroMsg);
        }
      }

      if (sucessos > 0) {
        showToast('success', `${sucessos} pedido(s) sincronizado(s)`);
      }
      if (onPedidosUpdated) await onPedidosUpdated();
    } catch (err) {
      console.warn('Erro no ciclo de sincronização:', err);
    } finally {
      sincronizandoRef.current = false;
      setSincronizando(false);
    }
  }

  async function retryPedido(id) {
    await updateStatusPedido(id, 'PENDENTE');
    // aguarda ciclo atual terminar antes de disparar novo
    while (sincronizandoRef.current) {
      await new Promise(r => setTimeout(r, 100));
    }
    await sincronizar();
  }

  return { sincronizar, retryPedido, sincronizando };
}
