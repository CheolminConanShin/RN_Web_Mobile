import React, {Component} from 'react';
import {VideoPlayer} from './VideoPlayer';
import {View, Text, Button} from 'react-native';
import {MediaQueryStyleSheet} from "react-native-responsive";
import {Styles} from './Styles'
var httpServer = require('react-native-http-server');

export class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            data: "yes"
        }

        this.fetchMe = this.fetchMe.bind(this);
    }

    componentWillMount() {
        var options = {
            port: 1234, // note that 80 is reserved on Android - an exception will be thrown
        };

        // initalise the server (now accessible via localhost:1234)
        httpServer.create(options, function (request, send) {
            // interpret the url
            let url = request.url.split('/');
            let ext = url[1];
            let data = JSON.stringify({data: "hello world!", extension: ext});

            //Build our response object (you can specify status, mime_type (type), data, and response headers)
            let res = {};
            res.status = "OK";
            res.type = "application/json";
            res.data = data;
            res.headers = {
                "Access-Control-Allow-Credentials": "true",
                "Access-Control-Allow-Headers": "Authorization, Content-Type, Accept, Origin, User-Agent, Cache-Control, Keep-Alive, If-Modified-Since, If-None-Match",
                "Access-Control-Allow-Methods": "GET, HEAD",
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Expose-Headers": "Content-Type, Cache-Control, ETag, Expires, Last-Modified, Content-Length",
                "Access-Control-Max-Age": "3000",
                "Cache-Control": "max-age=300",
                "Connection": "keep-alive",
                "Content-Encoding": "gzip",
                "Content-Length": data.length.toString(),
                "Date": (new Date()).toUTCString(),
                "Last-Modified": (new Date()).toUTCString(),
                "Server": "Fastly",
                "Vary": "Accept-Encoding"
            };
            send(res);
        });

        this.setState({
            data: "no"
        })
    }

    fetchMe() {
        fetch("http://localhost:1234").then((response)  => response.json())
            .then((responseJson) => this.setState({data: responseJson.data}))
        // this.setState({
        //     data: "hello Kris"
        // })

    }

    render() {
        return (
            <View>
                <Text>{this.state.data}</Text>
                <Button
                    onPress={this.fetchMe}
                    title="Fetch"
                />
            </View>
        );
    }
}

const mediaQueryStyles = MediaQueryStyleSheet.create(Styles.base, Styles.rules)