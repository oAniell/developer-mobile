import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import styles from '../styles/styles';

export default function Toast({ visible, type = 'success', message, onHide }) {
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;
    Animated.sequence([
      Animated.timing(opacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(2500),
      Animated.timing(opacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]).start(() => onHide && onHide());
  }, [visible, message]);

  if (!visible) return null;

  const isSuccess = type === 'success';

  return (
    <Animated.View style={[styles.toastContainer, { opacity }]}>
      <View style={[styles.toast, isSuccess ? styles.toastSuccess : styles.toastError]}>
        <Text style={styles.toastIcon}>{isSuccess ? '✓' : '✕'}</Text>
        <Text style={styles.toastMessage}>{message}</Text>
      </View>
    </Animated.View>
  );
}
