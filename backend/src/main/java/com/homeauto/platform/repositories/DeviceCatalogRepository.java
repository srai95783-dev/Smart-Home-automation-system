package com.homeauto.platform.repositories;

import com.homeauto.platform.models.DeviceCatalog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DeviceCatalogRepository extends JpaRepository<DeviceCatalog, Long> {
    List<DeviceCatalog> findByApprovalStatus(String approvalStatus);
    List<DeviceCatalog> findByCategory(String category);
}
