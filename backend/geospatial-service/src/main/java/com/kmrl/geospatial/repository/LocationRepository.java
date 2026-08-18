package com.kmrl.geospatial.repository;

import com.kmrl.geospatial.entity.MetroLocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface LocationRepository extends JpaRepository<MetroLocation, String> {
}