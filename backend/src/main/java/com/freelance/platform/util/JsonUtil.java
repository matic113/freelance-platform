package com.freelance.platform.util;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;

import java.util.Map;
import java.util.List;

public class JsonUtil {
    
    private static final ObjectMapper OBJECT_MAPPER = new ObjectMapper();
    
    static {
        OBJECT_MAPPER.registerModule(new JavaTimeModule());
        OBJECT_MAPPER.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
        OBJECT_MAPPER.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false);
    }
    
    /**
     * Converts object to JSON string
     */
    public static String toJson(Object object) {
        if (object == null) {
            return null;
        }
        
        try {
            return OBJECT_MAPPER.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert object to JSON", e);
        }
    }
    
    /**
     * Converts object to pretty JSON string
     */
    public static String toPrettyJson(Object object) {
        if (object == null) {
            return null;
        }
        
        try {
            return OBJECT_MAPPER.writerWithDefaultPrettyPrinter().writeValueAsString(object);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert object to pretty JSON", e);
        }
    }
    
    /**
     * Converts JSON string to object
     */
    public static <T> T fromJson(String json, Class<T> clazz) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        
        try {
            return OBJECT_MAPPER.readValue(json, clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert JSON to object", e);
        }
    }
    
    /**
     * Converts JSON string to Map
     */
    public static Map<String, Object> fromJsonToMap(String json) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        
        try {
            return OBJECT_MAPPER.readValue(json, Map.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert JSON to Map", e);
        }
    }
    
    /**
     * Converts JSON string to List
     */
    public static List<Object> fromJsonToList(String json) {
        if (json == null || json.trim().isEmpty()) {
            return null;
        }
        
        try {
            return OBJECT_MAPPER.readValue(json, List.class);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert JSON to List", e);
        }
    }
    
    /**
     * Converts Map to JSON string
     */
    public static String mapToJson(Map<String, Object> map) {
        if (map == null) {
            return null;
        }
        
        try {
            return OBJECT_MAPPER.writeValueAsString(map);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert Map to JSON", e);
        }
    }
    
    /**
     * Converts List to JSON string
     */
    public static String listToJson(List<?> list) {
        if (list == null) {
            return null;
        }
        
        try {
            return OBJECT_MAPPER.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert List to JSON", e);
        }
    }
    
    /**
     * Validates JSON string
     */
    public static boolean isValidJson(String json) {
        if (json == null || json.trim().isEmpty()) {
            return false;
        }
        
        try {
            OBJECT_MAPPER.readTree(json);
            return true;
        } catch (JsonProcessingException e) {
            return false;
        }
    }
    
    /**
     * Converts object to Map
     */
    public static Map<String, Object> objectToMap(Object object) {
        if (object == null) {
            return null;
        }
        
        try {
            return OBJECT_MAPPER.convertValue(object, Map.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert object to Map", e);
        }
    }
    
    /**
     * Converts Map to object
     */
    public static <T> T mapToObject(Map<String, Object> map, Class<T> clazz) {
        if (map == null) {
            return null;
        }
        
        try {
            return OBJECT_MAPPER.convertValue(map, clazz);
        } catch (Exception e) {
            throw new RuntimeException("Failed to convert Map to object", e);
        }
    }
    
    /**
     * Deep clones object using JSON serialization
     */
    public static <T> T deepClone(T object, Class<T> clazz) {
        if (object == null) {
            return null;
        }
        
        try {
            String json = OBJECT_MAPPER.writeValueAsString(object);
            return OBJECT_MAPPER.readValue(json, clazz);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to deep clone object", e);
        }
    }
    
    /**
     * Merges two JSON objects
     */
    public static String mergeJson(String json1, String json2) {
        if (json1 == null || json1.trim().isEmpty()) {
            return json2;
        }
        if (json2 == null || json2.trim().isEmpty()) {
            return json1;
        }
        
        try {
            Map<String, Object> map1 = OBJECT_MAPPER.readValue(json1, Map.class);
            Map<String, Object> map2 = OBJECT_MAPPER.readValue(json2, Map.class);
            
            map1.putAll(map2);
            return OBJECT_MAPPER.writeValueAsString(map1);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to merge JSON objects", e);
        }
    }
    
    /**
     * Extracts value from JSON using path
     */
    public static Object extractValue(String json, String path) {
        if (json == null || json.trim().isEmpty() || path == null) {
            return null;
        }
        
        try {
            Map<String, Object> map = OBJECT_MAPPER.readValue(json, Map.class);
            return extractValueFromMap(map, path);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to extract value from JSON", e);
        }
    }
    
    /**
     * Extracts value from Map using path
     */
    private static Object extractValueFromMap(Map<String, Object> map, String path) {
        String[] keys = path.split("\\.");
        Object current = map;
        
        for (String key : keys) {
            if (current instanceof Map) {
                current = ((Map<?, ?>) current).get(key);
            } else {
                return null;
            }
        }
        
        return current;
    }
    
    /**
     * Formats JSON string with indentation
     */
    public static String formatJson(String json) {
        if (json == null || json.trim().isEmpty()) {
            return json;
        }
        
        try {
            Object obj = OBJECT_MAPPER.readValue(json, Object.class);
            return OBJECT_MAPPER.writerWithDefaultPrettyPrinter().writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            return json; // Return original if formatting fails
        }
    }
    
    /**
     * Minifies JSON string
     */
    public static String minifyJson(String json) {
        if (json == null || json.trim().isEmpty()) {
            return json;
        }
        
        try {
            Object obj = OBJECT_MAPPER.readValue(json, Object.class);
            return OBJECT_MAPPER.writeValueAsString(obj);
        } catch (JsonProcessingException e) {
            return json; // Return original if minifying fails
        }
    }
    
    /**
     * Gets ObjectMapper instance
     */
    public static ObjectMapper getObjectMapper() {
        return OBJECT_MAPPER;
    }
}
