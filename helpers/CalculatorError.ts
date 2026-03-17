export const CalculatorErrorCodes = {
    INVALID_PARAMETER: "INVALID_PARAMETER",
    INCOMPLETE_EXPRESSION: "INCOMPLETE_EXPRESSION",
    INVALID_EXPRESSION: "INVALID_EXPRESSION",
    EMPTY_EXPRESSION: "EMPTY_EXPRESSION",
} as const;

export type CalculatorErrorCode =
    (typeof CalculatorErrorCodes)[keyof typeof CalculatorErrorCodes];

export class CalculatorError extends Error {
    code: CalculatorErrorCode;

    constructor(code: CalculatorErrorCode, message: string) {
        super(message);
        this.code = code;
        this.name = "CalculatorError";
    }
}

export const isCalculatorError = (error: unknown): error is CalculatorError =>
    error instanceof CalculatorError;

export const logCalculatorError = (
    context: string,
    error: unknown,
    metadata?: Record<string, unknown>
) => {
    const errorPayload = isCalculatorError(error)
        ? { code: error.code, message: error.message }
        : { code: CalculatorErrorCodes.INVALID_EXPRESSION, message: "Unknown error" };

    console.error(`[Calculator][${context}]`, {
        ...errorPayload,
        metadata,
    });
};
