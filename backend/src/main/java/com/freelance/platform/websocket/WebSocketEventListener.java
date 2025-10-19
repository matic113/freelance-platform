package com.freelance.platform.websocket;

import com.freelance.platform.entity.User;
import com.freelance.platform.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectedEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.security.Principal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class WebSocketEventListener {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @Autowired
    private UserRepository userRepository;

    // Store active sessions
    private final Map<String, String> activeSessions = new ConcurrentHashMap<>();

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectedEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        Principal user = headerAccessor.getUser();
        
        if (user != null) {
            String sessionId = headerAccessor.getSessionId();
            String userId = user.getName();
            
            activeSessions.put(sessionId, userId);
            
            // Notify that user is online
            messagingTemplate.convertAndSend("/topic/user.online", userId);
            
            System.out.println("User Connected: " + userId + " with session: " + sessionId);
        }
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        
        String userId = activeSessions.remove(sessionId);
        
        if (userId != null) {
            // Check if user has other active sessions
            boolean hasOtherSessions = activeSessions.containsValue(userId);
            
            if (!hasOtherSessions) {
                // Notify that user is offline
                messagingTemplate.convertAndSend("/topic/user.offline", userId);
            }
            
            System.out.println("User Disconnected: " + userId + " with session: " + sessionId);
        }
    }

    public boolean isUserOnline(String userId) {
        return activeSessions.containsValue(userId);
    }

    public int getOnlineUserCount() {
        return activeSessions.size();
    }
}
