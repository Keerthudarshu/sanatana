package com.eduprajna.service;

import com.eduprajna.entity.CartItem;
import com.eduprajna.entity.Product;
import com.eduprajna.entity.ProductVariant;
import com.eduprajna.entity.User;
import com.eduprajna.repository.CartItemRepository;
import com.eduprajna.repository.ProductRepository;
import com.eduprajna.repository.ProductVariantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CartService {
    private final CartItemRepository cartRepo;
    private final ProductRepository productRepo;
    private final ProductVariantRepository productVariantRepo;

    public CartService(CartItemRepository cartRepo, ProductRepository productRepo, ProductVariantRepository productVariantRepo) {
        this.cartRepo = cartRepo;
        this.productRepo = productRepo;
        this.productVariantRepo = productVariantRepo;
    }

    public List<CartItem> getCart(User user) {
        return cartRepo.findByUser(user);
    }

    public CartItem addToCart(User user, Long productId, int quantity, Long variantId, String variantName,
            Double weightValue, String weightUnit, Double price) {
        final Product product = productRepo.findById(productId).orElseThrow();
        final ProductVariant variant;
        final Integer stockQty;
        if (variantId != null) {
            variant = productVariantRepo.findById(variantId).orElseThrow();
            stockQty = variant.getStockQuantity();
        } else {
            variant = null;
            stockQty = null;
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        if (stockQty != null && stockQty <= 0) {
            throw new IllegalStateException("Variant is out of stock");
        }
        // Check for existing item with SAME product and SAME variant
        final List<CartItem> userItems = cartRepo.findByUser(user);
        final Long finalVariantId = variantId;
        final String finalVariantName = variantName;
        final Double finalWeightValue = weightValue;
        final String finalWeightUnit = weightUnit;
        final Double finalPrice = price;
        Optional<CartItem> existing = userItems.stream()
                .filter(item -> item.getProduct().getId().equals(productId))
                .filter(item -> {
                    if (finalVariantId != null) {
                        return finalVariantId.equals(item.getVariantId());
                    }
                    return item.getVariantId() == null;
                })
                .findFirst();

        CartItem item = existing.orElseGet(() -> {
            CartItem ci = new CartItem();
            ci.setUser(user);
            ci.setProduct(product);
            ci.setPriceAtAdd(finalPrice != null ? finalPrice : (variant != null && variant.getPrice() != null ? variant.getPrice() : (product.getPrice() != null ? product.getPrice().doubleValue() : 0.0)));
            ci.setQuantity(0);
            ci.setVariantId(finalVariantId);
            ci.setVariantName(finalVariantName);
            ci.setWeightValue(finalWeightValue);
            ci.setWeightUnit(finalWeightUnit);
            return ci;
        });
        int current = item.getQuantity() == null ? 0 : item.getQuantity();
        int newQty = current + quantity;
        if (stockQty != null && newQty > stockQty) {
            throw new IllegalStateException("Stock limit exceeded. Available: " + stockQty);
        }
        item.setQuantity(Math.max(1, newQty));
        if (price != null) {
            item.setPriceAtAdd(price);
        }
        if (variantName != null) {
            item.setVariantName(variantName);
        }
        if (variantId != null) {
            item.setVariantId(variantId);
        }
        if (weightValue != null) {
            item.setWeightValue(weightValue);
        }
        if (weightUnit != null) {
            item.setWeightUnit(weightUnit);
        }
        return cartRepo.save(item);
    }

    // Keep the old signature for backward compatibility
    public CartItem addToCart(User user, Long productId, int quantity) {
        return addToCart(user, productId, quantity, null, null, null, null, null);
    }

    public void removeItemByProductId(User user, Long productId) {
        List<CartItem> items = cartRepo.findByUser(user);
        for (CartItem item : items) {
            if (item.getProduct().getId().equals(productId)) {
                cartRepo.delete(item);
            }
        }
    }

    public CartItem updateQuantity(User user, Long productId, int quantity, Long variantId) {
        Product product = productRepo.findById(productId).orElseThrow();
        ProductVariant variant = null;
        if (variantId != null) {
            variant = productVariantRepo.findById(variantId).orElseThrow();
        }
        CartItem item = cartRepo.findByUser(user).stream()
            .filter(ci -> ci.getProduct().getId().equals(productId) && ((variantId == null && ci.getVariantId() == null) || (variantId != null && variantId.equals(ci.getVariantId()))))
            .findFirst().orElseThrow();
        Integer stockQty = variant != null ? variant.getStockQuantity() : null;
        if (stockQty != null && stockQty <= 0) {
            throw new IllegalStateException("Variant is out of stock");
        }
        if (quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }
        if (stockQty != null && quantity > stockQty) {
            throw new IllegalStateException("Stock limit exceeded. Available: " + stockQty);
        }
        item.setQuantity(quantity);
        return cartRepo.save(item);
    }

    public void removeItem(User user, Long productId) {
        Product product = productRepo.findById(productId).orElseThrow();
        List<CartItem> items = cartRepo.findByUser(user);
        for (CartItem item : items) {
            if (item.getProduct().getId().equals(productId)) {
                cartRepo.delete(item);
            }
        }
    }

    public void clearCart(User user) {
        cartRepo.deleteByUser(user);
    }
}
