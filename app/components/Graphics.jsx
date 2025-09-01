import React, { useState } from 'react';
import { View, Dimensions, StyleSheet, Image } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import FlexBox from '../elements/FlexBox';
import Text from '../elements/Text';
import Heart from './Heart';

const { width, height } = Dimensions.get('window');

const slideData = [
  {
    title: 'Spark passion',
    image: require('../../assets/images/couple_passion.jpg'),
    captions: [
      'Surrender fully',
      'Be seen. Be felt. Be wanted.',
      'Passion starts with openness',
    ],
  },
  {
    title: 'Reconnect',
    customComponent: <Heart />,
    captions: [
      'Pause the noise',
      'Listen. Touch. Breathe',
      'Come back to each other',
    ],
  },
  {
    title: 'Communicate',
    image: require('../../assets/images/secret_whisper.jpg'),
    captions: [
      'Say what you’ve never said',
      'Reveal the fantasy',
      'Let your words turn into touch',
    ],
  },
  {
    title: 'Build trust',
    image: require('../../assets/images/trust_edited.png'),
    captions: [
      'Try something new',
      'Step outside of your comfort zone',
      'Do it with them',
    ],
  },
  {
    title: 'Belong... Together',
    image: require('../../assets/images/women_kiss4.png'),
    captions: [
      'Make this yours',
      'Together, you fit perfectly',
      'Belonging begins with yes',
    ],
  },
];

export default function Graphics() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const renderItem = ({ index }) => {
  const slide = slideData[index];

  return (
    <View style={styles.slide}>
      {currentIndex === index && (
        <Text style={styles.title}>{slide.title}</Text>
      )}

      <View style={styles.imageWrapper}>
        {slide.customComponent ? (
          slide.customComponent
        ) : (
          <Image source={slide.image} style={styles.image} />
        )}
      </View>

      <View style={styles.captionBox}>
        {slide.captions.map((line, i) => (
          <Text key={i} style={styles.captionText}>
            {line}
          </Text>
        ))}
      </View>
    </View>
  );
};

  return (
    <View style={styles.container}>
      <Carousel
        width={width}
        height={height}
        autoPlay
        autoPlayInterval={5000}
        loop
        data={slideData}
        scrollAnimationDuration={1000}
        onSnapToItem={setCurrentIndex}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    overflow: 'hidden',
    alignItems: 'flex-start'
  },
  slide: {
    height: '40%',
    width: 289,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageWrapper: {
    width: 289,
    flex: 1,
    overflow: 'hidden',
  },
  image: {
    width: 289,
    flex:1,
    resizeMode: 'cover',
  },
  title: {
    width: 289,
    position: 'absolute',
    zIndex: 10,
    textAlign: 'center',
    backgroundColor: '#ffffff6b',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'serif',
    color: 'black',
    top: 0,
  },
  captionBox: {
    width: 289,
    paddingVertical: 10,
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 8,
    textAlign: 'center'
  },
  captionText: {
    fontSize: 16,
    fontFamily: 'serif',
    color: 'black',
    marginVertical: 2,
    width: 289,
    textAlign: 'center'
  },
});