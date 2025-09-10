package com.tjw.poketeam.server_java.badges;

import com.tjw.poketeam.server_java.badges.model.SnapshotPayload;
import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "hall_of_fame_entries")
public class HallOfFameEntryEntity {

    @Id
    @GeneratedValue
    @Column(name = "id", columnDefinition = "uuid", nullable = false)
    private UUID id;

    @Column(name = "user_id", length = 100, nullable = false)
    private String userId;

    @Column(name = "team_name", length = 30, nullable = false)
    private String teamName;

    @Column(name = "earned_at", columnDefinition = "timestamptz", insertable = false, updatable = false)
    private OffsetDateTime earnedAt;

    @Column(name = "power_score", nullable = false)
    private int powerScore;

    // Postgres text[] -> map as Java array with ARRAY type
    @JdbcTypeCode(SqlTypes.ARRAY)
    @Column(name = "badges", columnDefinition = "text[]", nullable = false)
    private String[] badges = new String[0];

    // JSONB snapshot payload
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "snapshot", columnDefinition = "jsonb", nullable = false)
    private SnapshotPayload snapshot;

    // audit (DB-managed)
    @Column(name = "created_at", columnDefinition = "timestamptz", insertable = false, updatable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "timestamptz", insertable = false, updatable = false)
    private OffsetDateTime updatedAt;

    public HallOfFameEntryEntity() {}

    public HallOfFameEntryEntity(String userId, String teamName, int powerScore, String[] badges, SnapshotPayload snapshot) {
        this.userId = userId;
        this.teamName = teamName;
        this.powerScore = powerScore;
        this.badges = badges != null ? badges : new String[0];
        this.snapshot = snapshot;
    }

    // getters/setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public String getTeamName() { return teamName; }
    public void setTeamName(String teamName) { this.teamName = teamName; }

    public OffsetDateTime getEarnedAt() { return earnedAt; }

    public int getPowerScore() { return powerScore; }
    public void setPowerScore(int powerScore) { this.powerScore = powerScore; }

    public String[] getBadges() { return badges; }
    public void setBadges(String[] badges) { this.badges = badges; }

    public SnapshotPayload getSnapshot() { return snapshot; }
    public void setSnapshot(SnapshotPayload snapshot) { this.snapshot = snapshot; }

    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
}
