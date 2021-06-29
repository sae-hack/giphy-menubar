import prettyBytes from 'pretty-bytes';
import React from 'react';
import {StyleSheet, Text, TouchableHighlight, View} from 'react-native';
import {Gif, GifImage} from './types';
import Clipboard from '@react-native-clipboard/clipboard';

const ActionMenuRow: React.FC<{id: string; image: GifImage}> = ({
  id,
  image,
}) => {
  const handleCopyLink = () => {
    Clipboard.setString(image.url);
  };

  const handleCopyMd = () => {
    Clipboard.setString(`![${id}](${image.url})`);
  };

  return (
    <View style={styles.row}>
      <Text>{prettyBytes(parseInt(image.size, 10))}</Text>
      <TouchableHighlight
        style={styles.button}
        onPress={handleCopyLink}
        underlayColor="#0004">
        <Text>🔗</Text>
      </TouchableHighlight>
      <TouchableHighlight
        style={styles.button}
        onPress={handleCopyMd}
        underlayColor="#0004">
        <Text>md</Text>
      </TouchableHighlight>
    </View>
  );
};

const ActionMenu: React.FC<{gif: Gif}> = ({gif}) => {
  return (
    <View style={styles.container}>
      <ActionMenuRow id={gif.id} image={gif.images.original} />
      {gif.images.original.size !== gif.images.downsized.size && (
        <ActionMenuRow id={gif.id} image={gif.images.downsized} />
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
    alignItems: 'center',
  },
  button: {
    marginLeft: 5,
    padding: 2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#fff8',
  },
});

export default ActionMenu;
