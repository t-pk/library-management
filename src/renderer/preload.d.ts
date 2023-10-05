import { Channels, InvokeChannels } from 'main/preload';

declare global {
  interface Window {
    electron: {
      ipcRenderer: {
        sendMessage(channel: Channels, args: unknown[]): void;
        on(channel: string, func: (...args: unknown[]) => void): (() => void) | undefined;
        once(channel: string, func: (...args: unknown[]) => void): void;
        invoke(channel: InvokeChannels, ...args: unknown[]): Promise<any>;
      };
    };
  }
}

export {};
