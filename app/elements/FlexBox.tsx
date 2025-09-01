import React from 'react';
import { View, StyleSheet } from 'react-native';

const FlexBox = ({
  children,
  dir = 'column',
  jc = 'flex-start',
  ai = 'flex-start',
  wrap = 'nowrap',
  w = 'auto',
  h = 'auto',
  p = 0,
  m = 0,
  br = 0,
  bg = 'transparent',
  style = {},
  ...rest
}) => {
  return (
    <View
      style={[
        styles.base,
        {
          flexDirection: dir,
          justifyContent: jc,
          alignItems: ai,
          flexWrap: wrap,
          width: w,
          height: h,
          padding: p,
          margin: m,
          borderRadius: br,
          backgroundColor: bg,
        },
        style,
      ]}
      {...rest}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    display: 'flex',
  },
});

export default FlexBox;