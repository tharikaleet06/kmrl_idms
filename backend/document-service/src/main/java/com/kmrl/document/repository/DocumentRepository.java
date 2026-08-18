package com.kmrl.document.repository;

import com.kmrl.document.entity.DocumentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<DocumentEntity, String> {
    List<DocumentEntity> findByDepartmentIgnoreCase(String department);
    List<DocumentEntity> findByUploaderIgnoreCase(String uploader);
    List<DocumentEntity> findByUploadedByIgnoreCase(String uploadedBy);

    @Query("SELECT d FROM DocumentEntity d WHERE LOWER(d.department) = LOWER(:dept) OR LOWER(d.uploadedBy) = LOWER(:user) OR LOWER(d.uploader) = LOWER(:user) OR LOWER(d.assignedTo) = LOWER(:user)")
    List<DocumentEntity> findByDepartmentOrUserAccess(@Param("dept") String dept, @Param("user") String user);

    @Query("SELECT d FROM DocumentEntity d WHERE LOWER(d.department) IN :depts OR LOWER(d.uploadedBy) = LOWER(:user) OR LOWER(d.uploader) = LOWER(:user)")
    List<DocumentEntity> findByDepartmentsInOrUserAccess(@Param("depts") List<String> depts, @Param("user") String user);
}
