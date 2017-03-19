import {AppRegistry} from 'react-native';
import {App} from './App/View/App';

AppRegistry.registerComponent('App', () => App);
AppRegistry.runApplication('App', {
    rootTag: document.getElementById('react-root')
})
