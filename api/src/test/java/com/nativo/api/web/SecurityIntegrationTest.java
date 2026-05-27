package com.nativo.api.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nativo.api.application.auth.AuthService;
import com.nativo.api.application.user.UserService;
import com.nativo.api.infrastructure.security.JwtService;
import com.nativo.api.infrastructure.security.UserDetailsServiceImpl;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Map;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(controllers = {AuthController.class, UserController.class})
@Import(com.nativo.api.config.SecurityConfig.class)
class SecurityIntegrationTest {

    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    MockMvc mockMvc;

    @MockitoBean
    AuthService authService;

    @MockitoBean
    UserService userService;

    @MockitoBean
    JwtService jwtService;

    @MockitoBean
    UserDetailsServiceImpl userDetailsService;

    // --- 401: acesso sem token ---

    @Test
    void getProfile_semToken_retorna401() throws Exception {
        mockMvc.perform(get("/api/users/me"))
                .andExpect(status().isUnauthorized());
    }

    // --- 400: validação de campos ---

    @Test
    void register_emailInvalido_retorna400() throws Exception {
        var body = Map.of("name", "Test", "email", "nao-e-email", "password", "senha123");
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_senhaFraca_retorna400() throws Exception {
        var body = Map.of("name", "Test", "email", "test@test.com", "password", "curta");
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void register_camposObrigatoriosAusentes_retorna400() throws Exception {
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest());
    }
}
