package com.homeauto.platform.dtos;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class AutomationRuleRequest {

    @NotBlank(message = "Rule name is required")
    private String ruleName;

    @NotBlank(message = "Trigger type is required (e.g. TEMPERATURE_HIGH, TIME, MOTION_DETECTED)")
    private String triggerType;

    @NotBlank(message = "Trigger condition is required (e.g. > 26, 22:00, DETECTED)")
    private String triggerCondition;

    @NotNull(message = "Target device ID is required")
    private Long targetDeviceId;

    @NotBlank(message = "Action command is required (TURN_ON, TURN_OFF, SET_VALUE)")
    private String actionCommand;

    private String actionValue;

    private boolean enabled = true;

    public AutomationRuleRequest() {
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

    public Long getTargetDeviceId() {
        return targetDeviceId;
    }

    public void setTargetDeviceId(Long targetDeviceId) {
        this.targetDeviceId = targetDeviceId;
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
}
