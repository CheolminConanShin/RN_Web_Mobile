import React, {Component} from 'react';
import {View, Text} from 'react-native';


export default class Scorm extends Component {
    constructor(props) {
        super(props);


        var express = require('express');
        var app = express();

        app.get('/', function (req, res) {
            res.send('Hello World! (' + Date.now() + ")");
        });

        var server = app.listen(3000, function () {
            // console.log("Express server is started. (port: 3000)");
        });
    }

    render(){
        return(
            <View>
                <Text>Hello</Text>
            </View>
        )
    }
}