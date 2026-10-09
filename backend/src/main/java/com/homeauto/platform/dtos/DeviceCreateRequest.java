package com.homeauto.platform.dtos;

import jakarta.validation.constraints.NotBlank;

public class DeviceCreateRequest {

    private Long catalogId;

    @NotBlank(message = "Device name is required")
    private String customName;

    @NotBlank(message = "Room location is required")
    private String roomLocation;

    @NotBlank(message = "Category is required")
    private String category;

    private Integer settingValue = 24;

    public DeviceCreateRequest() {
    }

    public Long getCatalogId() {
        return catalogId;
    }

    public void setCatalogId(Long catalogId) {
        this.catalogId = catalogId;
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

    public Integer getSettingValue() {
        return settingValue;
    }

    public void setSettingValue(Integer settingValue) {
        this.settingValue = settingValue;
    }
}
