package com.tjw.poketeam.server_java.badges.dto;

public class EvaluateResultDTO {
    private int powerScore;
    private java.util.List<UserBadgeDTO> earnedBadges = new java.util.ArrayList<>();
    private HallOfFameEntryDTO hofEntry; // may be null

    public EvaluateResultDTO() {}

    public EvaluateResultDTO(int powerScore,
                             java.util.List<UserBadgeDTO> earnedBadges,
                             HallOfFameEntryDTO hofEntry) {
        this.powerScore = powerScore;
        if (earnedBadges != null) this.earnedBadges = earnedBadges;
        this.hofEntry = hofEntry;
    }

    public int getPowerScore() { return powerScore; }
    public void setPowerScore(int powerScore) { this.powerScore = powerScore; }

    public java.util.List<UserBadgeDTO> getEarnedBadges() { return earnedBadges; }
    public void setEarnedBadges(java.util.List<UserBadgeDTO> earnedBadges) { this.earnedBadges = earnedBadges; }

    public HallOfFameEntryDTO getHofEntry() { return hofEntry; }
    public void setHofEntry(HallOfFameEntryDTO hofEntry) { this.hofEntry = hofEntry; }
}
