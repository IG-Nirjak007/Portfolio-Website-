package com.testing.service;

import com.testing.model.SocialLink;
import com.testing.repository.SocialLinkRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SocialLinkService {
    private final SocialLinkRepository socialLinkRepository;

    public SocialLinkService(SocialLinkRepository socialLinkRepository) {
        this.socialLinkRepository = socialLinkRepository;
    }

    public List<SocialLink> getAllSocialLinks() {
        return socialLinkRepository.findAll();
    }
}
