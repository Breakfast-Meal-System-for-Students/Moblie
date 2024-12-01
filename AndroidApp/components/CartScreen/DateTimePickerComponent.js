import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

const DateTimePickerComponent = ({ date, setDate }) => {
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState(date);
  const [selectedTime, setSelectedTime] = useState(date);

  const onDateChange = (event, date) => {
    const currentDate = date || selectedDate;
    setIsDatePickerVisible(false);
    setSelectedDate(currentDate);
    updateCombinedDate(currentDate, selectedTime);
  };

  const onTimeChange = (event, time) => {
    const currentTime = time || selectedTime;
    setIsTimePickerVisible(false);
    setSelectedTime(currentTime);
    updateCombinedDate(selectedDate, currentTime);
  };

  const updateCombinedDate = (date, time) => {
    const combinedDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      time.getHours(),
      time.getMinutes()
    );
    // Adjust for UTC+7
    const utcOffset = 7 * 60 * 60 * 1000; // 7 hours in milliseconds
    setDate(new Date(combinedDate.getTime() + utcOffset));
  };

  const showDatePicker = () => {
    setIsDatePickerVisible(true);
  };

  const showTimePicker = () => {
    setIsTimePickerVisible(true);
  };

  const formatDateTime = (date) => {
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  return (
    <View>
      <TouchableOpacity style={styles.selectButton} onPress={showDatePicker}>
        <Text style={styles.selectButtonText}>Select Date</Text>
      </TouchableOpacity>

      {isDatePickerVisible && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={onDateChange}
          is24Hour={true}
        />
      )}

      <TouchableOpacity style={styles.selectButton} onPress={showTimePicker}>
        <Text style={styles.selectButtonText}>Select Time</Text>
      </TouchableOpacity>

      {isTimePickerVisible && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={onTimeChange}
          is24Hour={true}
        />
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  selectButton: {
    backgroundColor: "#00cc69",
    paddingVertical: 6, // Vertical padding
    paddingHorizontal: 3, // Horizontal padding
    borderRadius: 8, // Rounded corners
    alignItems: "center", // Center the text
    marginVertical: 1, // Vertical margin
    shadowColor: "#000", // Shadow for Android
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5, // Shadow for iOS
  },
  selectButtonText: {
    color: "#fff", // Text color
    fontSize: 16, // Font size
    fontWeight: "bold", // Bold text
    marginTop: 5,
  },
});

export default DateTimePickerComponent;
