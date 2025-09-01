import React, { useEffect, useState, useRef } from 'react';
import { View, Button, TouchableOpacity, ScrollView, StyleSheet, TextInput, Image, KeyboardAvoidingView, Platform, Keyboard, KeyboardEvent } from 'react-native';
import { fantasyComment, fantasyData, getFantasies, getFantasyComments, insertFantasy, updateFantasyPublished } from '../business/supabase';
import Text from '../elements/Text';
import { supabase } from '../business/supabase';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import Accordion from '../elements/Accordion';
import ImageView from './ImageView'

import { Dimensions} from 'react-native';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height

const UserFantasyBoard = ({ user, setSelectedOption, session}) => {
  const [fantasies, setFantasies] = useState([]);
  const [selectFantasy, setSelectFantasy] = useState();
  const [refreshFantasies, setRefreshFantasies] = useState(0)
  const [commentText, setCommentText] = useState()
  const [fantasyComments, setFantasyComments] = useState([])
  const [newFantasy, setNewFantasy] = useState(false)
  const [newFantasyText, setNewFantasyText] = useState()
  const [newFantasyImgs, setNewFantasyImgs] = useState([])
  const [youThem, setYouThem] = useState(null)
  const [isDraft, setIsDraft] = useState(false)
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [accIdx, setAccIdx] = useState(0)
  const [selectedImg, setSelectedImg] = useState(null)

  useEffect(() => {
    const onKeyboardShow = (event) => {
      const height = event.endCoordinates.height;
      setKeyboardHeight(height);
      console.log('Keyboard height:', height);
    };

    const onKeyboardHide = () => {
      setKeyboardHeight(0);
    };

    const showListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
      onKeyboardShow
    );
    const hideListener = Keyboard.addListener(
      Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
      onKeyboardHide
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

    useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
      console.log('Keyboard is visible');
    });

    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      console.log('Keyboard is hidden');
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);
  

  const inputRef = useRef(null)

  const dismissKeyboard = () => {
    setKeyboardVisible(false)
    Keyboard.dismiss();
  };

  const handleDraftClick = () => {
    setIsDraft(true)

    setTimeout(() => {
      setIsDraft(false)
    }, 4000);
  }

  useEffect(() =>{
    // console.log(user.id, session?.user?.id)
    if(user.id === session?.user?.id){
      setYouThem('you')
      console.log('you')
    } else {
      setYouThem('them')
      console.log('them')
    }
  }, [])

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
        // console.log('New comment received', payload.new);
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
      // console.log('new comments', res)
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

const deleteImage = async (idx) => {
  console.log(idx)

  const filteredImgs = newFantasyImgs.filter((img, i) => i !== idx)

  setNewFantasyImgs(filteredImgs)

}

useEffect(() => {
  console.log(newFantasyImgs)
}, [newFantasyImgs])

const insertNewFantasy = async (text, auth, imgs, pub) => {
  const uploadedUrls = [];
  const parentFolder = Date.now();

  for (let i = 0; i < imgs.length; i++) {
    const uri = imgs[i];
    const fileExt = uri.split('.').pop().split('?')[0];
    const filePath = `${parentFolder}/img${i}.${fileExt}`;

    try {
      // Read file from URI as base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const fileBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));

      const { error: uploadError } = await supabase.storage
        .from(`user-${auth}`)
        .upload(filePath, fileBytes, {
          contentType: 'image/jpeg',
          upsert: false,
        });

      if (uploadError) {
        console.error(`❌ Upload error on img${i}:`, uploadError);
        continue;
      }

      const { data: urlData } = supabase
        .storage
        .from(`user-${auth}`)
        .getPublicUrl(filePath);

      uploadedUrls.push(urlData.publicUrl);
      console.log(`✅ Uploaded img${i}:`, urlData.publicUrl);

    } catch (err) {
      console.error(`❌ Error uploading img${i}:`, err);
    }
  }

  const { data, error } = await supabase
    .from('fantasies')
    .insert([
      {
        text_content: text,
        author_id: auth,
        images: uploadedUrls,
        published: pub,
      },
    ])
    .select();

  if (error) {
    console.error("❌ Error inserting fantasy:", error);
  }

  return data;
};



const saveNewFantasy = async () => {
  // console.log(newFantasyText, user.id, newFantasyImgs, false)
  await insertNewFantasy(newFantasyText, user.id, newFantasyImgs, false)
  setNewFantasyText(null)
  setNewFantasyImgs([])
  setNewFantasy(false)
}

