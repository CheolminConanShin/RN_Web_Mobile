import React, {Component} from 'react';
import {VideoPlayer} from './VideoPlayer';
import {View} from 'react-native';
import {MediaQueryStyleSheet} from "react-native-responsive";

export class App extends Component {
    render() {
        return (
            <View style={mediaQueryStyles.container}>
                <VideoPlayer/>
            </View>
        );
    }
}

const mediaQueryStyles = MediaQueryStyleSheet.create(
    {
        container: {
            height: "100%",
            backgroundColor: "black"
        }
    },
    {
        "@media (min-device-width: 320)": {
            container: {
                height: "100%",
                backgroundColor: "blue"
            }
        }
    }
)