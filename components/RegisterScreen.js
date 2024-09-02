import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Alert,
} from "react-native";
import DatePicker from "react-native-datepicker";

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState("");
  const [dob, setDob] = useState(""); // Ngày sinh
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState(""); // Số điện thoại
  const [username, setUsername] = useState(""); // Tài khoản
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // Nhập lại mật khẩu

  const [errors, setErrors] = useState({});

  const handleRegister = () => {
    let validationErrors = {};

    // Kiểm tra các trường không được để trống
    if (!fullName) validationErrors.fullName = "Full Name is required";
    if (!dob) validationErrors.dob = "Date of Birth is required";
    if (!email) validationErrors.email = "Email is required";
    if (!phone) validationErrors.phone = "Phone Number is required";
    if (!username) validationErrors.username = "Username is required";
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
    navigation.navigate("Login");
  };

  return (
    <ImageBackground
      source={{
        uri: "https://i.pinimg.com/564x/4e/a5/9f/4ea59fb67c528f2c78a30d4d366bf536.jpg",
      }}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.title}>Register</Text>
          <TextInput
            style={[styles.input, errors.fullName && styles.inputError]}
            placeholder="Full Name"
            value={fullName}
            onChangeText={setFullName}
          />
          {errors.fullName && (
            <Text style={styles.errorText}>{errors.fullName}</Text>
          )}

          <DatePicker
            style={[styles.datePicker, errors.dob && styles.inputError]}
            date={dob}
            mode="date"
            placeholder="Select Date of Birth"
            format="DD-MM-YYYY"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: "absolute",
                left: 0,
                top: 4,
                marginLeft: 0,
              },
              dateInput: {
                marginLeft: 36,
              },
            }}
            onDateChange={(date) => setDob(date)}
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
            style={[styles.input, errors.username && styles.inputError]}
            placeholder="Username"
            value={username}
            onChangeText={setUsername}
          />
          {errors.username && (
            <Text style={styles.errorText}>{errors.username}</Text>
          )}

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

          <TouchableOpacity style={styles.button} onPress={handleRegister}>
            <Text style={styles.buttonText}>Create Account</Text>
          </TouchableOpacity>

          <View style={styles.linkContainer}>
            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text style={styles.link}>Back to Login</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  box: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#009900",
    textAlign: "center",
  },
  input: {
    width: "100%",
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "red",
  },
  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#33CC33",
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  linkContainer: {
    marginTop: 20,
  },
  link: {
    color: "#009900",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
    textAlign: "center",
  },
  datePicker: {
    width: "100%",
    marginBottom: 15,
  },
});

export default RegisterScreen;
