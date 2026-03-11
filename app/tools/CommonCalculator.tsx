import {SafeAreaView, StyleSheet, View, Text, Dimensions} from 'react-native';
import {useState} from "react";
import {Button} from "@/components/Button";
import Derivative from "@/components/Operators/Derivative";

export default function CommonCalculator() {
    const [themeColor, setThemeColor] = useState("dark");
    const styles = createStyles(themeColor);

    return (
        <SafeAreaView>
            <View style={styles.theme}>
                {/* Change Theme Button */}
                <View style={[styles.changeThemeBtn, styles.fitBox]}>

                </View>

                {/* Result */}
                <View style={styles.fitBox}>
                    <Text style={styles.subText}>6.291÷5</Text>
                    <Text style={styles.mainText}>
                        <Derivative
                            expression="x^2 + 2x + 1"
                            x={45}
                            color={"white"}
                            screenSize={[190, 200]}
                            size={34}
                        />
                        2x + 2
                    </Text>
                </View>

                {/* Keyboard Layout */}
                <View style={styles.keyboard}>
                    {renderKeyboardLayout(styles)}
                </View>
            </View>
        </SafeAreaView>
    );
}

const renderKeyboardLayout = (styles: any) => {
    const buttons = [
        ["C", "±", "%", "÷"],
        ["7", "8", "9", "X"],
        ["4", "5", "6", "-"],
        ["1", "2", "3", "+"],
        [".", "0", "⌫", "="]
    ];

    return buttons.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.group}>
            { row.map((value, index) => (
                <Button
                    key={index}
                    textColor={styles.textBtn}
                    btnStyle={[
                        styles.button,
                        value.match(/[÷X=+=-]/) ? styles.commonButton : null,
                        value.match(/[C±%]/) ? styles.funcButton : null
                    ]}
                    value={value}
                />
            ))}
        </View>
    ));
};

const createStyles = (theme: any) => {
    return StyleSheet.create({
        theme: {
            backgroundColor: theme === "dark" ? 'black' : '#F1F2F3',
            height: '100%',
            justifyContent: 'space-between',
            padding: 15
        },
        button: {
            width: Dimensions.get('window').width / 4 - 20,
            height: Dimensions.get('window').width / 5.5 - 25,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 100,
            backgroundColor: theme === "dark" ? '#2E2F38' : '#FFFFFF',
        },
        textBtn: {
            fontSize: 25,
            color: theme === "dark" ? 'white' : 'black',
        },
        funcButton: {
            backgroundColor: theme === "dark" ? '#4E505F' : '#D2D3DA'
        },
        commonButton: {
            fontSize: 36,
            color: 'white',
            backgroundColor: '#4B5EFC',
        },
        group: {
            flexDirection: 'row',
            marginBottom: 8,
            justifyContent: 'space-between',
            alignItems: 'center'
        },
        mainText: {
            color: 'white',
            fontSize: 40,
            textAlign: 'right',
        },
        subText: {
            color: '#747477',
            fontSize: 42,
            textAlign: 'right',
            marginBottom: 20
        },
        changeThemeBtn: {
            // Add styles for the theme toggle button
        },
        keyboard: {
            flex: 3,
        },
        fitBox: {
            flex: 1,
            marginBottom: 99,
        }
    });
};
