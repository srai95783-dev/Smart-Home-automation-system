package com.homeauto.platform.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing security alerts and system events.
 * Can be homeowner-specific or global (null user) for administrators.
 */
@Entity
@Table(name = "system_alerts")
public class SystemAlert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = true)
    private User user;

    // Alert Types: SECURITY, SYSTEM_HEALTH, DEVICE_OFFLINE, AUTOMATION_TRIGGERED
    @Column(nullable = false)
    private String alertType;

    // Severity: INFO, WARNING, CRITICAL
    @Column(nullable = false)
    private String severity;

    @Column(nullable = false, length = 1000)
    private String message;

    @Column(nullable = false)
    private boolean isRead = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    public SystemAlert() {
    }

    public SystemAlert(User user, String alertType, String severity, String message) {
        this.user = user;
        this.alertType = alertType;
        this.severity = severity;
        this.message = message;
        this.isRead = false;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getAlertType() {
        return alertType;
    }

    public void setAlertType(String alertType) {
        this.alertType = alertType;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public boolean isRead() {
        return isRead;
    }

    public void setRead(boolean read) {
        isRead = read;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
