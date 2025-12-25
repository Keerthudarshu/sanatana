package com.eduprajna.config;

import java.sql.Connection;
import java.sql.SQLException;

import javax.sql.DataSource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DbStartupChecker implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DbStartupChecker.class);

    private final DataSource dataSource;

    public DbStartupChecker(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("Checking database connectivity at startup...");
        try (Connection c = dataSource.getConnection()) {
            if (c == null || c.isClosed()) {
                log.error("Unable to obtain a valid DB connection (null/closed)");
            } else {
                log.info("Database connection OK (catalog={})", c.getCatalog());
            }
        } catch (SQLException ex) {
            log.error("Database connectivity check failed: {}", ex.getMessage(), ex);
        }
    }
}
