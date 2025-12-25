package com.eduprajna.service;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.InputStreamResource;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class StorageService {
    // Read upload directory from Spring property; fallback to ./uploads
    @Value("${spring.servlet.multipart.location:./uploads}")
    private String uploadDir;

    public String store(MultipartFile file) throws IOException {
        String filename = System.currentTimeMillis() + "_" + StringUtils.cleanPath(file.getOriginalFilename());
        Path dirPath = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(dirPath);
        Path dest = dirPath.resolve(filename);
        file.transferTo(dest.toFile());
        // Return /uploads/ path to match database format and UploadController endpoint
        return "/uploads/" + filename;
    }

    public Resource loadAsResource(String filename) throws IOException {
        Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
        if (!Files.exists(filePath)) {
            throw new IOException("File not found: " + filename);
        }
        return new InputStreamResource(new FileInputStream(filePath.toFile())) {
            @Override
            public String getFilename() {
                return filePath.getFileName().toString();
            }

            @Override
            public long contentLength() throws IOException {
                return Files.size(filePath);
            }
        };
    }

    public MediaType probeMediaType(String filename) {
        try {
            Path filePath = Paths.get(uploadDir).resolve(filename).normalize();
            String type = Files.probeContentType(filePath);
            if (type != null) return MediaType.parseMediaType(type);
        } catch (Exception ignored) {}
        return MediaType.APPLICATION_OCTET_STREAM;
    }

    public List<String> listAll() {
        List<String> files = new ArrayList<>();
        File dir = Paths.get(uploadDir).toFile();
        if (dir.exists() && dir.isDirectory()) {
            File[] list = dir.listFiles();
            if (list != null) {
                for (File f : list) {
                    if (f.isFile()) {
                        files.add(f.getName());
                    }
                }
            }
        }
        return files;
    }

    // Delete a stored file by its filename, returns true if deleted or not present
    public boolean delete(String filename) {
        if (filename == null || filename.isEmpty()) return false;
        File f = Paths.get(uploadDir).resolve(filename).normalize().toFile();
        if (!f.exists()) return true; // already gone
        return f.delete();
    }

    // Extracts filename from an API url like "/api/admin/products/images/abc.jpg"
    public String extractFilenameFromUrl(String url) {
        if (url == null) return null;
        int idx = url.lastIndexOf('/') + 1;
        if (idx <= 0 || idx >= url.length()) return null;
        return url.substring(idx);
    }
}
