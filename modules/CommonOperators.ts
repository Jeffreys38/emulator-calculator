import {ExpressionTemplate, Scope} from "@/interfaces/Expression";

export default class CommonOperators extends ExpressionTemplate {
    cursorIndex: number;

    constructor(latexString: string) {
        super(latexString);
        this.cursorIndex = 0; // Indicates the cursor position, 0 means before the operator, 1 means after.
    }

    calculate(scope?: Scope): string {
        return this.rendering();
    }

    getLatexStringWithCursor(blink: boolean): string {
        const operator = this.cursorIndex === 0 ? (blink ? `|${this.rendering()}` : this.rendering()) : `${this.rendering()}|`;
        return operator;
    }

    getLatexString(): string {
        return this.latexString;
    }

    insertExp(cursorIndex: number, exp: string): void {

    }

    deleteExp(): void {
        this.latexString = '';
    }

    private rendering(): string {
        switch (this.latexString) {
            case '\\times':
                return '*';
            case '\\div':
                return '/';
            case '\\plus':
                return '+';
            case '\\minus':
                return '-';
            default:
                return this.latexString;
        }
    }
}
