import React, { useState, useEffect } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  Button,
  TouchableOpacity,
  Alert,
  StatusBar,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { AirbnbRating } from "react-native-ratings"; // Cần cài đặt react-native-ratings

export default function CreateFeedback({ route }) {
  const { orderId } = route.params; // Lấy orderId từ đầu vào của trang
  const [feedback, setFeedback] = useState(""); // State cho nội dung feedback
  const [rating, setRating] = useState(3); // State cho đánh giá sao
  const [order, setOrder] = useState([]);
  const navigation = useNavigation();

  // Hàm xử lý khi gửi feedback
  const handleSubmit = async () => {
    if (!feedback) {
      Alert.alert("Error", "Please provide your feedback.");
      return;
    }
    const token = await AsyncStorage.getItem("userToken");
    const jsonBody = {
      orderId: orderId,
      description: feedback,
      rating,
      userId: order.customerId,
      shopId: order.shopId,
    };
    const result = await fetch(
      `https://bms-fs-api.azurewebsites.net/api/Feedback/send-feedback`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jsonBody),
      }
    );
    const resBody = await result.json();
    if (resBody.isSuccess) {
      Alert.alert("Success", "Thank you for your feedback!");
      navigation.navigate("Feedback", { shopId: order.shopId, token: token });
    } else {
      console.log(resBody);
      if (resBody && resBody.messages && resBody.messages.length > 0) {
        Alert.alert("Error", resBody.messages[0].content);
      } else {
        Alert.alert("Error", "An error occurs in process feedback");
      }
    }
  };

  const fetchOrderById = async () => {
    const token = await AsyncStorage.getItem("userToken");
    const result = await fetch(
      `https://bms-fs-api.azurewebsites.net/api/Order/GetOrderById/${orderId}`,
      {
        method: "GET",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const resBody = await result.json();
    if (resBody.isSuccess) {
      setOrder(resBody.data);
    } else {
      Alert.alert("Error", "Can not to get order detail!!!");
    }
  };

  useEffect(() => {
    fetchOrderById();
  }, [orderId]);

  useEffect(() => {
    // Ẩn thanh trạng thái
    StatusBar.setHidden(true);
    // Bạn cũng có thể muốn thay đổi kiểu hiển thị của thanh trạng thái
    // StatusBar.setBarStyle('light-content');
    return () => {
      // Khôi phục trạng thái ban đầu khi trang bị hủy
      StatusBar.setHidden(false);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerText}>FEEDBACK YOUR ORDER</Text>
      </View>
      <View style={{ padding: 10 }}>
        {/* Đánh giá sao */}
        <AirbnbRating
          count={5}
          rating={rating}
          size={30}
          onFinishRating={(value) => setRating(value)}
        />

        {/* Khung nhập feedback */}
        <TextInput
          style={styles.textInput}
          placeholder="Write your feedback here..."
          multiline
          numberOfLines={5}
          value={feedback}
          onChangeText={(text) => setFeedback(text)}
        />

        {/* Nút gửi */}
        <Button title="Send Feedback" color="#00cc69" onPress={handleSubmit} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "white" },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 15,
    paddingBottom: 10,
    backgroundColor: "#00cc69",
    shadowColor: "#000",
    shadowOffset: { width: 8, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
    width: "100%",
  },
  backButton: { padding: 5 },
  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
    marginLeft: 15,
  },
  orderInfo: {
    flex: 1,
    marginLeft: 10,
  },
  orderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  noOrdersText: {
    textAlign: "center",
    marginTop: 15,
    color: "#888",
    fontSize: 16,
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 8,
    marginVertical: 16,
    textAlignVertical: "top",
  },
});
