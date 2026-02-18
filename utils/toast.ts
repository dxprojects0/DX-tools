export type ToastVariant = 'success' | 'error' | 'info';

export interface ToastPayload {
  message: string;
  variant?: ToastVariant;
  durationMs?: number;
}

const TOAST_EVENT = 'dxtools:toast';

export const emitToast = (payload: ToastPayload) => {
  window.dispatchEvent(new CustomEvent(TOAST_EVENT, { detail: payload }));
};

export const onToast = (handler: (payload: ToastPayload) => void) => {
  const listener = (event: Event) => {
    const custom = event as CustomEvent<ToastPayload>;
    if (!custom.detail?.message) return;
    handler(custom.detail);
  };
  window.addEventListener(TOAST_EVENT, listener);
  return () => window.removeEventListener(TOAST_EVENT, listener);
};
