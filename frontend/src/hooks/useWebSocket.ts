import { useEffect, useRef, useCallback, useState } from 'react';
import { useCurrentUser } from './useAuth';
import { config } from '@/config/env';

interface WebSocketMessage {
  id: string;
  sender: {
    id: string;
    firstName: string;
    lastName: string;
  };
  recipient: {
    id: string;
    firstName: string;
    lastName: string;
  };
  content: string;
  isRead: boolean;
  createdAt: string;
  projectId?: string;
}

interface UseWebSocketOptions {
  onMessage?: (message: WebSocketMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
  onError?: (error: any) => void;
}

/**
 * Hook to manage WebSocket connection for real-time messaging
 */
export const useWebSocket = (options: UseWebSocketOptions = {}) => {
  const { data: user } = useCurrentUser();
  const clientRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const reconnectAttemptsRef = useRef(0);
  const maxReconnectAttemptsRef = useRef(5);

   const getWebSocketUrl = useCallback((): string => {
     const wsUrl = config.wsUrl;
     if (wsUrl.startsWith('ws')) {
       return wsUrl;
     }
     const protocol = config.apiBaseUrl.startsWith('https') ? 'wss' : 'ws';
     const baseUrl = config.apiBaseUrl.replace('/api', '').replace(/^https?:\/\//, '');
     return `${protocol}://${baseUrl}/ws`;
   }, []);

   const connect = useCallback(() => {
     if (!user?.id) return;

     // Prevent multiple connection attempts
     if (clientRef.current?.active || isConnecting) return;

     setIsConnecting(true);

     try {
       // Dynamically import stomp client (it's browser-only)
       import('@stomp/stompjs').then((StompLib) => {
         import('sockjs-client').then((SockJSLib) => {
           const socket = new SockJSLib.default(getWebSocketUrl());
          const stompClient = StompLib.Stomp.over(socket);

          // Connect to WebSocket with JWT token
          const token = localStorage.getItem('accessToken');

          stompClient.connect(
            { Authorization: `Bearer ${token}` },
            () => {
              // Connection successful
              setIsConnected(true);
              setIsConnecting(false);
              reconnectAttemptsRef.current = 0;

              // Subscribe to message queue
              stompClient.subscribe(`/user/${user.id}/queue/messages`, (frame: any) => {
                try {
                  const message = JSON.parse(frame.body);
                  options.onMessage?.(message);
                } catch (error) {
                  console.error('Error parsing WebSocket message:', error);
                }
              });

              options.onConnect?.();
            },
            (error: any) => {
              console.error('WebSocket connection error:', error);
              setIsConnected(false);
              setIsConnecting(false);
              options.onError?.(error);

              // Attempt to reconnect
              if (reconnectAttemptsRef.current < maxReconnectAttemptsRef.current) {
                reconnectAttemptsRef.current += 1;
                const delay = Math.min(1000 * Math.pow(2, reconnectAttemptsRef.current), 30000);
                setTimeout(() => {
                  connect();
                }, delay);
              }
            }
          );

          clientRef.current = stompClient;
        });
      });
    } catch (error) {
       console.error('Failed to initialize WebSocket:', error);
       setIsConnecting(false);
       options.onError?.(error);
     }
   }, [user?.id, isConnecting, options, getWebSocketUrl]);

  const disconnect = useCallback(() => {
    if (clientRef.current?.connected) {
      clientRef.current.disconnect(() => {
        setIsConnected(false);
        options.onDisconnect?.();
      });
    }
  }, [options]);

  const sendMessage = useCallback(
    (destination: string, message: any) => {
      if (clientRef.current?.connected) {
        clientRef.current.send(destination, {}, JSON.stringify(message));
      } else {
        console.warn('WebSocket is not connected');
      }
    },
    []
  );

  const subscribe = useCallback(
    (destination: string, callback: (frame: any) => void) => {
      if (clientRef.current?.connected) {
        return clientRef.current.subscribe(destination, callback);
      }
    },
    []
  );

  // Auto-connect on mount
  useEffect(() => {
    if (user && !clientRef.current?.connected) {
      connect();
    }

    return () => {
      // Don't disconnect on unmount - keep connection alive for app
    };
  }, [user, connect]);

  return {
    isConnected,
    isConnecting,
    connect,
    disconnect,
    sendMessage,
    subscribe,
  };
};

/**
 * Global WebSocket hook - use at app level to maintain single connection
 */
export const useGlobalWebSocket = (options: UseWebSocketOptions = {}) => {
  return useWebSocket(options);
};
