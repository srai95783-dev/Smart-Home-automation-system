package com.homeauto.platform.controllers;

import com.homeauto.platform.dtos.ApiResponse;
import com.homeauto.platform.dtos.ProfileUpdateRequest;
import com.homeauto.platform.dtos.UserDto;
import com.homeauto.platform.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@Tag(name = "User Profile", description = "Endpoints for logged-in user profile management")
@SecurityRequirement(name = "BearerAuthentication")
public class UserController {

    @Autowired
    private AuthService authService;

    @GetMapping("/profile")
    @Operation(summary = "Get Profile", description = "Retrieves the currently authenticated user's profile")
    public ResponseEntity<ApiResponse<UserDto>> getProfile(Authentication authentication) {
        String email = authentication.getName();
        UserDto userDto = authService.getCurrentUser(email);
        return ResponseEntity.ok(ApiResponse.ok("Profile retrieved successfully", userDto));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update Profile", description = "Updates profile name, phone number, or password")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(
            Authentication authentication,
            @Valid @RequestBody ProfileUpdateRequest request) {
        String email = authentication.getName();
        UserDto updatedUser = authService.updateProfile(email, request);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updatedUser));
    }
}
