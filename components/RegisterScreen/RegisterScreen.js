import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  StyleSheet,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import axios from "axios"; // Add axios import

export default function Register({ onRegister }) {
  const [fullName, setFullName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dob, setDob] = useState(""); // Ngày sinh
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigation = useNavigation(); // Lấy đối tượng navigation

  const handleRegister = async () => {
    let validationErrors = {};

    // Kiểm tra các trường không được để trống
    if (!fullName) validationErrors.fullName = "Full Name is required";
    if (!lastName) validationErrors.lastName = "Last Name is required";
    if (!email) validationErrors.email = "Email is required";
    if (!password) validationErrors.password = "Password is required";
    if (!confirmPassword)
      validationErrors.confirmPassword = "Confirm Password is required";

    // Kiểm tra định dạng email

    // Kiểm tra mật khẩu
    if (password !== confirmPassword)
      validationErrors.confirmPassword = "Passwords do not match";

    // Nếu có lỗi, cập nhật trạng thái lỗi và thoát
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await axios.post(
        "https://bms-fs-api.azurewebsites.net/api/Auth/register",
        {
          email,
          firstName: fullName,
          lastName,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );

      if (response.status === 200) {
        Alert.alert(
          "Success",
          "Registration successful! Please log in to continue."
        );
        navigation.navigate("Login"); // Điều hướng đến trang Login
      } else {
        Alert.alert("Error", "Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration error:", error);
      Alert.alert(
        "Error",
        error.response?.data?.detail ||
          "An error occurred during registration. Please try again."
      );
    }
  };

  return (
    <View style={styles.formContainer}>
      <TextInput
        placeholder="Full Name"
        style={[styles.input, errors.fullName && styles.inputError]}
        value={fullName}
        onChangeText={setFullName}
      />
      {errors.fullName && (
        <Text style={styles.errorText}>{errors.fullName}</Text>
      )}

      <TextInput
        placeholder="Last Name"
        style={[styles.input, errors.lastName && styles.inputError]}
        value={lastName}
        onChangeText={setLastName}
      />
      {errors.lastName && (
        <Text style={styles.errorText}>{errors.lastName}</Text>
      )}

      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      <TextInput
        style={[styles.input, errors.confirmPassword && styles.inputError]}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}

      <Pressable style={styles.formButton} onPress={handleRegister}>
        <Text style={styles.buttonText}>REGISTER</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginVertical: 10,
    fontSize: 16,
    padding: 10,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  formButton: {
    backgroundColor: "#00cc69",
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginTop: 50,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 6.68,
    elevation: 8,
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
});
