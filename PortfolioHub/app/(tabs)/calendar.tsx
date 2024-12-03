import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Agenda } from 'react-native-calendars';
import { useTheme } from '@/contexts/ThemeContext';
import useCalendarViewModel from '@/viewmodels/CalendarViewModel';

const CalendarScreen = () => {
  const { currentThemeAttributes, theme } = useTheme();
  const { events, fetchDividendDates, calendarKey } = useCalendarViewModel();

  useEffect(() => {
    fetchDividendDates(); // Fetch dividend dates when the component mounts
  }, [fetchDividendDates]);

  useEffect(() => {
    console.log('Theme changed to:', theme); // Log theme changes
  }, [theme]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: currentThemeAttributes.backgroundColor },
      ]}
    >
      <Text style={[styles.title, { color: currentThemeAttributes.textColor }]}>
        Calendar
      </Text>
      <Agenda
        key={calendarKey} // Unique key forces re-render on theme change
        items={events}
        renderItem={(item) => (
          <View
            style={[
              styles.eventItemContainer,
              { backgroundColor: currentThemeAttributes.backgroundColor },
            ]}
          >
            <Text
              style={[
                styles.eventItem,
                { color: currentThemeAttributes.textColor },
              ]}
            >
              {item.name}
            </Text>
          </View>
        )}
        renderEmptyDate={() => (
          <View
            style={[
              styles.emptyDate,
              { backgroundColor: currentThemeAttributes.backgroundColor },
            ]}
          >
            <Text
              style={[
                styles.noEventsText,
                { color: currentThemeAttributes.textColor },
              ]}
            >
              No events on this date.
            </Text>
          </View>
        )}
        theme={{
          backgroundColor: currentThemeAttributes.backgroundColor,
          calendarBackground: currentThemeAttributes.backgroundColor,
          textSectionTitleColor: currentThemeAttributes.textColor,
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: currentThemeAttributes.backgroundColor,
          dayTextColor: currentThemeAttributes.textColor,
          textDisabledColor: '#d9e1e8',
          dotColor: '#00adf5',
          selectedDotColor: currentThemeAttributes.backgroundColor,
          arrowColor: currentThemeAttributes.textColor,
          monthTextColor: currentThemeAttributes.textColor,
          indicatorColor: currentThemeAttributes.textColor,
          todayTextColor: '#00adf5',
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  eventItemContainer: {
    borderRadius: 8,
    padding: 10,
    margin: 10,
  },
  eventItem: {
    fontSize: 16,
  },
  noEventsText: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
  },
  emptyDate: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CalendarScreen;
