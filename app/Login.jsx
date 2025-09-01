import { Text, View, TextInput, Button, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useEffect, useState, useRef } from 'react';
import Logo from './components/Logo';
import Graphics from './components/Graphics';
import { supabase } from './business/supabase'; // Correct import

export default function Login({ setToggleAlert, setSession, session}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const scrollRef = useRef();

  useEffect(() =>{
    if(window.location.origin.includes(':8081')){
      setTimeout(() => {
        setEmail('tom.ce.coney@gmail.com')
        setPassword('MaddMax1987!')
      }, 2000)
    }
  }, [])

  useEffect(() => {
    if(email === 'tom.ce.coney@gmail.com' && password === 'MaddMax1987!') {
      handleLogin()
    }
  }, [email, password])

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setError(error?.message || null);
    if (data?.user && data?.session) {
      setSession(data.session);
      setToggleAlert?.((prev) => ({
        ...prev,
        display: true,
        alert: 'Welcome',
        type: 'success',
        text: 'Login successful',
      }));
    }
  };

  return (
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    keyboardVerticalOffset={80}
    style={styles.container}>
      <View style={{ marginBottom: 10, width: '75%', height: '45%', justifyContent: 'center'}}>
        <Graphics />
      </View>

      <View style={{ marginBottom: 10, width: '100%', justifyContent: 'center'}}>
        <Logo />
      </View>

      <View 
      style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
          style={styles.input}
        />
      </View>

      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={{ marginTop: 10 }}>
        <Button onPress={handleLogin} title="Login" />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    width: '100%',
    backgroundColor: 'whitesmoke',
    overflow: 'hidden'
  },
  inputGroup: {
    width: '100%',
    marginBottom: 12,
    justifyContent: 'center'
  },
  label: {
    fontSize: 18,
    marginBottom: 4,
    color: 'black',
  },
  input: {
    height: 45,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: 'white',
    width: '100%'
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});