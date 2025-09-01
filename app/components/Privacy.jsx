import React from 'react';
import { ScrollView, View, Text, Linking, StyleSheet } from 'react-native';

export default function PrivacyInfo({ setSelectedOption }) {
  return (
    <View style={{ flex: 1, backgroundColor: 'whitesmoke' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {setSelectedOption && (
          <Text style={styles.link} onPress={setSelectedOption}>
            ← Back
          </Text>
        )}

        <Text style={styles.header}>Privacy Policy</Text>

        <View style={styles.card}>
          <Text style={styles.bodyText}>
            At <Text style={styles.bold}>Yes&YES</Text>, your privacy, safety, and emotional trust are sacred...
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subHeader}>1. What We Collect</Text>
          <Text style={styles.bodyText}>We collect only the information necessary to provide a deeply personal...</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Your email and basic account details</Text>
            <Text style={styles.bullet}>• Your responses and preferences shared within the app</Text>
            <Text style={styles.bullet}>• Consent and invitation activity between you and your partner</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.subHeader}>2. How We Use Your Information</Text>
          <Text style={styles.bodyText}>Your data is used solely to:</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• Enable meaningful communication...</Text>
            <Text style={styles.bullet}>• Provide technical support...</Text>
            <Text style={styles.bullet}>• Send optional updates or reminders...</Text>
          </View>
          <Text style={styles.bodyText}>We never sell or share your data.</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subHeader}>3. Your Control</Text>
          <View style={styles.bulletList}>
            <Text style={styles.bullet}>• View and manage your preferences</Text>
            <Text style={styles.bullet}>• Delete your account</Text>
            <Text style={styles.bullet}>• Withdraw consent or disconnect</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.subHeader}>4. Security & Confidentiality</Text>
          <Text style={styles.bodyText}>
            We use industry-standard encryption and best practices...
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.subHeader}>5. Contact Us</Text>
          <Text style={styles.bodyText}>
            Questions? Email us at{' '}
            <Text
              style={styles.link}
              onPress={() => Linking.openURL('mailto:privacy@yesandyes.app')}
            >
              privacy@yesandyes.app
            </Text>
            .
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.bodyText}>
            Thank you for trusting Yes&YES. Your intimacy deserves care—and your data does too.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    alignItems: 'center',
    backgroundColor: 'whitesmoke',
  },
  card: {
    width: '95%',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  bodyText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#333',
  },
  bulletList: {
    marginLeft: 10,
    marginBottom: 8,
  },
  bullet: {
    fontSize: 16,
    marginVertical: 2,
    color: '#444',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  bold: {
    fontWeight: 'bold',
  },
});