import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/styles';

export default function CardProduct({ props, onDelete, onEdit }) {
  const initials = props.name
    .split(' ')
    .slice(0, 2)
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <View style={styles.card}>
      <View style={[styles.cardAvatar, styles.cardAvatarProduct]}>
        <Text style={[styles.cardAvatarText, styles.cardAvatarTextProduct]}>{initials}</Text>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardId}>ID #{props.id}</Text>
        <Text style={styles.cardName} numberOfLines={1}>{props.name}</Text>
        <Text style={styles.cardPrice}>R$ {Number(props.price).toFixed(2)}</Text>
        <Text style={styles.cardDescription} numberOfLines={1}>{props.description}</Text>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity
          style={[styles.actionButton, styles.editButton]}
          onPress={onEdit}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.actionButtonText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionButton, styles.deleteButton]}
          onPress={onDelete}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Text style={styles.actionButtonText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
