package com.eduprajna.controller;

import com.eduprajna.entity.ContactInquiry;
import com.eduprajna.repository.ContactInquiryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/contact")
@CrossOrigin(origins = { "http://localhost:3000", "http://127.0.0.1:3000" })
public class ContactInquiryController {

    @Autowired
    private ContactInquiryRepository repository;

    @PostMapping("/submit")
    public ResponseEntity<?> submitInquiry(@RequestBody ContactInquiry inquiry) {
        try {
            inquiry.setViewed(false); // Ensure new inquiries are unread
            ContactInquiry savedInquiry = repository.save(inquiry);
            return ResponseEntity.ok(savedInquiry);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error saving inquiry: " + e.getMessage());
        }
    }

    @PostMapping("/mark-viewed/{id}")
    public ResponseEntity<?> markAsViewed(@PathVariable Long id) {
        try {
            return repository.findById(id).map(inquiry -> {
                inquiry.setViewed(true);
                repository.save(inquiry);
                return ResponseEntity.ok().build();
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body("Error marking inquiry as viewed: " + e.getMessage());
        }
    }

    @GetMapping("/unread-count")
    public ResponseEntity<Long> getUnreadCount() {
        return ResponseEntity.ok(repository.countByViewed(false));
    }

    @GetMapping("/all")
    public ResponseEntity<List<ContactInquiry>> getAllInquiries() {
        return ResponseEntity.ok(repository.findAll());
    }
}
