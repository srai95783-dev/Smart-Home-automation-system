package com.homeauto.platform.config;

import com.homeauto.platform.models.*;
import com.homeauto.platform.repositories.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Seeds rich demo data into the database on first run.
 * 
 * Includes:
 * - Admin and Homeowner user accounts
 * - Device compatibility catalog
 * - Realistic smart home devices
 * - Pre-configured automation rules
 * - Environment sensor history (temperature & humidity)
 * - Energy logs for interactive charts
 * - Default system settings and alerts
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private static final Logger logger = LoggerFactory.getLogger(DataInitializer.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeviceCatalogRepository deviceCatalogRepository;

    @Autowired
    private DeviceRepository deviceRepository;

    @Autowired
    private AutomationRuleRepository automationRuleRepository;

    @Autowired
    private SensorDataRepository sensorDataRepository;

    @Autowired
    private EnergyLogRepository energyLogRepository;

    @Autowired
    private SystemAlertRepository systemAlertRepository;

    @Autowired
    private SystemSettingRepository systemSettingRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (userRepository.count() > 0) {
            logger.info("Database already seeded with demo data. Skipping initialization.");
            return;
        }

        logger.info("Initializing demo data for college project demonstration...");

        // 1. Create Default Users
        User admin = new User(
                "System Administrator",
                "admin@homeauto.com",
                passwordEncoder.encode("admin123"),
                Role.ADMIN,
                "+1-800-555-0100"
        );
        userRepository.save(admin);

        User john = new User(
                "John Doe",
                "john@homeauto.com",
                passwordEncoder.encode("john123"),
                Role.HOMEOWNER,
                "+1-800-555-0199"
        );
        userRepository.save(john);

        User sarah = new User(
                "Sarah Miller",
                "sarah@homeauto.com",
                passwordEncoder.encode("sarah123"),
                Role.HOMEOWNER,
                "+1-800-555-0288"
        );
        userRepository.save(sarah);

        // 2. Create Device Catalog Items
        DeviceCatalog hueLight = new DeviceCatalog(
                "Philips Hue Smart Bulb", "LIGHT", "Philips", "ZIGBEE", "APPROVED",
                "16 million colors smart LED bulb with wireless dimming"
        );
        DeviceCatalog nestThermostat = new DeviceCatalog(
                "Nest Smart Thermostat", "THERMOSTAT", "Google", "WIFI", "APPROVED",
                "Energy star certified learning programmable thermostat"
        );
        DeviceCatalog ringCamera = new DeviceCatalog(
                "Ring Floodlight Cam Pro", "SECURITY", "Ring", "WIFI", "APPROVED",
                "Outdoor security camera with 1080p HDR and motion-activated floodlights"
        );
        DeviceCatalog samsungAc = new DeviceCatalog(
                "Samsung WindFree Smart AC", "APPLIANCE", "Samsung", "WIFI", "APPROVED",
                "Inverter smart air conditioner with AI climate control"
        );
        DeviceCatalog tpLinkPlug = new DeviceCatalog(
                "TP-Link Kasa Smart Plug", "APPLIANCE", "TP-Link", "WIFI", "APPROVED",
                "Compact Wi-Fi smart outlet with energy monitoring"
        );
        DeviceCatalog yaleLock = new DeviceCatalog(
                "Yale Assure Smart Deadbolt", "SECURITY", "Yale", "BLUETOOTH", "APPROVED",
                "Keyless touchscreen smart door lock"
        );
        DeviceCatalog smokeSensor = new DeviceCatalog(
                "Generic Smoke & Gas Detector", "SENSOR", "GenericIoT", "WIFI", "PENDING",
                "Smart photo-electric smoke and combustible gas sensor"
        );

        deviceCatalogRepository.save(hueLight);
        deviceCatalogRepository.save(nestThermostat);
        deviceCatalogRepository.save(ringCamera);
        deviceCatalogRepository.save(samsungAc);
        deviceCatalogRepository.save(tpLinkPlug);
        deviceCatalogRepository.save(yaleLock);
        deviceCatalogRepository.save(smokeSensor);

        // 3. Create Home Devices for John
        Device johnAc = new Device(john, samsungAc, "Living Room Smart AC", "Living Room", "APPLIANCE", "ONLINE", "ON", 23);
        Device johnLight = new Device(john, hueLight, "Living Room Ceiling Light", "Living Room", "LIGHT", "ONLINE", "ON", 85);
        Device johnBedroomLamp = new Device(john, hueLight, "Bedroom Ambient Lamp", "Bedroom", "LIGHT", "ONLINE", "OFF", 60);
        Device johnDoorLock = new Device(john, yaleLock, "Front Door Deadbolt", "Porch", "SECURITY", "ONLINE", "ON", 1);
        Device johnKitchenPlug = new Device(john, tpLinkPlug, "Kitchen Coffee Maker", "Kitchen", "APPLIANCE", "ONLINE", "OFF", 0);

        deviceRepository.save(johnAc);
        deviceRepository.save(johnLight);
        deviceRepository.save(johnBedroomLamp);
        deviceRepository.save(johnDoorLock);
        deviceRepository.save(johnKitchenPlug);

        // Devices for Sarah
        Device sarahLight = new Device(sarah, hueLight, "Studio Light", "Living Room", "LIGHT", "ONLINE", "ON", 70);
        Device sarahCamera = new Device(sarah, ringCamera, "Driveway Security Cam", "Porch", "SECURITY", "ONLINE", "ON", 1);
        deviceRepository.save(sarahLight);
        deviceRepository.save(sarahCamera);

        // 4. Create Automation Rules for John
        AutomationRule rule1 = new AutomationRule(
                john,
                johnAc,
                "Auto-Cool if Temp > 26°C",
                "TEMPERATURE_HIGH",
                "> 26",
                "TURN_ON",
                "22",
                true
        );
        AutomationRule rule2 = new AutomationRule(
                john,
                johnDoorLock,
                "Night Security Lock at 22:00",
                "TIME",
                "22:00",
                "TURN_ON",
                "1",
                true
        );
        automationRuleRepository.save(rule1);
        automationRuleRepository.save(rule2);

        // 5. Create Historical Sensor Readings for John
        LocalDateTime now = LocalDateTime.now();
        double[] tempSamples = {22.4, 23.1, 23.8, 24.5, 25.2, 25.9, 26.4, 26.1, 25.5, 24.8, 24.2, 23.9};
        double[] humSamples = {55.0, 56.2, 58.1, 59.4, 57.8, 54.2, 52.0, 51.5, 53.0, 54.4, 55.2, 56.0};

        for (int i = 0; i < tempSamples.length; i++) {
            LocalDateTime ts = now.minusHours(tempSamples.length - i);
            SensorData td = new SensorData(john, "Living Room", "TEMPERATURE", tempSamples[i], "°C");
            td.setRecordedAt(ts);
            sensorDataRepository.save(td);

            SensorData hd = new SensorData(john, "Living Room", "HUMIDITY", humSamples[i], "%");
            hd.setRecordedAt(ts);
            sensorDataRepository.save(hd);
        }

        // 6. Create Historical Energy Logs for the last 7 days
        LocalDate today = LocalDate.now();
        double[] acEnergy = {3.2, 4.1, 3.8, 2.9, 4.5, 3.6, 2.8};
        double[] lightEnergy = {0.8, 0.9, 0.7, 0.8, 1.1, 0.9, 0.6};

        for (int i = 0; i < 7; i++) {
            LocalDate date = today.minusDays(6 - i);
            energyLogRepository.save(new EnergyLog(johnAc, acEnergy[i], date, 20));
            energyLogRepository.save(new EnergyLog(johnLight, lightEnergy[i], date, 21));
        }

        // 7. System Settings
        systemSettingRepository.save(new SystemSetting("alert_threshold_temp", "32", "High temperature danger threshold (°C)"));
        systemSettingRepository.save(new SystemSetting("maintenance_mode", "false", "Platform maintenance toggle"));
        systemSettingRepository.save(new SystemSetting("max_devices_per_user", "25", "Maximum devices a homeowner can register"));
        systemSettingRepository.save(new SystemSetting("energy_rate_kwh", "0.14", "Electricity cost per kWh in USD"));

        // 8. Initial Alerts
        systemAlertRepository.save(new SystemAlert(null, "SYSTEM_HEALTH", "INFO", "System initialized and all services are operational."));
        systemAlertRepository.save(new SystemAlert(john, "SECURITY", "INFO", "Front Door Deadbolt locked automatically."));
        systemAlertRepository.save(new SystemAlert(john, "DEVICE_OFFLINE", "WARNING", "Guest Bedroom Light disconnected briefly."));

        logger.info("Demo data initialization complete! Default credentials:");
        logger.info("Admin:     admin@homeauto.com / admin123");
        logger.info("Homeowner: john@homeauto.com  / john123");
    }
}
