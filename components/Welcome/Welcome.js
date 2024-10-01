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
import LoginScreen from "../LogScreen/LoginScreen";
import RegisterScreen from "../RegisterScreen/RegisterScreen";

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
        <Svg height={height} width={width}>
          <ClipPath id="clipPathId">
            <Ellipse cx={width / 2} rx={height / 1} ry={height / 1} />
          </ClipPath>
          <Image
            href={require("../../assets/login-background.jpg")}
            width={width * 1} // Giảm chiều rộng hình ảnh
            height={height + 300} // Giảm chiều cao hình ảnh
            preserveAspectRatio="xMidYMid slice"
            clipPath="url(#clipPathId)"
          />
        </Svg>
      </Animated.View>

      {/* Nút X để đóng form */}
      <Animated.View
        style={[styles.closeButtonContainer, closeButtonContainerStyle]}
      >
        <Pressable onPress={closeHandler}>
          <Text style={{ fontSize: 18 }}>X</Text>
        </Pressable>
      </Animated.View>

      {/* Nút LOGIN và REGISTER sẽ hiển thị lại khi imagePosition.value == 1 */}
      {imagePosition.value === 1 ? (
        <Animated.View style={[styles.bottomContainer, buttonsAnimatedStyle]}>
          <Pressable style={styles.button} onPress={loginHandler}>
            <Text style={styles.buttonText}>LOG IN</Text>
          </Pressable>
          <Pressable style={styles.button} onPress={registerHandler}>
            <Text style={styles.buttonText}>REGISTER</Text>
          </Pressable>
        </Animated.View>
      ) : null}

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
    backgroundColor: "#00cc69",
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginHorizontal: 20,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "white",
    shadowOffset: {
      width: 4,
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
    position: "absolute",
    top: 60, // Điều chỉnh khoảng cách từ đỉnh màn hình
    alignSelf: "center", // Đặt nút nằm giữa theo chiều ngang
    height: 40, // Kích thước của nút
    width: 40,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white", // Màu nền trắng để tương phản
    borderRadius: 20, // Bo tròn nút thành hình tròn
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 3,
    zIndex: 2, // Đảm bảo nút luôn ở trên cùng các phần tử khác
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
    backgroundColor: "#00cc69",
    height: 55,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 35,
    marginTop: 20,
  },
});