package com.homeauto.platform.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing environmental sensor readings (temperature, humidity, air quality).
 */
@Entity
@Table(name = "sensor_data")
public class SensorData {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String roomLocation;

    // Sensor Types: TEMPERATURE, HUMIDITY, MOTION, GAS_LEVEL
    @Column(nullable = false)
    private String sensorType;

    @Column(nullable = false)
    private Double readingValue;

    private String unit;

    private LocalDateTime recordedAt = LocalDateTime.now();

    public SensorData() {
    }

    public SensorData(User user, String roomLocation, String sensorType, Double readingValue, String unit) {
        this.user = user;
        this.roomLocation = roomLocation;
        this.sensorType = sensorType;
        this.readingValue = readingValue;
        this.unit = unit;
        this.recordedAt = LocalDateTime.now();
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

    public String getRoomLocation() {
        return roomLocation;
    }

    public void setRoomLocation(String roomLocation) {
        this.roomLocation = roomLocation;
    }

    public String getSensorType() {
        return sensorType;
    }

    public void setSensorType(String sensorType) {
        this.sensorType = sensorType;
    }

    public Double getReadingValue() {
        return readingValue;
    }

    public void setReadingValue(Double readingValue) {
        this.readingValue = readingValue;
    }

    public String getUnit() {
        return unit;
    }

    public void setUnit(String unit) {
        this.unit = unit;
    }

    public LocalDateTime getRecordedAt() {
        return recordedAt;
    }

    public void setRecordedAt(LocalDateTime recordedAt) {
        this.recordedAt = recordedAt;
    }
}
