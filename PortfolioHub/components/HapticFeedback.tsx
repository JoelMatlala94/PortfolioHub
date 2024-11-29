import React from 'react';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';

const HapticFeedback = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return (props: P & HapticPressable) => (
    <PlatformPressable
      {...props}
      onPressIn={(ev) => {
        // Trigger haptic feedback on press in
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (props.onPressIn) {
          props.onPressIn(ev);
        }
      }}
    >
      <WrappedComponent {...props} />
    </PlatformPressable>
  );
};

export default HapticFeedback;