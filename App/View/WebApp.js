import React, {Component} from 'react';
import {StyleSheet, Text, View, Platform} from 'react-native';
import {Styles} from "./Styles";
import video from 'videojs-contrib-hls';
import videojs from "video.js";
window.videojs = videojs;

export class App extends Component {
    render() {

        return (
            <View>
                <Text>
                    Hello Conan! This is {Platform.OS} view!!!
                </Text>
                <video id="video-player" controls preload className="video-js"/>
            </View>
        );
    }

    componentDidMount(){
        let player = videojs("video-player", {html5: {
            hls: {
                withCredentials: false}}});

        player.src({
            // src: "https://d2zihajmogu5jn.cloudfront.net/bipbop-advanced/bipbop_16x9_variant.m3u8",
            src: "http://qthttp.apple.com.edgesuite.net/1010qwoeiuryfg/sl.m3u8",
            type: 'application/x-mpegURL'
        });
        player.play();

    }
}

const styles = StyleSheet.create(Styles.base, Styles.rules);