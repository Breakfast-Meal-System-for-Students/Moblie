import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Pressable,
  Image,
  ImageBackground,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";

function ForgotPasswordScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { width } = Dimensions.get("window");

  const handleSendEmail = async () => {
    if (!email || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill all fields.");
      return;
    }

    if (!email.endsWith("@gmail.com")) {
      Alert.alert("Error", "Email must end with '@gmail.com'.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

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
        Alert.alert("Success", "Password reset successfully!");
        navigation.navigate("OTPScreen");
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

          <Text style={styles.headerText}>Forgot Password?</Text>

          <TextInput
            placeholder="Enter your email"
            placeholderTextColor="#888"
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
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

          <Pressable style={styles.button} onPress={handleSendEmail}>
            <Text style={styles.buttonText}>Reset Password</Text>
          </Pressable>

          <View style={styles.policyContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Main")}>
              <Text style={styles.policyText}>
                <Text style={styles.policyLink}>Back to Login</Text>
              </Text>
            </TouchableOpacity>
          </View>
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
  policyContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  policyText: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
  policyLink: {
    color: "white",
  },
});

export default ForgotPasswordScreen;
