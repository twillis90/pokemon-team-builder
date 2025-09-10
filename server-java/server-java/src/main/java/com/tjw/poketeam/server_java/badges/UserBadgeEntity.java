package com.tjw.poketeam.server_java.badges;

import jakarta.persistence.*;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_badges")
public class UserBadgeEntity {

    @Id
    @GeneratedValue
    @Column(name = "id", columnDefinition = "uuid", nullable = false)
    private UUID id;

    @Column(name = "user_id", length = 100, nullable = false)
    private String userId;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @Column(name = "description", length = 300, nullable = false)
    private String description;

    // CHANGED: allow us to set this on insert/update
    @Column(name = "earned_at", columnDefinition = "timestamptz", nullable = false)
    private OffsetDateTime earnedAt;

    @Column(name = "count", nullable = false)
    private int count;

    @Column(name = "badge_version", nullable = false)
    private int badgeVersion;

    @Column(name = "hof_entry_id", columnDefinition = "uuid")
    private UUID hofEntryId; // nullable

    // audit (DB-managed)
    @Column(name = "created_at", columnDefinition = "timestamptz", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "timestamptz", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;

    public UserBadgeEntity() {}

    public UserBadgeEntity(String userId, String name, String description, int count, int badgeVersion, UUID hofEntryId, OffsetDateTime earnedAt) {
        this.userId = userId;
        this.name = name;
        this.description = description;
        this.count = count;
        this.badgeVersion = badgeVersion;
        this.hofEntryId = hofEntryId;
        this.earnedAt = earnedAt;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public OffsetDateTime getEarnedAt() { return earnedAt; }
    public void setEarnedAt(OffsetDateTime earnedAt) { this.earnedAt = earnedAt; }

    public int getCount() { return count; }
    public void setCount(int count) { this.count = count; }

    public int getBadgeVersion() { return badgeVersion; }
    public void setBadgeVersion(int badgeVersion) { this.badgeVersion = badgeVersion; }

    public UUID getHofEntryId() { return hofEntryId; }
    public void setHofEntryId(UUID hofEntryId) { this.hofEntryId = hofEntryId; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
