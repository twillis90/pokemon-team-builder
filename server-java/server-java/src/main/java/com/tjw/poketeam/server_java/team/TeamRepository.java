package com.tjw.poketeam.server_java.team;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TeamRepository extends JpaRepository<TeamEntity, String> {
    List<TeamEntity> findAllByUserId(String userId);
    boolean existsById(String id);
    long countByUserId(String userId);
}
