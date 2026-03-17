import Fraction from "../Fraction";
import RootN from "../RootN";
import {CalculatorError, CalculatorErrorCodes} from "@/helpers/CalculatorError";

describe("Expression guards", () => {
    it("calculates fraction when numerator and denominator are present", () => {
        const fraction = new Fraction("\\frac{☐}{☐}");
        fraction.insertExp(0, "1");
        fraction.insertExp(1, "2");

        expect(fraction.calculate()).toBe(0.5);
    });

    it("throws a typed error for incomplete fraction", () => {
        const fraction = new Fraction("\\frac{☐}{☐}");

        expect(() => fraction.calculate()).toThrow(CalculatorError);
        expect(() => fraction.calculate()).toThrow(
            expect.objectContaining({code: CalculatorErrorCodes.INCOMPLETE_EXPRESSION})
        );
    });

    it("calculates root when index and radicand are present", () => {
        const rootN = new RootN("\\sqrt[☐]{☐}");
        rootN.insertExp(0, "2");
        rootN.insertExp(1, "9");

        expect(rootN.calculate()).toBe(3);
    });

    it("throws a typed error for incomplete root expression", () => {
        const rootN = new RootN("\\sqrt[☐]{☐}");

        expect(() => rootN.calculate()).toThrow(CalculatorError);
        expect(() => rootN.calculate()).toThrow(
            expect.objectContaining({code: CalculatorErrorCodes.INCOMPLETE_EXPRESSION})
        );
    });
});
