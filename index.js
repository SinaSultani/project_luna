/**
 * @format
 */
import * as React from 'react';
import { AppRegistry } from 'react-native';
import { MainBundlePath } from 'react-native-fs';
import { Fonts, Provider as PaperProvider, DefaultTheme, configureFonts } from 'react-native-paper';
import App from './App';
import { name as appName } from './app.json';


export default function Main() {
    return (
        <PaperProvider>
            <App />
        </PaperProvider>
    )
}


AppRegistry.registerComponent(appName, () => Main);
