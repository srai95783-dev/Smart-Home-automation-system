package com.homeauto.platform.dtos;

import com.homeauto.platform.models.Role;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class UserUpdateRequest {

    @NotBlank(message = "Full name cannot be blank")
    private String fullName;

    private String phone;

    @NotNull(message = "Role must be specified")
    private Role role;

    private boolean active;

    public UserUpdateRequest() {
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

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }
}
