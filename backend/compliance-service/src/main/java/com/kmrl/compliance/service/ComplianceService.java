package com.kmrl.compliance.service;

import com.kmrl.compliance.entity.ComplianceRecord;
import com.kmrl.compliance.repository.ComplianceRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class ComplianceService {

    private final ComplianceRepository complianceRepository;

    @Autowired
    public ComplianceService(ComplianceRepository complianceRepository) {
        this.complianceRepository = complianceRepository;
    }

    @PostConstruct
    public void seedData() {
        if (complianceRepository.count() == 0) {
            complianceRepository.save(new ComplianceRecord("cmp-001", "Metro Railway Safety & Clearance Act 2024", "Statutory Safety", "Operations & Safety", "Compliant", "2026-07-20", "Compliance Officer", "All CMRS guidelines satisfied."));
            complianceRepository.save(new ComplianceRecord("cmp-002", "Environmental Protection Impact Assessment Phase II", "Environmental", "Civil Works", "Under Review", "2026-08-01", "Environmental Consultant", "Pending Kerala PCB final NOC."));
        }
    }

    public List<ComplianceRecord> getAllRecords() {
        return complianceRepository.findAll();
    }

    public ComplianceRecord saveRecord(ComplianceRecord record) {
        if (record.getId() == null || record.getId().isEmpty()) {
            record.setId("cmp-" + String.format(java.util.Locale.US, "%03d", (complianceRepository.count() + 1)));
        }
        return complianceRepository.save(record);
    }

    public ComplianceRecord updateRecord(String id, ComplianceRecord updated) {
        Optional<ComplianceRecord> opt = complianceRepository.findById(id);
        if (opt.isPresent()) {
            ComplianceRecord rec = opt.get();
            if (updated.getStatus() != null) rec.setStatus(updated.getStatus());
            if (updated.getNotes() != null) rec.setNotes(updated.getNotes());
            if (updated.getOfficer() != null) rec.setOfficer(updated.getOfficer());
            if (updated.getTitle() != null) rec.setTitle(updated.getTitle());
            if (updated.getDepartment() != null) rec.setDepartment(updated.getDepartment());
            if (updated.getRegulationType() != null) rec.setRegulationType(updated.getRegulationType());
            return complianceRepository.save(rec);
        }
        if (updated.getId() == null) updated.setId(id);
        return saveRecord(updated);
    }

    public ComplianceRecord updateStatus(String id, String status, String notes, String officer) {
        Optional<ComplianceRecord> opt = complianceRepository.findById(id);
        ComplianceRecord rec;
        if (opt.isPresent()) {
            rec = opt.get();
        } else {
            rec = new ComplianceRecord(id, "Statutory Compliance Record " + id, "Statutory Safety", "Operations", status != null ? status : "Under Review", "2026-08-30", officer != null ? officer : "Compliance Officer", notes != null ? notes : "Updated compliance status.");
        }
        if (status != null && !status.trim().isEmpty()) rec.setStatus(status);
        if (notes != null && !notes.trim().isEmpty()) rec.setNotes(notes);
        if (officer != null && !officer.trim().isEmpty()) rec.setOfficer(officer);
        return complianceRepository.save(rec);
    }
}