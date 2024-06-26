import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const FormScreen = () => {
  return (
    <View style={styles.container}>
      <Text>form Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default FormScreen;