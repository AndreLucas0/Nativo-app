// ARQUIVO: app/login.tsx
// Tela de Login e Cadastro.
// Alterna entre os modos "login" e "register" com um botão de troca.
// Valida os campos localmente antes de chamar a API via AuthContext.

import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';

export default function LoginScreen() {
  const { login, register } = useAuth(); // funções de autenticação do contexto

  // Controla qual formulário está visível: 'login' ou 'register'
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Estados dos campos do formulário
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Estados de feedback para o usuário
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Executado ao pressionar o botão "Entrar" ou "Cadastrar"
  const handleSubmit = async () => {
    setError('');

    // Validação básica dos campos obrigatórios
    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    if (mode === 'register' && !name.trim()) {
      setError('Informe seu nome.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        await login(email.trim(), password); // chama API de login
      } else {
        await register(name.trim(), email.trim(), password); // chama API de registro
      }
      router.replace('/(tabs)'); // sucesso → vai para as abas principais
    } catch (err: any) {
      setError(err?.message ?? 'Erro ao autenticar. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    // KeyboardAvoidingView empurra o conteúdo para cima quando o teclado abre no iOS
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Logo do app */}
        <View style={styles.logoRow}>
          <View style={styles.logoBox}>
            <Text style={styles.logoLetter}>N</Text>
          </View>
          <Text style={styles.logoText}>Nativo</Text>
        </View>

        {/* Título e subtítulo mudam conforme o modo (login vs cadastro) */}
        <Text style={styles.headline}>
          {mode === 'login' ? 'Bem-vindo de volta!' : 'Crie sua conta'}
        </Text>
        <Text style={styles.sub}>
          {mode === 'login'
            ? 'Entre para continuar aprendendo.'
            : 'Comece a aprender agora mesmo.'}
        </Text>

        {/* Campo de nome — aparece somente no modo de cadastro */}
        {mode === 'register' && (
          <TextInput
            style={styles.input}
            placeholder="Seu nome"
            placeholderTextColor="#555"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
          />
        )}

        {/* Campo de e-mail */}
        <TextInput
          style={styles.input}
          placeholder="E-mail"
          placeholderTextColor="#555"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Campo de senha (oculta o texto) */}
        <TextInput
          style={styles.input}
          placeholder="Senha"
          placeholderTextColor="#555"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        {/* Mensagem de erro — só aparece se houver erro */}
        {error ? <Text style={styles.error}>{error}</Text> : null}

        {/* Botão principal: mostra spinner enquanto a requisição está em andamento */}
        <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#000" />
            : <Text style={styles.btnText}>{mode === 'login' ? 'ENTRAR' : 'CADASTRAR'}</Text>
          }
        </TouchableOpacity>

        {/* Botão para alternar entre login e cadastro */}
        <TouchableOpacity
          style={styles.switchBtn}
          onPress={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
        >
          <Text style={styles.switchText}>
            {mode === 'login'
              ? 'Não tem conta? Cadastre-se'
              : 'Já tem conta? Entre'}
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#131f24' },
  scroll: { flexGrow: 1, justifyContent: 'center', padding: 28 },

  logoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 36, alignSelf: 'center' },
  logoBox: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: '#9EF01A',
    justifyContent: 'center', alignItems: 'center', marginRight: 12,
  },
  logoLetter: { fontSize: 26, fontWeight: 'bold', color: '#000' },
  logoText: { fontSize: 30, fontWeight: 'bold', color: '#fff' },

  headline: { color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 6 },
  sub: { color: '#8899a0', fontSize: 14, marginBottom: 28 },

  input: {
    backgroundColor: '#1e2f38',
    borderRadius: 12,
    padding: 16,
    color: '#fff',
    fontSize: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#2a3f4a',
  },

  error: { color: '#FF4D6D', fontSize: 13, marginBottom: 12 },

  btn: {
    backgroundColor: '#9EF01A',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 4,
  },
  btnText: { color: '#000', fontWeight: 'bold', fontSize: 15, letterSpacing: 0.5 },

  switchBtn: { marginTop: 20, alignItems: 'center' },
  switchText: { color: '#9EF01A', fontSize: 14 },
});
