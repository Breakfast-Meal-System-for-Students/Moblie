import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function EditProfile() {
  const navigation = useNavigation();
  const route = useRoute();
  const { data } = route.params;

  const [firstName, setFirstName] = useState(data?.firstName || "");
  const [lastName, setLastName] = useState(data?.lastName || "");
  const [phone, setPhone] = useState(data?.phone || "");
  const [avatar, setAvatar] = useState(
    data?.avatar || "https://via.placeholder.com/100"
  );
  const [phoneError, setPhoneError] = useState("");

  const handleUpdateProfile = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phone", phone);
    const response = await fetch(
      `https://bms-fs-api.azurewebsites.net/api/Account`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }
    );
    if (response.status != 200) {
      console.log(response);
      Alert.alert("Failed to update profile");
      return;
    }

    // If there's a new avatar, add it to the formData
    if (avatar) {
      const filename = avatar.split("/").pop();
      const type = `image/${filename.split(".").pop()}`;
      const formData = new FormData();
      formData.append("request", { uri: avatar, name: filename, type });
      try {
        const response = await axios.put(
          "https://bms-fs-api.azurewebsites.net/api/Account/update-avatar",
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          Alert.alert("Success", "Profile updated successfully!");
          // Pass the updated avatar back to ProfileScreen
          navigation.navigate("Profile", { updatedAvatar: avatar });
        }
      } catch (error) {
        Alert.alert(
          "Error",
          error.response?.data?.message || "Failed to update profile"
        );
      }
    }
  };

  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert("Error", "Please fill in the first and last name");
      return;
    }

    // Validate phone number
    if (phone.length !== 10 || isNaN(phone)) {
      setPhoneError("Phone number must be exactly 10 digits.");
      return;
    } else {
      setPhoneError(""); // Clear error if valid
    }

    await handleUpdateProfile();
  };

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  return (
    <ScrollView style={styles.outerContainer}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.profileContainer}>
          <TouchableOpacity onPress={pickImage}>
            <Image source={{ uri: avatar }} style={styles.profileImage} />
          </TouchableOpacity>
          <Text style={styles.profileName}>{`${firstName} ${lastName}`}</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>First Name</Text>
          <TextInput
            style={styles.input}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Enter your first name"
          />

          <Text style={styles.label}>Last Name</Text>
          <TextInput
            style={styles.input}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Enter your last name"
          />

          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.phoneInput}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />
          {phoneError ? (
            <Text style={styles.errorText}>{phoneError}</Text>
          ) : null}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#00cc69",
  },
  backButton: {
    padding: 8,
    marginRight: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  container: {
    backgroundColor: "#fff",
    borderRadius: 15,
    paddingBottom: 20,
    elevation: 5,
    marginHorizontal: 20,
    marginTop: 20,
    overflow: "hidden",
  },
  profileContainer: {
    alignItems: "center",
    marginTop: -20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#00cc69",
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    padding: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "600",
    color: "#555",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  phoneInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
    height: 50,
  },
  saveButton: {
    backgroundColor: "#00c853",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    marginBottom: 10,
  },
});
