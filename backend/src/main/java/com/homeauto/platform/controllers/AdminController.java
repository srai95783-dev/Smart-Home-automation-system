package com.homeauto.platform.controllers;

import com.homeauto.platform.dtos.*;
import com.homeauto.platform.models.DeviceCatalog;
import com.homeauto.platform.models.SystemAlert;
import com.homeauto.platform.models.SystemSetting;
import com.homeauto.platform.services.AdminService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
@Tag(name = "Admin Operations", description = "Endpoints for System Administration and Device Compatibility")
@SecurityRequirement(name = "BearerAuthentication")
public class AdminController {

    @Autowired
    private AdminService adminService;

    // --- User Management ---

    @GetMapping("/users")
    @Operation(summary = "List All Users", description = "Returns a list of all registered platform users")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok("Users retrieved successfully", adminService.getAllUsers()));
    }

    @PostMapping("/users")
    @Operation(summary = "Create User", description = "Admin can manually register users and assign ADMIN or HOMEOWNER role")
    public ResponseEntity<ApiResponse<UserDto>> createUser(@Valid @RequestBody RegisterRequest request) {
        UserDto newUser = adminService.createUser(request);
        return ResponseEntity.ok(ApiResponse.ok("User created successfully", newUser));
    }

    @PutMapping("/users/{id}")
    @Operation(summary = "Update User & Role", description = "Modify user details, status, or role")
    public ResponseEntity<ApiResponse<UserDto>> updateUser(
            @PathVariable Long id,
            @Valid @RequestBody UserUpdateRequest request) {
        UserDto updated = adminService.updateUser(id, request);
        return ResponseEntity.ok(ApiResponse.ok("User updated successfully", updated));
    }

    @DeleteMapping("/users/{id}")
    @Operation(summary = "Delete User", description = "Remove a user account from the platform")
    public ResponseEntity<ApiResponse<Void>> deleteUser(@PathVariable Long id) {
        adminService.deleteUser(id);
        return ResponseEntity.ok(ApiResponse.ok("User deleted successfully"));
    }

    // --- Device Compatibility Management ---

    @GetMapping("/devices/catalog")
    @Operation(summary = "List Device Catalog", description = "View all hardware models and their approval status")
    public ResponseEntity<ApiResponse<List<DeviceCatalog>>> getCatalog() {
        return ResponseEntity.ok(ApiResponse.ok("Device catalog retrieved", adminService.getAllCatalogDevices()));
    }

    @PostMapping("/devices/catalog")
    @Operation(summary = "Add Device Model", description = "Add a new hardware model to compatibility specifications")
    public ResponseEntity<ApiResponse<DeviceCatalog>> addCatalogDevice(@Valid @RequestBody DeviceCatalogRequest request) {
        DeviceCatalog created = adminService.addCatalogDevice(request);
        return ResponseEntity.ok(ApiResponse.ok("Device model added to catalog", created));
    }

    @PatchMapping("/devices/catalog/{id}/approval")
    @Operation(summary = "Approve or Reject Device", description = "Change approval status to APPROVED, REJECTED, or PENDING")
    public ResponseEntity<ApiResponse<DeviceCatalog>> updateApprovalStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        DeviceCatalog updated = adminService.updateApprovalStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Device status updated to " + status, updated));
    }

    // --- System Monitoring & Alerts ---

    @GetMapping("/system/metrics")
    @Operation(summary = "System Metrics", description = "Returns JVM memory usage, total users, online devices, and uptime")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getMetrics() {
        return ResponseEntity.ok(ApiResponse.ok("System metrics retrieved", adminService.getSystemMetrics()));
    }

    @GetMapping("/system/alerts")
    @Operation(summary = "System Alerts", description = "View platform and security alerts")
    public ResponseEntity<ApiResponse<List<SystemAlert>>> getAlerts() {
        return ResponseEntity.ok(ApiResponse.ok("System alerts retrieved", adminService.getAllAlerts()));
    }

    // --- System Settings ---

    @GetMapping("/settings")
    @Operation(summary = "Get System Settings", description = "Retrieve global system settings")
    public ResponseEntity<ApiResponse<List<SystemSetting>>> getSettings() {
        return ResponseEntity.ok(ApiResponse.ok("Settings retrieved", adminService.getAllSettings()));
    }

    @PutMapping("/settings/{key}")
    @Operation(summary = "Update System Setting", description = "Modify a global configuration property")
    public ResponseEntity<ApiResponse<SystemSetting>> updateSetting(
            @PathVariable String key,
            @Valid @RequestBody SystemSettingRequest request) {
        SystemSetting updated = adminService.updateSetting(key, request);
        return ResponseEntity.ok(ApiResponse.ok("Setting updated successfully", updated));
    }
}
