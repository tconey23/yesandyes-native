import React from 'react'
import { Image, View, Dimensions, TouchableOpacity, Text } from 'react-native';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height

export default function ImageView ({url, setSelectedImg}){
console.log(url)
  return (
    <View style={{height: screenHeight, width: screenWidth, position: 'absolute', backgroundColor: '#5a5a5a88', top: -screenHeight * 0.9, left: -screenWidth / 2.}}>
        <View style={{height: '100%', width: '100%', justifyContent: 'center', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => setSelectedImg(null)} style={{backgroundColor: 'skyblue', height: 30, justifyContent: 'center', paddingHorizontal: 10}}>
                <Text style={{fontSize: 18}}>Close</Text>
            </TouchableOpacity>
            <Image height='80%' width='80%' source={url}/>
        </View>
    </View>
  )
}
