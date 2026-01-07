package com.eduprajna.repository;

import com.eduprajna.entity.Order;
import com.eduprajna.entity.OrderStatusHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderStatusHistoryRepository extends JpaRepository<OrderStatusHistory, Long> {
    List<OrderStatusHistory> findByOrderOrderByChangedAtAsc(Order order);
    List<OrderStatusHistory> findByOrderIdOrderByChangedAtAsc(Long orderId);
}
