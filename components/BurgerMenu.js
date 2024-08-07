// CustomHeader.js
import React, { useState } from 'react';
import { View, Modal, TouchableOpacity, Text, Image, StyleSheet } from 'react-native';

const CustomHeader = ({ navigation }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  const toggleMenu = () => setMenuVisible(!menuVisible);

  const handleLogout = () => {
    navigation.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
    toggleMenu(); // Close the menu after logout
  };

  return (
    
    <>
    <View>
    <TouchableOpacity onPress={toggleMenu} style={{ marginRight: 15 }}>
        <Image
          source={require('../assets/burger-bar.png')}
          style={{ width: 24, height: 24 }}
        />
      </TouchableOpacity>
    </View>
    <View style={styles.logoView}>
    <Image
      source={require('../assets/verbalLogo.jpeg')}
      style={{ width: 75, height: 45, marginRight: 100, marginTop: -32}}
    />
    </View>




      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={toggleMenu}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity style={styles.button} onPress={handleLogout}>
              <Text style={styles.buttonText}>Logout</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={toggleMenu}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0, 0, 0, 0.4)'
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    elevation: 5
  },
  button: {
    backgroundColor: "#2196F3",
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    marginVertical: 10
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  logoView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginRight:200,
  }
});

export default CustomHeader;
