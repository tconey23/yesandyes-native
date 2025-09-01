// ⚠️ This is a partial conversion of the UserForm to React Native (JSX, not TSX)
// Assumes use of libraries like react-native, react-native-elements or react-native-paper for UI
// Assumes FlexBox and Text are wrappers for View/Text with extended styling
// Web-specific features like <select>, <option>, and <input type="email"> need custom components in RN

import React, { useEffect, useState } from 'react';
import { View, TextInput, TouchableOpacity, Button, ScrollView, Image, StyleSheet, Modal, Text } from 'react-native';
import FlexBox from '../elements/FlexBox';
import { supabase, inviteUser, getUser } from '../business/supabase';
// import ProfileImg from './ProfileImg';
// import Alert from './Alert'
import TagInput from '../elements/TagInput'

const UserProfile = ({ user, prof, onSubmit, setNeedsSetup, setToggleAlert, setSelectedOption }) => {
  const [partnerEmail, setPartnerEmail] = useState('');
  const [likesInput, setLikesInput] = useState('');
  const [dislikesInput, setDislikesInput] = useState('');
  const [openToInput, setOpenToInput] = useState('');
  const [inviteAlert, setInviteAlert] = useState('');
  const [inviteError, setInviteError] = useState('');
  const [changeImg, setChangeImg] = useState(false);
  const [selectedInput, setSelectedInput] = useState(null);
  const [positions, setPositions] = useState([]);
  const [actions, setActions] = useState([]);
  const [newUser, setNewUser] = useState({
    id: '', display_name: '', avatar_url: null, pronouns: '', orientation: '', gender: '',
    trust_key: '', partner_id: '', preferences: '', likes: [], dislikes: [], open_to: [],
    limits: [], consent_notes: [], communication_style: '', communication_challenges: [],
    email: '', invited_user: '', onboarding_complete: false
  });

  const pronouns = ['he/him', 'she/her', 'they/them', 'Ask me'];
  const genders = ['Male', 'Female', 'Non-binary'];
  const orientations = ['Gay', 'Lesbian', 'Heterosexual', 'Pansexual'];

  useEffect(() => {
    const getData = async () => {
      let { data: pos } = await supabase.from('positions').select('*');
      setPositions(pos || []);
      let { data: acts } = await supabase.from('actions').select('*');
      setActions(acts || []);
      let { data, error } = await supabase
        .from('user_profiles')
        .select("*")
        .eq('id', user.id)

        setNewUser(data[0])
      
        const getPartnerEmail = async () => {
          return await getUser(data[0].partner_id)
        }

        const prtnremail = await getPartnerEmail()
        setPartnerEmail(prtnremail.email)

    };

    getData();
  }, []);

  useEffect(() => {
    if (user) {
      setNewUser((prev) => ({ ...prev, id: user.id, email: user.email }));
    }
  }, [user]);

  const handleChange = (field, value) => {
    setNewUser((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    const cleaned = { ...newUser };
    delete cleaned.likes_input;
    delete cleaned.dislikes_input;

    const { data, error } = await supabase.from('user_profiles').upsert(cleaned, { onConflict: 'id' });
    if (error) {
      setInviteAlert('Error saving profile');
    } else {
      if (onSubmit) onSubmit(cleaned);
      setInviteAlert('Profile saved');
    }
  };

  const handleInvite = async () => {
    try {
      await inviteUser(partnerEmail, 'there', 'https://your-app.com', newUser.id);
      setInviteAlert('Invite sent');
    } catch (err) {
      setInviteError(err.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
        <Button title='back' onPress={() => setSelectedOption(null)}/>
      <Text style={styles.header}>Update Your Profile</Text>

      <TouchableOpacity onPress={() => setChangeImg(true)} style={styles.avatarBox}>
        <Image source={{ uri: newUser.avatar_url }} style={styles.avatarImg} />
        <View style={styles.avatarOverlay}>
          <Text style={styles.avatarOverlayText}>Change</Text>
        </View>
      </TouchableOpacity>

      <Text>Display name</Text>
      <TextInput
        placeholder="Display Name"
        value={newUser.display_name}
        onChangeText={(text) => handleChange('display_name', text)}
        style={styles.input}
      />

      <Text>Pronouns</Text>
      <TextInput
        placeholder="Pronouns"
        value={newUser.pronouns}
        onChangeText={(text) => handleChange('pronouns', text)}
        style={styles.input}
      />

      <Text>Gender</Text>
      <TextInput
        placeholder="Gender"
        value={newUser.gender}
        onChangeText={(text) => handleChange('gender', text)}
        style={styles.input}
      />

      <Text>Orientation</Text>
      <TextInput
        placeholder="Orientation"
        value={newUser.orientation}
        onChangeText={(text) => handleChange('orientation', text)}
        style={styles.input}
      />

      <Text>Partner Email</Text>
      <TextInput
        placeholder="Partner Email"
        value={partnerEmail}
        onChangeText={setPartnerEmail}
        keyboardType="email-address"
        style={styles.input}
      />

      <TagInput
  label="Likes"
  tags={newUser.likes || []}
  inputValue={likesInput}
  setInputValue={setLikesInput}
  onAddTag={(tag) => {
    if (!newUser.likes.includes(tag)) {
      handleChange('likes', [...newUser.likes, tag]);
    }
  }}
  onRemoveTag={(index) => {
    const updated = [...newUser.likes];
    updated.splice(index, 1);
    handleChange('likes', updated);
  }}
/>

<TagInput
  label="Dislikes"
  tags={newUser.dislikes || []}
  inputValue={dislikesInput}
  setInputValue={setDislikesInput}
  onAddTag={(tag) => {
    if (!newUser.dislikes.includes(tag)) {
      handleChange('dislikes', [...newUser.dislikes, tag]);
    }
  }}
  onRemoveTag={(index) => {
    const updated = [...newUser.dislikes];
    updated.splice(index, 1);
    handleChange('dislikes', updated);
  }}
/>

<TagInput
  label="Open To"
  tags={newUser.open_to || []}
  inputValue={openToInput}
  setInputValue={setOpenToInput}
  onAddTag={(tag) => {
    if (!newUser.open_to.includes(tag)) {
      handleChange('open_to', [...newUser.open_to, tag]);
    }
  }}
  onRemoveTag={(index) => {
    const updated = [...newUser.open_to];
    updated.splice(index, 1);
    handleChange('open_to', updated);
  }}
/>

      <Button title="Send Invite" onPress={handleInvite} />
      <Button title="Save Profile" onPress={handleSubmit} />

      {changeImg && (
        <Modal visible={true} transparent>
          <ProfileImg currImg={newUser.avatar_url} setCurrImg={setNewUser} userid={newUser.id} open={setChangeImg} />
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: 'center', backgroundColor: 'whitesmoke'},
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '100%', padding: 10, borderWidth: 1, borderColor: '#ccc', borderRadius: 6, marginBottom: 12, color: 'black' },
  avatarBox: { width: 180, height: 180, marginBottom: 20, position: 'relative' },
  avatarImg: { width: '100%', height: '100%', borderRadius: 90 },
  avatarOverlay: { position: 'absolute', width: '100%', height: '100%', backgroundColor: '#00000060', justifyContent: 'center', alignItems: 'center' },
  avatarOverlayText: { color: 'white', fontWeight: 'bold' }
});

export default UserProfile;

