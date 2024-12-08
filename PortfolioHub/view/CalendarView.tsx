import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useTheme } from '@/contexts/ThemeContext';
import useCalendarViewModel from '@/viewmodels/CalendarViewModel';

interface CalendarViewProps {
  loading: boolean;
}

const CalendarView: React.FC<CalendarViewProps> = ({
  loading,
}) => {
  const { currentThemeAttributes } = useTheme();
  const { events, fetchCalendarEvents } = useCalendarViewModel();
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

  const getSelectedDateEvents = () => events[selectedDate] || [];

  const getMarkedDates = () => {
    const marked: Record<string, any> = {};
    Object.keys(events).forEach((date) => {
      marked[date] = {
        marked: true,
        dotColor: currentThemeAttributes.green,
      };
    });

    if (selectedDate) {
      marked[selectedDate] = {
        ...marked[selectedDate],
        selected: true,
        selectedColor: currentThemeAttributes.textShadowColor,
        selectedTextColor: currentThemeAttributes.textColor,
      };
    }
    return marked;
  };

  const formatDate = (dateString: string) => {
    const options = { year: '2-digit', month: '2-digit', day: '2-digit' } as const;
    return new Date(dateString + 'T00:00:00').toLocaleDateString(undefined, options); //Normalized date to local timezone.
  };

  if (loading) {
    return (
      <View style={[styles.loaderContainer, { backgroundColor: currentThemeAttributes.backgroundColor }]}>
        <ActivityIndicator size="large" color={currentThemeAttributes.textShadowColor} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: currentThemeAttributes.backgroundColor }]}>
      <Calendar
        markedDates={getMarkedDates()}
        theme={{
          calendarBackground: currentThemeAttributes.backgroundColor,
          textSectionTitleColor: currentThemeAttributes.textColor,
          dayTextColor: currentThemeAttributes.textColor,
          todayTextColor: currentThemeAttributes.textShadowColor,
          monthTextColor: currentThemeAttributes.textColor,
          arrowColor: currentThemeAttributes.iconColor,
          textDisabledColor: '#d9e1e8',
          selectedDotColor: currentThemeAttributes.textShadowColor,
        }}
        onDayPress={(day: { dateString: string; }) => setSelectedDate(day.dateString)}
        initialDate={new Date().toISOString().split('T')[0]}
      />

      <Text style={[styles.subtitle, { color: currentThemeAttributes.textColor }]}>
        Stock Events for {formatDate(selectedDate)}
      </Text>

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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalendarView;