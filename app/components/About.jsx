import React from 'react';
import { ScrollView, Text, View, StyleSheet } from 'react-native';
import FlexBox from '../elements/FlexBox';

const About = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.paragraph}>
        Yes & YES is built to help couples talk more openly, honestly, and confidently about intimacy.
      </Text>

      <Text style={styles.paragraph}>
        Too often, sexual preferences, desires, and boundaries go unspoken — which can create distance where closeness should grow. Our goal is to make those conversations easier, safer, and more meaningful.
      </Text>

      <Text style={styles.paragraph}>
        With guided profile tools, you and your partner can:
      </Text>

      <View style={styles.bulletList}>
        <Text style={styles.bullet}>• Share your likes, dislikes, and fantasies</Text>
        <Text style={styles.bullet}>• Explore boundaries and limits together</Text>
        <Text style={styles.bullet}>• Express the communication styles that feel most comfortable</Text>
        <Text style={styles.bullet}>• Keep notes on trust, consent, and what excites you</Text>
      </View>

      <Text style={styles.paragraph}>
        By inviting your partner to join and linking your profiles, you create a shared space where desires are respected, boundaries are clear, and curiosity is encouraged.
      </Text>

      <Text style={styles.paragraph}>
        At its heart, this app is about more than just documenting preferences — it’s about building a foundation of trust, deepening intimacy, and celebrating pleasure together.
      </Text>

      <FlexBox dir="row" jc="center" ai="center" style={{ flexWrap: 'wrap' }}>
        <Text style={styles.inlineText}>{`Start with `}</Text>
        <Text style={styles.underlineBig}>yes</Text>
        <Text style={styles.inlineText}>{` and get to `}</Text>
        <Text style={styles.underlineYES}>{`YES!`}</Text>
      </FlexBox>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'whitesmoke',
  },
  paragraph: {
    fontSize: 16,
    color: 'black',
    marginBottom: 10,
  },
  bulletList: {
    marginBottom: 10,
    paddingLeft: 10,
  },
  bullet: {
    fontSize: 16,
    color: 'black',
    marginBottom: 4,
  },
  inlineText: {
    fontSize: 18,
    color: 'black',
  },
  underlineBig: {
    fontSize: 22,
    marginLeft: 10,
    textDecorationLine: 'underline',
    color: 'black',
  },
  underlineYES: {
    fontSize: 22,
    marginLeft: 10,
    textDecorationLine: 'underline',
    color: 'black',
    fontWeight: '700',
    fontFamily: 'Playwrite HU',
  },
});

export default About;