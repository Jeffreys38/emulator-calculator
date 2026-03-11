import {ExpressionBox} from "@/interfaces/Expression";

class CommonHelper {
    public static formatString(str: string, ...val: string[]): string {
        for (let index = 0; index < val.length; index++) {
            str = str.replace(`{${index}}`, val[index]);
        }
        return str;
    }

    public static getExpByCursorIndex(expressions: ExpressionBox[], cursorIndex: number): ExpressionBox | null {
        for (const exp of expressions) {
            if (exp.prevCursor?.positionInLength == cursorIndex)
                return exp;
            if (exp.nextCursor?.positionInLength == cursorIndex)
                return exp;
        }
        return null;
    }

    /**
     * Valid expression conversion function used for mathjs
     *
     * @return string (exp used for evaluate mathjs)
     * @return number (result of expression)
     */
    public static convertLatexToExp(expression: ExpressionBox): string | number {
        switch (expression.constructor.name) {
            case 'Fraction':
                break;
            case 'Deriative':
                break;
        }
        return "";
    }
}

export default CommonHelper;