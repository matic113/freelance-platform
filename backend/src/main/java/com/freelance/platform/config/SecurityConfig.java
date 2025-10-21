package com.freelance.platform.config;

import com.freelance.platform.security.CustomAccessDeniedHandler;
import com.freelance.platform.security.JwtAuthenticationEntryPoint;
import com.freelance.platform.security.JwtAuthenticationFilter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(prePostEnabled = true)
public class SecurityConfig {
    
    @Autowired
    private JwtAuthenticationEntryPoint unauthorizedHandler;
    
    @Autowired
    private CustomAccessDeniedHandler accessDeniedHandler;
    
    @Autowired
    private JwtAuthenticationFilter jwtAuthenticationFilter;
    
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
    
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOriginPatterns(Arrays.asList(
        "http://localhost:*",
        "http://127.0.0.1:*",
        "https://*.example.com",
        "https://freint.com"
    ));
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setExposedHeaders(Arrays.asList("Authorization", "X-Total-Count"));
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(AbstractHttpConfigurer::disable)
            .exceptionHandling(exception -> exception
                .authenticationEntryPoint(unauthorizedHandler)
                .accessDeniedHandler(accessDeniedHandler))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(authz -> authz
                // Public endpoints
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/public/**").permitAll()
                .requestMatchers("/api/health/**").permitAll()
                .requestMatchers("/api/docs/**").permitAll()
                .requestMatchers("/swagger-ui/**").permitAll()
                .requestMatchers("/v3/api-docs/**").permitAll()
                .requestMatchers("/actuator/**").permitAll()
                
                // Static file serving - allow public access to uploaded files
                .requestMatchers("/uploads/**").permitAll()
                
                // WebSocket endpoints
                .requestMatchers("/ws/**").permitAll()
                
                // Admin auth endpoints
                .requestMatchers("/api/admin/auth/**").permitAll()
                // Admin endpoints
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                
                // User endpoints
                .requestMatchers("/api/users/**").hasAnyRole("CLIENT", "FREELANCER")
                .requestMatchers("/api/freelancer-profile/**").hasAnyRole("CLIENT", "FREELANCER")
                .requestMatchers("/api/projects").permitAll()
                .requestMatchers("/api/projects/featured").permitAll()
                .requestMatchers("/api/projects/search").permitAll()
                .requestMatchers("/api/projects/all").permitAll()
                .requestMatchers("/api/projects/**").hasAnyRole("CLIENT", "FREELANCER")
                .requestMatchers("/api/proposals/**").hasAnyRole("CLIENT", "FREELANCER")
                .requestMatchers("/api/contracts/**").hasAnyRole("CLIENT", "FREELANCER")
                .requestMatchers("/api/payments/**").hasAnyRole("CLIENT", "FREELANCER")
                .requestMatchers("/api/messages/**").hasAnyRole("CLIENT", "FREELANCER")
                .requestMatchers("/api/notifications/**").hasAnyRole("CLIENT", "FREELANCER")
                .requestMatchers("/api/reviews/test").permitAll()
                .requestMatchers("/api/reviews/**").hasAnyRole("CLIENT", "FREELANCER")
                .requestMatchers("/api/reports/**").hasAnyRole("CLIENT", "FREELANCER")
                .requestMatchers("/api/files/**").hasAnyRole("CLIENT", "FREELANCER")
                .requestMatchers("/api/analytics/**").hasAnyRole("CLIENT", "FREELANCER")
                .requestMatchers("/api/settings/**").hasAnyRole("CLIENT", "FREELANCER")
                .requestMatchers("/api/help/**").permitAll()
                .requestMatchers("/api/content/**").permitAll()
                
                // All other requests need authentication
                .anyRequest().authenticated()
            );
        
        http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
