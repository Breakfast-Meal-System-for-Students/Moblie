import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  Pressable,
  TouchableOpacity,
  Text,
  StyleSheet,
  Alert,
  Image,
  ImageBackground,
  Dimensions,
  ScrollView,
} from "react-native";
import CheckBox from "@react-native-community/checkbox";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Grid } from "react-native-feather";
import { Picker } from "@react-native-picker/picker";

export default function Register() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [studentIdCard, setStudentIdCard] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isFormValid, setIsFormValid] = useState(false);
  const [isProccessing, setIsProccessing] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");
  const [listUniversity, setListUniversity] = useState([]);
  const { width, height } = Dimensions.get("window");
  const [useStudentEmail, setUseStudentEmail] = useState(false);

  useEffect(() => {
    setIsFormValid(
      fullName.trim() !== "" &&
        lastName.trim() !== "" &&
        email.trim() !== "" &&
        studentIdCard.trim() !== "" &&
        password.trim() !== "" &&
        password === confirmPassword
    );
  }, [fullName, lastName, email, password, confirmPassword]);

  useEffect(() => {
    fetchUniversity("", true, 1, 1000);
  }, []);

  const fetchUniversity = async (search, isDesc, pageIndex, pageSize) => {
    const params = new URLSearchParams({ search, isDesc, pageIndex, pageSize });
    const result = await fetch(
      `https://bms-fs-api.azurewebsites.net/api/University?${params.toString()}`
    );
    const resBody = await result.json();
    if (resBody.isSuccess) {
      setListUniversity(resBody.data.data);
    } else {
      console.log(resBody);
    }
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Biểu thức chính quy kiểm tra email
    return emailRegex.test(email);
  }

  const handleRegister = async () => {
    setIsProccessing(true);
    if (!isFormValid) {
      Alert.alert("Error", "Please complete all fields correctly.");
      setIsProccessing(false);
      return;
    }
    if (!isValidEmail(email)) {
      Alert.alert("Error", "Please enter a valid email.");
      setIsProccessing(false);
      return;
    }
    if (selectedValue == "0") {
      Alert.alert("Error", "Please select your school.");
      setIsProccessing(false);
      return;
    }
    var universitySelect = null;
    for (let i = 0; i < listUniversity.length; i++) {
      const item = listUniversity[i];
      if (selectedValue == item.id) {
        universitySelect = item;
        break;
      }
    }
    if (universitySelect != null) {
      if (
        useStudentEmail &&
        universitySelect.endMail &&
        !email.includes(universitySelect.endMail)
      ) {
        Alert.alert("Error", "Please enter a student email of your school.");
        setIsProccessing(false);
        return;
      }
    }
    const jsonRequest = {
      firstName: fullName,
      lastName,
      email,
      password,
      universityId: selectedValue,
      studentIdCard: studentIdCard,
    };
    if (!useStudentEmail) {
      setIsProccessing(false);
      navigation.navigate("TakePhotoStudentCard", { jsonRequest });
      return;
    }
    const response = await fetch(
      "https://bms-fs-api.azurewebsites.net/api/Auth/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
        },
        body: JSON.stringify(jsonRequest),
      }
    );
    const resBody = await response.json();
    if (resBody.isSuccess) {
      Alert.alert("Success", "Sign up successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } else if (resBody.messages && resBody.messages.length > 0) {
      Alert.alert("Error", resBody.messages[0].content);
    } else {
      Alert.alert("Error", "An unknown error is occor");
    }
    setIsProccessing(false);
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        source={{
          uri: "https://img5.thuthuatphanmem.vn/uploads/2021/11/17/hinh-nen-powerpoint-dong-ngo-nghinh_110015707.gif",
        }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <ScrollView contentContainerStyle={styles.content}>
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
                width: width * 0.3,
                height: width * 0.3,
                borderRadius: (width * 0.3) / 2,
              },
            ]}
          />

          <Text style={styles.headerText}>Register</Text>
          <View style={styles.containerDevide}>
            <View style={styles.rowDevide}>
              <TextInput
                placeholder="First Name * "
                style={styles.textInputDevide}
                value={fullName}
                onChangeText={setFullName}
              />
              <TextInput
                placeholder="Last Name * "
                style={styles.textInputDevide}
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
          </View>

          <Picker
            selectedValue={selectedValue}
            style={styles.textInput}
            onValueChange={(itemValue) => setSelectedValue(itemValue)}
          >
            <Picker.Item
              label="Select your school *"
              value="0"
              style={styles.placeholderItem}
            />
            {listUniversity &&
              listUniversity.map((row, index) => (
                <Picker.Item key={index} label={row.name} value={row.id} />
              ))}
          </Picker>

          <TextInput
            placeholder="Student ID* "
            style={styles.textInput}
            value={studentIdCard}
            onChangeText={setStudentIdCard}
          />

          <TextInput
            placeholder="Email * "
            style={styles.textInput}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          {/* Checkbox for "Use Student Email" */}
          <View style={styles.checkboxContainer}>
            <CheckBox
              value={useStudentEmail}
              onValueChange={setUseStudentEmail}
              style={styles.checkbox}
            />
            <Text style={styles.checkboxLabel}>Use Student Email</Text>
          </View>

          <View style={styles.containerDevide}>
            <View style={styles.rowDevide}>
              <TextInput
                placeholder="Password * "
                style={styles.textInputDevide}
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TextInput
                placeholder="Confirm Password * "
                style={styles.textInputDevide}
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>

          <Pressable
            style={[styles.button, isProccessing && styles.buttonProccessing]}
            onPress={handleRegister}
            disabled={isProccessing}
          >
            <Text style={styles.buttonText}>
              {(isProccessing && "Processing...") || "Register"}
            </Text>
          </Pressable>

          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.signInText}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  containerDevide: {
    display: "flex",
  },
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
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
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
    marginBottom: 10,
  },
  headerText: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    marginBottom: 10,
  },
  placeholderItem: {
    color: "lightgray",
    fontStyle: "italic",
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
  textInputDevide: {
    width: "48%",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
    padding: 12,
    marginVertical: 10,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  rowDevide: {
    flexDirection: "row",
    justifyContent: "space-between", // Đảm bảo khoảng cách giữa hai ô
    alignItems: "center",
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
  buttonProccessing: {
    backgroundColor: "gray",
  },
  signInText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    marginTop: 20,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderWidth: 1,
    borderColor: "#00cc69",
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    marginVertical: 10,
  },
  checkbox: {
    marginRight: 10,
  },
  checkboxLabel: {
    fontSize: 16,
    color: "#333",
  },
});
