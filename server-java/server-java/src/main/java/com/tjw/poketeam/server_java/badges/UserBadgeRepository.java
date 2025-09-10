package com.tjw.poketeam.server_java.badges;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserBadgeRepository extends JpaRepository<UserBadgeEntity, UUID> {
    List<UserBadgeEntity> findAllByUserIdOrderByEarnedAtDesc(String userId);

    Optional<UserBadgeEntity> findByUserIdAndNameAndBadgeVersion(String userId, String name, int badgeVersion);

    long countByUserId(String userId);
}
