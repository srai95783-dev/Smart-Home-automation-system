package com.homeauto.platform.repositories;

import com.homeauto.platform.models.SystemAlert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemAlertRepository extends JpaRepository<SystemAlert, Long> {
    List<SystemAlert> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<SystemAlert> findByUserIdIsNullOrderByCreatedAtDesc(); // Global system alerts for Admin
    List<SystemAlert> findAllByOrderByCreatedAtDesc();
    long countByUserIdAndIsReadFalse(Long userId);
    long countByUserIdIsNullAndIsReadFalse();
}
