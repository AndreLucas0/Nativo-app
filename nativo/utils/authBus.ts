// ARQUIVO: utils/authBus.ts
// "Barramento de eventos" de autenticação.
// Permite que o cliente HTTP (api.ts) notifique o AuthContext quando
// o token expira (erro 401), sem criar dependência circular entre os módulos.

type Listener = () => void;

// Armazena o único handler registrado (normalmente o AuthContext)
let handler: Listener | null = null;

export const authBus = {
  // Registra a função que será chamada quando ocorrer erro 401 (sessão expirada)
  onUnauthorized: (fn: Listener) => {
    handler = fn;
  },

  // Dispara o evento de sessão expirada → chama o handler registrado
  emit: () => {
    handler?.();
  },
};