const handleAddComment = async (id) => {
  let author
  let partner

  if(youThem === 'them'){
    author = session?.user?.id
    partner = user.id
  } else {
    author = user.id
    partner = session?.user?.id
  }

  // console.log('you or them', youThem)
  // console.log('author', author)
  // console.log('partner', partner)

  // console.log('session user', session?.user?.id)
  // console.log('user id', user.id)

  await fantasyComment(id, author, commentText)
  setCommentText('')
  getComments(id)
}

  return (
    <KeyboardAvoidingView 
    style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={500}
    >
      <View style={{width: screenWidth, justifyContent: 'center'}}>
        <Text style={{fontSize: 15, color: 'red', width: '100%', textAlign: 'center'}}>{isDraft ? `You can't view fantasies that your partner hasn't published` : ''}</Text>
      </View>
      {!newFantasy && !selectFantasy && <View style={{flex: 0, backgroundColor: 'whitesmoke', maxHeight: screenHeight *0.73}}>
          <ScrollView contentContainerStyle={[styles.scroll, { gap: 1, backgroundColor: 'whitesmoke', zoom: 0.5}]}>
            {fantasies?.map((f) => { 

              if(youThem === 'them' && !f.published) return (
                <TouchableOpacity key={f.id} style={[styles.fantasyCard, {flexDirection: 'row', backgroundColor: 'gray'}]} onPress={() => handleDraftClick()}>
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
                </TouchableOpacity>
              )

              return( 
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
            )})}
            {user.id === session?.user?.id && <TouchableOpacity onPress={() => setNewFantasy(true)} style={[styles.publishButton, {backgroundColor: 'skyblue', padding: 10, width: '100%', justifyContent: 'center'}]}>
              <Text>NEW</Text>
            </TouchableOpacity>}
          <View>
            {youThem === 'them' && fantasies?.length === 0 &&  
              <View>
                <Text style={{textAlign: 'center'}}>Your partner hasn't created any fantasies yet</Text>
                <Text style={{textAlign: 'center'}}>Check back in later</Text>
              </View>
            }
          </View>
          </ScrollView>
        </View>}
        <View style={{width: '95%', height: '97%', justifyContent: 'flex-start', backgroundColor: '', overflow: 'hidden'}}>
            {selectFantasy && !newFantasy &&
             <View style={{flex:0, backgroundColor: 'white'}}>


              <View style={{height: 30, marginBottom: 20}}>
                <View style={{height: '100%', justifyContent: 'space-around', flexDirection: 'row', alignItems: 'flex-start', marginTop: 12}}>
                  <Text style={{fontSize: 15}}>Fantasy {selectFantasy.id}</Text>
                {youThem === 'you' && <TouchableOpacity
                    style={[styles.publishButton, {height: '100%', backgroundColor: 'skyblue', padding: 5}]}
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
                  </TouchableOpacity>}
                </View>
              </View>

              <ScrollView>

              <View style={{marginVertical: 10, backgroundColor: 'white'}}>
                <Accordion title='Fantasy text' coll={!accIdx == 0}>
                  <View style={{overflow: 'hidden', height: screenHeight * 0.25}}>
                    <ScrollView style={{padding: 10, height: '100%'}}>
                      <Text style={{height: '100%'}}>{selectFantasy.text_content}</Text>
                    </ScrollView>
                  </View>
                </Accordion>
              </View>

              <View style={{marginVertical: 10, backgroundColor: 'white'}}>
                <Accordion title='Images' coll={true}>
                  <View style={{overflow: 'hidden', height: screenHeight * 0.25}}>
                    <ScrollView style={{padding: 10, height: '100%'}}>
                      {selectFantasy?.images?.map((img, i) => {
                        return (
                          <TouchableOpacity onPress={() => setSelectedImg({url: img})}>
                            <Image height={100} width={100} key={i} source={{url: img}}/>
                          </TouchableOpacity>
                        )
                      })}
                    </ScrollView>
                  </View>
                </Accordion>
              </View>

              <View style={{ flex: 1, marginTop: 1, overflow: 'hidden'}}>
                <Accordion title='Comments'>
                  <View style={{overflow: 'hidden', height: screenHeight * 0.25}}>

                    <ScrollView style={{ flex: 1, backgroundColor: '#dad6d6', padding: 8}}>
                      {fantasyComments.map((c, i) => { 
                        // console.log(c.author_id === session?.user?.id)
                        let self = c.author_id === session?.user?.id
                        return (
                          <View
                          key={i}
                          style={{
                            minHeight: 50,
                            backgroundColor: self ? 'skyblue' : 'grey',
                            justifyContent: 'flex-start',
                            alignItems: 'center',
                            marginVertical: 6,
                            marginLeft: self  ? 10 : 40,
                            marginRight: self ? 40 : 10,
                            borderRadius: 6,
                            padding: 8,
                            flexDirection: 'row'
                          }}
                          >
                          <Text>{self ? 'You: ' : 'Them: '} </Text>
                          <Text>{c.comment_text}</Text>
                        </View>
                      )})}
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
                  </Accordion>
              </View>
                        </ScrollView>

              <View style={{width: '100%', justifyContent: 'center'}}>
                <TouchableOpacity onPress={() => setSelectFantasy(null)} style={[styles.shadow, {width: '100%', backgroundColor: 'skyblue', textAlign: 'center'}]}>
                  <Text style={{textAlign: 'center', fontWeight: 800}}>Done</Text>
                </TouchableOpacity>
              </View>

             </View>
            }
            {newFantasy && 
             <View style={{width: '100%', flex: 1}}>
              
                <View style={{height: 20, justifyContent: 'center'}}>
                  <Text>Fantasy Text</Text>
                </View>

                <View style={{backgroundColor: 'white', padding: 5}}>
                  <View style={{flex:0}}>
                  <TextInput
                    ref={inputRef}
                    multiline
                    numberOfLines={2}
                    style={{ fontSize: 17, color: 'black'}}
                    value={newFantasyText}
                    onChangeText={setNewFantasyText}
                    />
                  </View>

                  {keyboardVisible &&
                  <View style={{width: screenWidth, position: 'absolute', top: keyboardHeight, left: screenHeight /2, justifyContent: 'center', zIndex: 10000}}>
                    <TouchableOpacity style={[styles.shadow, {backgroundColor: '#414141c5', width: screenWidth * 0.90, height: 40, justifyContent: 'center'}]} onPress={dismissKeyboard}>
                      <Text style={{width: '100%', fontSize: 18, textAlign: 'center', color: 'white'}}>Hide keyboard</Text>
                    </TouchableOpacity>
                  </View>}
                </View>

                <View style={{flex:1, marginVertical: 10}}>
                  <View style={{flex:0}}>
                    <TouchableOpacity onPress={() => pickImage()} style={{backgroundColor: 'skyblue', alignItems: 'center', fontSize: 20}}>
                      <Text>Select image</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={{flex:1, minHeight: 130}}> 
                  <ScrollView style={{backgroundColor: 'white'}}>
                    {newFantasyImgs.map((imgUri, index) => (
                      <View key={index} style={{marginVertical: 20, width: 100, height: 100, alignItems: 'flex-end'}}>
                        <TouchableOpacity onPress={() => deleteImage(index)} style={[styles.shadow,{backgroundColor: 'skyblue', width: 20}]}>
                          <Text> X</Text>
                        </TouchableOpacity>
                        <Image
                          key={index}
                          source={{ uri: imgUri }}
                          style={{ width: 100, height: 100, margin: 5, borderRadius: 8 }}
                        />
                      </View>
                    ))}
                  </ScrollView>
                  </View>

                  <View style={{height: '20%', marginVertical: 20, flexDirection: 'row', width: '100%', justifyContent: 'center'}}>
                    <TouchableOpacity onPress={() => saveNewFantasy()} style={{backgroundColor: 'skyblue', alignItems: 'center', fontSize: 20, width: '50%', marginHorizontal: 10}}>
                      <Text>Save</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setNewFantasy(false)} style={{backgroundColor: 'skyblue', alignItems: 'center', fontSize: 20, width: '50%', marginHorizontal: 10}}>
                      <Text>Cancel</Text>
                    </TouchableOpacity>
                  </View>

                </View>

             </View>
            }
        </View>
        {selectedImg && 
          <View>
            <ImageView url={selectedImg} setSelectedImg={setSelectedImg}/>
          </View>
        }
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
  color: '#000000ff',
  textAlign: 'center',
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
},

publishButton: {
  shadowColor: '#000',
  shadowOffset: { width: 1, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  borderRadius: 20
},

shadow:{
  shadowColor: '#000',
  shadowOffset: { width: 1, height: 1 },
  shadowOpacity: 0.2,
  shadowRadius: 2,
  elevation: 3,
}

});

export default UserFantasyBoard;