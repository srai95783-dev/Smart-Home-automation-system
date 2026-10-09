package com.homeauto.platform.repositories;

import com.homeauto.platform.models.EnergyLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EnergyLogRepository extends JpaRepository<EnergyLog, Long> {
    List<EnergyLog> findByDeviceId(Long deviceId);

    @Query("SELECT e FROM EnergyLog e WHERE e.device.user.id = :userId ORDER BY e.logDate ASC")
    List<EnergyLog> findByUserId(@Param("userId") Long userId);

    @Query("SELECT e FROM EnergyLog e WHERE e.device.user.id = :userId AND e.logDate >= :startDate ORDER BY e.logDate ASC")
    List<EnergyLog> findByUserIdAndDateAfter(@Param("userId") Long userId, @Param("startDate") LocalDate startDate);
}
