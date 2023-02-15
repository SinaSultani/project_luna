import React from "react";
import { TextInput } from 'react-native-paper';

function Input({ type, placeholder, style, placeholderTextColor, secureTextEntry }, ref) {
    return (
        <TextInput
            ref={ref}
            placeholder={placeholder}
            style={style}
            placeholderTextColor={placeholderTextColor}
            secureTextEntry={secureTextEntry}
        />
    );
}

const forwardedInput = React.forwardRef(Input);
export default forwardedInput;