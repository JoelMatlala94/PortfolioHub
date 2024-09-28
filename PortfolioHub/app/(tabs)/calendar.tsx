import { StyleSheet, Modal, Button, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { Calendar } from 'react-native-calendars'; 
import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View } from '@/components/Themed';

export default function CalendarScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>(undefined);
  const [eventName, setEventName] = useState('');

  const handleAddEvent = () => {
    if (!selectedDate || !eventName) {
      Alert.alert('Error', 'Please enter an event name and select a date.');
      return;
    }

    console.log(`Event added: ${eventName}, Date: ${selectedDate}`);

    setEventName('');
    setSelectedDate(undefined);
    setModalVisible(false);
  };

  const onDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      
      {/* Calendar Component */}
      <Calendar
        onDayPress={onDayPress}
        markedDates={{ [selectedDate]: { selected: true, marked: true } }}
      />

      <Button title="Add Event" onPress={() => setModalVisible(true)} color="#007BFF" />

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Add Event</Text>
          <TextInput
            style={styles.input}
            placeholder="Event Name"
            value={eventName}
            onChangeText={setEventName}
          />
          <Text style={styles.dateText}>Selected Date: {selectedDate || 'None'}</Text>
          <Button title="Submit" onPress={handleAddEvent} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF3D00" />
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
    backgroundColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 20,
    color: '#fff',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 10,
    width: '100%',
    backgroundColor: '#fff',
  },
  dateText: {
    color: '#fff',
    marginBottom: 15,
  },
});
