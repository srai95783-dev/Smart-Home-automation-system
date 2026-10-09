package com.homeauto.platform.controllers;

import com.homeauto.platform.dtos.*;
import com.homeauto.platform.services.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "Endpoints for User Login and Registration")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "User Login", description = "Authenticates user credentials and returns a JWT Bearer Token with role details")
    public ResponseEntity<ApiResponse<JwtResponse>> login(@Valid @RequestBody LoginRequest loginRequest) {
        JwtResponse jwtResponse = authService.login(loginRequest);
        return ResponseEntity.ok(ApiResponse.ok("Login successful", jwtResponse));
    }

    @PostMapping("/register")
    @Operation(summary = "Homeowner Registration", description = "Registers a new user account with default HOMEOWNER role")
    public ResponseEntity<ApiResponse<UserDto>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        UserDto userDto = authService.register(registerRequest);
        return ResponseEntity.ok(ApiResponse.ok("User registered successfully", userDto));
    }
}
