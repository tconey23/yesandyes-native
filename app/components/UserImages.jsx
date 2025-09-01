import React from 'react'
import { View, Button } from 'react-native'

const UserImages = ({setSelectedOption}) => {
  return (
    <View>
      <Button title='back' onPress={() => setSelectedOption(null)}/>
    </View>
  )
}

export default UserImages
