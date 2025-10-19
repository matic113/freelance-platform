package com.freelance.platform.config;

import io.minio.MinioClient;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MinIOConfig {

    @Value("${minio.url:http://localhost:9000}")
    private String minioUrl;

    @Value("${minio.access-key:minioadmin}")
    private String accessKey;

    @Value("${minio.secret-key:minioadmin}")
    private String secretKey;

    @Value("${minio.bucket-name:freelance-bucket}")
    private String bucketName;

    @Bean
    public MinioClient minioClient() {
        return MinioClient.builder()
                .endpoint(minioUrl)
                .credentials(accessKey, secretKey)
                .build();
    }

    @Bean
    public MinIOProperties minioProperties() {
        return new MinIOProperties(minioUrl, accessKey, secretKey, bucketName);
    }

    public static class MinIOProperties {
        private final String url;
        private final String accessKey;
        private final String secretKey;
        private final String bucketName;

        public MinIOProperties(String url, String accessKey, String secretKey, String bucketName) {
            this.url = url;
            this.accessKey = accessKey;
            this.secretKey = secretKey;
            this.bucketName = bucketName;
        }

        public String getUrl() {
            return url;
        }

        public String getAccessKey() {
            return accessKey;
        }

        public String getSecretKey() {
            return secretKey;
        }

        public String getBucketName() {
            return bucketName;
        }
    }
}
