import { View, Text } from 'react-native';
import styles, { COLORS } from '../../styles/styles';

export default function CardPedido({ item }) {
  const initials = item.produto.slice(0, 2).toUpperCase();

  return (
    <View style={styles.card}>
      <View style={[styles.cardAvatar, { backgroundColor: COLORS.accentGlow, borderColor: COLORS.accent + '40' }]}>
        <Text style={[styles.cardAvatarText, { color: COLORS.accent }]}>{initials}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardId}>Pedido #{item.id}</Text>
        <Text style={styles.cardName}>{item.produto}</Text>
        <Text style={styles.cardDescription}>Qtd: {item.quantidade}</Text>
      </View>
    </View>
  );
}
