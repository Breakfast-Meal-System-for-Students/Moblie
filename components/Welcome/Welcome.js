import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function WelcomeScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Sử dụng thuộc tính uri để tải hình ảnh từ URL */}
        <Image
          source={{
            uri: "https://i.pinimg.com/564x/27/a3/cd/27a3cd9373ee461430493609ee5e91bd.jpg",
          }}
          style={styles.image}
        />
      </View>
      <Text style={styles.title}>Fresh look and affordable</Text>
      <Text style={styles.subtitle}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Fermentum diam
        est, sit amet ullamcorper habitasse in.
      </Text>

      {/* Chấm chỉ thị vị trí (pagination dots) */}
      <View style={styles.pagination}>
        <View style={styles.dot} />
        <View style={styles.activeDot} />
        <View style={styles.dot} />
      </View>

      {/* Nút "Get Started" */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  imageContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: 900,
    height: 600,
    resizeMode: "contain",
    marginBottom: 90,
  },
  title: {
    flex: 1,
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: -110,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "gray",
    marginHorizontal: 5,
  },
  activeDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#00cc69",
    marginHorizontal: 5,
  },
  button: {
    backgroundColor: "#00cc69",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
