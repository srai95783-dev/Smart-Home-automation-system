package com.homeauto.platform.dtos;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class DeviceSettingsRequest {

    @NotNull(message = "Setting value cannot be null")
    @Min(value = 0, message = "Setting value must be at least 0")
    @Max(value = 100, message = "Setting value must not exceed 100")
    private Integer settingValue;

    public DeviceSettingsRequest() {
    }

    public DeviceSettingsRequest(Integer settingValue) {
        this.settingValue = settingValue;
    }

    public Integer getSettingValue() {
        return settingValue;
    }

    public void setSettingValue(Integer settingValue) {
        this.settingValue = settingValue;
    }
}
