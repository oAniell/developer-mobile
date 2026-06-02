import { View, Text, TouchableOpacity } from 'react-native';
import styles, { COLORS } from '../../styles/styles';

const STATUS_CONFIG = {
  PENDENTE:      { label: '⏳ Pendente',      color: COLORS.textMuted },
  SINCRONIZANDO: { label: '🔄 Sincronizando', color: COLORS.accent },
  SINCRONIZADO:  { label: '✅ Sincronizado',   color: COLORS.green },
  ERRO:          { label: '❌ Erro',           color: COLORS.red },
};

export default function CardPedido({ item, onRetry }) {
  const initials = item.produto.slice(0, 2).toUpperCase();
  const { label, color } = STATUS_CONFIG[item.status] ?? STATUS_CONFIG.PENDENTE;

  return (
    <View style={styles.card}>
      <View style={[styles.cardAvatar, { backgroundColor: COLORS.accentGlow, borderColor: COLORS.accent + '40' }]}>
        <Text style={[styles.cardAvatarText, { color: COLORS.accent }]}>{initials}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardId}>Pedido #{item.id}</Text>
        <Text style={styles.cardName}>{item.produto}</Text>
        <Text style={styles.cardDescription}>Qtd: {item.quantidade}</Text>
        <Text style={[styles.syncStatus, { color }]}>{label}</Text>
        {item.status === 'ERRO' && item.erro_msg && (
          <Text style={styles.syncError}>{item.erro_msg}</Text>
        )}
        {item.status === 'ERRO' && onRetry && (
          <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Tentar novamente</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
