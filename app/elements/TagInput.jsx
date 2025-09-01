import React from 'react';
import { View, TextInput, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const TagInput = ({ label, tags, inputValue, setInputValue, onAddTag, onRemoveTag }) => {
  const handleKeyPress = ({ nativeEvent }) => {
    if (nativeEvent.key === 'Enter' && inputValue.trim()) {
      onAddTag(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholder={`Add ${label}`}
        style={styles.input}
        value={inputValue}
        onChangeText={setInputValue}
        onSubmitEditing={() => {
          if (inputValue.trim()) {
            onAddTag(inputValue.trim());
            setInputValue('');
          }
        }}
        blurOnSubmit={false}
      />
      <FlatList
        horizontal
        data={tags}
        keyExtractor={(item, index) => `${item}-${index}`}
        contentContainerStyle={styles.tagList}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            style={styles.tag}
            onPress={() => onRemoveTag(index)}
          >
            <Text style={styles.tagText}>{item} ✕</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { marginBottom: 20 },
  label: { fontSize: 16, fontWeight: 'bold', color: 'black', marginBottom: 6 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    padding: 10,
    color: 'black',
    marginBottom: 10
  },
  tagList: { flexDirection: 'row', flexWrap: 'wrap' },
  tag: {
    backgroundColor: '#ddd',
    borderRadius: 16,
    paddingVertical: 4,
    paddingHorizontal: 10,
    marginRight: 6,
  },
  tagText: { color: '#333' },
});

export default TagInput;