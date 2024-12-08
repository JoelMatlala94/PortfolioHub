import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import useCalendarViewModel from '@/viewmodels/CalendarViewModel';
import CalendarView from '@/view/CalendarView';

const Calendar = () => {
  const { fetchCalendarEvents } = useCalendarViewModel();
  const [loading, setLoading] = useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;
      setLoading(true);

      const fetchData = async () => {
        await fetchCalendarEvents();
        if (isActive) setLoading(false);
      };

      fetchData();
      return () => {
        isActive = false;
      };
    }, [fetchCalendarEvents])
  );

  return (
    <CalendarView
      loading={loading}
    />
  );
};

export default Calendar;