import { View, Text, TouchableOpacity } from 'react-native';
import styles, { COLORS } from '../../styles/styles';

export default function CardProduct({ props, onDelete, onEdit }) {
  const initials = props.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleDelete = () => {
    console.log('Excluir produto:', props.id);
    if (onDelete) onDelete();
  };

  const handleEdit = () => {
    console.log('Editar produto:', props.id);
    if (onEdit) onEdit();
  };

  return (
    <View style={styles.card}>
      <View style={[styles.cardAvatar, styles.cardAvatarProduct]}>
        <Text style={styles.cardAvatarText}>{initials}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardId}>#{props.id}</Text>
        <Text style={styles.cardName}>{props.name}</Text>
        <Text style={styles.cardPrice}>R$ {props.price.toFixed(2)}</Text>
        <Text style={styles.cardDescription}>{props.description}</Text>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity 
          style={[styles.actionButton, styles.editButton]} 
          onPress={handleEdit}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.actionButtonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.actionButton, styles.deleteButton]} 
          onPress={handleDelete}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}