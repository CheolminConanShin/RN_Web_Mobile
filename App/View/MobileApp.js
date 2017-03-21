import React, {Component} from 'react';
import {VideoPlayer} from './VideoPlayer';
import {View} from 'react-native';
import {MediaQueryStyleSheet} from "react-native-responsive";
import {Styles} from './Styles'

export class App extends Component {
    render() {
        return (
            <View style={mediaQueryStyles.container}>
                <VideoPlayer/>
            </View>
        );
    }
}

const mediaQueryStyles = MediaQueryStyleSheet.create(Styles.base, Styles.rules)