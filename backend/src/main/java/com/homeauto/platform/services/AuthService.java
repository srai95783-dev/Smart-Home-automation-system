package com.homeauto.platform.services;

import com.homeauto.platform.dtos.*;
import com.homeauto.platform.exceptions.BadRequestException;
import com.homeauto.platform.exceptions.ResourceNotFoundException;
import com.homeauto.platform.models.Role;
import com.homeauto.platform.models.User;
import com.homeauto.platform.repositories.UserRepository;
import com.homeauto.platform.security.JwtUtils;
import com.homeauto.platform.security.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtils jwtUtils;

    public JwtResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return new JwtResponse(jwt, userDetails.getId(), userDetails.getFullName(), userDetails.getUsername(), role);
    }

    @Transactional
    public UserDto register(RegisterRequest registerRequest) {
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new BadRequestException("Error: Email is already in use!");
        }

        Role assignedRole = registerRequest.getRole() != null ? registerRequest.getRole() : Role.HOMEOWNER;

        User user = new User(
                registerRequest.getFullName(),
                registerRequest.getEmail(),
                passwordEncoder.encode(registerRequest.getPassword()),
                assignedRole,
                registerRequest.getPhone()
        );

        User savedUser = userRepository.save(user);
        return UserDto.fromEntity(savedUser);
    }

    public UserDto getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));
        return UserDto.fromEntity(user);
    }

    @Transactional
    public UserDto updateProfile(String email, ProfileUpdateRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + email));

        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());

        if (request.getNewPassword() != null && !request.getNewPassword().trim().isEmpty()) {
            if (request.getNewPassword().length() < 6) {
                throw new BadRequestException("Password must be at least 6 characters long");
            }
            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        }

        User updatedUser = userRepository.save(user);
        return UserDto.fromEntity(updatedUser);
    }
}
