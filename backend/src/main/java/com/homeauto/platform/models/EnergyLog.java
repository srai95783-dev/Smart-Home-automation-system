package com.homeauto.platform.models;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Entity representing energy usage records (in kilowatt-hours, kWh).
 */
@Entity
@Table(name = "energy_logs")
public class EnergyLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "device_id", nullable = false)
    private Device device;

    @Column(nullable = false)
    private Double energyKwh;

    @Column(nullable = false)
    private LocalDate logDate;

    // Optional hour (0-23) for hourly breakdown
    private Integer logHour;

    public EnergyLog() {
    }

    public EnergyLog(Device device, Double energyKwh, LocalDate logDate, Integer logHour) {
        this.device = device;
        this.energyKwh = energyKwh;
        this.logDate = logDate;
        this.logHour = logHour;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Device getDevice() {
        return device;
    }

    public void setDevice(Device device) {
        this.device = device;
    }

    public Double getEnergyKwh() {
        return energyKwh;
    }

    public void setEnergyKwh(Double energyKwh) {
        this.energyKwh = energyKwh;
    }

    public LocalDate getLogDate() {
        return logDate;
    }

    public void setLogDate(LocalDate logDate) {
        this.logDate = logDate;
    }

    public Integer getLogHour() {
        return logHour;
    }

    public void setLogHour(Integer logHour) {
        this.logHour = logHour;
    }
}
