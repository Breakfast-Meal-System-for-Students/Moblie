import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import QRCode from "react-native-qrcode-svg"; // To display QR codes

export default function GroupOrderScreen() {
  const [qrVisible, setQrVisible] = useState(false);
  const [groupParticipants, setGroupParticipants] = useState([
    { name: "John", order: "Bánh mì ốp la", price: 50000 },
    { name: "Tianjiao", order: "Bánh mì thịt", price: 55000 },
  ]);

  //   const shareOptions = [
  //     { name: "AirDrop", icon: require("./assets/airdrop.png") },
  //     { name: "WhatsApp", icon: require("./assets/whatsapp.png") },
  //     { name: "Instagram", icon: require("./assets/instagram.png") },
  //     { name: "Twitter", icon: require("./assets/twitter.png") },
  //   ];

  const showQRCode = () => {
    setQrVisible(!qrVisible);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <Text style={styles.title}>Bánh Mì Ngon</Text>
      </View>

      {/* Invite Participants Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Thiết lập đơn hàng nhóm của bạn</Text>
        <Text style={styles.sectionText}>
          Là trưởng nhóm, bạn được linh hoạt chọn giữa thanh toán cho mọi người
          hoặc chia hóa đơn.
        </Text>
        <TouchableOpacity style={styles.greenButton}>
          <Text style={styles.buttonText}>Mời thêm thành viên</Text>
        </TouchableOpacity>
      </View>

      {/* Share Options */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Chia sẻ</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {shareOptions.map((option, index) => (
            <View key={index} style={styles.shareOption}>
              <Image source={option.icon} style={styles.shareIcon} />
              <Text>{option.name}</Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* QR Code Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tham gia đặt đơn nhóm</Text>
        <TouchableOpacity style={styles.qrButton} onPress={showQRCode}>
          <Text style={styles.qrButtonText}>Quét mã QR</Text>
        </TouchableOpacity>
        {qrVisible && (
          <View style={styles.qrCodeContainer}>
            <QRCode value="https://banhmignon.com/join" size={150} />
          </View>
        )}
      </View>

      {/* Order Review Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Kiểm tra Đơn hàng</Text>
        {groupParticipants.map((participant, index) => (
          <View key={index} style={styles.participantOrder}>
            <Text>{participant.name}</Text>
            <Text>{participant.order}</Text>
            <Text>{participant.price} VND</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.greenButton}>
          <Text style={styles.buttonText}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  headerContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  section: {
    marginVertical: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  sectionText: {
    fontSize: 14,
    marginBottom: 10,
  },
  greenButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  shareOption: {
    alignItems: "center",
    marginRight: 15,
  },
  shareIcon: {
    width: 50,
    height: 50,
    marginBottom: 5,
  },
  qrButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  qrButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  qrCodeContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  participantOrder: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});
