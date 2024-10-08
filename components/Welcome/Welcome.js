import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const slides = [
  {
    id: "1",
    title: "Delicious Breakfast Options",
    subtitle: "Start your day with our healthy and tasty breakfast choices.",
    image:
      "https://i.pinimg.com/564x/b4/9b/c5/b49bc54a84f406df5dcd82e7ab135d51.jpg",
  },
  {
    id: "2",
    title: "Fresh Smoothies",
    subtitle:
      "Revitalize your morning with a refreshing smoothie made from fresh ingredients.",
    image:
      "https://i.pinimg.com/564x/dd/71/bd/dd71bd142b9c2345417a3e06e6d953d5.jpg",
  },
  {
    id: "3",
    title: "Quick and Easy Delivery",
    subtitle:
      "Order your breakfast and have it delivered to your door within minutes.",
    image:
      "https://i.pinimg.com/564x/69/44/5b/69445bf61fac30c35480ffa86813bf44.jpg",
  },
];

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const { width } = Dimensions.get("window");
  const slideInterval = 3000; // 3 seconds interval for each slide

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, slideInterval);

    return () => clearInterval(interval); // Clean up on component unmount
  }, []);

  const currentSlide = slides[currentIndex];

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: currentSlide.image }}
          style={[styles.image, { width: 400, height: 600 * 0.9 }]}
        />
      </View>
      <Text style={styles.title}>{currentSlide.title}</Text>
      <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>

      {/* Pagination Dots */}
      <View style={styles.pagination}>
        {slides.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentIndex === index && styles.activeDot]}
          />
        ))}
      </View>

      {/* Get Started Button */}
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
    alignItems: "center",
  },
  imageContainer: {
    flex: 3,
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    resizeMode: "cover",
    borderRadius: 15,
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    color: "#000",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: "gray",
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
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
    backgroundColor: "#00cc69",
  },
  button: {
    backgroundColor: "#00cc69",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
