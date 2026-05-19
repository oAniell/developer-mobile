import { useEffect, useRef } from 'react';
import { Animated, Text, View, StyleSheet } from 'react-native';
import { COLORS } from '../styles/styles';

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
    <Animated.View style={[styles.container, { opacity }]}>
      <View style={[styles.toast, isSuccess ? styles.success : styles.error]}>
        <Text style={styles.icon}>{isSuccess ? '✓' : '✕'}</Text>
        <Text style={styles.message}>{message}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 32,
    right: 16,
    zIndex: 999,
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  success: { backgroundColor: '#1a3a2a', borderWidth: 1, borderColor: COLORS.green },
  error:   { backgroundColor: '#3a1a1a', borderWidth: 1, borderColor: COLORS.red },
  icon: { fontSize: 16, fontWeight: '700', color: COLORS.text },
  message: { color: COLORS.text, fontSize: 14, fontWeight: '500' },
});
