package com.homeauto.platform.services;

import com.homeauto.platform.dtos.*;
import com.homeauto.platform.exceptions.BadRequestException;
import com.homeauto.platform.exceptions.ResourceNotFoundException;
import com.homeauto.platform.models.*;
import com.homeauto.platform.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.lang.management.ManagementFactory;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class AdminService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeviceCatalogRepository deviceCatalogRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private SystemAlertRepository systemAlertRepository;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // --- User Management ---

    public List<UserDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserDto createUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("User with email already exists");
        }
        User user = new User(
                request.getFullName(),
                request.getEmail(),
                passwordEncoder.encode(request.getPassword()),
                request.getRole() != null ? request.getRole() : Role.HOMEOWNER,
                request.getPhone()
        );
        return UserDto.fromEntity(userRepository.save(user));
    }

    @Transactional
    public UserDto updateUser(Long userId, UserUpdateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setActive(request.isActive());

        return UserDto.fromEntity(userRepository.save(user));
    }

    @Transactional
    public void deleteUser(Long userId) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("User not found with id: " + userId);
        }
        userRepository.deleteById(userId);
    }

    // --- Device Compatibility Management ---

    public List<DeviceCatalog> getAllCatalogDevices() {
        return deviceCatalogRepository.findAll();
    }

    @Transactional
    public DeviceCatalog addCatalogDevice(DeviceCatalogRequest request) {
        DeviceCatalog catalog = new DeviceCatalog(
                request.getModelName(),
                request.getCategory(),
                request.getManufacturer(),
                request.getProtocol(),
                request.getApprovalStatus() != null ? request.getApprovalStatus() : "APPROVED",
                request.getDescription()
        );
        return deviceCatalogRepository.save(catalog);
    }

    @Transactional
    public DeviceCatalog updateApprovalStatus(Long catalogId, String status) {
        DeviceCatalog catalog = deviceCatalogRepository.findById(catalogId)
                .orElseThrow(() -> new ResourceNotFoundException("Device model not found in catalog"));

        catalog.setApprovalStatus(status.toUpperCase());
        return deviceCatalogRepository.save(catalog);
    }

    // --- System Monitoring & Alerts ---

    public Map<String, Object> getSystemMetrics() {
        Map<String, Object> metrics = new HashMap<>();

        long totalUsers = userRepository.count();
        long adminCount = userRepository.countByRole(Role.ADMIN);
        long homeownerCount = userRepository.countByRole(Role.HOMEOWNER);
        long totalDevices = deviceRepository.count();
        long onlineDevices = deviceRepository.countByStatus("ONLINE");
        long devicesTurnedOn = deviceRepository.countByPowerState("ON");
        long unreadAlerts = systemAlertRepository.countByUserIdIsNullAndIsReadFalse();

        // JVM and System runtime info for viva demonstration
        Runtime runtime = Runtime.getRuntime();
        long maxMemory = runtime.maxMemory() / (1024 * 1024);
        long totalMemory = runtime.totalMemory() / (1024 * 1024);
        long freeMemory = runtime.freeMemory() / (1024 * 1024);
        long usedMemory = totalMemory - freeMemory;
        long uptimeMs = ManagementFactory.getRuntimeMXBean().getUptime();

        metrics.put("totalUsers", totalUsers);
        metrics.put("adminCount", adminCount);
        metrics.put("homeownerCount", homeownerCount);
        metrics.put("totalDevices", totalDevices);
        metrics.put("onlineDevices", onlineDevices);
        metrics.put("activePoweredDevices", devicesTurnedOn);
        metrics.put("systemAlertsCount", unreadAlerts);
        metrics.put("jvmUsedMemoryMb", usedMemory);
        metrics.put("jvmTotalMemoryMb", totalMemory);
        metrics.put("jvmMaxMemoryMb", maxMemory);
        metrics.put("uptimeSeconds", uptimeMs / 1000);
        metrics.put("systemHealth", "HEALTHY");

        return metrics;
    }

    public List<SystemAlert> getAllAlerts() {
        return systemAlertRepository.findAllByOrderByCreatedAtDesc();
    }

    // --- System Settings ---

    public List<SystemSetting> getAllSettings() {
        return systemSettingRepository.findAll();
    }

    @Transactional
    public SystemSetting updateSetting(String settingKey, SystemSettingRequest request) {
        SystemSetting setting = systemSettingRepository.findBySettingKey(settingKey)
                .orElse(new SystemSetting(settingKey, request.getSettingValue(), request.getDescription()));

        setting.setSettingValue(request.getSettingValue());
        if (request.getDescription() != null) {
            setting.setDescription(request.getDescription());
        }
        return systemSettingRepository.save(setting);
    }
}
