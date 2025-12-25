package com.eduprajna.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cart_items")
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id")
    private Product product;

    @Column(nullable = false)
    private Integer quantity = 1;

    @Column(nullable = false)
    private Double priceAtAdd; // snapshot price

    // Variant-related fields
    @Column(name = "variant_id")
    private Long variantId; // ID of the selected variant
    
    @Column(name = "variant_name")
    private String variantName; // e.g., "200ML"
    
    @Column(name = "weight_value")
    private Double weightValue; // e.g., 200.0
    
    @Column(name = "weight_unit")
    private String weightUnit; // e.g., "ml"

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getPriceAtAdd() { return priceAtAdd; }
    public void setPriceAtAdd(Double priceAtAdd) { this.priceAtAdd = priceAtAdd; }
    
    public Long getVariantId() { return variantId; }
    public void setVariantId(Long variantId) { this.variantId = variantId; }
    public String getVariantName() { return variantName; }
    public void setVariantName(String variantName) { this.variantName = variantName; }
    public Double getWeightValue() { return weightValue; }
    public void setWeightValue(Double weightValue) { this.weightValue = weightValue; }
    public String getWeightUnit() { return weightUnit; }
    public void setWeightUnit(String weightUnit) { this.weightUnit = weightUnit; }
}

 
