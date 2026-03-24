import { View, Text } from 'react-native';
import styles, { COLORS } from '../../styles/styles';

export default function CardProduct({ props }) {
  const initials = props.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <View style={styles.card}>
      <View style={[styles.cardAvatar, styles.cardAvatarProduct]}>
        <Text style={styles.cardAvatarText}>{initials}</Text>
      </View>
      <View>
        <Text style={styles.cardId}>#{props.id}</Text>
        <Text style={styles.cardName}>{props.name}</Text>
        <Text style={styles.cardPrice}>R$ {props.price.toFixed(2)}</Text>
        <Text style={styles.cardDescription}>{props.description}</Text>
      </View>
    </View>
  );
}