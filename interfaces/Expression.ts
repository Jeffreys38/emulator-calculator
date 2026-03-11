import {IExpressionMethods} from "@/interfaces/IExpressionMethods";

export interface Cursor {
    index: number,
    positionInLength: number
}

export interface Scope {
    [key: string]: number
}

export abstract class ExpressionTemplate implements IExpressionMethods {
    protected latexString: string;
    cursorIndex: number = 0;

    constructor(latexString: string) {
        this.latexString = latexString;
    }

    abstract calculate(scope?: Scope): number | string;

    abstract insertExp(cursorIndex: number, exp: string): void;

    abstract getLatexString(): string;

    abstract deleteExp(): void;

    abstract getLatexStringWithCursor(blink: boolean): string;

    deleteOperator(exp: string | null): string | null {
        // Case: \\times, \\modulus, \sqrt{☐}, etc. not 1 character
        if (exp !== null) {
            let lastChar = exp[exp.length - 1];
            if (lastChar.match(/[a-zA-Z]/) && lastChar !== "x") {
                exp = exp.replace(/(\\times|\\modulus)$/, '');
                return exp;
            }
        }
        return null;
    }
}