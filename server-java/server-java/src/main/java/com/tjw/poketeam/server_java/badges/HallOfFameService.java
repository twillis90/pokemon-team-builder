package com.tjw.poketeam.server_java.badges;

import com.tjw.poketeam.server_java.badges.dto.HallOfFameEntryDTO;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class HallOfFameService {

    private final HallOfFameEntryRepository hofRepo;

    public HallOfFameService(HallOfFameEntryRepository hofRepo) {
        this.hofRepo = hofRepo;
    }

    @Transactional(readOnly = true)
    public List<HallOfFameEntryDTO> listUserHof(String userId) {
        return hofRepo.findAllByUserIdOrderByEarnedAtDesc(userId)
                .stream()
                .map(HallOfFameMapper::toDto)
                .collect(Collectors.toList());
    }
}
