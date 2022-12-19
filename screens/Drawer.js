import React from 'react';
import { View, TouchableOpacity, StyleSheet, Animated, Text } from 'react-native';

const BottomDrawer = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const height = React.useRef(new Animated.Value(0)).current;

    const toggleDrawer = () => {
        if (isOpen) {
            Animated.timing(height, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(height, {
                toValue: 200,
                duration: 200,
                useNativeDriver: true,
            }).start();
        }
        setIsOpen(!isOpen);
    };

    return (
        <View>
            <TouchableOpacity onPress={toggleDrawer}>
                <Text>Image is here</Text>
            </TouchableOpacity>
            <Animated.View
                style={[styles.container, { height: isOpen ? 200 : 0, easing: 'bounce' }]}
                // style={[styles.container, { transform: [{ translateY:  isOpen ? 200 : 0 }], easing: 'bounce' }]}
            >
                <Text onPress={toggleDrawer}>Drawer Content Here</Text>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        
    },
});

export default BottomDrawer;






// import React, { useRef, useState } from 'react';
// import { View, StyleSheet } from 'react-native';

// function BottomDrawer({ children, onClose }) {
//   // Use the useRef hook to create a reference to the drawer component
//   const drawerRef = useRef(null);

//   // Use the useState hook to keep track of whether the drawer is open
//   const [isOpen, setIsOpen] = useState(false);

//   // Define the openDrawer method
//   const openDrawer = () => {
//     drawerRef.current.open();
//     setIsOpen(true);
//   }

//   // Define the closeDrawer method
//   const closeDrawer = () => {
//     drawerRef.current.close();
//     setIsOpen(false);
//   }

//   // Define the onClose prop for the drawer
//   const drawerOnClose = () => {
//     closeDrawer();
//     if (onClose) {
//       onClose();
//     }
//   }

//   return (
   
//   )
// }