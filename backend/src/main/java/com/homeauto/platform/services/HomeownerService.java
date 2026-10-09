package com.homeauto.platform.services;

import com.homeauto.platform.dtos.AutomationRuleRequest;
import com.homeauto.platform.dtos.DeviceCreateRequest;
import com.homeauto.platform.exceptions.BadRequestException;
import com.homeauto.platform.exceptions.ResourceNotFoundException;
import com.homeauto.platform.models.*;
import com.homeauto.platform.repositories.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class HomeownerService {

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private DeviceCatalogRepository deviceCatalogRepository;

    @Autowired
    private AutomationRuleRepository automationRuleRepository;

    @Autowired
    private SensorDataRepository sensorDataRepository;

    @Autowired
    private EnergyLogRepository energyLogRepository;

    @Autowired
    private SystemAlertRepository systemAlertRepository;

    @Autowired
    private UserRepository userRepository;

    // --- Device Management & Controls ---

    public List<Device> getDevicesByUserId(Long userId) {
        return deviceRepository.findByUserId(userId);
    }

    @Transactional
    public Device addDevice(Long userId, DeviceCreateRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        DeviceCatalog catalog = null;
        if (request.getCatalogId() != null) {
            catalog = deviceCatalogRepository.findById(request.getCatalogId()).orElse(null);
            if (catalog != null && "REJECTED".equalsIgnoreCase(catalog.getApprovalStatus())) {
                throw new BadRequestException("Cannot add device: This model has been rejected by Administrator");
            }
        }

        Device device = new Device(
                user,
                catalog,
                request.getCustomName(),
                request.getRoomLocation(),
                request.getCategory(),
                "ONLINE",
                "OFF",
                request.getSettingValue() != null ? request.getSettingValue() : 24
        );

        return deviceRepository.save(device);
    }

    @Transactional
    public Device togglePower(Long userId, Long deviceId, String powerState) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found"));

        if (!device.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this device");
        }

        device.setPowerState(powerState.toUpperCase());
        device.setLastUpdated(LocalDateTime.now());
        return deviceRepository.save(device);
    }

    @Transactional
    public Device updateSettings(Long userId, Long deviceId, Integer settingValue) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found"));

        if (!device.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this device");
        }

        device.setSettingValue(settingValue);
        device.setLastUpdated(LocalDateTime.now());
        return deviceRepository.save(device);
    }

    @Transactional
    public void deleteDevice(Long userId, Long deviceId) {
        Device device = deviceRepository.findById(deviceId)
                .orElseThrow(() -> new ResourceNotFoundException("Device not found"));

        if (!device.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this device");
        }

        deviceRepository.delete(device);
    }

    // --- Automation Rules Engine ---

    public List<AutomationRule> getRulesByUserId(Long userId) {
        return automationRuleRepository.findByUserId(userId);
    }

    @Transactional
    public AutomationRule createRule(Long userId, AutomationRuleRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        Device targetDevice = deviceRepository.findById(request.getTargetDeviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Target device not found"));

        if (!targetDevice.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only create rules for your own devices");
        }

        AutomationRule rule = new AutomationRule(
                user,
                targetDevice,
                request.getRuleName(),
                request.getTriggerType(),
                request.getTriggerCondition(),
                request.getActionCommand(),
                request.getActionValue(),
                request.isEnabled()
        );

        return automationRuleRepository.save(rule);
    }

    @Transactional
    public AutomationRule updateRule(Long userId, Long ruleId, AutomationRuleRequest request) {
        AutomationRule rule = automationRuleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found"));

        if (!rule.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this rule");
        }

        Device targetDevice = deviceRepository.findById(request.getTargetDeviceId())
                .orElseThrow(() -> new ResourceNotFoundException("Target device not found"));

        rule.setRuleName(request.getRuleName());
        rule.setTriggerType(request.getTriggerType());
        rule.setTriggerCondition(request.getTriggerCondition());
        rule.setActionCommand(request.getActionCommand());
        rule.setActionValue(request.getActionValue());
        rule.setEnabled(request.isEnabled());
        rule.setTargetDevice(targetDevice);

        return automationRuleRepository.save(rule);
    }

    @Transactional
    public AutomationRule toggleRule(Long userId, Long ruleId) {
        AutomationRule rule = automationRuleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found"));

        if (!rule.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this rule");
        }

        rule.setEnabled(!rule.isEnabled());
        return automationRuleRepository.save(rule);
    }

    @Transactional
    public void deleteRule(Long userId, Long ruleId) {
        AutomationRule rule = automationRuleRepository.findById(ruleId)
                .orElseThrow(() -> new ResourceNotFoundException("Rule not found"));

        if (!rule.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this rule");
        }

        automationRuleRepository.delete(rule);
    }

    // --- Environment Telemetry (Temperature & Humidity) ---

    public Map<String, Object> getEnvironmentTelemetry(Long userId) {
        Map<String, Object> data = new HashMap<>();

        List<SensorData> temps = sensorDataRepository.findByUserIdAndSensorTypeOrderByRecordedAtDesc(userId, "TEMPERATURE");
        List<SensorData> hums = sensorDataRepository.findByUserIdAndSensorTypeOrderByRecordedAtDesc(userId, "HUMIDITY");

        double currentTemp = temps.isEmpty() ? 24.5 : temps.get(0).getReadingValue();
        double currentHum = hums.isEmpty() ? 52.0 : hums.get(0).getReadingValue();

        data.put("currentTemperature", currentTemp);
        data.put("currentHumidity", currentHum);
        data.put("temperatureHistory", temps.stream().limit(15).toList());
        data.put("humidityHistory", hums.stream().limit(15).toList());

        return data;
    }

    // --- Security Status ---

    public Map<String, Object> getSecurityStatus(Long userId) {
        Map<String, Object> security = new HashMap<>();

        List<Device> userDevices = deviceRepository.findByUserId(userId);
        long lockCount = userDevices.stream().filter(d -> "SECURITY".equalsIgnoreCase(d.getCategory())).count();
        long activeLocks = userDevices.stream()
                .filter(d -> "SECURITY".equalsIgnoreCase(d.getCategory()) && "ON".equalsIgnoreCase(d.getPowerState()))
                .count();

        List<SystemAlert> securityAlerts = systemAlertRepository.findByUserIdOrderByCreatedAtDesc(userId).stream()
                .filter(a -> "SECURITY".equalsIgnoreCase(a.getAlertType()))
                .toList();

        boolean armed = activeLocks > 0;
        security.put("armed", armed);
        security.put("totalSecurityDevices", lockCount);
        security.put("activeArmedDevices", activeLocks);
        security.put("recentSecurityAlerts", securityAlerts.stream().limit(10).toList());
        security.put("overallStatus", securityAlerts.stream().anyMatch(a -> !a.isRead()) ? "ALERT" : "SECURED");

        return security;
    }

    // --- Energy Usage ---

    public List<EnergyLog> getEnergyUsage(Long userId) {
        LocalDate sevenDaysAgo = LocalDate.now().minusDays(7);
        return energyLogRepository.findByUserIdAndDateAfter(userId, sevenDaysAgo);
    }

    // --- User Alerts ---

    public List<SystemAlert> getUserAlerts(Long userId) {
        return systemAlertRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Transactional
    public SystemAlert markAlertAsRead(Long userId, Long alertId) {
        SystemAlert alert = systemAlertRepository.findById(alertId)
                .orElseThrow(() -> new ResourceNotFoundException("Alert not found"));

        if (alert.getUser() != null && !alert.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this alert");
        }

        alert.setRead(true);
        return systemAlertRepository.save(alert);
    }
}
