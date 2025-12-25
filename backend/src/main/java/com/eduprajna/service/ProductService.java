package com.eduprajna.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.eduprajna.entity.Product;
import com.eduprajna.entity.ProductVariant;
import com.eduprajna.repository.CartItemRepository;
import com.eduprajna.repository.OrderItemRepository;
import com.eduprajna.repository.ProductVariantRepository;
import com.eduprajna.repository.ProductRepository;
import com.eduprajna.repository.WishlistItemRepository;


@Service
public class ProductService {
    @Autowired
    private ProductVariantRepository productVariantRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private WishlistItemRepository wishlistItemRepository;

    // Fetch all product variants (for admin and user)
    public List<ProductVariant> getAllVariants() {
        return productVariantRepository.findAll();
    }

    // Fetch a single product variant by id
    public ProductVariant getVariantById(Long id) {
        return productVariantRepository.findById(id).orElse(null);
    }

    // --- RESTORED PRODUCT CRUD METHODS (NO STOCK LOGIC) ---
    public Product save(Product p) {
        return productRepository.save(p);
    }

    public Product getById(Long id) {
        return productRepository.findById(id).orElse(null);
    }

    public List<Product> getAll() {
        return productRepository.findAll();
    }

    public void delete(Long id) {
        productRepository.deleteById(id);
    }

	// Update stock for a variant (reduce or add)
	@Transactional
	public void updateVariantStock(Long variantId, int delta) {
		ProductVariant variant = productVariantRepository.findById(variantId).orElse(null);
		if (variant != null) {
			int current = variant.getStockQuantity() != null ? variant.getStockQuantity() : 0;
			int newQty = current + delta;
			variant.setStockQuantity(Math.max(newQty, 0));
			productVariantRepository.save(variant);
		}
	}

    // Remove a variant (and related entities if needed)
    @Transactional
    public void deleteVariant(Long variantId) {
        productVariantRepository.deleteById(variantId);
    }
}