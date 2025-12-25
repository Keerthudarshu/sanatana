package com.eduprajna.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.eduprajna.entity.ProductVariant;

public interface ProductVariantRepository extends JpaRepository<ProductVariant, Long> {

}
