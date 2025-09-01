import React from 'react';
import { Text as RNText, StyleSheet } from 'react-native';

const Text = ({
  children,
  fs = 16, // fontSize
  c = 'black', // color
  ff = 'System', // fontFamily
  fw = 'normal', // fontWeight
  lh = 0,
  ta = 'left', // textAlign 
  st = {},
  ...props
}) => {
  return (
    <RNText
      style={[
        styles.text,
        {
          fontSize: typeof fs === 'string' ? parseFloat(fs) : fs,
          color: c,
          fontFamily: ff,
          fontWeight: fw,
          lineHeight: lh,
          textAlign: ta,
        },
        st,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    margin: 0,
    padding: 0,
  },
});

export default Text;