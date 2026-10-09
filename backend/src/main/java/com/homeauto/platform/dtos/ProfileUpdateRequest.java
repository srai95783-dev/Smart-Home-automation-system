package com.homeauto.platform.dtos;

import jakarta.validation.constraints.NotBlank;

public class ProfileUpdateRequest {

    @NotBlank(message = "Full name cannot be blank")
    private String fullName;

    private String phone;

    // Optional: if non-empty, updates the user's password
    private String newPassword;

    public ProfileUpdateRequest() {
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getNewPassword() {
        return newPassword;
    }

    public void setNewPassword(String newPassword) {
        this.newPassword = newPassword;
    }
}
