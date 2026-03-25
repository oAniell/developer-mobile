import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../../styles/styles';

export default function CardUser({ props, onEdit, onDelete }) {
  const initials = props.name.split(' ').map(n => n[0]).join('').toUpperCase();

  const handleEdit = () => {
    console.log('Editar usuário:', props.id);
    if (onEdit) onEdit();
  };

  const hadleDeleteUser = () => {
    console.log('Excluir usuário:', props.id);
    if (onDelete) onDelete();
  };

  return (
    <View style={styles.card}>
      <View style={styles.cardAvatar}>
        <Text style={styles.cardAvatarText}>{initials}</Text>
      </View>
      <View style={styles.cardInfo}>
        <Text style={styles.cardId}>#{props.id}</Text>
        <Text style={styles.cardName}>{props.name}</Text>
        <Text style={styles.cardEmail}>{props.email}</Text>
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
          onPress={hadleDeleteUser}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.actionButtonText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}