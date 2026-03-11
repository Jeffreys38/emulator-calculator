import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, Button, StyleSheet } from 'react-native';
import { create, all } from 'mathjs';

// Initialize math.js
const math = create(all);

// Define the structure of each expression element
type ExpressionElement = {
    id: string;         // Unique identifier for each element
    value: string;      // The value, could be a number, operator, etc.
};

// Define the structure of the expression state
type ExpressionState = {
    elements: ExpressionElement[];
    cursorPosition: number; // The current cursor position
};

// Initial state with a sample expression
const initialState: ExpressionState = {
    elements: [],
    cursorPosition: 0,
};

// Function to move the cursor left or right
const moveCursor = (direction: 'left' | 'right', state: ExpressionState): ExpressionState => {
    let newPosition = state.cursorPosition;
    if (direction === 'left' && state.cursorPosition > 0) {
        newPosition--;
    } else if (direction === 'right' && state.cursorPosition < state.elements.length) {
        newPosition++;
    }
    return { ...state, cursorPosition: newPosition };
};

// Function to insert a value at the current cursor position
const insertValueAtCursor = (value: string, state: ExpressionState): ExpressionState => {
    const newElement = { id: `${Date.now()}`, value };
    const newElements = [
        ...state.elements.slice(0, state.cursorPosition),
        newElement,
        ...state.elements.slice(state.cursorPosition),
    ];
    return {
        elements: newElements,
        cursorPosition: state.cursorPosition + 1,
    };
};

// Function to handle backspace (delete the element before the cursor)
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

// Function to evaluate the current expression
const evaluateExpression = (state: ExpressionState): string => {
    const expression = state.elements.map(el => el.value).join('');
    try {
        const result = math.evaluate(expression);
        return result.toString();
    } catch (error) {
        return 'Error';
    }
};

// Component to display the expression with the cursor
const ExpressionDisplay = ({ state, showCursor }: { state: ExpressionState, showCursor: boolean }) => {
    const elementsWithCursor = [
        ...state.elements.slice(0, state.cursorPosition),
        { id: 'cursor', value: showCursor ? '|' : ' ' },  // Display the blinking cursor
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

// Main calculator component
const ExpressionCalculator = () => {
    const [state, setState] = useState<ExpressionState>(initialState);
    const [showCursor, setShowCursor] = useState(true);  // New state for blinking cursor
    const [result, setResult] = useState<string>(''); // To display the calculation result

    // Handle arrow key presses (left or right)
    const handleArrowKeyPress = (direction: 'left' | 'right') => {
        setState((prevState) => moveCursor(direction, prevState));
    };

    // Handle inserting a new value at the cursor position
    const handleValuePress = (value: string) => {
        setState((prevState) => insertValueAtCursor(value, prevState));
    };

    // Handle backspace (delete the element before the cursor)
    const handleBackspacePress = () => {
        setState((prevState) => handleBackspace(prevState));
    };

    // Handle evaluating the expression
    const handleEvaluatePress = () => {
        const calculatedResult = evaluateExpression(state);
        setResult(calculatedResult);
    };

    // Blinking cursor effect using useEffect and setInterval
    useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor((prev) => !prev);  // Toggle the cursor visibility
        }, 500); // Blinks every 500ms

        return () => clearInterval(interval); // Clean up the interval on unmount
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
                <Button title="(" onPress={() => handleValuePress('(')} />
                <Button title=")" onPress={() => handleValuePress(')')} />
                <Button title="sin" onPress={() => handleValuePress('sin(')} />
            </View>
        </View>
    );
};

// Styles for the components
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
