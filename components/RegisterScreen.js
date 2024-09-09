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

export default function Register({ onRegister }) {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState(""); // Ngày sinh
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // Số điện thoại
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigation = useNavigation(); // Lấy đối tượng navigation

  const handleRegister = () => {
    let validationErrors = {};

    // Kiểm tra các trường không được để trống
    if (!fullName) validationErrors.fullName = "Full Name is required";
    if (!dob) validationErrors.dob = "Date of Birth is required";
    if (!email) validationErrors.email = "Email is required";
    if (!phone) validationErrors.phone = "Phone Number is required";
    if (!password) validationErrors.password = "Password is required";
    if (!confirmPassword)
      validationErrors.confirmPassword = "Confirm Password is required";

    // Kiểm tra định dạng email
    if (!email.endsWith("@gmail.com"))
      validationErrors.email = "Email must end with '@gmail.com'";

    // Kiểm tra mật khẩu
    if (password !== confirmPassword)
      validationErrors.confirmPassword = "Passwords do not match";

    // Kiểm tra số điện thoại
    const phonePattern = /^[0-9]+$/;
    if (!phonePattern.test(phone))
      validationErrors.phone = "Phone Number must contain only numbers";
    if (phone.length > 10)
      validationErrors.phone = "Phone Number must not exceed 10 digits";

    // Kiểm tra ngày sinh
    const dobPattern = /^\d{2}-\d{2}-\d{4}$/; // Định dạng DD-MM-YYYY
    if (!dobPattern.test(dob))
      validationErrors.dob = "Date of Birth must be in the format DD-MM-YYYY";

    // Nếu có lỗi, cập nhật trạng thái lỗi và thoát
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Giả lập đăng ký thành công
    Alert.alert("Success", "Registration successful!");
    navigation.navigate("Home"); // Điều hướng đến trang Home
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
        style={[styles.input, errors.dob && styles.inputError]}
        placeholder="Date of Birth (DD-MM-YYYY or DD/MM/YYYY)"
        value={dob}
        onChangeText={(text) => {
          // Remove all non-numeric and non-slash/hyphen characters
          const formattedText = text.replace(/[^0-9\-\/]/g, "").slice(0, 10);
          setDob(formattedText);
        }}
        keyboardType="numeric"
      />
      {errors.dob && <Text style={styles.errorText}>{errors.dob}</Text>}
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
        style={[styles.input, errors.phone && styles.inputError]}
        placeholder="Phone Number"
        value={phone}
        onChangeText={(text) => {
          // Chỉ cho phép nhập số và giới hạn không quá 10 chữ số
          const formattedText = text.replace(/[^0-9]/g, "").slice(0, 10);
          setPhone(formattedText);
        }}
        keyboardType="numeric"
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

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
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginVertical: 10,
    fontSize: 16,
  },
  formButton: {
    backgroundColor: "rgba(123,104,238,0.8)",
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginTop: 20,
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
