import { Dimensions, Platform, StatusBar } from "react-native";

const getHeaderHeight = () => {
    const { height, width } = Dimensions.get('window');
    const defaultStatusBarHeight = 24; // Default value for status bar height if undefined
    const aspectRatio = height / width;

    if (Platform.OS === 'android') {
        return (StatusBar.currentHeight || defaultStatusBarHeight); //Android Height
    }
    return 56; //Default Height
};

export { getHeaderHeight };