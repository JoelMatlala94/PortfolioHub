import React, { useState } from 'react';
import { StyleSheet, Text, View, Modal, TextInput, Button, FlatList, Alert, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';

const CalendarScreen = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventName, setEventName] = useState('');
  const [events, setEvents] = useState({});

  const onDayPress = (day) => {
    setSelectedDay(day.dateString);
    setModalVisible(true);
  };

  const addEvent = () => {
    if (!eventName) {
      Alert.alert('Error', 'Please enter an event name.');
      return;
    }

    const newEvents = { ...events };
    if (!newEvents[selectedDay]) {
      newEvents[selectedDay] = [];
    }
    newEvents[selectedDay].push(eventName);
    
    setEvents(newEvents);
    setEventName('');
    setModalVisible(false);
  };

  const handleRemoveEvent = (event) => {
    const newEvents = { ...events };
    newEvents[selectedDay] = newEvents[selectedDay].filter(e => e !== event);
    setEvents(newEvents);
  };

  const renderEvents = () => {
    const eventList = events[selectedDay] || [];
    return (
      <FlatList
        data={eventList}
        renderItem={({ item }) => (
          <View style={styles.eventItemContainer}>
            <Text style={styles.eventItem}>{item}</Text>
            <TouchableOpacity onPress={() => handleRemoveEvent(item)}>
              <Text style={styles.removeText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Calendar</Text>
      <Calendar
        onDayPress={onDayPress}
        style={styles.calendar}
        theme={{
          todayTextColor: '#00adf5',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          arrowColor: '#00adf5',
        }}
      />
      {selectedDay && (
        <View style={styles.eventsContainer}>
          <Text style={styles.eventsTitle}>Events on {selectedDay}:</Text>
          {renderEvents()}
        </View>
      )}

      {/* Modal for adding events */}
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
          <Button title="Add Event" onPress={addEvent} />
          <Button title="Cancel" onPress={() => setModalVisible(false)} color="#FF3D00" />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  calendar: {
    marginTop: 20,
  },
  eventsContainer: {
    marginTop: 20,
  },
  eventsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  eventItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  eventItem: {
    fontSize: 16,
  },
  removeText: {
    color: 'red',
    fontWeight: 'bold',
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
});

export default CalendarScreen;
