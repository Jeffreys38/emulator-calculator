import React from 'react';
import {Rect, Svg, Text} from 'react-native-svg';
import { View } from 'react-native';
import limitNumber from "ajv/lib/vocabularies/validation/limitNumber";

/**
 * DerivativeProps
 *
 * This type defines the properties for the Derivative component.
 * It accepts a mathematical expression, a variable for differentiation (x),
 * along with the color, size, screenSize options for customization.
 *
 * @property {string | React.JSX.Element} expression - The mathematical expression to differentiate, e.g., "x^2 + 2x + 1".
 * @property {number| React.JSX.Element} x - The value of the variable with respect to which the differentiation occurs.
 * @property {string} color - The color of the derivative text (e.g., "white", "#000000").
 * @property {number} size - The font size for rendering the derivative expression.
 * @property {[number, number]} screenSize - The display area must be lower than Main Screen [width, height]
 */
type DerivativeProps = {
    expression: string | React.JSX.Element,
    x: number | React.JSX.Element,
    color: string,
    size: number,
    screenSize: [number, number],
}

export default function Derivative(derivativeProps: DerivativeProps) {
    return (
        <View>
            <Svg width={derivativeProps.screenSize[0]} height={derivativeProps.screenSize[1]} >
                {/* The derivative symbol d/dx */}
                <Text
                    x={(derivativeProps.size / 2) - (derivativeProps.size / 4)}
                    y="47"
                    fontSize={derivativeProps.size}
                    fontWeight="bold"
                    fill={derivativeProps.color}
                >
                    d
                </Text>
                <Svg height="100" width="100%">
                    <Rect
                        x="1"
                        y="55"
                        width={derivativeProps.size * 1.4}
                        height="5"
                        fill="white"
                    />
                </Svg>
                <Text
                    x="10"
                    y="92"
                    fontSize={derivativeProps.size}
                    fontWeight="bold"
                    fill={derivativeProps.color}
                >
                    dx
                </Text>

                {/* Add parentheses for the expression */}
                <Text
                    x="52"
                    y={derivativeProps.screenSize[1] / 3.3}
                    fontSize={derivativeProps.size / 1.3}
                    fontWeight="bold"
                    fill={derivativeProps.color}
                >
                    (
                </Text>

                {/* Render the mathematical expression inside the parentheses */}
                <Text
                    x="65"
                    y={derivativeProps.screenSize[1] / 3.3}
                    fontSize={derivativeProps.size / 1.65}
                    fontWeight="bold"
                    fill={derivativeProps.color}
                >
                    {derivativeProps.expression}
                </Text>

                {/* Close parentheses */}
                <Text
                    x="182"
                    y={derivativeProps.screenSize[1] / 3.2}
                    fontSize="20"
                    fontWeight="bold"
                    fill={derivativeProps.color}
                >
                    )
                </Text>
            </Svg>
        </View>
    );
};
