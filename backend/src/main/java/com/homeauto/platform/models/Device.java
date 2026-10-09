package com.homeauto.platform.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing an active smart device deployed in a homeowner's residence.
 */
@Entity
@Table(name = "devices")
public class Device {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "catalog_id", nullable = true)
    private DeviceCatalog catalog;

    @Column(nullable = false)
    private String customName;

    // Room: Living Room, Bedroom, Kitchen, Bathroom, Porch, Garage, Office
    @Column(nullable = false)
    private String roomLocation;

    // Device Category (e.g. LIGHT, THERMOSTAT, SECURITY, SENSOR, APPLIANCE)
    @Column(nullable = false)
    private String category;

    // Status: ONLINE, OFFLINE
    @Column(nullable = false)
    private String status = "ONLINE";

    // Power State: ON, OFF
    @Column(nullable = false)
    private String powerState = "OFF";

    // Setting value (e.g., thermostat temperature in °C, light brightness %, fan speed)
    private Integer settingValue = 24;

    private LocalDateTime lastUpdated = LocalDateTime.now();

    public Device() {
    }

    public Device(User user, DeviceCatalog catalog, String customName, String roomLocation, String category, String status, String powerState, Integer settingValue) {
        this.user = user;
        this.catalog = catalog;
        this.customName = customName;
        this.roomLocation = roomLocation;
        this.category = category;
        this.status = status;
        this.powerState = powerState;
        this.settingValue = settingValue;
        this.lastUpdated = LocalDateTime.now();
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

    public DeviceCatalog getCatalog() {
        return catalog;
    }

    public void setCatalog(DeviceCatalog catalog) {
        this.catalog = catalog;
    }

    public String getCustomName() {
        return customName;
    }

    public void setCustomName(String customName) {
        this.customName = customName;
    }

    public String getRoomLocation() {
        return roomLocation;
    }

    public void setRoomLocation(String roomLocation) {
        this.roomLocation = roomLocation;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPowerState() {
        return powerState;
    }

    public void setPowerState(String powerState) {
        this.powerState = powerState;
    }

    public Integer getSettingValue() {
        return settingValue;
    }

    public void setSettingValue(Integer settingValue) {
        this.settingValue = settingValue;
    }

    public LocalDateTime getLastUpdated() {
        return lastUpdated;
    }

    public void setLastUpdated(LocalDateTime lastUpdated) {
        this.lastUpdated = lastUpdated;
    }
}
