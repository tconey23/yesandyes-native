import React, { useEffect, useState, useRef } from 'react';
import { View, Button, TouchableOpacity, ScrollView, StyleSheet, TextInput, Image, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
import { fantasyComment, fantasyData, getFantasies, getFantasyComments, insertFantasy, updateFantasyPublished } from '../business/supabase';
import Text from '../elements/Text';
import { supabase } from '../business/supabase';
import * as ImagePicker from 'expo-image-picker';
import { Dimensions} from 'react-native';
import { KeyboardAccessoryView } from 'react-native-keyboard-accessory';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height

const UserFantasyBoard = ({ user, setSelectedOption }) => {
  const [fantasies, setFantasies] = useState([]);
  const [selectFantasy, setSelectFantasy] = useState(null);
  const [refreshFantasies, setRefreshFantasies] = useState(0)
  const [commentText, setCommentText] = useState()
  const [fantasyComments, setFantasyComments] = useState([])
  const [newFantasy, setNewFantasy] = useState(false)
  const [newFantasyText, setNewFantasyText] = useState()
  const [newFantasyImgs, setNewFantasyImgs] = useState([])

  const inputRef = useRef(null)

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  useEffect(() => {
  if (!selectFantasy?.id) return;

  const channel = supabase
    .channel(`fantasy_comments_${selectFantasy.id}`)
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'fantasy_comments',
        filter: `linked_fantasy=eq.${selectFantasy.id}`,
      },
      (payload) => {
        console.log('New comment received', payload.new);
        getComments(selectFantasy.id);
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}, [selectFantasy?.id]);

  const getSelectedFantasy = async (id) => {
    const data = await fantasyData(id);
      if (data) {
        setSelectFantasy(data[0]);
      }
  }

  const fetchFantasies = async () => {
    const data = await getFantasies(user.id);
    if (data) {
      setFantasies(data);
    }
  };

    const updateFantasies = async (id) => {
    const data = await getFantasies(user.id);
    if (data) {
      setFantasies(data);
      getSelectedFantasy(id)
      setRefreshFantasies(prev => prev + 1)
    }
  };

  useEffect(() => {

    if (user) {
      fetchFantasies();
    }
  }, [user]);

  const getComments = async (id) => {
    const res = await getFantasyComments(id)

    if(res){
      console.log('new comments', res)
      setFantasyComments(res)
    }
  }

  useEffect(() => {
    if(selectFantasy){
      getComments(selectFantasy.id)
    }
  }, [selectFantasy])

  const handleSelectFantasy = async (id) => {
    setSelectFantasy(null)
    getSelectedFantasy(id)
  }

  const pickImage = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All,
    allowsEditing: true,
    base64: false,
  });

  if (!result.canceled) {
    setNewFantasyImgs(prev => ([
      ...prev,
      result.assets[0].uri
    ]));
  }
};

const saveNewFantasy = async () => {
  await insertFantasy(newFantasyText, user.id, newFantasyImgs, false)
  setNewFantasyText(null)
  setNewFantasyImgs([])
  setNewFantasy(false)
}

const handleAddComment = async (id) => {
  await fantasyComment(id, user.id, commentText)
  setCommentText('')
  getComments(id)
}

