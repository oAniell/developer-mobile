import { View, Text } from 'react-native';
import styles from '../../styles/styles';

export default function CardUser({ props }) {
  const initials = props.name.split(' ').map(n => n[0]).join('').toUpperCase();

  return (
    <View style={styles.card}>
      <View style={styles.cardAvatar}>
        <Text style={styles.cardAvatarText}>{initials}</Text>
      </View>
      <View>
        <Text style={styles.cardId}>#{props.id}</Text>
        <Text style={styles.cardName}>{props.name}</Text>
        <Text style={styles.cardEmail}>{props.email}</Text>
      </View>
    </View>
  );
}