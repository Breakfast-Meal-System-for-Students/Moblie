import React, { useState } from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  Pressable,
  TextInput,
} from "react-native";
import Svg, { Image, Ellipse, ClipPath } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  interpolate,
  withTiming,
  withDelay,
  runOnJS,
  withSequence,
  withSpring,
} from "react-native-reanimated";
import LoginScreen from "./LoginScreen";
import RegisterScreen from "./RegisterScreen";

const { height, width } = Dimensions.get("window");

export default function WelcomeScreen({ navigation }) {
  const imagePosition = useSharedValue(1);
  const formButtonScale = useSharedValue(1);
  const [isRegistering, setIsRegistering] = useState(false);

  const imageAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(
      imagePosition.value,
      [0, 1],
      [-height / 2, 0]
    );
    return {
      transform: [
        { translateY: withTiming(interpolation, { duration: 1000 }) },
      ],
    };
  });

  const buttonsAnimatedStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [250, 0]);
    return {
      opacity: withTiming(imagePosition.value, { duration: 500 }),
      transform: [
        { translateY: withTiming(interpolation, { duration: 1000 }) },
      ],
    };
  });

  const closeButtonContainerStyle = useAnimatedStyle(() => {
    const interpolation = interpolate(imagePosition.value, [0, 1], [250, 0]);
    return {
      opacity: withTiming(imagePosition.value === 1 ? 0 : 1, { duration: 800 }),
      transform: [
        { rotate: withTiming(interpolation + "deg", { duration: 1000 }) },
      ],
    };
  });
  const formAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity:
        imagePosition.value === 0
          ? withDelay(400, withTiming(1, { duration: 800 }))
          : withTiming(0, { duration: 300 }),
    };
  });
  const formButtonAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: formButtonScale.value }],
    };
  });

  const loginHandler = () => {
    imagePosition.value = 0; // Ẩn nút khi bấm
    setIsRegistering(false);
  };

  const registerHandler = () => {
    imagePosition.value = 0; // Ẩn nút khi bấm
    setIsRegistering(true);
  };

  const closeHandler = () => {
    imagePosition.value = 1; // Hiện lại nút LOGIN và REGISTER
    setIsRegistering(false); // Đặt lại isRegistering về false để trở lại form Login
  };

  return (
    <Animated.View style={styles.container}>
      <Animated.View style={[StyleSheet.absoluteFill, imageAnimatedStyle]}>
        <Svg height={height + 40} width={width}>
          <ClipPath id="clipPathId">
            <Ellipse cx={width / 2} rx={width} ry={height + 40} />
          </ClipPath>
          <Image
            xlinkHref={require("../assets/login-background.jpg")}
            width={width + 70}
            height={height + 100}
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#clipPathId)"
          />
        </Svg>
      </Animated.View>

      {/* Nút X để đóng form */}
      <Animated.View
        style={[styles.closeButtonContainer, closeButtonContainerStyle]}
      >
        <Text onPress={closeHandler}>X</Text>
      </Animated.View>

      {/* Nút LOGIN và REGISTER sẽ ẩn khi imagePosition.value == 0 */}
      {imagePosition.value === 1 && (
        <Animated.View style={[styles.bottomContainer, buttonsAnimatedStyle]}>
          <Pressable style={styles.button} onPress={loginHandler}>
            <Text style={styles.buttonText}>LOG IN</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={registerHandler}>
            <Text style={styles.buttonText}>REGISTER</Text>
          </Pressable>
        </Animated.View>
      )}

      {/* Form LOGIN và REGISTER */}
      <Animated.View style={[styles.formInputContainer, formAnimatedStyle]}>
        {isRegistering ? (
          <RegisterScreen onRegister={registerHandler} />
        ) : (
          <LoginScreen onLogin={loginHandler} />
        )}
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "white",
    letterSpacing: 0.5,
  },
  button: {
    backgroundColor: "#00CC33",
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "white",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  formInputContainer: {
    marginBottom: 70,
    ...StyleSheet.absoluteFill,
    zIndex: -1,
    justifyContent: "center",
  },
  closeButtonContainer: {
    height: 40,
    width: 40,
    justifyContent: "center",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.34,
    shadowRadius: 6.27,
    elevation: 1,
    backgroundColr: "white",
    alignItems: "center",
    borderRadius: 70,
    top: 60,
    bottom: 5,
    right: 0,
  },
  formInputContainer: {
    paddingHorizontal: 20,
  },
  textInput: {
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginVertical: 10,
    fontSize: 16,
  },
  formButton: {
    backgroundColor: "#00CC33",
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginTop: 20,
  },
});
