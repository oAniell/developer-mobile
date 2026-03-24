import { useState } from 'react';
import { Text, View, FlatList } from 'react-native';
import styles from './styles/styles';
import CardUser from './components/cardUser';
import CreateUsers from './components/createUsers';

const initialDb = [
  { id: 1, name: 'John Doe', email: 'john.doe@example.com' },
  { id: 2, name: 'Jane Smith', email: 'jane.smith@example.com' },
  { id: 3, name: 'Alice Johnson', email: 'alice.johnson@example.com' }
];

export default function App() {
  const [users, setUsers] = useState(initialDb);
  const [nextId, setNextId] = useState(4);

  function handleCreateUser(newUser) {
    setUsers([...users, newUser]);
    setNextId(nextId + 1);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Aula 02</Text>
      <CreateUsers onCreateUser={handleCreateUser} nextId={nextId} />
      <FlatList
        data={users}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => <CardUser props={item} />}
      />
      
    </View>
  );
}