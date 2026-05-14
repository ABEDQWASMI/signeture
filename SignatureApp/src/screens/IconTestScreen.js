import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Icon from '../components/Icon';

const IconTest = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Icon Test Screen</Text>
      
      <TouchableOpacity style={{ padding: 20, backgroundColor: '#f0f0f0', marginBottom: 10 }}>
        <Icon name="shopping-bag" size={32} color="#000" />
        <Text>Shopping Bag Icon</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={{ padding: 20, backgroundColor: '#f0f0f0', marginBottom: 10 }}>
        <Icon name="chevron-left" size={32} color="#000" />
        <Text>Chevron Left Icon</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={{ padding: 20, backgroundColor: '#f0f0f0', marginBottom: 10 }}>
        <Icon name="check" size={32} color="#000" />
        <Text>Check Icon</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={{ padding: 20, backgroundColor: '#f0f0f0', marginBottom: 10 }}>
        <Icon name="user" size={32} color="#000" />
        <Text>User Icon</Text>
      </TouchableOpacity>
      
      <Text style={{ marginTop: 20, color: '#666' }}>
        If you see icons above, they work. If you see squares or nothing, icons are broken.
      </Text>
    </View>
  );
};

export default IconTest;
