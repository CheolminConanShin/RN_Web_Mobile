import React, {Component} from 'react';

export default class Connector extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        var x = fetch('http://localhost:50001/scormPlayer.html?cntsNid=60551&chNid=5245&langCd=en&port=50001');
        console.log(x);
        return(
            <div>hello</div>
        )
    }
}