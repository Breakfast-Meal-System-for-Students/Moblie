import React, { useState } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Image,
  TouchableOpacity,
  Text,
  Alert
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";
import { useRoute, useNavigation } from "@react-navigation/native";
import uuid from 'react-native-uuid';

export default function TakePhotoStudentCard() {
  const route = useRoute();
  const navigation = useNavigation();
  const { jsonRequest } = route.params;
  const [photo, setPhoto] = useState(null);
  const [isProccessing, setIsProccessing] = useState(false);

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      alert("Permission to access camera is required!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri); // Lưu ảnh đã chụp
    }
  };

  const handleRetake = () => {
    setPhoto(null); // Xóa ảnh hiện tại và quay lại trạng thái ban đầu
    openCamera();
  };

  const handleOk = async () => {
    if (!photo) {
      Alert.alert("No photo taken", "Please take a photo before submitting.");
      return;
    }
    setIsProccessing(true);
    const formData = new FormData();
    const params = new URLSearchParams(jsonRequest);
    const image = await convertPhotoToFile();
    formData.append("images", image);
    const url = `https://bms-fs-api.azurewebsites.net/api/Auth/register-student-non-mailedu?${params.toString()}`;
    console.log("url: " + url);
    const result = await fetch(url, {
      method: "POST",
      body: formData,
    });
    const resBody = await result.json();
    if (resBody.isSuccess) {
      Alert.alert("Success", "Sign up successfully!", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } else {
      Alert.alert("Register failed!")
    }
    setIsProccessing(false);
  };

  const convertPhotoToFile = async () => {
    const randomUUID = uuid.v4();
    const photoFile = {
      uri: photo,
      name: `${randomUUID}.jpg`,
      type: "image/jpeg",
    };
    return photoFile;
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Thanh tiêu đề */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Take a Photo of Student Card</Text>
      </View>

      {/* Khung camera hoặc preview ảnh */}
      <View style={styles.cameraContainer}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.imagePreview} />
        ) : (
          <Text style={styles.placeholderText}>Camera Preview</Text>
        )}
      </View>

      {/* Nút chụp lại và OK */}
      <View style={styles.buttonContainer}>
        {photo ? (
          <>
            <TouchableOpacity style={styles.captureButton} onPress={handleRetake}>
              <Text style={styles.captureText}>Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[
              styles.okButton,
              isProccessing && styles.okButtonProcessing,
            ]} onPress={handleOk} disabled={isProccessing}>
              <Text style={styles.okText}>{isProccessing && "Processing..." || "OK"}</Text>
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity style={styles.captureButton} onPress={openCamera}>
            <Text style={styles.captureText}>Take Photo</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
    color: "black",
  },
  cameraContainer: {
    flex: 1,
    margin: 16,
    backgroundColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
  },
  placeholderText: {
    color: "#888",
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 16,
  },
  captureButton: {
    backgroundColor: "gray",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  captureText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  okButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  okButtonProcessing: {
    backgroundColor: "gray",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  okText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
