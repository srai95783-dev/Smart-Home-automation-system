package com.homeauto.platform.repositories;

import com.homeauto.platform.models.SensorData;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SensorDataRepository extends JpaRepository<SensorData, Long> {
    List<SensorData> findByUserId(Long userId);
    List<SensorData> findByUserIdAndSensorTypeOrderByRecordedAtDesc(Long userId, String sensorType);
    List<SensorData> findTop10ByUserIdOrderByRecordedAtDesc(Long userId);
    List<SensorData> findByUserIdAndRecordedAtAfter(Long userId, LocalDateTime after);
}