useEffect(() => {
  console.log('*******************************************************',Keyboard?.isVisible())
}, [Keyboard])  

  return (
    <KeyboardAvoidingView 
    style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={500}
    >
      <View>
        <Button title="Back" onPress={() => setSelectedOption(null)} />
      </View>
      <View style={{flex: 1, backgroundColor: 'whitesmoke', maxHeight: 200}}>
          <ScrollView contentContainerStyle={[styles.scroll, { gap: 1, backgroundColor: 'whitesmoke', zoom: 0.5}]}>
            {fantasies?.map((f) => ( 
              <TouchableOpacity
              key={f.id}
              style={styles.fantasyCard}
              onPress={() => handleSelectFantasy(f.id)}
              >
                <View style={styles.fantasyTextContainer}>
                  <View style={styles.fantasyData}>
                    <Text style={styles.fantasyText}>ID:</Text>
                    <Text style={styles.fantasyText}>{f.id}</Text>
                  </View>
                  <View style={styles.fantasyData}>
                    <Text style={styles.fantasyText}>Status:</Text>
                    <Text style={styles.fantasyText}>{f.published ? 'Published' : 'Draft'}</Text>
                  </View>
                  <View style={styles.fantasyData}>
                    <Text style={styles.fantasyText}>Images:</Text>
                    <Text style={styles.fantasyText}>{f.images.length}</Text>
                  </View>
                  <View style={styles.fantasyData}>
                    <Text style={styles.fantasyText}>Links:</Text>
                    <Text style={styles.fantasyText}>{f.links?.length}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
            <TouchableOpacity onPress={() => setNewFantasy(true)} style={{backgroundColor: 'skyblue', padding: 10, width: '100%', justifyContent: 'center'}}>
              <Text>NEW</Text>
            </TouchableOpacity>
          <View>
          </View>
          </ScrollView>
        </View>
        <View style={{width: '95%', height: '30%', justifyContent: 'flex-start', backgroundColor: 'white'}}>
            {selectFantasy && !newFantasy &&
             <View style={{flex:0}}>

              <View style={{height: 30, marginBottom: 20}}>
                <View style={{height: '100%', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 5}}>
                  <Text style={{fontSize: 15}}>Fantasy {selectFantasy.id}</Text>
                <TouchableOpacity
                    style={{height: '100%', backgroundColor: 'skyblue'}}
                    title={selectFantasy.published ? 'Unpublish' : 'Publish'}
                    onPress={() => {
                      updateFantasyPublished(selectFantasy.id, !selectFantasy.published, user.partner_id, user.id)
                      setFantasies([])
                      setTimeout(() => {
                        updateFantasies(selectFantasy.id)
                      }, 50);
                    }}
                  >
                    <Text>{selectFantasy.published ? 'Unpublish' : 'Publish'}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={{height: '50%', marginVertical: 10, backgroundColor: 'white'}}>
                <ScrollView style={{padding: 10, height: '100%'}}>
                  <Text style={{height: '100%'}}>{selectFantasy.text_content}</Text>
                </ScrollView>
              </View>

              <View style={{ flex: 1, marginTop: 1, minHeight: screenHeight * 0.30  }}>
                <Text style={{ marginBottom: 8 }}>Comments</Text>
                <ScrollView style={{ flex: 1, backgroundColor: '#dad6d6', padding: 8}}>
                  {fantasyComments.map((c, i) => (
                    <View
                      key={i}
                      style={{
                        minHeight: 50,
                        backgroundColor: c.author_id === user.id ? 'skyblue' : 'grey',
                        justifyContent: 'center',
                        marginVertical: 6,
                        marginLeft: c.author_id === user.id ? 10 : 40,
                        marginRight: c.author_id === user.id ? 40 : 10,
                        borderRadius: 6,
                        padding: 8,
                      }}
                    >
                      <Text>{c.comment_text}</Text>
                    </View>
                  ))}
                </ScrollView>
                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <TextInput
                    value={commentText}
                    onChangeText={setCommentText}
                    placeholder="Add comment..."
                    style={{
                      flex: 1,
                      fontSize: 16,
                      backgroundColor: '#fff',
                      padding: 10,
                      borderRadius: 8,
                      marginRight: 10,
                    }}
                  />
                  <Button
                    disabled={!commentText}
                    onPress={() => handleAddComment(selectFantasy.id)}
                    title=">"
                  />
                </View>
              </View>
             </View>
            }
            {newFantasy && 
             <View style={{width: '100%', height: '100%'}}>
              
                <View style={{height: 20, justifyContent: 'center'}}>
                  <Text>Fantasy Text</Text>
                </View>

                <View style={{height: 100, backgroundColor: 'white', padding: 5}}>
                  <TextInput
                    ref={inputRef}
                    multiline
                    style={{ fontSize: 17, height: '100%' }}
                    value={newFantasyText}
                    onChangeText={setNewFantasyText}
                  />
                {Keyboard?.isVisible() && <TouchableOpacity onPress={dismissKeyboard}>
                  <Text style={styles.doneButton}>Done</Text>
                </TouchableOpacity>}
                </View>

                <View style={{height: '100%'}}>

                  <View style={{height: '10%'}}>
                    <TouchableOpacity onPress={() => pickImage()} style={{backgroundColor: 'skyblue', alignItems: 'center', fontSize: 20}}>
                      Select Image
                    </TouchableOpacity>
                  </View>

                  <View style={{height: '100%'}}> 
                  <ScrollView style={{height: '100%', backgroundColor: 'white'}}>
                    {newFantasyImgs.map((imgUri, index) => (
                      <Image
                      key={index}
                      source={{ uri: imgUri }}
                      style={{ width: 100, height: 100, margin: 5, borderRadius: 8 }}
                      />
                    ))}
                  </ScrollView>
                  </View>

                  <View style={{height: '100%'}}>
                    <TouchableOpacity onPress={() => saveNewFantasy()} style={{backgroundColor: 'skyblue', alignItems: 'center', fontSize: 20}}>
                      Save
                    </TouchableOpacity>
                  </View>

                </View>

             </View>
            }
        </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  accessory: {
  backgroundColor: '#eee',
  paddingVertical: 10,
  alignItems: 'flex-end',
  paddingRight: 15,
  height: '50%',
  zIndex: 1000
},
doneButton: {
  fontSize: 16,
  fontWeight: '600',
  color: '#ff0000',
},
  container: {
    flex: 1,
    width: 420,
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 10,
    backgroundColor: 'whitesmoke'
  },
  scroll: {
    width: '100%',
    alignItems: 'center',
  },
  fantasyCard: {
  width: '95%',
  marginBottom: 16,
  padding: 16,
  backgroundColor: '#fff',
  borderRadius: 8,
  shadowColor: '#000',
  shadowOffset: { width: 1, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 3,
},

fantasyTextContainer: {
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: 4, // Or use marginBottom on individual texts if `gap` doesn't work on your RN version
},

fantasyText: {
  fontSize: 16,
  color: '#000',
},

fantasyData: {
  width: '25%',
  justifyContent: 'center'
}

});

export default UserFantasyBoard;