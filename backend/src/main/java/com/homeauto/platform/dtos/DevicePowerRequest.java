package com.homeauto.platform.dtos;

import jakarta.validation.constraints.Pattern;

public class DevicePowerRequest {

    @Pattern(regexp = "^(ON|OFF)$", message = "Power state must be either ON or OFF")
    private String powerState;

    public DevicePowerRequest() {
    }

    public DevicePowerRequest(String powerState) {
        this.powerState = powerState;
    }

    public String getPowerState() {
        return powerState;
    }

    public void setPowerState(String powerState) {
        this.powerState = powerState;
    }
}
