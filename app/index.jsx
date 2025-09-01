if (typeof setImmediate === 'undefined') {
  global.setImmediate = (fn) => setTimeout(fn, 0);
}


import { Text, View, Dimensions } from "react-native";
import Login from "./Login";
import { useEffect, useState } from "react";
import HomePage from "./components/HomePage";
import { supabase, supabaseAnonKey } from "./business/supabase";
import { Stack } from 'expo-router';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export default function Index() {
  const [toggleAlert, setToggleAlert] = useState();
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [partner, setPartner] = useState(null);

  // 🔔 Get Expo Push Token and save it to Supabase
  const registerForPushNotificationsAsync = async (userId) => {
    if (!Device.isDevice || !userId) return;

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus === 'granted') {
      const token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Expo push token:', token);

      // Save token to Supabase
      await supabase
        .from('user_profiles')
        .update({ expo_push_token: token })
        .eq('id', userId);
    } else {
      alert('Failed to get push token');
    }
  };

  // 🔁 Fetch logged-in user
  const getUser = async () => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('email', session?.user?.email)
      .single();

    if (data) {
      setUser(data);
      registerForPushNotificationsAsync(data.id); // ✅ Register once user is known
    }
  };

  // 🤝 Fetch partner's profile
  const getPartner = async (partnerId) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', partnerId)
      .single();

    if (data) setPartner(data);
  };

  // 📦 Load user when session changes
  useEffect(() => {
    if (session?.user?.id) getUser();
  }, [session]);

  // 📦 Load partner when user is available
  useEffect(() => {
    if (user?.partner_id) getPartner(user.partner_id);
  }, [user]);

  // 🔔 Subscribe to partner comment notifications
  // useEffect(() => {
  //   if (!user?.id || !user?.expo_push_token) return;

  //   const channel = supabase
  //     .channel('realtime:fantasy_comments')
  //     .on(
  //       'postgres_changes',
  //       {
  //         event: 'INSERT',
  //         schema: 'public',
  //         table: 'fantasy_comments',
  //         filter: `author_id=eq.${user.id}`,
  //       },
  //       async (payload) => {
  //         console.log('📥 New comment from partner:', payload.new);

  //         await fetch('https://qjxyqhltyjcagcttlyry.supabase.co/functions/v1/comment-notifications', {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json',
  //             'Authorization': `Bearer ${supabaseAnonKey}`,
  //           },
  //           body: JSON.stringify({
  //             recipient_id: partner.id,
  //             comment_text: payload.new.comment_text,
  //             linked_fantasy: payload.new.linked_fantasy,
  //           }),
  //         });
  //       }
  //     )
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, [partner?.id, user?.expo_push_token]);

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: 'black',
          width: screenWidth,
          height: screenHeight,
        }}
      >
        {!session ? (
          <View style={{ width: '100%', height: '90%', justifyContent: 'center', backgroundColor: 'black',}}>
            <Login setToggleAlert={setToggleAlert} setSession={setSession} session={session}/>
          </View>
        ) : (
          user && <HomePage user={user} partner={partner} setSession={setSession} session={session}/>
        )}
      </View>
    </>
  );
}