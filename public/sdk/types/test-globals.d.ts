declare function describe(name: string, fn: () => void): void;
declare function it(name: string, fn: () => void | Promise<void>): void;
declare function beforeEach(fn: () => void | Promise<void>): void;
declare function afterEach(fn: () => void | Promise<void>): void;

declare function expect(actual: unknown): {
  toBe(expected: unknown): void;
  toContain(expected: string): void;
  toHaveBeenCalledTimes(expected: number): void;
};

declare const jest: {
  useFakeTimers(): void;
  useRealTimers(): void;
  restoreAllMocks(): void;
  runAllTimersAsync(): Promise<void>;
  spyOn<T extends object, K extends keyof T>(object: T, method: K): {
    mockImplementation(impl: (...args: never[]) => unknown): void;
  };
  fn(): {
    mockResolvedValue(value: unknown): unknown;
  };
};