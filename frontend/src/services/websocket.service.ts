import { Client, IMessage } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { WebSocketMessage, WebSocketNotification } from '@/types/api';

class WebSocketService {
  private client: Client | null = null;
  private isConnected = false;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectInterval = 5000;

  private getWebSocketUrl(): string {
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8081/ws';
    
    if (typeof wsUrl === 'string' && wsUrl.startsWith('ws')) {
      return wsUrl;
    }
    
    const apiUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api';
    const baseUrl = apiUrl.replace('/api', '');
    const protocol = baseUrl.startsWith('https') ? 'wss' : 'ws';
    
    return `${protocol}://${baseUrl.replace(/^https?:\/\//, '')}/ws`;
  }

  connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.isConnected) {
        resolve();
        return;
      }

      const wsUrl = this.getWebSocketUrl();
      const token = localStorage.getItem('accessToken');

      this.client = new Client({
        webSocketFactory: () => {
          return new SockJS(wsUrl);
        },
        connectHeaders: {
          Authorization: `Bearer ${token}`,
        },
        debug: (str) => {
          console.log('WebSocket Debug:', str);
        },
        onConnect: () => {
          console.log('WebSocket connected');
          this.isConnected = true;
          this.reconnectAttempts = 0;
          this.subscribeToTopics();
          resolve();
        },
        onStompError: (frame) => {
          console.error('WebSocket STOMP error:', frame);
          this.isConnected = false;
          reject(frame);
        },
        onWebSocketError: (error) => {
          console.error('WebSocket error:', error);
          this.isConnected = false;
          this.handleReconnect();
          reject(error);
        },
        onDisconnect: () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
          this.handleReconnect();
        },
      });

      this.client.activate();
    });
  }

  private subscribeToTopics(): void {
    if (!this.client || !this.isConnected) return;

    // Subscribe to private messages
    this.client.subscribe('/user/queue/messages', (message: IMessage) => {
      const data = JSON.parse(message.body);
      this.handleMessage(data);
    });

    // Subscribe to notifications
    this.client.subscribe('/user/queue/notifications', (message: IMessage) => {
      const notification: WebSocketNotification = JSON.parse(message.body);
      this.handleNotification(notification);
    });

    // Subscribe to project updates
    this.client.subscribe('/topic/projects', (message: IMessage) => {
      const data = JSON.parse(message.body);
      this.handleProjectUpdate(data);
    });

    // Subscribe to proposal updates
    this.client.subscribe('/topic/proposals', (message: IMessage) => {
      const data = JSON.parse(message.body);
      this.handleProposalUpdate(data);
    });

    // Subscribe to contract updates
    this.client.subscribe('/topic/contracts', (message: IMessage) => {
      const data = JSON.parse(message.body);
      this.handleContractUpdate(data);
    });
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    console.log(`Attempting to reconnect... (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

    setTimeout(() => {
      this.connect().catch((error) => {
        console.error('Reconnection failed:', error);
      });
    }, this.reconnectInterval);
  }

  private handleMessage(data: any): void {
    // Emit custom event for message updates
    window.dispatchEvent(new CustomEvent('websocket:message', { detail: data }));
  }

  private handleNotification(notification: WebSocketNotification): void {
    // Emit custom event for notification updates
    window.dispatchEvent(new CustomEvent('websocket:notification', { detail: notification }));
  }

  private handleProjectUpdate(data: any): void {
    // Emit custom event for project updates
    window.dispatchEvent(new CustomEvent('websocket:project', { detail: data }));
  }

  private handleProposalUpdate(data: any): void {
    // Emit custom event for proposal updates
    window.dispatchEvent(new CustomEvent('websocket:proposal', { detail: data }));
  }

  private handleContractUpdate(data: any): void {
    // Emit custom event for contract updates
    window.dispatchEvent(new CustomEvent('websocket:contract', { detail: data }));
  }

  sendMessage(destination: string, body: any): void {
    if (this.client && this.isConnected) {
      this.client.publish({
        destination,
        body: JSON.stringify(body),
      });
    } else {
      console.warn('WebSocket not connected. Cannot send message.');
    }
  }

  disconnect(): void {
    if (this.client) {
      this.client.deactivate();
      this.client = null;
      this.isConnected = false;
    }
  }

  isWebSocketConnected(): boolean {
    return this.isConnected;
  }
}

// Create singleton instance
export const websocketService = new WebSocketService();
