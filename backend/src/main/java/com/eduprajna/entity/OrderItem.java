package com.eduprajna.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "order_items")
public class OrderItem {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;



    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = true)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "variant_id", nullable = true)
    private com.eduprajna.entity.ProductVariant variant;

    // --- Snapshot fields for product/variant details at order time ---
    @Column(name = "product_name")
    private String productName;

    @Column(name = "product_image_url")
    private String productImageUrl;

    @Column(name = "variant_name")
    private String variantName;

    @Column(name = "variant_price")
    private Double variantPrice;

    @Column(name = "variant_original_price")
    private Double variantOriginalPrice;

    @Column(name = "variant_weight_value")
    private Double variantWeightValue;

    @Column(name = "variant_weight_unit", length = 50)
    private String variantWeightUnit;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false)
    private Double price; // per item at time of order

    @Column(name = "weight_value")
    private String weightValue;

    @Column(name = "weight_unit")
    private String weightUnit;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Order getOrder() { return order; }
    public void setOrder(Order order) { this.order = order; }

    public Product getProduct() { return product; }
    public void setProduct(Product product) { this.product = product; }

    public com.eduprajna.entity.ProductVariant getVariant() { return variant; }
    public void setVariant(com.eduprajna.entity.ProductVariant variant) { this.variant = variant; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getProductImageUrl() { return productImageUrl; }
    public void setProductImageUrl(String productImageUrl) { this.productImageUrl = productImageUrl; }

    public String getVariantName() { return variantName; }
    public void setVariantName(String variantName) { this.variantName = variantName; }

    public Double getVariantPrice() { return variantPrice; }
    public void setVariantPrice(Double variantPrice) { this.variantPrice = variantPrice; }

    public Double getVariantOriginalPrice() { return variantOriginalPrice; }
    public void setVariantOriginalPrice(Double variantOriginalPrice) { this.variantOriginalPrice = variantOriginalPrice; }

    public Double getVariantWeightValue() { return variantWeightValue; }
    public void setVariantWeightValue(Double variantWeightValue) { this.variantWeightValue = variantWeightValue; }

    public String getVariantWeightUnit() { return variantWeightUnit; }
    public void setVariantWeightUnit(String variantWeightUnit) { this.variantWeightUnit = variantWeightUnit; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getWeightValue() { return weightValue; }
    public void setWeightValue(String weightValue) { this.weightValue = weightValue; }
    public String getWeightUnit() { return weightUnit; }
    public void setWeightUnit(String weightUnit) { this.weightUnit = weightUnit; }
}


