import prettyBytes from 'pretty-bytes';
import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {Gif, GifImage} from './types';
import Clipboard from '@react-native-clipboard/clipboard';

const ActionMenuRow: React.FC<{image: GifImage}> = ({image}) => {
  const handleCopyLink = () => {
    Clipboard.setString(image.url);
  };

  return (
    <View style={styles.row}>
      <Text>{prettyBytes(parseInt(image.size, 10))}</Text>
      <TouchableOpacity style={styles.button} onPress={handleCopyLink}>
        <Text>🔗</Text>
      </TouchableOpacity>
    </View>
  );
};

const ActionMenu: React.FC<{gif: Gif}> = ({gif}) => {
  return (
    <View style={styles.container}>
      <ActionMenuRow image={gif.images.original} />
      {gif.images.original.size !== gif.images.downsized.size && (
        <ActionMenuRow image={gif.images.downsized} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '80%',
    height: '80%',
    left: '10%',
    top: '20%',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#0004',
    padding: 10,
  },
  button: {
    paddingLeft: 5,
  },
});

export default ActionMenu;