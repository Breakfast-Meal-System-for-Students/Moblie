import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Platform,
  StatusBar,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    image:
      "https://i.pinimg.com/474x/b4/3c/c0/b43cc0b6234489930779dfbd70e811d3.jpg",
    title: "Welcome to BMS",
    subtitle: "Your breakfast, your way",
    description:
      "Start your day with a delightful breakfast tailored for students. Discover a variety of meals that fuel your energy.",
    actionText: "Explore Now",
    backgroundColor: "#ffad46",
  },
  {
    image:
      "https://i.pinimg.com/564x/6f/37/6f/6f376f44cbd2cfb62f25ee123ee43f60.jpg",
    title: "Fast Food Heaven",
    subtitle: "Quick bites for busy days",
    description:
      "Enjoy a world of flavors with our fast food options, perfect for those always on the go.",
    actionText: "Order Now",
    backgroundColor: "#f96e5b",
  },
  {
    image:
      "https://i.pinimg.com/564x/5c/7a/43/5c7a43138d9740941d0326a156551135.jpg",
    title: "Refreshing Drinks",
    subtitle: "Sip, relax, repeat",
    description:
      "Cool down with our selection of refreshing drinks. Perfect for any time of the day.",
    actionText: "Check it Out",
    backgroundColor: "#4db6ac",
  },
];

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const slideInterval = 3000;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % slides.length);
    }, slideInterval);

    return () => clearInterval(interval);
  }, []);

  const currentSlide = slides[currentIndex];

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" />
      <Image source={{ uri: currentSlide.image }} style={styles.image} />

      <View style={styles.overlay}>
        <SafeAreaView style={styles.contentWrapper}>
          <View style={styles.contentContainer}>
            <Text style={styles.title}>{currentSlide.title}</Text>
            <Text style={styles.subtitle}>{currentSlide.subtitle}</Text>
          </View>

          <View style={styles.bottomContainer}>
            <View style={styles.pagination}>
              {slides.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.dot,
                    currentIndex === index && styles.activeDot,
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Login")}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  image: {
    position: "absolute",
    width: width,
    height: height + (Platform.OS === "android" ? StatusBar.currentHeight : 0),
    top: 0,
    left: 0,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  contentWrapper: {
    flex: 1,
  },
  contentContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: width * 0.1,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  title: {
    fontSize: width * 0.08,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginBottom: height * 0.02,
  },
  subtitle: {
    fontSize: width * 0.045,
    color: "#fff",
    textAlign: "center",
    opacity: 0.9,
  },
  bottomContainer: {
    paddingBottom: Platform.OS === "ios" ? height * 0.05 : height * 0.07,
  },
  pagination: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.03,
  },
  dot: {
    width: width * 0.02,
    height: width * 0.02,
    borderRadius: width * 0.01,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: width * 0.01,
  },
  activeDot: {
    backgroundColor: "#00cc69",
    width: width * 0.025,
    height: width * 0.025,
  },
  button: {
    backgroundColor: "#00cc69",
    paddingVertical: height * 0.018,
    marginHorizontal: width * 0.1,
    borderRadius: height * 0.03,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  buttonText: {
    color: "#fff",
    fontSize: width * 0.045,
    fontWeight: "bold",
    textAlign: "center",
  },
});
