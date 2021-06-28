import {useRequest} from 'ahooks';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Text,
  Image,
  FlatList,
  ListRenderItem,
} from 'react-native';
import * as querystring from 'query-string';
import debounce from 'debounce';

import {Colors} from 'react-native/Libraries/NewAppScreen';

interface GifImage {
  size: string;
  url: string;
}

interface Gif {
  title: string;
  id: string;
  images: {
    original: GifImage;
    downsized: GifImage;
    fixed_height_small: GifImage;
  };
}

interface SearchResult {
  data: Gif[];
}

const GIPHY_KEY = 'lBkWp4xWgwegUbSnnms1bsvPMX0zoT2i'; // some dummy account, ok to include in git

const GifView: React.FC<{gif: Gif}> = ({gif}) => {
  return (
    <View>
      <Text style={[styles.text, styles.imageText]} numberOfLines={1}>
        {gif.title || gif.id}
      </Text>
      <Image
        style={styles.image}
        height={200}
        width={267}
        source={{uri: gif.images.fixed_height_small.url}}
      />
    </View>
  );
};

const App: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  const {data, run, loading} = useRequest<SearchResult>(
    (query: string) => ({
      url: querystring.stringifyUrl({
        url: 'https://api.giphy.com/v1/gifs/search',
        query: {q: query, api_key: GIPHY_KEY},
      }),
    }),
    {manual: true},
  );

  const debouncedSearch = useMemo(() => debounce(run, 200), [run]);

  useEffect(() => {
    if (searchText) {
      debouncedSearch(searchText);
    }
  }, [debouncedSearch, searchText]);

  const renderItem: ListRenderItem<Gif> = useCallback(
    ({item}) => <GifView gif={item} />,
    [],
  );

  return (
    <>
      <SafeAreaView style={styles.body}>
        <TextInput
          style={styles.input}
          onChangeText={setSearchText}
          value={searchText}
        />
        {loading && <Text style={styles.text}>Loading</Text>}

        <FlatList<Gif>
          style={styles.list}
          data={data?.data || []}
          renderItem={renderItem}
          keyExtractor={(item: Gif) => item.id}
          numColumns={3}
        />
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    color: Colors.black,
    flex: 1,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    color: 'black',
  },
  text: {
    color: Colors.black,
  },
  imageText: {
    width: 266,
  },
  image: {
    width: 266,
    height: 200,
  },
  list: {
    marginLeft: 15,
  },
});

export default App;
