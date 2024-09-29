import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHome,
  faListAlt,
  faHeart,
  faBell,
  faUser,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native"; // Sử dụng useNavigation để điều hướng

export default function BottomNavigationBar() {
  const [activeTab, setActiveTab] = useState("Home");
  const [showFavorites, setShowFavorites] = useState(false); // Trạng thái để hiển thị Favorites
  const navigation = useNavigation(); // Lấy đối tượng điều hướng

  const scaleValue = useRef(new Animated.Value(1)).current; // Giá trị scale mặc định là 1

  const handlePress = (screen) => {
    setActiveTab(screen);
    if (screen === "Add") {
      setShowFavorites(!showFavorites); // Chuyển đổi trạng thái hiển thị Favorites
      Animated.spring(scaleValue, {
        toValue: 1.3, 
        friction: 3,
        useNativeDriver: true,
      }).start();
    } else {
      navigation.navigate(screen); // Điều hướng đến màn hình tương ứng
    }
  };

  return (
    <View style={styles.container}>
      {/* Các nút bên trái */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress("Home")}
      >
        <FontAwesomeIcon
          icon={faHome}
          size={20}
          color={activeTab === "Home" ? "#00cc69" : "#707070"}
        />
        <Text
          style={[styles.label, activeTab === "Home" && styles.labelActive]}
        >
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress("Orders")}
      >
        <FontAwesomeIcon
          icon={faListAlt}
          size={20}
          color={activeTab === "Orders" ? "#00cc69" : "#707070"}
        />
        <Text
          style={[styles.label, activeTab === "Orders" && styles.labelActive]}
        >
          Orders
        </Text>
      </TouchableOpacity>

      {/* Nút cộng với hiệu ứng */}
      <Animated.View style={{ transform: [{ scale: scaleValue }] }}>
        <TouchableOpacity
          style={styles.centralButton}
          onPress={() => handlePress("Add")}
        >
          <FontAwesomeIcon icon={faPlus} size={28} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress("Notifications")}
      >
        <FontAwesomeIcon
          icon={faBell}
          size={20}
          color={activeTab === "Notifications" ? "#00cc69" : "#707070"}
        />
        <Text
          style={[
            styles.label,
            activeTab === "Notifications" && styles.labelActive,
          ]}
        >
          Notifications
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress("Profile")}
      >
        <FontAwesomeIcon
          icon={faUser}
          size={20}
          color={activeTab === "Profile" ? "#00cc69" : "#707070"}
        />
        <Text
          style={[styles.label, activeTab === "Profile" && styles.labelActive]}
        >
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#98FB98",
    paddingVertical: 10,
    paddingBottom: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 5,
    // marginLeft: 6,
  },
  button: {
    alignItems: "center",
    marginLeft: 18,
  },
  favoriteContainer: {
    position: "absolute",
    top: -100, // Điều chỉnh vị trí để nằm trên nút cộng
    left: 182, // Di chuyển sang phải bằng cách thay đổi giá trị này
    alignSelf: "flex-start",
  },
  favoriteButton: {
    alignItems: "center",
    backgroundColor: "#B0C4DE",
    padding: 5,
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  centralButton: {
    backgroundColor: "#00cc69",
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
    left: 13,
  },
  label: {
    fontSize: 12,
    color: "#707070",
    marginTop: 9,
  },
  labelActive: {
    color: "#707070",
    fontWeight: "bold",
  },
});
