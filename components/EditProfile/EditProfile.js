import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";

export default function EditProfile() {
  const navigation = useNavigation();
  const route = useRoute();
  const { data } = route.params;

  const [firstName, setFirstName] = useState(data?.firstName || "");
  const [lastName, setLastName] = useState(data?.lastName || "");
  const [phone, setPhone] = useState(data?.phone || "");

  const handleUpdateProfile = async (firstName, lastName, phone) => {
    const formData = new FormData();
    formData.append("firstName", firstName);
    formData.append("lastName", lastName);
    formData.append("phone", phone);

    try {
      const response = await fetch(
        "https://bms-fs-api.azurewebsites.net/api/Account",
        {
          method: "PUT",
          headers: {
            Accept: "*/*",
            "Content-Type": "multipart/form-data",
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorResponse = await response.json();
        throw new Error(errorResponse.message || "Failed to update profile");
      }
    } catch (error) {
      throw error;
    }
  };

  const handleSave = async () => {
    if (!firstName || !lastName || !phone) {
      Alert.alert("Error", "Please fill all the fields");
      return;
    }

    try {
      await handleUpdateProfile(firstName, lastName, phone);
      Alert.alert("Success", "Profile updated successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to update profile");
    }
  };

  return (
    <View style={styles.outerContainer}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Edit Profile</Text>
      </View>

      {/* Main Card Container */}
      <View style={styles.container}>
        {/* Profile Picture */}
        <View style={styles.profileContainer}>
          <Image
            source={{ uri: data?.avatar || "https://via.placeholder.com/100" }}
            style={styles.profileImage}
          />
          <Text style={styles.profileName}>{`${firstName} ${lastName}`}</Text>
          <Text style={styles.profileEmail}>youremail@example.com</Text>
        </View>

        {/* Form */}
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
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="Enter your phone number"
            keyboardType="phone-pad"
          />

          <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
            <Text style={styles.saveButtonText}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: "#f2f2f2",
    paddingTop: 40, // Padding for header spacing
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
  profileEmail: {
    fontSize: 14,
    color: "#777",
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
});
