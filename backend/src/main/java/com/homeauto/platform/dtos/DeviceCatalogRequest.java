package com.homeauto.platform.dtos;

import jakarta.validation.constraints.NotBlank;

public class DeviceCatalogRequest {

    @NotBlank(message = "Model name cannot be blank")
    private String modelName;

    @NotBlank(message = "Category cannot be blank")
    private String category;

    @NotBlank(message = "Manufacturer cannot be blank")
    private String manufacturer;

    private String protocol;

    // APPROVED, PENDING, REJECTED
    private String approvalStatus = "APPROVED";

    private String description;

    public DeviceCatalogRequest() {
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
}
