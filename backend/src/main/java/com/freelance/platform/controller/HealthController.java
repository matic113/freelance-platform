package com.freelance.platform.controller;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@Tag(name = "Health Check", description = "Health check and system status APIs")
public class HealthController {
    
    @Value("${app.platform.name}")
    private String platformName;
    
    @Value("${app.platform.version}")
    private String platformVersion;
    
    @GetMapping
    @Operation(summary = "Health check", description = "Check if the API is running")
    public ResponseEntity<Map<String, Object>> health() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("platform", platformName);
        response.put("version", platformVersion);
        response.put("timestamp", LocalDateTime.now());
         response.put("message", "Freint API is running");
        
        return ResponseEntity.ok(response);
    }
    
    @GetMapping("/status")
    @Operation(summary = "System status", description = "Get detailed system status information")
    public ResponseEntity<Map<String, Object>> status() {
        Map<String, Object> response = new HashMap<>();
        response.put("status", "UP");
        response.put("platform", platformName);
        response.put("version", platformVersion);
        response.put("timestamp", LocalDateTime.now());
        response.put("uptime", System.currentTimeMillis());
        response.put("java_version", System.getProperty("java.version"));
        response.put("os_name", System.getProperty("os.name"));
        response.put("os_version", System.getProperty("os.version"));
        
        return ResponseEntity.ok(response);
    }
}
