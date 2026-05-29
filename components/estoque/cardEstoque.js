import { View, Text } from 'react-native';
import styles, { COLORS } from '../../styles/styles';

export default function CardEstoque({ item }) {
  const initials = item.produto.slice(0, 2).toUpperCase();
  const qtd = item.quantidade;
  const cor = qtd <= 0 ? COLORS.red : qtd <= 5 ? COLORS.yellow : COLORS.green;
  const corSoft = qtd <= 0 ? COLORS.redSoft : qtd <= 5 ? 'rgba(251,191,36,0.12)' : COLORS.greenSoft;

  return (
    <View style={styles.card}>
      <View style={[styles.cardAvatar, { backgroundColor: corSoft, borderColor: cor + '40' }]}>
        <Text style={[styles.cardAvatarText, { color: cor }]}>{initials}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{item.produto}</Text>
        <Text style={[styles.cardPrice, { color: cor }]}>
          {qtd} unidade{qtd !== 1 ? 's' : ''}
        </Text>
      </View>
    </View>
  );
}
