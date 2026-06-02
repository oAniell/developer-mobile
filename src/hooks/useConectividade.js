import { useState, useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';

export function useConectividade() {
  const [isConnected, setIsConnected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
      setIsLoading(false);
    });
    return unsubscribe;
  }, []);

  return { isConnected, isLoading };
}
