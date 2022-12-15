import React, { useState } from "react";
import { View, StyleSheet, Button } from "react-native";
import { RNCamera } from 'react-native-camera';
import { useCamera } from 'react-native-camera-hooks';
import RNFS from 'react-native-fs';

export default function Camera({ navigation, route }) {

    const [{ cameraRef }, { takePicture }] = useCamera(null);
    const [uri, setUri] = useState('');
    const path = route?.params?.from;
    const captureHandle = async () => {
        try {
            const data = await takePicture();
            const filePath = data.uri;
            const newFilePath = RNFS.ExternalDirectoryPath + '/MyPicture3.jpg';
            setUri(newFilePath);
            RNFS.moveFile(filePath, newFilePath)
                .then(() => navigation.navigate(path, {
                    screen: `Another ${path}`,
                    params: { thePath: newFilePath }
                }))
                .catch(error => {
                    console.log(error);
                })
                .finally(() => console.log("done"));
        } catch (err) {
            console.log("error: ", err.message);
        }
    }
    return (
        <RNCamera
            ref={cameraRef}
            type={RNCamera.Constants.Type.back}
            style={styles.preview}>
            <Button onPress={() => captureHandle()}
                title="Press me">
                Capture</Button>
        </RNCamera>
    )
}

const styles = StyleSheet.create({
    body: {
        flex: 1
    },
    preview: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'flex-end',
    }
})