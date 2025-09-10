package com.tjw.poketeam.server_java.badges;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface HallOfFameEntryRepository extends JpaRepository<HallOfFameEntryEntity, UUID> {
    List<HallOfFameEntryEntity> findAllByUserIdOrderByEarnedAtDesc(String userId);
}
