import * as math from 'mathjs';
import React, {useEffect, useRef, useState} from 'react';
import {MathJaxSvg} from 'react-native-mathjax-html-to-svg';
import {Dimensions, SafeAreaView, ScrollView, StyleSheet, Switch, Text, View, Image} from 'react-native';

import Fraction from "@/modules/Fraction";
import CommonOperators from "@/modules/CommonOperators";
import {Button} from "@/components/Button";
import {ExpressionTemplate} from "@/interfaces/Expression";
import {AdvancedOperations, CommonOperations} from "@/constants/Operations";
import RootN from "@/modules/RootN";

export default function DemoCalculator() {
    const [isDark, setIsDark] = useState(true);
    const styles= createStyles(isDark);

    const [params, setParams] = useState<string>("");
    const [isShowParams, setShowParams] = useState(false);
    const [result, setResult] = useState<number | string>(0);
    const [expressions, setExpressions] = useState<ExpressionTemplate[]>([
        new CommonOperators("")
    ]);

    const [blink, setBlink] = useState<boolean>(true);
    const [cursorPosition, setCursorPosition] = useState<number>(0);

    const scrollRef = useRef<ScrollView>(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setBlink(prev => !prev);
        }, 490);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (expressions[0]?.getLatexString().length == 0) {
            setResult(0);
        }
    }, [expressions]);

    useEffect(() => {
        if (isShowParams === false)
            setParams("");
    }, [isShowParams]);


    const autoScroll = () => {
        scrollRef.current?.scrollTo({ x: 2500, y: 0, animated: true });
    }

    const insertAtCursor = (exp: string | CommonOperations | AdvancedOperations) => {
        autoScroll();

        // Operations
        const isCommonOperator = (value: any): value is CommonOperations => {
            return Object.values(CommonOperations).includes(value);
        };
        const isAdvancedOperator = (value: any): value is AdvancedOperations => {
            return Object.values(AdvancedOperations).includes(value);
        };

        if (isShowParams) {
            if (/[0-9]/g.test(exp)) {
                if (params.length > 12) {
                    alert("This number is so big")
                    return;
                }
                setParams(params + exp);
            }
            return;
        }

        // Handle only fraction
        const currentExpression = expressions[cursorPosition];
        if (currentExpression instanceof Fraction || currentExpression instanceof RootN) {
            currentExpression.insertExp(currentExpression.cursorIndex, exp);
            setExpressions([...expressions]);
            return;
        }

        if (isCommonOperator(exp) || /[0-9]/g.test(exp)) {
            setExpressions([
                ...expressions.slice(0, cursorPosition),
                new CommonOperators(`${exp}`),
                ...expressions.slice(cursorPosition)
            ]);
        }

        if (isAdvancedOperator(exp)) {
            if (exp === AdvancedOperations.ROOT_N) {
                setExpressions([
                    ...expressions.slice(0, cursorPosition),
                    new RootN(`${exp}`),
                    ...expressions.slice(cursorPosition)
                ]);
            } else {
                setExpressions([
                    ...expressions.slice(0, cursorPosition),
                    new Fraction(`${exp}`),
                    ...expressions.slice(cursorPosition)
                ]);
            }
        }

        setCursorPosition(cursorPosition + 1);
    };

    const moveCursor = (direction: 'left' | 'right' | 'up' | 'down') => {
        let currentExpr = expressions[cursorPosition];

        if (direction === 'left') {
            if (cursorPosition > 0) {
                setCursorPosition(cursorPosition - 1);
            }
        } else if (direction === 'right') {
            if (cursorPosition < expressions.length - 1) {
                setCursorPosition(cursorPosition + 1);
            }
        } else if (direction === 'up') {
            if (currentExpr instanceof ExpressionTemplate && currentExpr.cursorIndex === 1) {
                currentExpr.cursorIndex = 0;
                setExpressions([...expressions]);
            }
        } else if (direction === 'down') {
            if (currentExpr instanceof ExpressionTemplate && currentExpr.cursorIndex === 0) {
                currentExpr.cursorIndex = 1;
                setExpressions([...expressions]);
            }
        }
    };

    const renderingExpression = () => {
        return expressions
            .map((value, index) =>
                index === cursorPosition
                    ? value.getLatexStringWithCursor(blink)
                    : value.getLatexString()
            )
            .join(' ');
    };

    const deleteExpression = (): void => {
        if (isShowParams) {
            setExpressions([new CommonOperators("")]);
            setCursorPosition(0);
            setResult("0");
            setParams("");
            setShowParams(!isShowParams)
            return;
        }
        const currentExpression = expressions[cursorPosition];

        if (
            currentExpression instanceof Fraction &&
            currentExpression.numerator === "☐" &&
            currentExpression.denominator === "☐"
        ) {
            const updatedExpressions = expressions.filter((_, index) => index !== cursorPosition);
            setExpressions(updatedExpressions);
            setCursorPosition(Math.max(0, cursorPosition - 1));
        } else if(
            currentExpression instanceof RootN &&
            currentExpression.index === "☐" &&
            currentExpression.radicand === "☐"
        ) {
            const updatedExpressions = expressions.filter((_, index) => index !== cursorPosition);
            setExpressions(updatedExpressions);
            setCursorPosition(Math.max(0, cursorPosition - 1));
        }
        else {
            currentExpression.deleteExp();
            setExpressions([...expressions]);
        }
    };

    const evaluateExpression = () => {
        try {
            let scope = {x: 0};

            if (isShowParams && params != "") {
                if (parseInt(params) || params == "0") {
                    scope = {x: parseInt(params)}
                } else {
                    alert("Invalid expression");
                    return;
                }
                setShowParams(!isShowParams);
                setParams("")
            }


            let fullExpression = expressions.map(expr => expr.calculate(scope)).join('');
            fullExpression.replace(/([+*/-])/g, ' $1 ');
            const result =  math.evaluate(fullExpression, scope);

            setResult(result);
        } catch (error) {
            setResult('Error in evaluate');
        }
    };

    return (
        <SafeAreaView>
            <View style={styles.theme}>
                {/* Change Theme Button */}
                <View style={[styles.changeThemeBtn, styles.fitBox, styles.group, { justifyContent: 'center', flexDirection: 'row', flex: 0.4}]}>
                    <Image
                        source={isDark
                            ? require('@/assets/images/sun.png')
                            : require('@/assets/images/moon.png')
                        }
                        style={styles.image}
                    />
                    <Switch
                        trackColor={{false: '#767577', true: '#81b0ff'}}
                        thumbColor={isDark ? '#f5dd4b' : '#f4f3f4'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={() => {setIsDark(!isDark)}}
                        value={isDark}
                    />
                </View>

                {/* Result */}
                <View style={{ flex: 3 }}>
                    <ScrollView
                        ref={scrollRef}
                        horizontal={true}
                        showsHorizontalScrollIndicator={false}
                    >
                        <MathJaxSvg style={{
                            marginTop: 30,
                            marginRight: 50
                        }} fontSize={30} color={(isDark) ? 'white' : 'black'} fontCache={true}>
                            {`\\[${renderingExpression()}\\]`}
                        </MathJaxSvg>
                    </ScrollView>
                    <View style={[
                        styles.group,
                    ]}>
                        <Text style={[
                            styles.subText,
                            {
                                flex: 1,
                                fontSize: (params?.length > 5) ? 20 : 23,
                                textAlign: 'left'
                            }
                        ]}>
                            {(isShowParams) ? "x = " + params : null}
                        </Text>
                        <Text style={[
                            styles.mainText,
                            {
                                flex: 3,
                                fontSize: (result?.toString().length > 10) ? 25 : 40,
                                marginBottom: 23,
                                color: (isDark) ? 'white' : 'black'
                            }
                        ]}>
                            {result}
                        </Text>
                    </View>
                </View>

                {/* Keyboard Layout */}
                <View style={styles.keyboard}>
                    <View style={styles.group}>
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[
                                styles.button, , { backgroundColor: '#fe5708' }
                            ]}
                            value={"Shift"}
                            onPress={() => {setShowParams(!isShowParams)}}
                        />
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button, ]}
                            value={"Mode"}
                            onPress={() => {}}
                        />
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button, ]}
                            value={"("}
                            onPress={() => { insertAtCursor(CommonOperations.OpeningBracket) }}
                        />
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button]}
                            value={")"}
                            onPress={() => { insertAtCursor(CommonOperations.ClosingBracket) }}
                        />
                    </View>
                    <View style={styles.group}>
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button, ]}
                            value={"←"}
                            onPress={() => { moveCursor('left') }}
                        />
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button, ]}
                            value={"→"}
                            onPress={() => { moveCursor('right') }}
                        />
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button, ]}
                            value={"↑"}
                            onPress={() => { moveCursor('up') }}
                        />
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button, ]}
                            value={"↓"}
                            onPress={() => { moveCursor('down') }}
                        />
                    </View>
                    <View style={styles.group}>
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button, ]}
                            value={"Param"}
                            onPress={() => {insertAtCursor(CommonOperations.Param)}}
                        />
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button, ]}
                            value={"³⁄₂"}
                            onPress={() => { insertAtCursor(AdvancedOperations.FRACTION) }}
                        />
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button, ]}
                            value={"ⁿ√"}
                            onPress={() => { insertAtCursor(AdvancedOperations.ROOT_N) }}
                        />
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button, ]}
                            value={"Del"}
                            onPress={deleteExpression}
                        />
                    </View>
                    <View style={styles.group}>
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button]}
                            value={"7"}
                            onPress={() => { insertAtCursor('7') }}
                        />
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button]}
                            value={"8"}
                            onPress={() => { insertAtCursor('8') }}
                        />
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button]}
                            value={"9"}
                            onPress={() => { insertAtCursor('9') }}
                        />
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button, ]}
                            value={"x"}
                            onPress={() => { insertAtCursor(CommonOperations.Multiply) }}
                        />
                    </View>
                    <View style={styles.group}>
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button]}
                            value={"4"}
                            onPress={() => { insertAtCursor('4') }}
                        />
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button]}
                            value={"5"}
                            onPress={() => { insertAtCursor('5') }}
                        />
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button]}
                            value={"6"}
                            onPress={() => { insertAtCursor('6') }}
                        />
                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button, ]}
                            value={"-"}
                            onPress={() => { insertAtCursor(CommonOperations.Subtract) }}
                        />
                    </View>
                    <View style={[styles.group, { marginTop: -17}]}>
                        <View style={[
                            styles.group,
                            {
                                flexDirection: 'column',
                                alignItems: 'stretch',
                                justifyContent: 'space-between',
                                width: '74%',
                            }
                        ]}>
                           <View style={styles.group}>
                               <Button
                                   textColor={styles.textBtn}
                                   btnStyle={[styles.button]}
                                   value={"1"}
                                   onPress={() => { insertAtCursor('1') }}
                               />
                               <Button
                                   textColor={styles.textBtn}
                                   btnStyle={[styles.button]}
                                   value={"2"}
                                   onPress={() => { insertAtCursor('2') }}
                               />
                               <Button
                                   textColor={styles.textBtn}
                                   btnStyle={[styles.button]}
                                   value={"3"}
                                   onPress={() => { insertAtCursor('3') }}
                               />
                           </View>
                            <View style={styles.group}>
                                <Button
                                    textColor={styles.textBtn}
                                    btnStyle={[styles.button]}
                                    value={"."}
                                    onPress={() => { insertAtCursor(CommonOperations.Dot) }}
                                />
                                <Button
                                    textColor={styles.textBtn}
                                    btnStyle={[styles.button]}
                                    value={"0"}
                                    onPress={() => { insertAtCursor('0') }}
                                />
                                <Button
                                    textColor={styles.textBtn}
                                    btnStyle={[styles.button, ]}
                                    value={"+"}
                                    onPress={() => { insertAtCursor(CommonOperations.Add) }}
                                />
                            </View>
                        </View>

                        <Button
                            textColor={styles.textBtn}
                            btnStyle={[styles.button, , { backgroundColor: '#fe5708', height: '70%', borderRadius: 10}]}
                            value={"="}
                            onPress={evaluateExpression}
                            hint={"Solve"}
                            hintColor={(isDark) ? 'white' : '#fe5708'}
                        />
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
}

