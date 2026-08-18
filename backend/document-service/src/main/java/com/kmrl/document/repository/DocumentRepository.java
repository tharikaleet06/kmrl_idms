package com.kmrl.document.repository;

import com.kmrl.document.entity.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, String> {
    List<DocumentEntity> findByDepartment(String department);
    List<DocumentEntity> findByUploader(String uploader);
}
