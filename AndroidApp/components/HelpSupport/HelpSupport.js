import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Linking, Image } from 'react-native';

const HelpSupport = () => {

  const handleCallSupport = () => {
    Linking.openURL('tel:+1234567890'); // Thay bằng số điện thoại của bạn
  };

  const handlePrivacyPolicy = () => {
    // Bạn có thể dẫn đến trang Privacy Policy
    Linking.openURL('https://yourapp.com/privacy-policy');
  };

  return (
    <View style={styles.container}>
      {/* Hình ảnh của trang HelpSupport */}
      <Image 
        source={{uri: 'https://yourapp.com/your-image.png'}}  // Đường dẫn đến hình ảnh của bạn
        style={styles.image}
      />
      
      <Text style={styles.title}>Help & Support</Text>

      <Text style={styles.text}>Need assistance? We're here to help!</Text>

      <TouchableOpacity style={styles.button} onPress={handleCallSupport}>
        <Text style={styles.buttonText}>Call Support</Text>
      </TouchableOpacity>

      <Text style={styles.text}>For privacy and data protection, please read our:</Text>

      <TouchableOpacity style={styles.button} onPress={handlePrivacyPolicy}>
        <Text style={styles.buttonText}>Privacy Policy</Text>
      </TouchableOpacity>

      <Text style={styles.footer}>© 2024 YourApp - All Rights Reserved</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f4f4f9',
  },
  image: {
    width: 100,  // Chiều rộng của hình ảnh
    height: 100, // Chiều cao của hình ảnh
    marginBottom: 20, // Khoảng cách giữa hình ảnh và tiêu đề
    borderRadius: 50,  // Làm tròn góc hình ảnh (nếu cần)
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#00cc69',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 5,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    fontSize: 14,
    color: '#888',
    marginTop: 30,
  },
});

export default HelpSupport;
