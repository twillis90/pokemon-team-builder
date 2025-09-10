package com.tjw.poketeam.server_java.badges.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

public class UserBadgeDTO {
    private UUID id;
    private String name;
    private String description;
    private OffsetDateTime earnedAt;
    private int count;
    private int badgeVersion;
    private UUID hofEntryId;

    public UserBadgeDTO() {}

    public UserBadgeDTO(UUID id, String name, String description,
                        OffsetDateTime earnedAt, int count, int badgeVersion, UUID hofEntryId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.earnedAt = earnedAt;
        this.count = count;
        this.badgeVersion = badgeVersion;
        this.hofEntryId = hofEntryId;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

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
}
