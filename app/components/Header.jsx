import { useState, useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { supabase } from "../business/supabase";
import { useFonts, BilboSwashCaps_400Regular } from '@expo-google-fonts/bilbo-swash-caps';


export default function Header ({setSelectedComponent, setSession}) {
const [fontsLoaded] = useFonts({
    BilboSwashCaps_400Regular,
})

const handleLogout = async () => {
    let { error } = await supabase.auth.signOut()
    setSession(null)
}

    return (
        <View style={{height: '100%', backgroundColor: 'black'}}>
            <View style={{flexDirection: 'row', height: '100%', alignItems: 'center', padding: 5, width: '100%', justifyContent: 'space-evenly'}}>
                <TouchableOpacity onPress={() => setSelectedComponent(null)} style={{backgroundColor: '#ffffff97', padding: 10, borderRadius: 10}}>
                    <Text style={{color: 'black', fontSize: 20}}>Home</Text>
                </TouchableOpacity>

                <View style={{backgroundColor: 'white', flexDirection: 'row', paddingHorizontal: 40, width: '50%'}}>
                    <Text style={{fontSize: 30}}>Yes</Text>
                    <Text style={{fontSize: 30, color: 'red'}}> & </Text>
                    <Text style={{fontSize: 30, fontFamily: 'BilboSwashCaps_400Regular'}}>YES</Text>
                </View>

                <TouchableOpacity onPress={() => handleLogout()} style={{backgroundColor: '#ffffff97', padding: 10, borderRadius: 10}}>
                    <Text style={{color: 'black', fontSize: 20}}>Logout</Text>
                </TouchableOpacity>
                
            </View>
        </View>
    )
}