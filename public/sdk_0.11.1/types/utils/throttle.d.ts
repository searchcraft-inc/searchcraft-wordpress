/**
 * Creates a throttled version of the given function that only invokes
 * the original function at most once every specified number of milliseconds.
 *
 * The logic is written in a way that the last invocation is always called, after the
 * throttle cooldown period has ended.
 *
 * @template Arguments - The argument types for the function to throttle
 * @param callback - The function to throttle
 * @param delayInMilliseconds - The number of milliseconds to wait before allowing the next invocation
 * @returns A throttled version of the original function
 */
export declare function throttle<Arguments extends any[]>(callback: (...args: Arguments) => void, delayInMilliseconds: number): (...args: Arguments) => void;
//# sourceMappingURL=throttle.d.ts.map