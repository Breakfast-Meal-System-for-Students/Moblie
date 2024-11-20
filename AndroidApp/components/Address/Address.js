import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function Address() {
  const navigation = useNavigation();
  const [address, setAddress] = useState("123 Breakfast St, Food City, FC");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newAddress, setNewAddress] = useState(address);

  const handleSaveAddress = () => {
    setAddress(newAddress);
    setIsModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Header with Back Button, Home Icon, and Title */}
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Ionicons
          name="home-outline"
          size={24}
          color="#fff"
          style={styles.homeIcon}
        />
        <Text style={styles.headerText}>Your Pickup Address</Text>
      </View>

      {/* Address Content */}
      <View style={styles.addressContainer}>
        <Text style={styles.addressTitle}>Store Location</Text>
        <Text style={styles.addressDetails}>{address}</Text>
      </View>

      {/* Action Button */}
      <TouchableOpacity
        style={styles.changeAddressButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.buttonText}>Change Address</Text>
      </TouchableOpacity>

      {/* Modal for Editing Address */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Enter New Address</Text>
            <TextInput
              style={styles.input}
              placeholder="New address"
              value={newAddress}
              onChangeText={setNewAddress}
            />
            <TouchableOpacity
              style={styles.saveButton}
              onPress={handleSaveAddress}
            >
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setIsModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f8f8f8",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#00cc69",
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 8,
  },
  homeIcon: {
    marginLeft: 10,
  },
  addressContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginBottom: 20,
  },
  addressTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  addressDetails: {
    fontSize: 16,
    color: "#666",
  },
  changeAddressButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 8,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 20,
  },
  saveButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: "#f44336",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
  },
});
