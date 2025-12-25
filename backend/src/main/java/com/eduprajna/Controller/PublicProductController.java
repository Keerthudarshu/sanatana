package com.eduprajna.Controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.eduprajna.entity.Product;
import com.eduprajna.service.ProductService;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000"}, allowCredentials = "true")
public class PublicProductController {
    
    @Autowired
    private ProductService productService;

    /**
     * Get all active products for public consumption
     * Supports filtering by category, search, and other parameters
     */
    @GetMapping
    public ResponseEntity<List<Product>> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String sort,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice
    ) {
        // Get all active products
        List<Product> products = productService.getAll().stream()
                .filter(p -> p.getIsActive() != null && p.getIsActive()) // Only active products
                .collect(Collectors.toList());

        // Apply category filter
        if (category != null && !category.trim().isEmpty()) {
            products = products.stream()
                    .filter(p -> {
                        String productCategory = p.getCategory();
                        if (productCategory == null) return false;
                        
                        // Case-insensitive matching with multiple strategies
                        String categoryLower = category.toLowerCase().trim();
                        String productCategoryLower = productCategory.toLowerCase().trim();
                        
                        // Direct match
                        if (productCategoryLower.equals(categoryLower)) return true;
                        
                        // Handle URL-encoded spaces and hyphens
                        String normalizedCategory = categoryLower.replace("%20", " ").replace("-", " ").replace("_", " ");
                        String normalizedProductCategory = productCategoryLower.replace("-", " ").replace("_", " ");
                        
                        if (normalizedProductCategory.equals(normalizedCategory)) return true;
                        
                        // Partial matching
                        return normalizedProductCategory.contains(normalizedCategory) || 
                               normalizedCategory.contains(normalizedProductCategory);
                    })
                    .collect(Collectors.toList());
        }

        // Apply search filter
        if (search != null && !search.trim().isEmpty()) {
            String searchLower = search.toLowerCase().trim();
            products = products.stream()
                    .filter(p -> {
                        String name = p.getName() != null ? p.getName().toLowerCase() : "";
                        String description = p.getDescription() != null ? p.getDescription().toLowerCase() : "";
                        String productCategory = p.getCategory() != null ? p.getCategory().toLowerCase() : "";
                        
                        return name.contains(searchLower) || 
                               description.contains(searchLower) || 
                               productCategory.contains(searchLower);
                    })
                    .collect(Collectors.toList());
        }

        // Apply price filter
        if (minPrice != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() != null && p.getPrice() >= minPrice)
                    .collect(Collectors.toList());
        }

        if (maxPrice != null) {
            products = products.stream()
                    .filter(p -> p.getPrice() != null && p.getPrice() <= maxPrice)
                    .collect(Collectors.toList());
        }

        // Apply sorting
        if (sort != null) {
            switch (sort.toLowerCase()) {
                case "price-low-high":
                    products.sort((a, b) -> {
                        Double priceA = a.getPrice() != null ? a.getPrice() : 0.0;
                        Double priceB = b.getPrice() != null ? b.getPrice() : 0.0;
                        return priceA.compareTo(priceB);
                    });
                    break;
                case "price-high-low":
                    products.sort((a, b) -> {
                        Double priceA = a.getPrice() != null ? a.getPrice() : 0.0;
                        Double priceB = b.getPrice() != null ? b.getPrice() : 0.0;
                        return priceB.compareTo(priceA);
                    });
                    break;
                case "name-a-z":
                    products.sort((a, b) -> {
                        String nameA = a.getName() != null ? a.getName() : "";
                        String nameB = b.getName() != null ? b.getName() : "";
                        return nameA.compareToIgnoreCase(nameB);
                    });
                    break;
                case "name-z-a":
                    products.sort((a, b) -> {
                        String nameA = a.getName() != null ? a.getName() : "";
                        String nameB = b.getName() != null ? b.getName() : "";
                        return nameB.compareToIgnoreCase(nameA);
                    });
                    break;
                case "newest":
                    products.sort((a, b) -> Long.compare(b.getId(), a.getId()));
                    break;
                case "oldest":
                    products.sort((a, b) -> Long.compare(a.getId(), b.getId()));
                    break;
                default:
                    // Default sorting by ID descending (newest first)
                    products.sort((a, b) -> Long.compare(b.getId(), a.getId()));
                    break;
            }
        }

        return ResponseEntity.ok(products);
    }

    /**
     * Get a specific product by ID (public access)
     */
    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Product product = productService.getById(id);
        
        // Check if product exists and is active
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        
        if (product.getIsActive() == null || !product.getIsActive()) {
            return ResponseEntity.notFound().build(); // Don't show inactive products to public
        }
        
        return ResponseEntity.ok(product);
    }

    /**
     * Get products by category
     */
    @GetMapping("/category/{categoryName}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable String categoryName) {
        List<Product> products = productService.getAll().stream()
                .filter(p -> p.getIsActive() != null && p.getIsActive()) // Only active products
                .filter(p -> {
                    String productCategory = p.getCategory();
                    if (productCategory == null) return false;
                    
                    // Case-insensitive matching
                    return productCategory.toLowerCase().equals(categoryName.toLowerCase()) ||
                           productCategory.toLowerCase().replace("-", " ").equals(categoryName.toLowerCase().replace("-", " "));
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(products);
    }

    /**
     * Search products
     */
    @GetMapping("/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String q) {
        if (q == null || q.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        String searchTerm = q.toLowerCase().trim();
        List<Product> products = productService.getAll().stream()
                .filter(p -> p.getIsActive() != null && p.getIsActive()) // Only active products
                .filter(p -> {
                    String name = p.getName() != null ? p.getName().toLowerCase() : "";
                    String description = p.getDescription() != null ? p.getDescription().toLowerCase() : "";
                    String category = p.getCategory() != null ? p.getCategory().toLowerCase() : "";
                    
                    return name.contains(searchTerm) || 
                           description.contains(searchTerm) || 
                           category.contains(searchTerm);
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(products);
    }
}
