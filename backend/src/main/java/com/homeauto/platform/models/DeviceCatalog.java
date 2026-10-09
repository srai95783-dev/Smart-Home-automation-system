package com.homeauto.platform.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing certified device models in the compatibility catalog,
 * managed and approved/rejected by Administrators.
 */
@Entity
@Table(name = "device_catalog")
public class DeviceCatalog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String modelName;

    // Categories: LIGHT, THERMOSTAT, SECURITY, SENSOR, APPLIANCE
    @Column(nullable = false)
    private String category;

    @Column(nullable = false)
    private String manufacturer;

    // Protocols: WIFI, ZIGBEE, BLUETOOTH, MATTER
    private String protocol;

    // Status: APPROVED, PENDING, REJECTED
    @Column(nullable = false)
    private String approvalStatus = "APPROVED";

    @Column(length = 1000)
    private String description;

    private LocalDateTime createdAt = LocalDateTime.now();

    public DeviceCatalog() {
    }

    public DeviceCatalog(String modelName, String category, String manufacturer, String protocol, String approvalStatus, String description) {
        this.modelName = modelName;
        this.category = category;
        this.manufacturer = manufacturer;
        this.protocol = protocol;
        this.approvalStatus = approvalStatus;
        this.description = description;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getModelName() {
        return modelName;
    }

    public void setModelName(String modelName) {
        this.modelName = modelName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getProtocol() {
        return protocol;
    }

    public void setProtocol(String protocol) {
        this.protocol = protocol;
    }

    public String getApprovalStatus() {
        return approvalStatus;
    }

    public void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
