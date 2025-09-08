export declare enum LogLevel {
    DEBUG = 0,
    INFO = 1,
    WARN = 2,
    ERROR = 3,
    NONE = 4
}
interface SearchcraftLoggerOptions {
    logLevel: LogLevel;
    logFormatter?: (level: LogLevel, message: string) => string;
}
declare class SearchcraftLogger {
    private logLevel;
    private logFormatter;
    constructor(options: SearchcraftLoggerOptions);
    private defaultFormatter;
    debug(message: string): void;
    info(message: string): void;
    warn(message: string): void;
    error(message: string): void;
    log(level: LogLevel, message: string): void;
}
export declare const Logger: SearchcraftLogger;
export {};
//# sourceMappingURL=Logger.d.ts.map