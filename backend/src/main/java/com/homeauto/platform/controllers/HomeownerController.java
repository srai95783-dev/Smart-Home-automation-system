package com.homeauto.platform.controllers;

import com.homeauto.platform.dtos.*;
import com.homeauto.platform.models.*;
import com.homeauto.platform.security.UserDetailsImpl;
import com.homeauto.platform.services.AdminService;
import com.homeauto.platform.services.HomeownerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/homeowner")
@PreAuthorize("hasRole('HOMEOWNER')")
@Tag(name = "Homeowner Controls", description = "Endpoints for Smart Device Control, Automation Rules, Environment & Security Monitoring")
@SecurityRequirement(name = "BearerAuthentication")
public class HomeownerController {

    @Autowired
    private HomeownerService homeownerService;

    @Autowired
    private AdminService adminService;

    private Long getUserId(Authentication authentication) {
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        return userDetails.getId();
    }

    // --- Device Management & Controls ---

    @GetMapping("/devices")
    @Operation(summary = "Get Connected Devices", description = "Returns all devices belonging to the logged-in homeowner")
    public ResponseEntity<ApiResponse<List<Device>>> getDevices(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok("Devices retrieved", homeownerService.getDevicesByUserId(getUserId(authentication))));
    }

    @PostMapping("/devices")
    @Operation(summary = "Add New Device", description = "Adds a certified device into the homeowner's home")
    public ResponseEntity<ApiResponse<Device>> addDevice(
            Authentication authentication,
            @Valid @RequestBody DeviceCreateRequest request) {
        Device device = homeownerService.addDevice(getUserId(authentication), request);
        return ResponseEntity.ok(ApiResponse.ok("Device added successfully", device));
    }

    @PatchMapping("/devices/{id}/power")
    @Operation(summary = "Turn Device ON/OFF", description = "Controls the power state of a device (ON or OFF)")
    public ResponseEntity<ApiResponse<Device>> togglePower(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody DevicePowerRequest request) {
        Device device = homeownerService.togglePower(getUserId(authentication), id, request.getPowerState());
        return ResponseEntity.ok(ApiResponse.ok("Device power updated", device));
    }

    @PatchMapping("/devices/{id}/settings")
    @Operation(summary = "Adjust Device Settings", description = "Adjusts thermostat temperature, bulb brightness, or fan level")
    public ResponseEntity<ApiResponse<Device>> updateSettings(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody DeviceSettingsRequest request) {
        Device device = homeownerService.updateSettings(getUserId(authentication), id, request.getSettingValue());
        return ResponseEntity.ok(ApiResponse.ok("Device setting adjusted", device));
    }

    @DeleteMapping("/devices/{id}")
    @Operation(summary = "Remove Device", description = "Unlinks and deletes a device from the home")
    public ResponseEntity<ApiResponse<Void>> deleteDevice(
            Authentication authentication,
            @PathVariable Long id) {
        homeownerService.deleteDevice(getUserId(authentication), id);
        return ResponseEntity.ok(ApiResponse.ok("Device removed successfully"));
    }

    @GetMapping("/catalog")
    @Operation(summary = "Approved Device Catalog", description = "Returns approved models available for installation")
    public ResponseEntity<ApiResponse<List<DeviceCatalog>>> getApprovedCatalog() {
        List<DeviceCatalog> approved = adminService.getAllCatalogDevices().stream()
                .filter(d -> "APPROVED".equalsIgnoreCase(d.getApprovalStatus()))
                .toList();
        return ResponseEntity.ok(ApiResponse.ok("Catalog retrieved", approved));
    }

    // --- Automation Rules ---

    @GetMapping("/rules")
    @Operation(summary = "Get Automation Rules", description = "Retrieves all custom automation rules for this home")
    public ResponseEntity<ApiResponse<List<AutomationRule>>> getRules(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok("Rules retrieved", homeownerService.getRulesByUserId(getUserId(authentication))));
    }

    @PostMapping("/rules")
    @Operation(summary = "Create Automation Rule", description = "Creates a trigger-action automation rule")
    public ResponseEntity<ApiResponse<AutomationRule>> createRule(
            Authentication authentication,
            @Valid @RequestBody AutomationRuleRequest request) {
        AutomationRule rule = homeownerService.createRule(getUserId(authentication), request);
        return ResponseEntity.ok(ApiResponse.ok("Automation rule created", rule));
    }

    @PutMapping("/rules/{id}")
    @Operation(summary = "Update Automation Rule", description = "Modifies an existing automation rule")
    public ResponseEntity<ApiResponse<AutomationRule>> updateRule(
            Authentication authentication,
            @PathVariable Long id,
            @Valid @RequestBody AutomationRuleRequest request) {
        AutomationRule rule = homeownerService.updateRule(getUserId(authentication), id, request);
        return ResponseEntity.ok(ApiResponse.ok("Automation rule updated", rule));
    }

    @PatchMapping("/rules/{id}/toggle")
    @Operation(summary = "Toggle Automation Rule", description = "Enables or disables an automation rule")
    public ResponseEntity<ApiResponse<AutomationRule>> toggleRule(
            Authentication authentication,
            @PathVariable Long id) {
        AutomationRule rule = homeownerService.toggleRule(getUserId(authentication), id);
        return ResponseEntity.ok(ApiResponse.ok("Automation rule status changed", rule));
    }

    @DeleteMapping("/rules/{id}")
    @Operation(summary = "Delete Automation Rule", description = "Deletes an automation rule")
    public ResponseEntity<ApiResponse<Void>> deleteRule(
            Authentication authentication,
            @PathVariable Long id) {
        homeownerService.deleteRule(getUserId(authentication), id);
        return ResponseEntity.ok(ApiResponse.ok("Automation rule deleted"));
    }

    // --- Telemetry & Environmental Monitoring ---

    @GetMapping("/telemetry/environment")
    @Operation(summary = "Environment Telemetry", description = "Current temperature and humidity readings with historical trend points")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getEnvironment(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok("Environment readings", homeownerService.getEnvironmentTelemetry(getUserId(authentication))));
    }

    @GetMapping("/telemetry/security")
    @Operation(summary = "Security Status", description = "Armed status, active locks, and security alerts")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getSecurity(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok("Security status", homeownerService.getSecurityStatus(getUserId(authentication))));
    }

    @GetMapping("/telemetry/energy")
    @Operation(summary = "Energy Consumption Analytics", description = "Daily kWh consumption logs for analytics charts")
    public ResponseEntity<ApiResponse<List<EnergyLog>>> getEnergy(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok("Energy usage records", homeownerService.getEnergyUsage(getUserId(authentication))));
    }

    // --- Homeowner Alerts ---

    @GetMapping("/alerts")
    @Operation(summary = "Get Homeowner Alerts", description = "Returns notifications and security alerts")
    public ResponseEntity<ApiResponse<List<SystemAlert>>> getAlerts(Authentication authentication) {
        return ResponseEntity.ok(ApiResponse.ok("Alerts retrieved", homeownerService.getUserAlerts(getUserId(authentication))));
    }

    @PatchMapping("/alerts/{id}/read")
    @Operation(summary = "Mark Alert Read", description = "Marks a notification alert as read")
    public ResponseEntity<ApiResponse<SystemAlert>> markAlertRead(
            Authentication authentication,
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok("Alert marked as read", homeownerService.markAlertAsRead(getUserId(authentication), id)));
    }
}
