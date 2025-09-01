import Collapsible from 'react-native-collapsible';
import { useEffect, useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import Text from './Text'

export default function Accordion ({title, content, coll, fs = 18, mb=30, children}) {
    const [collapsed, setCollapsed] = useState(true)

    useEffect(() => {
      setCollapsed(coll)
    }, [coll])

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
        <View style={{overflow: 'hidden'}}>
          {content ? content : children}
        </View>
      </Collapsible>
    </View>
  )
}
