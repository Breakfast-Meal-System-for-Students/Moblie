import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Security() {
  const navigation = useNavigation();

  const handleOptionPress = (option) => {
    switch (option) {
      case "ChangePassword":
        //Alert.alert("Change Password", "Navigate to Change Password screen.");
        navigation.navigate("ChangePassword");
        break;
      case "Enable2FA":
        Alert.alert(
          "Two-Factor Authentication",
          "Navigate to 2FA setup screen."
        );
        // navigation.navigate("TwoFactorAuthScreen");
        break;
      case "SecurityQuestions":
        Alert.alert(
          "Security Questions",
          "Navigate to set security questions screen."
        );
        // navigation.navigate("SecurityQuestionsScreen");
        break;
      case "RecentActivity":
        Alert.alert(
          "Recent Activity",
          "Navigate to view recent activity screen."
        );
        // navigation.navigate("RecentActivityScreen");
        break;
      default:
        break;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Security Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Change Password Option */}
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleOptionPress("ChangePassword")}
        >
          <MaterialCommunityIcons name="key-change" size={24} color="#00cc69" />
          <Text style={styles.optionText}>Change Password</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        {/* Two-Factor Authentication Option */}
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleOptionPress("Enable2FA")}
        >
          <Ionicons name="shield-checkmark-outline" size={24} color="#00cc69" />
          <Text style={styles.optionText}>
            Enable Two-Factor Authentication
          </Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        {/* Security Questions Option */}
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleOptionPress("SecurityQuestions")}
        >
          <Ionicons name="help-circle-outline" size={24} color="#00cc69" />
          <Text style={styles.optionText}>Set Security Questions</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>

        {/* Recent Activity Option */}
        <TouchableOpacity
          style={styles.optionContainer}
          onPress={() => handleOptionPress("RecentActivity")}
        >
          <Ionicons name="time-outline" size={24} color="#00cc69" />
          <Text style={styles.optionText}>View Recent Activity</Text>
          <Ionicons name="chevron-forward" size={24} color="#666" />
        </TouchableOpacity>
      </ScrollView>

      {/* Save Changes Button */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={() =>
          Alert.alert("Save Changes", "Your changes have been saved.")
        }
      >
        <Text style={styles.buttonText}>Save Changes</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00cc69",
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 10,
    flex: 1,
    textAlign: "center",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  optionContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  optionText: {
    flex: 1,
    marginLeft: 15,
    fontSize: 18,
    color: "#333",
  },
  saveButton: {
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
    margin: 20,
    backgroundColor: "#00cc69",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
});
