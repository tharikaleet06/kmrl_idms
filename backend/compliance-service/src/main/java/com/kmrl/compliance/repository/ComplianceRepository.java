package com.kmrl.compliance.repository;

import com.kmrl.compliance.entity.ComplianceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ComplianceRepository extends JpaRepository<ComplianceRecord, String> {
}