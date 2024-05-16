import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import {Slot, Stack} from 'expo-router';
import {useFonts} from 'expo-font';

const RootLayout = () => {

  const [loaded] = useFonts({
    "IBM-Plex-Sans": require("../assets/fonts/IBMPlexSans-Regular.ttf"),
    "IBM-Plex-Sans-Bold": require("../assets/fonts/IBMPlexSans-Bold.ttf"),
    "IBM-Plex-Sans-Medium": require("../assets/fonts/IBMPlexSans-Medium.ttf"),
    "IBM-Plex-Sans-SemiBold": require("../assets/fonts/IBMPlexSans-SemiBold.ttf"),
    "IBM-Plex-Sans-Light": require("../assets/fonts/IBMPlexSans-Light.ttf"),
    "IBM-Plex-Sans-ExtraLight": require("../assets/fonts/IBMPlexSans-ExtraLight.ttf"),
    "IBM-Plex-Sans-Thin": require("../assets/fonts/IBMPlexSans-Thin.ttf"),
    "IBM-Plex-SemiBoldItalic": require("../assets/fonts/IBMPlexSans-SemiBoldItalic.ttf"),
    "IBM-Plex-Sans-ThinItalic": require("../assets/fonts/IBMPlexSans-ThinItalic.ttf"),
    "IBM-Plex-Sans-LightItalic": require("../assets/fonts/IBMPlexSans-LightItalic.ttf"),
    "IBM-Plex-Sans-ExtraLightItalic": require("../assets/fonts/IBMPlexSans-ExtraLightItalic.ttf"),
    "IBM-Plex-Sans-MediumItalic": require("../assets/fonts/IBMPlexSans-MediumItalic.ttf"),
    "IBM-Plex-Sans-BoldItalic": require("../assets/fonts/IBMPlexSans-BoldItalic.ttf")
  });


  return (
    <Stack>
        <Stack.Screen name="index"
        options={{ headerShown:
        false}}/>
    </Stack>
  )
}

export default RootLayout
