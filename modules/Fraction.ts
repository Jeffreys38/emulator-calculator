import {ExpressionTemplate, Scope} from "@/interfaces/Expression";
import * as math from "mathjs";
import CommonHelper from "@/helpers/CommonHelper";
import {AdvancedOperations} from "@/constants/Operations";
import {CalculatorError, CalculatorErrorCodes} from "@/helpers/CalculatorError";

class Fraction extends ExpressionTemplate {
    private _numerator: string;
    private _denominator: string;

    constructor(latexString: string) {
        super(latexString);
        this._numerator = "☐";
        this._denominator = "☐";
    }

    getLatexString(): string {
        return CommonHelper.formatString(
            this.latexString,
            this._numerator,
            this._denominator
        );
    }

    get numerator(): string {
        return this._numerator;
    }

    get denominator(): string {
        return this._denominator;
    }

    insertExp(cursorIndex: number, exp: string): void {
        const isAdvancedOperator = (value: any): value is AdvancedOperations => {
            return Object.values(AdvancedOperations).includes(value);
        };

        if (isAdvancedOperator(exp)) {
            console.warn("Nesting of additional operators is not yet supported.");
            return;
        }

        if (cursorIndex === 0) {
            this._numerator = this._numerator.replace("☐", "") + exp;
        } else if (cursorIndex === 1) {
            this._denominator = this._denominator.replace("☐", "") + exp;
        }
        this.latexString = this.formatFraction(this._numerator, this._denominator);
    };

    calculate(scope: Scope = { x: 0 }): number | string {
        if (this._numerator === "☐" || this._denominator === "☐") {
            throw new CalculatorError(
                CalculatorErrorCodes.INCOMPLETE_EXPRESSION,
                "Fraction is incomplete"
            );
        }

        // Fix: Added parentheses to ensure correct order of operations
        // e.g., (1+2)/(3+4) instead of 1+2/3+4
        const exp = (`(${this._numerator})/(${this._denominator})`)
            .replace(/\\times|\\modulus/g, '*');

        return math.evaluate(
            exp,
            scope
        );
    }

    getLatexStringWithCursor(blink: boolean): string {
        const numerator = this.cursorIndex === 0 ? (blink ? `${this._numerator}|` : `${this._numerator}`) : this._numerator;
        const denominator = this.cursorIndex === 1 ? (blink ? `${this._denominator}|` : `${this._denominator}`) : this._denominator;
        return this.formatFraction(numerator, denominator);
    }

    deleteExp(): void {
        if (this.cursorIndex === 0) {
            if (this._numerator.length > 0) {
                let exp1 = this.deleteOperator(this._numerator);
                if (exp1 !== null){
                    this._numerator = exp1;
                    return;
                }
                this._numerator = this._numerator.slice(0, -1) || '☐'; // Remove the last character or reset to placeholder
            }
        } else if (this.cursorIndex === 1) {
            if (this._denominator.length > 0) {
                let exp2 = this.deleteOperator(this._denominator);
                if (exp2 !== null){
                    this._denominator = exp2;
                    return;
                }
                this._denominator = this._denominator.slice(0, -1) || '☐'; // Remove the last character or reset to placeholder
            }
        }
        this.latexString = this.formatFraction(this._numerator, this._denominator);
    }

    private formatFraction(num: string, den: string) {
        return `\\frac{${num}}{${den}}`;
    }
}

export default Fraction;
