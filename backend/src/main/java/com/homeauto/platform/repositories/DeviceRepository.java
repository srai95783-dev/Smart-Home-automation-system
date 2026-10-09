package com.homeauto.platform.repositories;

import com.homeauto.platform.models.Device;
import com.homeauto.platform.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceRepository extends JpaRepository<Device, Long> {
    List<Device> findByUser(User user);
    List<Device> findByUserId(Long userId);
    List<Device> findByUserIdAndRoomLocation(Long userId, String roomLocation);
    long countByPowerState(String powerState);
    long countByStatus(String status);
}
