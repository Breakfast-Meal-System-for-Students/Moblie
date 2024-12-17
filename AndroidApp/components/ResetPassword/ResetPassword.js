import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function ResetPasswordScreen() {
  const navigation = useNavigation();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { width } = Dimensions.get("window");

  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }
    const email = await AsyncStorage.getItem("email");
    try {
      const response = await axios.put(
        "https://bms-fs-api.azurewebsites.net/api/Account/ResetPassword",
        {
          email,
          newPassword,
          confirmPassword,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert("Success", "Password reset successfully.");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error(error);
      const errorMsg =
        error.response?.data?.errors?.ConfirmPassword?.[0] ||
        "An error occurred. Please try again.";
      Alert.alert("Error", errorMsg);
    }
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://i.pinimg.com/564x/22/a1/55/22a155dbc71897dab5b766dcce874973.jpg",
        }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <View style={styles.content}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Text style={styles.backButtonText}>←</Text>
          </TouchableOpacity>

          <Image
            source={{
              uri: "https://i.pinimg.com/474x/dc/f3/93/dcf3934512c6f8f2a107005eca1ab9de.jpg",
            }}
            style={[
              styles.icon,
              {
                width: width * 0.4,
                height: width * 0.4,
                borderRadius: (width * 0.4) / 2,
              },
            ]}
          />

          <Text style={styles.headerText}>Reset Password</Text>
          <TextInput
            placeholder="New Password"
            placeholderTextColor="#888"
            style={styles.textInput}
            value={newPassword}
            secureTextEntry
            onChangeText={setNewPassword}
          />
          <TextInput
            placeholder="Confirm Password"
            placeholderTextColor="#888"
            style={styles.textInput}
            value={confirmPassword}
            secureTextEntry
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </TouchableOpacity>
        </View>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  background: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
  },
  backButtonText: {
    fontSize: 24,
    color: "white",
  },
  icon: {
    alignSelf: "center",
    marginBottom: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 20,
  },
  textInput: {
    width: "100%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 12,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  button: {
    width: "100%",
    backgroundColor: "#00cc69",
    paddingVertical: 15,
    borderRadius: 30,
    alignItems: "center",
    marginVertical: 20,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ResetPasswordScreen;
