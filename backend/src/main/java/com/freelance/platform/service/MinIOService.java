package com.freelance.platform.service;

import com.freelance.platform.config.MinIOConfig;
import io.minio.*;
import io.minio.http.Method;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

@Service
public class MinIOService {

    private static final Logger logger = LoggerFactory.getLogger(MinIOService.class);

    @Autowired
    private MinioClient minioClient;

    @Autowired
    private MinIOConfig.MinIOProperties minioProperties;

    public void ensureBucketExists() throws Exception {
        String bucketName = minioProperties.getBucketName();
        logger.info("Checking if bucket '{}' exists", bucketName);
        
        try {
            logger.info("Attempting MinIO connection to check bucket existence...");
            boolean found = minioClient.bucketExists(BucketExistsArgs.builder()
                    .bucket(bucketName)
                    .build());
            
            if (!found) {
                logger.warn("Bucket '{}' does not exist. Attempting to create it.", bucketName);
                minioClient.makeBucket(MakeBucketArgs.builder()
                        .bucket(bucketName)
                        .build());
                logger.info("Bucket '{}' created successfully", bucketName);
                
                String policy = "{"
                        + "\"Version\":\"2012-10-17\","
                        + "\"Statement\":[{"
                        + "\"Effect\":\"Allow\","
                        + "\"Principal\":{\"AWS\":[\"*\"]},"
                        + "\"Action\":[\"s3:GetObject\"],"
                        + "\"Resource\":[\"arn:aws:s3:::" + bucketName + "/*\"]"
                        + "}]"
                        + "}";
                
                minioClient.setBucketPolicy(SetBucketPolicyArgs.builder()
                        .bucket(bucketName)
                        .config(policy)
                        .build());
                logger.info("Bucket policy set for '{}'", bucketName);
            } else {
                logger.info("Bucket '{}' already exists", bucketName);
            }
        } catch (Exception e) {
            logger.error("Error checking/creating bucket '{}': {}", bucketName, e.getMessage(), e);
            logger.warn("Assuming bucket exists and continuing...");
        }
    }

    public Map<String, String> generatePresignedUploadUrl(String fileName, String contentType) {
        try {
            logger.info("=== Starting Presigned URL Generation ===");
            logger.info("Input - fileName: {}, contentType: {}", fileName, contentType);
            logger.info("MinIO Config - URL: {}, Bucket: {}, Access Key: {}", 
                minioProperties.getUrl(), 
                minioProperties.getBucketName(),
                minioProperties.getAccessKey().substring(0, 5) + "***");
            
            logger.info("Attempting to ensure bucket exists...");
            ensureBucketExists();
            logger.info("Bucket check completed");
            
            String uniqueFileName = generateUniqueFileName(fileName);
            String objectName = "avatars/" + uniqueFileName;
            logger.info("Generated object name: {}", objectName);
            
            logger.info("Requesting presigned URL from MinIO...");
            String uploadUrl = minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                    .method(Method.PUT)
                    .bucket(minioProperties.getBucketName())
                    .object(objectName)
                    .expiry(15, TimeUnit.MINUTES)
                    .build()
            );
            
            logger.info("Successfully generated presigned upload URL: {}", uploadUrl);
            
            String publicUrl = minioProperties.getUrl().replaceAll("/$", "") + "/" + 
                             minioProperties.getBucketName() + "/" + objectName;
            
            logger.info("Generated public URL: {}", publicUrl);
            
            Map<String, String> result = new HashMap<>();
            result.put("uploadUrl", uploadUrl);
            result.put("fileUrl", publicUrl);
            result.put("fileName", uniqueFileName);
            result.put("objectName", objectName);
            
            logger.info("=== Presigned URL Generation Successful ===");
            return result;
        } catch (Exception e) {
            logger.error("=== FAILED to generate presigned URL ===");
            logger.error("Exception type: {}", e.getClass().getName());
            logger.error("Exception message: {}", e.getMessage());
            logger.error("Full stack trace:", e);
            throw new RuntimeException("Failed to generate presigned URL: " + e.getMessage(), e);
        }
    }

    public String uploadFile(MultipartFile file, String folder) {
        try {
            ensureBucketExists();
            
            String uniqueFileName = generateUniqueFileName(file.getOriginalFilename());
            String objectName = (folder != null && !folder.isEmpty()) 
                ? folder + "/" + uniqueFileName 
                : uniqueFileName;
            
            InputStream inputStream = file.getInputStream();
            
            minioClient.putObject(
                PutObjectArgs.builder()
                    .bucket(minioProperties.getBucketName())
                    .object(objectName)
                    .stream(inputStream, file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build()
            );
            
            inputStream.close();
            
            return minioProperties.getUrl() + "/" + 
                   minioProperties.getBucketName() + "/" + objectName;
        } catch (Exception e) {
            throw new RuntimeException("Failed to upload file to MinIO: " + e.getMessage(), e);
        }
    }

    public void deleteFile(String objectName) {
        try {
            minioClient.removeObject(
                RemoveObjectArgs.builder()
                    .bucket(minioProperties.getBucketName())
                    .object(objectName)
                    .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete file from MinIO: " + e.getMessage(), e);
        }
    }

    public String generatePresignedDownloadUrl(String objectName, int expiryMinutes) {
        try {
            return minioClient.getPresignedObjectUrl(
                GetPresignedObjectUrlArgs.builder()
                    .method(Method.GET)
                    .bucket(minioProperties.getBucketName())
                    .object(objectName)
                    .expiry(expiryMinutes, TimeUnit.MINUTES)
                    .build()
            );
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate presigned download URL: " + e.getMessage(), e);
        }
    }

    private String generateUniqueFileName(String originalFileName) {
        String extension = "";
        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(originalFileName.lastIndexOf("."));
        }
        return UUID.randomUUID().toString() + extension;
    }
}
