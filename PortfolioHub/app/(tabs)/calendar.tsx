import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '@/contexts/ThemeContext';
import useCalendarViewModel from '@/viewmodels/CalendarViewModel';

const ThemedCalendar = () => {
  const { currentThemeAttributes } = useTheme();
  const { events } = useCalendarViewModel();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);

  const renderListItem = ({ item }: { item: { name: string } }) => (
    <View
      style={[
        styles.listItem,
        { backgroundColor: currentThemeAttributes.backgroundColor },
      ]}
    >
      <Text style={[styles.listText, { color: currentThemeAttributes.textColor }]}>
        {item.name}
      </Text>
    </View>
  );

  const getSelectedDateEvents = () => {
    return events[selectedDate] || [];
  };

  // Generate marked dates
  const getMarkedDates = () => {
    const marked: Record<string, any> = {};

    Object.keys(events).forEach((date) => {
      marked[date] = {
        marked: true, // Show a dot on dates with events
        dotColor: currentThemeAttributes.iconColor,
      };
    });

    // Highlight the selected date
    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate], // Preserve existing marking (like dots)
        selected: true,
        selectedColor: currentThemeAttributes.iconColor,
        selectedTextColor: currentThemeAttributes.secondaryBackgroundColor,
      };
    }

    return marked;
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentThemeAttributes.backgroundColor },
      ]}
    >
      {/* Calendar */}
      <Calendar
        markedDates={getMarkedDates()} // Use marked dates
        theme={{
          calendarBackground: currentThemeAttributes.backgroundColor,
          textSectionTitleColor: currentThemeAttributes.textColor,
          dayTextColor: currentThemeAttributes.textColor,
          todayTextColor: currentThemeAttributes.iconColor,
          monthTextColor: currentThemeAttributes.textColor,
          arrowColor: currentThemeAttributes.iconColor,
          textDisabledColor: '#d9e1e8',
          dotColor: currentThemeAttributes.iconColor,
          selectedDotColor: currentThemeAttributes.iconColor,
        }}
        onDayPress={(day) => setSelectedDate(day.dateString)}
        initialDate={new Date().toISOString().split('T')[0]}
      />

      <Text style={[styles.subtitle, { color: currentThemeAttributes.textColor }]}>
        Events for {selectedDate}
      </Text>

      {/* List of events */}
      <FlatList
        data={getSelectedDateEvents()}
        renderItem={renderListItem}
        keyExtractor={(item, index) => `${selectedDate}-${index}`}
        style={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  listContainer: {
    flex: 1,
    marginTop: 10,
  },
  listItem: {
    padding: 16,
    marginVertical: 8,
    borderRadius: 8,
    shadowOpacity: 0.2,
    shadowOffset: { width: 1, height: 2 },
    shadowRadius: 4,
  },
  listText: {
    fontSize: 16,
  },
});

export default ThemedCalendar;