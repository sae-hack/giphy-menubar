import React, {useState} from 'react';
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity as _TouchableOpacity,
  View,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import ActionMenu from './ActionMenu';
import {Gif} from './types';

// react-native-macos' TouchableOpacity does not have
// onMouseEnter in its type definition, converting to any to supress the error.
const TouchableOpacity = _TouchableOpacity as any;

const GifView: React.FC<{gif: Gif}> = ({gif}) => {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <View style={styles.gifView}>
      <TouchableOpacity
        onMouseEnter={() => setShowMenu(true)}
        onMouseLeave={() => setShowMenu(false)}>
        <Image
          style={styles.image}
          height={150}
          source={{uri: gif.images.fixed_height_small.url}}
        />
      </TouchableOpacity>
      <Text style={[styles.text, styles.imageText]} numberOfLines={1}>
        {gif.title || gif.id}
      </Text>
      {showMenu && <ActionMenu gif={gif} />}
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
