import React from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {Gif} from './types';

const GifView: React.FC<{gif: Gif}> = ({gif}) => {
  return (
    <View style={styles.gifView}>
      <Image
        style={styles.image}
        height={150}
        source={{uri: gif.images.fixed_height_small.url}}
      />
      <Text style={[styles.text, styles.imageText]} numberOfLines={1}>
        {gif.title || gif.id}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.black,
  },
  gifView: {
    position: 'relative',
    width: '25%',
  },
  imageText: {
    width: '100%',
    padding: '2%',
    backgroundColor: '#0004',
    color: '#fff',
    position: 'absolute',
    left: 0,
    top: 0,
  },
  image: {},
});

export default GifView;