const createStyles = (isDark: boolean) => {
    return StyleSheet.create({
        theme: {
            backgroundColor: isDark ? 'black' : '#F1F2F3',
            height: '100%',
            justifyContent: 'space-between',
            padding: 15,
        },
        button: {
            width: Dimensions.get('window').width / 4 - 20,
            height: Dimensions.get('window').width / 5.76 - 29,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
            backgroundColor: isDark ? '#2E2F38' : '#FFFFFF',
            fontFamily: 'Roboto-Regular'
        },
        textBtn: {
            fontSize: 25,
            color: isDark ? 'white' : 'black',
            fontFamily: 'Roboto-Regular'
        },
        funcButton: {
            backgroundColor: isDark ? '#4E505F' : '#D2D3DA'
        },
        commonButton: {
            fontSize: 36,
            color: 'white',
            backgroundColor: '#4B5EFC',
        },
        group: {
            flexDirection: 'row',
            marginBottom: 8,
            marginTop: 10,
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        mainText: {
            color: 'white',
            fontSize: 40,
            textAlign: 'right',
            fontFamily: 'Roboto-Bold'
        },
        subText: {
            color: '#747477',
            fontSize: 42,
            textAlign: 'right',
            marginBottom: 20
        },
        note: {
            color: (isDark) ? 'white' : 'black',
            fontSize: 19,
            marginBottom: 10
        },
        changeThemeBtn: {

        },
        keyboard: {
            flex: 6,
        },
        fitBox: {
            flex: 1,
            marginBottom: 99,
        },
        image: {
            width: 40,
            height: 40,
            marginRight: 13
        }
    });
};
