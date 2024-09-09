// BottomNavigationBar.js
import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { faHome, faSearch, faUser } from "@fortawesome/free-solid-svg-icons";

export default function BottomNavigationBar({ navigation }) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Home")}
      >
        <FontAwesomeIcon icon={faHome} size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        // onPress={() => navigation.navigate('SearchScreen')}
      >
        <FontAwesomeIcon icon={faSearch} size={20} />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        // onPress={() => navigation.navigate('ProfileScreen')}
      >
        <FontAwesomeIcon icon={faUser} size={20} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    backgroundColor: "#00CC33",
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  button: {
    padding: 10,
  },
});
