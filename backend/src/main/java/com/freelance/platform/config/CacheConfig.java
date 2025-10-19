package com.freelance.platform.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.CacheManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.cache.RedisCacheConfiguration;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;

import java.time.Duration;
import java.util.HashMap;
import java.util.Map;

@Configuration
public class CacheConfig {

    @Value("${app.cache.ttl.adminDashboard:300}")
    private long adminDashboardTtlSeconds;

    @Value("${app.cache.ttl.userAnalytics:60}")
    private long userAnalyticsTtlSeconds;

    @Value("${app.cache.ttl.projectAnalytics:60}")
    private long projectAnalyticsTtlSeconds;

    @Value("${app.cache.ttl.revenueAnalytics:300}")
    private long revenueAnalyticsTtlSeconds;

    @Value("${app.cache.ttl.performanceMetrics:60}")
    private long performanceMetricsTtlSeconds;

    @Bean
    public CacheManager cacheManager(RedisConnectionFactory redisConnectionFactory) {
        RedisCacheConfiguration defaultConfig = RedisCacheConfiguration.defaultCacheConfig()
                .entryTtl(Duration.ofSeconds(60))
                .disableCachingNullValues();

        Map<String, RedisCacheConfiguration> cacheConfigs = new HashMap<>();
        cacheConfigs.put("adminDashboard", defaultConfig.entryTtl(Duration.ofSeconds(adminDashboardTtlSeconds)));
        cacheConfigs.put("userAnalytics", defaultConfig.entryTtl(Duration.ofSeconds(userAnalyticsTtlSeconds)));
        cacheConfigs.put("projectAnalytics", defaultConfig.entryTtl(Duration.ofSeconds(projectAnalyticsTtlSeconds)));
        cacheConfigs.put("revenueAnalytics", defaultConfig.entryTtl(Duration.ofSeconds(revenueAnalyticsTtlSeconds)));
        cacheConfigs.put("performanceMetrics", defaultConfig.entryTtl(Duration.ofSeconds(performanceMetricsTtlSeconds)));

        return RedisCacheManager.builder(redisConnectionFactory)
                .cacheDefaults(defaultConfig)
                .withInitialCacheConfigurations(cacheConfigs)
                .build();
    }
}
