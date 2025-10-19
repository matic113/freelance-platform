package com.freelance.platform.service;

import io.minio.GetPresignedObjectUrlArgs;
import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import io.minio.RemoveObjectArgs;
import io.minio.http.Method;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.freelance.platform.config.MinIOConfig;
import com.freelance.platform.exception.FileUploadException;
import com.freelance.platform.util.FileUploadUtil;

import java.io.InputStream;
import java.util.UUID;

@Service
public class StorageService {

    @Autowired
    private MinioClient minioClient;

    @Autowired
    private MinIOConfig.MinIOProperties minioProperties;

    public String uploadFile(MultipartFile file, String folder) {
        try {
            FileUploadUtil.validateFile(file);

            String fileName = generateUniqueFileName(file.getOriginalFilename());
            String objectName = folder != null ? folder + "/" + fileName : fileName;

            InputStream inputStream = file.getInputStream();
            long fileSize = file.getSize();
            String contentType = file.getContentType();

            minioClient.putObject(
                    PutObjectArgs.builder()
                            .bucket(minioProperties.getBucketName())
                            .object(objectName)
                            .stream(inputStream, fileSize, -1)
                            .contentType(contentType)
                            .build()
            );

            return objectName;
        } catch (FileUploadException e) {
            throw e;
        } catch (Exception e) {
            throw new FileUploadException("Failed to upload file: " + e.getMessage());
        }
    }

    public String uploadImageFile(MultipartFile file, String folder) {
        try {
            FileUploadUtil.validateImageFile(file);
            return uploadFile(file, folder);
        } catch (FileUploadException e) {
            throw e;
        }
    }

    public String uploadDocumentFile(MultipartFile file, String folder) {
        try {
            FileUploadUtil.validateDocumentFile(file);
            return uploadFile(file, folder);
        } catch (FileUploadException e) {
            throw e;
        }
    }

    public String getPresignedDownloadUrl(String objectName, int expirationHours) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.GET)
                            .bucket(minioProperties.getBucketName())
                            .object(objectName)
                            .expiry(expirationHours, java.util.concurrent.TimeUnit.HOURS)
                            .build()
            );
        } catch (Exception e) {
            throw new FileUploadException("Failed to generate download URL: " + e.getMessage());
        }
    }

    public String getPresignedUploadUrl(String objectName, int expirationHours) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .method(Method.PUT)
                            .bucket(minioProperties.getBucketName())
                            .object(objectName)
                            .expiry(expirationHours, java.util.concurrent.TimeUnit.HOURS)
                            .build()
            );
        } catch (Exception e) {
            throw new FileUploadException("Failed to generate upload URL: " + e.getMessage());
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
            throw new FileUploadException("Failed to delete file: " + e.getMessage());
        }
    }

    private String generateUniqueFileName(String originalFileName) {
        String extension = FileUploadUtil.getFileExtension(originalFileName);
        String baseName = FileUploadUtil.getBaseName(originalFileName);
        String timestamp = String.valueOf(System.currentTimeMillis());
        String uuid = UUID.randomUUID().toString().substring(0, 8);
        return baseName + "_" + timestamp + "_" + uuid + extension;
    }
}
