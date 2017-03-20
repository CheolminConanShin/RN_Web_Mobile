import React, {Component} from 'react';
import {StyleSheet, Text, View, Platform} from 'react-native';

export class App extends Component {
    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.welcome}>
                    Hello Conan! This is {Platform.OS} view!!!
                </Text>
                <video id="my-video" class="video-js" controls preload="auto" width="640" height="264" data-setup="{}">
                    <source src="./broadchurch.mp4" type='video/mp4'/>
                </video>
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