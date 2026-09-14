package com.testing.controller;

import com.testing.model.SocialLink;
import com.testing.service.SocialLinkService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/social-links")
public class SocialLinkController {
    private final SocialLinkService socialLinkService;

    public SocialLinkController(SocialLinkService socialLinkService) {
        this.socialLinkService = socialLinkService;
    }

    @GetMapping
    public List<SocialLink> getSocialLinks() {
        return socialLinkService.getAllSocialLinks();
    }
}
