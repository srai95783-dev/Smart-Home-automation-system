package com.homeauto.platform.models;

import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Entity representing an automated conditional rule configured by a homeowner.
 * E.g., "If Temperature > 26°C -> Turn ON Living Room AC".
 */
@Entity
@Table(name = "automation_rules")
public class AutomationRule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "target_device_id", nullable = false)
    private Device targetDevice;

    @Column(nullable = false)
    private String ruleName;

    // Trigger Types: TEMPERATURE_HIGH, TEMPERATURE_LOW, TIME, MOTION_DETECTED, HUMIDITY_HIGH
    @Column(nullable = false)
    private String triggerType;

    // Trigger Condition: e.g. "> 26", "< 18", "22:00", "DETECTED"
    @Column(nullable = false)
    private String triggerCondition;

    // Action Command: TURN_ON, TURN_OFF, SET_VALUE
    @Column(nullable = false)
    private String actionCommand;

    // Value to set if command is SET_VALUE (e.g., "22", "80")
    private String actionValue;

    @Column(nullable = false)
    private boolean enabled = true;

    private LocalDateTime lastTriggered;

    public AutomationRule() {
    }

    public AutomationRule(User user, Device targetDevice, String ruleName, String triggerType, String triggerCondition, String actionCommand, String actionValue, boolean enabled) {
        this.user = user;
        this.targetDevice = targetDevice;
        this.ruleName = ruleName;
        this.triggerType = triggerType;
        this.triggerCondition = triggerCondition;
        this.actionCommand = actionCommand;
        this.actionValue = actionValue;
        this.enabled = enabled;
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

    public Device getTargetDevice() {
        return targetDevice;
    }

    public void setTargetDevice(Device targetDevice) {
        this.targetDevice = targetDevice;
    }

    public String getRuleName() {
        return ruleName;
    }

    public void setRuleName(String ruleName) {
        this.ruleName = ruleName;
    }

    public String getTriggerType() {
        return triggerType;
    }

    public void setTriggerType(String triggerType) {
        this.triggerType = triggerType;
    }

    public String getTriggerCondition() {
        return triggerCondition;
    }

    public void setTriggerCondition(String triggerCondition) {
        this.triggerCondition = triggerCondition;
    }

    public String getActionCommand() {
        return actionCommand;
    }

    public void setActionCommand(String actionCommand) {
        this.actionCommand = actionCommand;
    }

    public String getActionValue() {
        return actionValue;
    }

    public void setActionValue(String actionValue) {
        this.actionValue = actionValue;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public LocalDateTime getLastTriggered() {
        return lastTriggered;
    }

    public void setLastTriggered(LocalDateTime lastTriggered) {
        this.lastTriggered = lastTriggered;
    }
}
