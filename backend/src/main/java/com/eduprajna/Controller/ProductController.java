package com.eduprajna.controller;

import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.eduprajna.entity.Product;
import com.eduprajna.entity.ProductVariant;
import com.eduprajna.service.ProductService;
import com.eduprajna.service.StorageService;

@RestController
@RequestMapping("/api/admin/products")

public class ProductController {
    @Autowired
    private ProductService productService;

    @Autowired
    private StorageService storageService;

    // Get all product variants (for admin and user)
    @GetMapping("/variants")
    public ResponseEntity<List<ProductVariant>> getAllVariants() {
        return ResponseEntity.ok(productService.getAllVariants());
    }

    // Get a single product variant by id
    @GetMapping("/variants/{id}")
    public ResponseEntity<ProductVariant> getVariantById(@PathVariable Long id) {
        ProductVariant v = productService.getVariantById(id);
        if (v == null)
            return ResponseEntity.notFound().build();
        return ResponseEntity.ok(v);
    }

    // Update stock for a variant (reduce/add)
    @PutMapping("/variants/{id}/stock")
    public ResponseEntity<Void> updateVariantStock(@PathVariable Long id, @RequestParam int delta) {
        productService.updateVariantStock(id, delta);
        return ResponseEntity.noContent().build();
    }

    // Remove a variant
    @DeleteMapping("/variants/{id}")
    public ResponseEntity<Void> deleteVariant(@PathVariable Long id) {
        productService.deleteVariant(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping(consumes = { "multipart/form-data" })
    public ResponseEntity<Product> create(
            @RequestPart("product") Product p,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {
        if (imageFile != null && !imageFile.isEmpty()) {
            String relativePath = storageService.store(imageFile);
            p.setImageUrl(relativePath);
        }
        Product saved = productService.save(p);
        return ResponseEntity.ok(saved);
    }

    @PutMapping(value = "/{id}", consumes = { "application/json" })
    public ResponseEntity<Product> updateJson(
            @PathVariable Long id,
            @RequestBody Product p) {
        p.setId(id);
        return ResponseEntity.ok(productService.save(p));
    }

    @PutMapping(value = "/{id}", consumes = { "multipart/form-data" })
    public ResponseEntity<Product> updateMultipart(
            @PathVariable Long id,
            @RequestPart("product") Product p,
            @RequestParam(value = "image", required = false) MultipartFile imageFile) throws IOException {
        p.setId(id);
        if (imageFile != null && !imageFile.isEmpty()) {
            String relativePath = storageService.store(imageFile);
            p.setImageUrl(relativePath);
        }
        return ResponseEntity.ok(productService.save(p));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        // Load product to get image URL before deleting DB row
        try {
            Product existing = productService.getById(id);
            if (existing != null && existing.getImageUrl() != null) {
                String filename = storageService.extractFilenameFromUrl(existing.getImageUrl());
                if (filename != null) {
                    storageService.delete(filename);
                }
            }
        } catch (Exception ignored) {
            // Ignore errors during image deletion; proceed to delete DB row
        }
        productService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // Serve uploaded images via API so frontend can display them
    @GetMapping("/images/{filename:.+}")
    public ResponseEntity<Resource> getImage(@PathVariable String filename) throws IOException {
        // If filename contains path separators, extract just the filename
        if (filename.contains("/")) {
            filename = filename.substring(filename.lastIndexOf('/') + 1);
        }
        Resource resource = storageService.loadAsResource(filename);
        MediaType contentType = storageService.probeMediaType(filename);
        return ResponseEntity.ok()
                .header(HttpHeaders.CACHE_CONTROL, "max-age=86400, public")
                .contentType(contentType)
                .body(resource);
    }

    // List all stored image filenames (or absolute URLs)
    @GetMapping("/images")
    public ResponseEntity<List<String>> listImages() {
        List<String> files = storageService.listAll();
        // Convert filenames to API URLs for convenience
        List<String> urls = files.stream()
                .map(name -> "/api/admin/products/images/" + name)
                .collect(Collectors.toList());
        return ResponseEntity.ok(urls);
    }

    // Upload or update product image by id
    @PostMapping(value = "/{id}/image", consumes = { "multipart/form-data" })
    public ResponseEntity<?> uploadProductImage(
            @PathVariable Long id,
            @RequestParam("image") MultipartFile imageFile) {
        try {
            Product product = productService.getById(id);
            if (product == null) {
                return ResponseEntity.status(404).body("Product not found");
            }
            if (imageFile != null && !imageFile.isEmpty()) {
                // Delete old image if exists
                if (product.getImageUrl() != null) {
                    String oldFilename = storageService.extractFilenameFromUrl(product.getImageUrl());
                    if (oldFilename != null) {
                        storageService.delete(oldFilename);
                    }
                }
                String relativePath = storageService.store(imageFile);
                product.setImageUrl(relativePath);
                productService.save(product);
            }
            return ResponseEntity.ok(product);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }

    // Delete product image by id
    @DeleteMapping("/{id}/image")
    public ResponseEntity<?> deleteProductImage(@PathVariable Long id) {
        try {
            Product product = productService.getById(id);
            if (product == null) {
                return ResponseEntity.status(404).body("Product not found");
            }
            if (product.getImageUrl() != null) {
                String filename = storageService.extractFilenameFromUrl(product.getImageUrl());
                if (filename != null) {
                    boolean deleted = storageService.delete(filename);
                    if (!deleted) {
                        return ResponseEntity.status(500).body("Failed to delete image file: " + filename);
                    }
                    product.setImageUrl(null);
                    productService.save(product);
                }
            }
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Internal server error: " + e.getMessage());
        }
    }
}