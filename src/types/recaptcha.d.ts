interface ReCaptchaInstance {
  render: (
    container: HTMLElement,
    parameters: {
      sitekey: string;
      theme?: "dark" | "light";
      callback?: (token: string) => void;
      "expired-callback"?: () => void;
    }
  ) => number;
  getResponse: (widgetId?: number) => string;
  reset: (widgetId?: number) => void;
}

declare global {
  interface Window {
    grecaptcha: ReCaptchaInstance;
  }
}

export {};
