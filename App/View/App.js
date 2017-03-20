import React, {Component} from 'react';
import {AppRegistry, StyleSheet, Text, View, Platform} from 'react-native';

export class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Hello Conan! This is {Platform.OS} view!!!
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    }
});