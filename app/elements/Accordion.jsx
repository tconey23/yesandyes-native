import Collapsible from 'react-native-collapsible';
import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from './Text'

export default function Accordion ({title, content, coll = true, fs = 18, mb=30}) {
    const [collapsed, setCollapsed] = useState(coll)
  return (
    <View style={{marginBottom: mb}}>
      <TouchableOpacity onPress={() => setCollapsed(!collapsed)}>
        <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
          <Text style={{ fontSize: fs }}>{title}</Text>
          {collapsed ? 
            <Text style={{fontSize: 22}}>▶</Text>
              :
            <Text style={{fontSize: 22}}>▼</Text>
          }
        </View>
      </TouchableOpacity>
      
      <Collapsible collapsed={collapsed}>
        {content}
      </Collapsible>
    </View>
  )
}
