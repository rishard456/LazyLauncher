import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Text,
  Animated,
  PanResponder,
  Dimensions,
} from 'react-native';
import { COLORS, FLOATING_BUTTON_SIZE, FLOATING_BUTTON_MARGIN } from '../constants';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

interface Props {
  onPress: () => void;
  visible?: boolean;
}

export const FloatingHomeButton: React.FC<Props> = ({ onPress, visible = true }) => {
  const [position] = useState(
    new Animated.ValueXY({
      x: SCREEN_WIDTH - FLOATING_BUTTON_SIZE - FLOATING_BUTTON_MARGIN,
      y: SCREEN_HEIGHT / 2,
    })
  );

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onMoveShouldSetPanResponder: () => true,
    onPanResponderGrant: () => {
      position.setOffset({
        x: (position.x as any)._value,
        y: (position.y as any)._value,
      });
      position.setValue({ x: 0, y: 0 });
    },
    onPanResponderMove: Animated.event(
      [null, { dx: position.x, dy: position.y }],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (_, gesture) => {
      position.flattenOffset();

      // Snap to edge
      const toValue = {
        x:
          gesture.moveX < SCREEN_WIDTH / 2
            ? FLOATING_BUTTON_MARGIN
            : SCREEN_WIDTH - FLOATING_BUTTON_SIZE - FLOATING_BUTTON_MARGIN,
        y: Math.max(
          FLOATING_BUTTON_MARGIN,
          Math.min(
            SCREEN_HEIGHT - FLOATING_BUTTON_SIZE - FLOATING_BUTTON_MARGIN,
            (position.y as any)._value + gesture.dy
          )
        ),
      };

      Animated.spring(position, {
        toValue,
        useNativeDriver: false,
        friction: 7,
      }).start();
    },
  });

  if (!visible) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: position.getTranslateTransform(),
        },
      ]}
      {...panResponder.panHandlers}
    >
      <TouchableOpacity style={styles.button} onPress={onPress} activeOpacity={0.8}>
        <Text style={styles.icon}>🏠</Text>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: FLOATING_BUTTON_SIZE,
    height: FLOATING_BUTTON_SIZE,
    zIndex: 9999,
  },
  button: {
    width: FLOATING_BUTTON_SIZE,
    height: FLOATING_BUTTON_SIZE,
    borderRadius: FLOATING_BUTTON_SIZE / 2,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },
  icon: {
    fontSize: 24,
  },
});
