import React, { useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  Platform,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faHome,
  faListAlt,
  faBell,
  faUser,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigation } from "@react-navigation/native";

export default function BottomNavigationBar() {
  const [activeTab, setActiveTab] = useState("Home");
  const navigation = useNavigation();
  const scaleValue = useRef(new Animated.Value(1)).current;

  const handlePress = (screen) => {
    setActiveTab(screen);
    navigation.navigate(screen);
  };

  return (
    <View style={styles.container}>
      {/* Nút Home */}
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

      {/* Nút Order */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress("Order")}
      >
        <FontAwesomeIcon
          icon={faListAlt}
          size={20}
          color={activeTab === "Order" ? "#00cc69" : "#707070"}
        />
        <Text
          style={[styles.label, activeTab === "Order" && styles.labelActive]}
        >
          Order
        </Text>
      </TouchableOpacity>

      {/* Nút trung tâm (Plus) */}
      <Animated.View style={[styles.centralButtonContainer]}>
        <TouchableOpacity
          style={styles.centralButton}
          onPress={() => handlePress("GroupOrder")}
        >
          <FontAwesomeIcon icon={faPlus} size={28} color="#fff" />
        </TouchableOpacity>
      </Animated.View>

      {/* Nút Notifications */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => handlePress("MapScreen")} // Thay đổi từ "Notifications" thành "MapScreen"
      >
        <FontAwesomeIcon
          icon={faBell} // Có thể thay đổi icon nếu cần
          size={20}
          color={activeTab === "MapScreen" ? "#00cc69" : "#707070"} // Cập nhật điều kiện cho MapScreen
        />
        <Text
          style={[
            styles.label,
            activeTab === "MapScreen" && styles.labelActive, // Cập nhật điều kiện cho MapScreen
          ]}
        >
          MapScreen 
        </Text>
      </TouchableOpacity>

      {/* Nút Profile */}
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
    justifyContent: "space-between", // Chia đều không gian giữa các nút
    alignItems: "center",
    backgroundColor: Platform.OS === "ios" ? "#f8f8f8" : "#98FB98",
    paddingVertical: Platform.OS === "ios" ? 15 : 10,
    paddingBottom: 10,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: Platform.OS === "ios" ? 0.2 : 0,
    shadowRadius: 3,
    elevation: Platform.OS === "android" ? 5 : 0,
    paddingHorizontal: 10,
  },
  button: {
    flex: 1, // Đảm bảo các nút chiếm không gian đều nhau
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 5, // Tạo không gian bên trong các nút
  },
  centralButtonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  centralButton: {
    backgroundColor: "#00cc69",
    width: Platform.OS === "ios" ? 70 : 60, // Nút Plus lớn hơn trên iOS
    height: Platform.OS === "ios" ? 70 : 60,
    borderRadius: Platform.OS === "ios" ? 35 : 30,
    justifyContent: "center",
    alignItems: "center",
    marginTop: -40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: Platform.OS === "ios" ? 0.3 : 0.1,
    shadowRadius: 5,
    elevation: Platform.OS === "android" ? 5 : 0,
  },
  label: {
    fontSize: 12,
    color: "#707070",
    marginTop: 5,
  },
  labelActive: {
    color: "#00cc69",
    fontWeight: "bold",
  },
});
