package com.freelance.platform.service;

import com.freelance.platform.config.properties.GoogleOAuthProperties;
import com.freelance.platform.dto.response.GoogleUserProfile;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.jackson2.JacksonFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

@Service
public class GoogleOAuthService {

    private static final Logger logger = LoggerFactory.getLogger(GoogleOAuthService.class);

    private final GoogleOAuthProperties properties;

    private final HttpTransport transport = new NetHttpTransport();

    private final JsonFactory jsonFactory = JacksonFactory.getDefaultInstance();

    public GoogleOAuthService(GoogleOAuthProperties properties) {
        this.properties = properties;
    }

    public GoogleUserProfile verifyIdToken(String idToken) {
        if (!properties.hasClientId()) {
            throw new IllegalStateException("Google OAuth client id is not configured");
        }

        GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(transport, jsonFactory)
                .setAudience(Collections.singletonList(properties.getClientId()))
                .build();

        try {
            GoogleIdToken token = verifier.verify(idToken);
            if (token == null) {
                logger.warn("Invalid Google ID token");
                throw new IllegalArgumentException("Invalid Google ID token");
            }

            GoogleIdToken.Payload payload = token.getPayload();

            if (!payload.getEmailVerified()) {
                throw new IllegalArgumentException("Google email is not verified");
            }

            if (!isDomainAllowed(payload.getEmail())) {
                throw new IllegalArgumentException("Email domain is not allowed for Google login");
            }

            GoogleUserProfile profile = new GoogleUserProfile();
            profile.setEmail(payload.getEmail());
            profile.setFirstName((String) payload.get("given_name"));
            profile.setLastName((String) payload.get("family_name"));
            profile.setEmailVerified(Boolean.TRUE.equals(payload.getEmailVerified()));
            profile.setPicture((String) payload.get("picture"));
            return profile;
        } catch (GeneralSecurityException | IOException e) {
            logger.error("Failed to verify Google ID token", e);
            throw new IllegalArgumentException("Failed to verify Google ID token");
        }
    }

    private boolean isDomainAllowed(String email) {
        List<String> allowed = properties.getAllowedDomains();
        if (allowed == null || allowed.isEmpty()) {
            return true;
        }

        String domain = email.substring(email.indexOf('@') + 1);
        return allowed.stream().anyMatch(allowedDomain -> allowedDomain.equalsIgnoreCase(domain));
    }
}

