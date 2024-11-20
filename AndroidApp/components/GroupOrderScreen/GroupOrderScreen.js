import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from "react-native";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import {
  faArrowLeft,
  faShoppingCart,
  faPlus,
  faUserFriends,
} from "@fortawesome/free-solid-svg-icons";

const OrderGroupScreen = ({ navigation, route }) => {
  const { cart = {}, setCart = () => {} } = route.params || {};
  const [groupName, setGroupName] = useState("");
  const [groupMembers, setGroupMembers] = useState([]);
  const [newMemberName, setNewMemberName] = useState("");

  const addMember = () => {
    if (newMemberName.trim() !== "") {
      setGroupMembers([...groupMembers, newMemberName.trim()]);
      setNewMemberName("");
    }
  };

  const removeMember = (index) => {
    const updatedMembers = [...groupMembers];
    updatedMembers.splice(index, 1);
    setGroupMembers(updatedMembers);
  };

  const placeGroupOrder = async () => {
    if (groupName.trim() === "") {
      Alert.alert("Error", "Please enter a group name.");
      return;
    }

    if (groupMembers.length < 2) {
      Alert.alert("Error", "A group must have at least 2 members.");
      return;
    }

    try {
      // Here you would make a request to the server to place the group order
      console.log("Group order placed:", {
        groupName,
        groupMembers,
        cart,
      });
      Alert.alert("Success", "Group order placed successfully!");
      navigation.goBack();
    } catch (error) {
      Alert.alert("Error", "Failed to place group order.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <FontAwesomeIcon icon={faArrowLeft} size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerText}>Order Group</Text>
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Checkout", { cart })}
        >
          <FontAwesomeIcon icon={faShoppingCart} size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Group Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter group name"
            value={groupName}
            onChangeText={setGroupName}
          />
        </View>

        <View style={styles.membersContainer}>
          <Text style={styles.inputLabel}>Group Members</Text>
          <FlatList
            data={groupMembers}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.memberItem}>
                <Text style={styles.memberName}>{item}</Text>
                <TouchableOpacity onPress={() => removeMember(index)}>
                  <FontAwesomeIcon icon={faPlus} size={20} color="#ff0000" />
                </TouchableOpacity>
              </View>
            )}
            ListEmptyComponent={
              <Text style={styles.emptyListText}>No members added yet</Text>
            }
            style={styles.membersList}
          />
          <View style={styles.addMemberContainer}>
            <TextInput
              style={styles.input}
              placeholder="Add member"
              value={newMemberName}
              onChangeText={setNewMemberName}
            />
            <TouchableOpacity onPress={addMember}>
              <FontAwesomeIcon icon={faPlus} size={24} color="#00cc69" />
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={placeGroupOrder}
        >
          <FontAwesomeIcon
            icon={faUserFriends}
            size={24}
            color="#fff"
            style={styles.placeOrderIcon}
          />
          <Text style={styles.placeOrderText}>Place Group Order</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#00cc69",
    marginTop: Platform.OS === "ios" ? 59 : 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  backButton: {
    padding: 10,
  },
  headerText: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  cartButton: {
    padding: 10,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  inputContainer: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  membersContainer: {
    marginBottom: 20,
  },
  memberItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  memberName: {
    fontSize: 16,
  },
  emptyListText: {
    color: "#aaa",
    fontSize: 16,
    textAlign: "center",
    marginTop: 10,
  },
  addMemberContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  placeOrderButton: {
    backgroundColor: "#00cc69",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  placeOrderIcon: {
    marginRight: 10,
  },
  placeOrderText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default OrderGroupScreen;
