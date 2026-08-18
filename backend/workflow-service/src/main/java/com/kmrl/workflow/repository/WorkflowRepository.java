package com.kmrl.workflow.repository;

import com.kmrl.workflow.entity.WorkflowTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowRepository extends JpaRepository<WorkflowTask, String> {
    List<WorkflowTask> findByDocumentId(String documentId);
    List<WorkflowTask> findByDepartment(String department);
}
