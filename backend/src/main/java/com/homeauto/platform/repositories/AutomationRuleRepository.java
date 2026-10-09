package com.homeauto.platform.repositories;

import com.homeauto.platform.models.AutomationRule;
import com.homeauto.platform.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AutomationRuleRepository extends JpaRepository<AutomationRule, Long> {
    List<AutomationRule> findByUser(User user);
    List<AutomationRule> findByUserId(Long userId);
    List<AutomationRule> findByEnabledTrue();
}
