import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Svg, Defs, ClipPath, Path, Image as SvgImage } from 'react-native-svg';

const Heart = () => {
  return (
    <View style={styles.container}>
      <Svg viewBox="0 0 5000 5000" width={250} height={250}>
        <Defs>
          <ClipPath id="heartClip">
            <Path
              d="M1392.785 346.239c414.836-20.046 875.695 204.833 1105.524 555.27 30.738-50.734 69.433-97.523 110.304-140.461 710.571-746.637 1906.274-436.164 2226.413 535.484 122.587 372.004 66.361 790.637-131.858 1126.36-127.391 215.769-316.992 384.082-490.406 561.719l-857.153 863.546-702.539 707.692c-47.949 48.558-91.015 110.547-168.015 98.707l-4.274-.685c-40.48-6.323-76.957-42.089-105.707-68.921L471.199 2667.204c-285.84-319.144-418.578-736.25-357.668-1160.16C204.363 874.919 750.324 367.767 1392.785 346.239z"
            />
          </ClipPath>
        </Defs>

        <SvgImage
          href={require('../../assets/images/kiss_drawing1.png')}
          width="5000"
          height="5000"
          clipPath="url(#heartClip)"
          preserveAspectRatio="xMidYMid slice"
        />

        <Path
          d="M1392.785 346.239c414.836-20.046 875.695 204.833 1105.524 555.27 30.738-50.734 69.433-97.523 110.304-140.461 710.571-746.637 1906.274-436.164 2226.413 535.484 122.587 372.004 66.361 790.637-131.858 1126.36-127.391 215.769-316.992 384.082-490.406 561.719l-857.153 863.546-702.539 707.692c-47.949 48.558-91.015 110.547-168.015 98.707l-4.274-.685c-40.48-6.323-76.957-42.089-105.707-68.921L471.199 2667.204c-285.84-319.144-418.578-736.25-357.668-1160.16C204.363 874.919 750.324 367.767 1392.785 346.239z"
          fill="none"
          stroke="black"
          strokeWidth="10"
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Heart;