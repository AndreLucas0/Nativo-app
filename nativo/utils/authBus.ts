type Listener = () => void;

let handler: Listener | null = null;

export const authBus = {
  onUnauthorized: (fn: Listener) => {
    handler = fn;
  },
  emit: () => {
    handler?.();
  },
};
