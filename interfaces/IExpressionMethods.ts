import {Scope} from "@/interfaces/Expression";

export interface IExpressionMethods {
    insertExp(cursorIndex: number, exp: string): void;
    deleteExp(): void;
    getLatexString(): string;
    getLatexStringWithCursor(blink: boolean): string;
    /**
     * Recursively calls to convert LatexStrings into computable expressions
     */
    calculate(scope?: Scope): number | string;

    deleteOperator(exp: string | null): string | null;
}