import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  RefreshControl,
  Dimensions,
  StatusBar,
  Platform,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
const { width, height } = Dimensions.get("window");
const ITEM_HEIGHT = 100;

const statusMapping = {
  1: "PAID",
  2: "PAID TO SHOP",
  3: "ERROR",
  4: "REFUND",
  5: "DEPOSIT",
  6: "WITHDRAW",
  7: "PAID PACKAGE",
};

const TransactionHistory = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const navigation = useNavigation();

  const fetchTransactions = async (page = pageIndex) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem("userToken");

      if (!token) {
        Alert.alert("Notice", "Please log in again");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        "https://bms-fs-api.azurewebsites.net/api/Wallet/GetAllTransactionOfUserWallet",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: { pageIndex: page, pageSize },
        }
      );

      if (response.data.isSuccess) {
        const { data, lastPage } = response.data.data;
        setTransactions(data);
        setTotalPages(lastPage);
      } else {
        Alert.alert("Error", "Unable to load transaction history");
      }
    } catch (error) {
      console.error("Error:", error.message);
      Alert.alert("Error", "An error occurred while loading data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [pageIndex]);

  const onRefresh = () => {
    setRefreshing(true);
    setPageIndex(1);
    fetchTransactions(1);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${day}/${month}/${year}\n${hours}:${minutes}`;
  };

  const formatMoney = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const TransactionIcon = ({ price }) => {
    const iconName = price > 0 ? "arrow-up-circle" : "arrow-down-circle"; // Up for positive, down for negative
    const iconColor = price > 0 ? "#00C853" : "#FF5252"; // Green for positive, red for negative

    return (
      <View
        style={[styles.iconContainer, { backgroundColor: `${iconColor}20` }]}
      >
        <Ionicons name={iconName} size={20} color={iconColor} />
      </View>
    );
  };

  const renderTransactionItem = ({ item }) => (
    <TouchableOpacity style={styles.transactionCard} activeOpacity={0.7}>
      <TransactionIcon
        price={item.price} // Pass price directly
      />
      <View style={styles.transactionInfo}>
        <View style={styles.transactionHeader}>
          <Text style={styles.transactionID} numberOfLines={1}>
            #{item.walletID}
          </Text>
          <Text
            style={[
              styles.transactionAmount,
              {
                color:
                  item.status === 1
                    ? item.price > 0
                      ? "#00C853"
                      : "#FF5252"
                    : "#757575",
              },
            ]}
            numberOfLines={1}
          >
            {formatMoney(item.price)}
          </Text>
        </View>
        <View style={styles.transactionFooter}>
          <Text style={styles.transactionDate}>
            {formatDate(item.createDate)}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: item.status === 1 ? "#E8F5E9" : "#EEEEEE" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: item.status === 1 ? "#00C853" : "#757575" },
              ]}
            >
              {statusMapping[item.status] || "UNKNOWN"}
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  const ListEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Ionicons name="receipt-outline" size={60} color="#BDBDBD" />
      <Text style={styles.emptyTitle}>No transactions found</Text>
      <Text style={styles.emptySubtitle}>
        Your transactions will appear here
      </Text>
    </View>
  );

  const ListHeaderComponent = () => <View style={styles.listHeader}></View>;

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      <TouchableOpacity
        style={[styles.pageButton, pageIndex <= 1 && styles.pageButtonDisabled]}
        onPress={() => pageIndex > 1 && setPageIndex(pageIndex - 1)}
        disabled={pageIndex <= 1}
      >
        <Ionicons
          name="chevron-back"
          size={20}
          color={pageIndex <= 1 ? "#BDBDBD" : "#fff"}
        />
      </TouchableOpacity>

      <View style={styles.pageIndicator}>
        <Text style={styles.pageText}>
          {pageIndex}/{totalPages}
        </Text>
      </View>

      <TouchableOpacity
        style={[
          styles.pageButton,
          pageIndex >= totalPages && styles.pageButtonDisabled,
        ]}
        onPress={() => pageIndex < totalPages && setPageIndex(pageIndex + 1)}
        disabled={pageIndex >= totalPages}
      >
        <Ionicons
          name="chevron-forward"
          size={20}
          color={pageIndex >= totalPages ? "#BDBDBD" : "#fff"}
        />
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transaction History</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={styles.loadingText}>Loading data...</Text>
        </View>
      ) : (
        <FlatList
          data={transactions}
          keyExtractor={(item) => `${item.walletID}-${Math.random()}`}
          renderItem={renderTransactionItem}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={["#2196F3"]}
            />
          }
          ListEmptyComponent={ListEmptyComponent}
          ListHeaderComponent={ListHeaderComponent}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          getItemLayout={(data, index) => ({
            length: ITEM_HEIGHT,
            offset: ITEM_HEIGHT * index,
            index,
          })}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
        />
      )}

      {!loading && transactions.length > 0 && renderPagination()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#00cc69",
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
  },
  listHeader: {
    paddingHorizontal: 16,
    paddingVertical: 1,
  },
  listHeaderText: {
    fontSize: 14,
    color: "#757575",
    fontWeight: "500",
  },
  listContent: {
    padding: 12,
    paddingBottom: height * 0.1,
  },
  transactionCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    height: ITEM_HEIGHT - 20,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  transactionInfo: {
    flex: 1,
    justifyContent: "space-between",
  },
  transactionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionID: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212121",
    flex: 1,
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: "bold",
    marginLeft: 8,
  },
  transactionFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  transactionDate: {
    fontSize: 12,
    color: "#757575",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "500",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  pageButton: {
    backgroundColor: "#00cc69",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  pageButtonDisabled: {
    backgroundColor: "#EEEEEE",
  },
  pageIndicator: {
    backgroundColor: "#00cc69",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  pageText: {
    color: "#ffff",
    fontSize: 12,
    fontWeight: "500",
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: height * 0.15,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#424242",
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#757575",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 8,
    fontSize: 12,
    color: "#757575",
  },
});

export default TransactionHistory;
