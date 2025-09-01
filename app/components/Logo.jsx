import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Svg, Text as SvgText } from 'react-native-svg';
import { FontAwesome5, Fontisto, MaterialCommunityIcons } from '@expo/vector-icons';


const Logo = ({ height = 150, page }) => {
  const [symIdx, setSymIdx] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const symbols = [
    <FontAwesome5 name="mars" size={30} />,
    <FontAwesome5 name="venus" size={30} />,
    <FontAwesome5 name="transgender" size={30} />,
    <FontAwesome5 name="genderless" size={30} />,
    <Fontisto name="persons" size={30} />,
    <Fontisto name="female" size={30} />,
    <Fontisto name="male" size={30} />,
    <FontAwesome5 name="mars-double" size={30} />,
    <FontAwesome5 name="venus-double" size={30} />,
    <Text style={styles.emoji}>🏳️‍🌈</Text>,
    <Text style={styles.emoji}>🏳️‍⚧️</Text>,
    <FontAwesome5 name="heart" size={30} />,
    <FontAwesome5 name="infinity" size={30} />,
    <FontAwesome5 name="star" size={30} />
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start(() => {
        setSymIdx((prev) => (prev + 1) % symbols.length);
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true
        }).start();
      });
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ backgroundColor: 'transparent', alignItems: 'center', justifyContent: 'center'}}>
      <Svg width={'100%'} height={100} viewBox="0 0 250 100">
        <SvgText
          x="20"
          y="60"
          fontSize="48"
          stroke={page === 'homepage' ? '#fff' : '#222'}
          fill={page === 'homepage' ? '#fff' : '#222'}
        >
          Yes
        </SvgText>
        <SvgText
          x="104"
          y="60"
          fontSize="48"
          stroke="#e91e63"
          fill="#e91e63"
        >
          &
        </SvgText>
        <SvgText
          x="140"
          y="60"
          fontSize="48"
          stroke={page === 'homepage' ? '#fff' : '#222'}
          fill={page === 'homepage' ? '#fff' : '#222'}
        >
          YES
        </SvgText>
      </Svg>

      {page !== 'homepage' && (
        <Animated.View style={{ opacity: fadeAnim, marginTop: 0 }}>
          <View dir="row" jc="center" ai="center">
            <Text style={styles.subText}>come one</Text>
            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
              {symbols[symIdx]}
            </View>
            <Text style={styles.subText}>come all</Text>
          </View>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  subText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: 'black',
    textAlign: 'center'
  },
  emoji: {
    fontSize: 30,
  },
});

export default Logo;