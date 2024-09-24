import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Image,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function ProfileScreen() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const navigation = useNavigation();

  const toggleDarkMode = () => setIsDarkMode((previousState) => !previousState);

  return (
    <View style={styles.container}>
      {/* Thêm Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      <View style={styles.profileHeader}>
        <Image
          source={{
            uri: "https://i.pinimg.com/564x/cf/f7/4e/cff74e044fe8eb2918424b53297bce18.jpg",
          }}
          style={styles.profileImage}
        />
        <Text style={styles.profileName}>Nathalie Erneson</Text>
        <Text style={styles.profileEmail}>nathalie_erneson@gmail.com</Text>
      </View>

      <ScrollView style={styles.profileOptions}>
        <OptionItem icon="cart-outline" title="My Cart" />
        <OptionItem icon="notifications-outline" title="My Notification" />
        <OptionItem icon="location-outline" title="Address" />
        <OptionItem icon="person-outline" title="Edit Profile" />
        <OptionItem icon="notifications-outline" title="Notification" />
        <OptionItem icon="card-outline" title="Payment" />
        <OptionItem icon="lock-closed-outline" title="Security" />
        <OptionItem
          icon="globe-outline"
          title="Language & Region"
          rightText="English (US)"
        />
        <View style={styles.darkModeContainer}>
          <Ionicons name="moon-outline" size={24} color="black" />
          <Text style={styles.optionText}>Dark Mode</Text>
          <Switch value={isDarkMode} onValueChange={toggleDarkMode} />
        </View>
      </ScrollView>
    </View>
  );
}

function OptionItem({ icon, title, rightText }) {
  return (
    <TouchableOpacity style={styles.optionItem}>
      <View style={styles.optionLeft}>
        <Ionicons name={icon} size={24} color="black" />
        <Text style={styles.optionText}>{title}</Text>
      </View>
      {rightText ? (
        <Text style={styles.rightText}>{rightText}</Text>
      ) : (
        <Ionicons name="chevron-forward-outline" size={20} color="black" />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#00cc69",
    padding: 16,
  },
  backButton: {
    padding: 8,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    left: -260,
  },
  profileHeader: {
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  profileEmail: {
    fontSize: 14,
    color: "#888",
  },
  profileOptions: {
    borderTopWidth: 1,
    borderTopColor: "#ddd",
    marginTop: 20,
    flex: 1,
  },
  optionItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  optionText: {
    fontSize: 16,
    marginLeft: 15,
  },
  rightText: {
    fontSize: 16,
    color: "#888",
  },
  darkModeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
});
