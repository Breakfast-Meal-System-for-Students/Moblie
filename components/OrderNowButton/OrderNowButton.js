import React, { useState, useEffect } from "react";
import { View, FlatList, Alert } from "react-native";
import {
  Card,
  Button,
  IconButton,
  ActivityIndicator,
  Text,
} from "react-native-paper";
import axios from "axios";

const CartScreen = ({ navigation }) => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        "https://bms-fs-api.azurewebsites.net/api/Cart/GetAllCartForUser",
        {
          headers: { Authorization: `Bearer YOUR_ACCESS_TOKEN` },
          params: { pageIndex: 1, pageSize: 10 },
        }
      );
      setCartItems(response.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deleteCartItem = async (cartItemId) => {
    try {
      await axios.delete(
        `https://bms-fs-api.azurewebsites.net/api/Cart/DeleteCartItem`,
        {
          headers: { Authorization: `Bearer YOUR_ACCESS_TOKEN` },
          params: { cartItemId },
        }
      );
      Alert.alert("Xóa thành công", "Sản phẩm đã được xóa");
      fetchCartItems();
    } catch (err) {
      Alert.alert("Lỗi", "Xóa sản phẩm không thành công");
    }
  };

  if (loading) {
    return <ActivityIndicator animating={true} size="large" />;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Giỏ hàng của bạn</Text>
        <Button
          title="Thêm sản phẩm"
          onPress={() => navigation.navigate("AddProduct")}
        />
        <Button
          title="Chỉnh sửa sản phẩm"
          onPress={() => navigation.navigate("EditProduct")}
        />
        <Button
          title="Xóa sản phẩm"
          onPress={() => navigation.navigate("RemoveProduct")}
        />
      </View>
      <FlatList
        data={cartItems}
        keyExtractor={(item) => item.cartId.toString()}
        renderItem={({ item }) => (
          <Card style={{ marginVertical: 10 }}>
            <Card.Title
              title={`Shop: ${item.shopId}`}
              subtitle={`Tổng sản phẩm: ${item.totalItems}`}
            />
            <Card.Actions>
              <Button
                onPress={() => navigation.navigate("UpdateCartItem", { item })}
              >
                Cập nhật
              </Button>
              <IconButton
                icon="delete"
                color="red"
                onPress={() => deleteCartItem(item.cartItemId)}
              />
            </Card.Actions>
          </Card>
        )}
      />
      <Button
        mode="contained"
        onPress={() => navigation.navigate("AddCartItem")}
        style={{ marginTop: 10 }}
      >
        Thêm sản phẩm
      </Button>
    </View>
  );
};
