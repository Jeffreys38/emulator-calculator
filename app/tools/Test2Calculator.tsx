import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, Button, StyleSheet } from 'react-native';
import { create, all } from 'mathjs';

const math = create(all);

type ExpressionElement = {
    id: string;         // Unique identifier for each element
    value: string;      // The value, could be a number, operator, etc.
};

type ExpressionState = {
    elements: ExpressionElement[];
    cursorPosition: number; // The current cursor position
};

const initialState: ExpressionState = {
    elements: [],
    cursorPosition: 0,
};

const moveCursor = (direction: 'left' | 'right', state: ExpressionState): ExpressionState => {
    let newPosition = state.cursorPosition;
    if (direction === 'left' && state.cursorPosition > 0) {
        newPosition--;
    } else if (direction === 'right' && state.cursorPosition < state.elements.length) {
        newPosition++;
    }
    return { ...state, cursorPosition: newPosition };
};

const insertValueAtCursor = (value: string, state: ExpressionState): ExpressionState => {
    const newElement = { id: `${Date.now()}`, value };
    const newElements = [
        ...state.elements.slice(0, state.cursorPosition),
        newElement,
        ...state.elements.slice(state.cursorPosition),
    ];

    // Nếu giá trị là các phép tính đặc biệt, thêm dấu ngoặc để đảm bảo biểu thức đúng
    if (value === 'sqrt(' || value === '^(' || value === 'nthRoot(') {
        newElements.splice(state.cursorPosition + 1, 0, { id: `${Date.now() + 1}`, value: ')' });
    }

    return {
        elements: newElements,
        cursorPosition: state.cursorPosition + 1,
    };
};

const handleBackspace = (state: ExpressionState): ExpressionState => {
    if (state.cursorPosition === 0) return state; // No deletion possible if cursor is at the start

    const newElements = [
        ...state.elements.slice(0, state.cursorPosition - 1),
        ...state.elements.slice(state.cursorPosition),
    ];

    return {
        elements: newElements,
        cursorPosition: state.cursorPosition - 1,
    };
};

const evaluateExpression = (state: ExpressionState): string => {
    const expression = state.elements.map(el => el.value).join('');
    try {
        const result = math.evaluate(expression);
        return result.toString();
    } catch (error) {
        return 'Error';
    }
};

const ExpressionDisplay = ({ state, showCursor }: { state: ExpressionState, showCursor: boolean }) => {
    const elementsWithCursor = [
        ...state.elements.slice(0, state.cursorPosition),
        { id: 'cursor', value: showCursor ? '|' : ' ' },
        ...state.elements.slice(state.cursorPosition),
    ];

    return (
        <FlatList
            data={elementsWithCursor}
            horizontal
            renderItem={({ item }) => (
                <Text style={item.id === 'cursor' ? styles.cursor : styles.expressionText}>
                    {item.value}
                </Text>
            )}
            keyExtractor={(item) => item.id}
        />
    );
};

const ExpressionCalculator = () => {
    const [state, setState] = useState<ExpressionState>(initialState);
    const [showCursor, setShowCursor] = useState(true);  // New state for blinking cursor
    const [result, setResult] = useState<string>(''); // To display the calculation result

    const handleArrowKeyPress = (direction: 'left' | 'right') => {
        console.log(moveCursor(direction, state))
        setState((prevState) => moveCursor(direction, prevState));
    };

    const handleValuePress = (value: string) => {
        setState((prevState) => insertValueAtCursor(value, prevState));
    };

    const handleBackspacePress = () => {
        setState((prevState) => handleBackspace(prevState));
    };

    const handleEvaluatePress = () => {
        const calculatedResult = evaluateExpression(state);
        setResult(calculatedResult);
    };


    useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor((prev) => !prev);
        }, 500);

        return () => clearInterval(interval);
    }, []);

    return (
        <View style={styles.container}>
            <ExpressionDisplay state={state} showCursor={showCursor} />
            <Text style={styles.resultText}>Result: {result}</Text>
            <View style={styles.buttonContainer}>
                <Button title="Left" onPress={() => handleArrowKeyPress('left')} />
                <Button title="Right" onPress={() => handleArrowKeyPress('right')} />
                <Button title="Backspace" onPress={handleBackspacePress} />
                <Button title="=" onPress={handleEvaluatePress} />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="5" onPress={() => handleValuePress('5')} />
                <Button title="+" onPress={() => handleValuePress('+')} />
                <Button title="3" onPress={() => handleValuePress('3')} />
                <Button title="sqrt" onPress={() => handleValuePress('sqrt(')} />
                <Button title="^" onPress={() => handleValuePress('^(')} />
                <Button title="nthRoot" onPress={() => handleValuePress('nthRoot(')} />
                <Button title="(" onPress={() => handleValuePress('(')} />
                <Button title=")" onPress={() => handleValuePress(')')} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    expressionText: {
        fontSize: 24,
        marginHorizontal: 5,
    },
    cursor: {
        fontSize: 24,
        marginHorizontal: 5,
        color: 'blue',
    },
    resultText: {
        fontSize: 18,
        marginVertical: 10,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginVertical: 10,
    },
});

export default ExpressionCalculator;
