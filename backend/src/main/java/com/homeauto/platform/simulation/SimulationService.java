package com.homeauto.platform.simulation;

import com.homeauto.platform.models.*;
import com.homeauto.platform.repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Random;

/**
 * IoT Sensor and Automation Rule Simulator.
 * 
 * Runs background scheduled jobs to:
 * 1. Generate realistic fluctuations in room temperature & humidity.
 * 2. Evaluate active automation rules against live telemetry.
 * 3. Log simulated energy consumption for running appliances.
 */
@Service
public class SimulationService {

    private static final Logger logger = LoggerFactory.getLogger(SimulationService.class);
    private final Random random = new Random();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private SensorDataRepository sensorDataRepository;

    @Autowired
    private AutomationRuleRepository automationRuleRepository;

    @Autowired
    private EnergyLogRepository energyLogRepository;

    @Autowired
    private SystemAlertRepository systemAlertRepository;

    /**
     * Simulates environment sensor readings every 25 seconds.
     */
    @Scheduled(fixedRate = 25000, initialDelay = 10000)
    @Transactional
    public void simulateSensorTelemetry() {
        List<User> homeowners = userRepository.findByRole(Role.HOMEOWNER);

        for (User homeowner : homeowners) {
            // Generate temperature between 22.0°C and 28.5°C
            double temp = Math.round((22.0 + (random.nextDouble() * 6.5)) * 10.0) / 10.0;
            // Generate humidity between 40% and 65%
            double hum = Math.round((40.0 + (random.nextDouble() * 25.0)) * 10.0) / 10.0;

            SensorData tempData = new SensorData(homeowner, "Living Room", "TEMPERATURE", temp, "°C");
            SensorData humData = new SensorData(homeowner, "Living Room", "HUMIDITY", hum, "%");

            sensorDataRepository.save(tempData);
            sensorDataRepository.save(humData);

            // Evaluate automation rules based on this new reading
            evaluateAutomationRules(homeowner, temp, hum);
        }
    }

    /**
     * Evaluates active automation rules against latest telemetry.
     */
    private void evaluateAutomationRules(User homeowner, double currentTemp, double currentHum) {
        List<AutomationRule> activeRules = automationRuleRepository.findByUserId(homeowner.getId())
                .stream()
                .filter(AutomationRule::isEnabled)
                .toList();

        for (AutomationRule rule : activeRules) {
            boolean triggered = false;

            if ("TEMPERATURE_HIGH".equalsIgnoreCase(rule.getTriggerType())) {
                try {
                    String cleanCondition = rule.getTriggerCondition().replaceAll("[^0-9.]", "");
                    double threshold = Double.parseDouble(cleanCondition);
                    if (currentTemp > threshold) {
                        triggered = true;
                    }
                } catch (Exception ignored) {
                }
            } else if ("HUMIDITY_HIGH".equalsIgnoreCase(rule.getTriggerType())) {
                try {
                    String cleanCondition = rule.getTriggerCondition().replaceAll("[^0-9.]", "");
                    double threshold = Double.parseDouble(cleanCondition);
                    if (currentHum > threshold) {
                        triggered = true;
                    }
                } catch (Exception ignored) {
                }
            }

            if (triggered) {
                Device targetDevice = rule.getTargetDevice();
                if (targetDevice != null) {
                    if ("TURN_ON".equalsIgnoreCase(rule.getActionCommand()) && "OFF".equalsIgnoreCase(targetDevice.getPowerState())) {
                        targetDevice.setPowerState("ON");
                        targetDevice.setLastUpdated(LocalDateTime.now());
                        deviceRepository.save(targetDevice);

                        rule.setLastTriggered(LocalDateTime.now());
                        automationRuleRepository.save(rule);

                        String msg = String.format("Automation rule '%s' triggered: Automatically turned ON %s (Temp: %.1f°C)",
                                rule.getRuleName(), targetDevice.getCustomName(), currentTemp);
                        systemAlertRepository.save(new SystemAlert(homeowner, "AUTOMATION_TRIGGERED", "INFO", msg));
                        logger.info(msg);
                    } else if ("TURN_OFF".equalsIgnoreCase(rule.getActionCommand()) && "ON".equalsIgnoreCase(targetDevice.getPowerState())) {
                        targetDevice.setPowerState("OFF");
                        targetDevice.setLastUpdated(LocalDateTime.now());
                        deviceRepository.save(targetDevice);

                        rule.setLastTriggered(LocalDateTime.now());
                        automationRuleRepository.save(rule);

                        String msg = String.format("Automation rule '%s' triggered: Turned OFF %s",
                                rule.getRuleName(), targetDevice.getCustomName());
                        systemAlertRepository.save(new SystemAlert(homeowner, "AUTOMATION_TRIGGERED", "INFO", msg));
                        logger.info(msg);
                    }
                }
            }
        }
    }

    /**
     * Incrementally simulates energy consumption for devices that are ON every 60 seconds.
     */
    @Scheduled(fixedRate = 60000, initialDelay = 15000)
    @Transactional
    public void simulateEnergyConsumption() {
        List<Device> activeDevices = deviceRepository.findAll().stream()
                .filter(d -> "ON".equalsIgnoreCase(d.getPowerState()))
                .toList();

        LocalDate today = LocalDate.now();

        for (Device device : activeDevices) {
            // Power consumption simulation based on device category
            double deltaKwh;
            if ("THERMOSTAT".equalsIgnoreCase(device.getCategory()) || "APPLIANCE".equalsIgnoreCase(device.getCategory())) {
                deltaKwh = 0.05 + (random.nextDouble() * 0.03); // higher power draw
            } else {
                deltaKwh = 0.01 + (random.nextDouble() * 0.01); // light / sensor
            }

            EnergyLog log = new EnergyLog(device, Math.round(deltaKwh * 100.0) / 100.0, today, LocalDateTime.now().getHour());
            energyLogRepository.save(log);
        }
    }
}
