import {useRequest} from 'ahooks';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  ListRenderItem,
  NativeSyntheticEvent,
  NativeScrollEvent,
  View,
} from 'react-native';
import * as querystring from 'query-string';
import debounce from 'debounce';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import GifView from './GifView';
import {Gif, SearchResult} from './types';
import {ToastProvider} from 'react-native-rooster';

const GIPHY_KEY = 'lBkWp4xWgwegUbSnnms1bsvPMX0zoT2i'; // some dummy account, ok to include in git

const App: React.FC = () => {
  const [searchText, setSearchText] = useState('');
  const [offset, setOffset] = useState(0);

  const [images, setImages] = useState<ReadonlyArray<Gif>>([]);

  const {data, run, loading} = useRequest<SearchResult>(
    (query: string, _offset: number) => ({
      url: querystring.stringifyUrl({
        url: 'https://api.giphy.com/v1/gifs/search',
        query: {q: query, api_key: GIPHY_KEY, offset: _offset},
      }),
    }),
    {manual: true},
  );

  const debouncedSearch = useMemo(() => debounce(run, 200), [run]);

  useEffect(() => {
    if (searchText.trim()) {
      setImages([]);
      debouncedSearch(searchText, 0);
    }
  }, [debouncedSearch, searchText]);

  useEffect(() => {
    if (data?.data) {
      setImages((_images) => {
        // avoid duplication by checking the last item
        if (
          _images.length > 0 &&
          data.data.length > 0 &&
          _images[_images.length - 1].id === data.data[data.data.length - 1].id
        ) {
          return _images;
        }
        return [..._images, ...data?.data];
      });
      setOffset(data.pagination.offset + data.pagination.count);
    }
  }, [data]);

  const renderItem: ListRenderItem<Gif> = useCallback(
    ({item}) => <GifView gif={item} />,
    [],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const {layoutMeasurement, contentOffset, contentSize} = event.nativeEvent;
      if (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - 20
      ) {
        debouncedSearch(searchText, offset);
      }
    },
    [debouncedSearch, offset, searchText],
  );

  return (
    <ToastProvider>
      <SafeAreaView style={styles.body}>
        <TextInput
          style={styles.input}
          onChangeText={setSearchText}
          value={searchText}
        />
        {loading && <Text style={styles.loading}>loading...</Text>}

        {searchText.trim() ? (
          <FlatList<Gif>
            style={styles.list}
            data={images}
            renderItem={renderItem}
            keyExtractor={(item: Gif) => item.id}
            numColumns={4}
            onScroll={handleScroll}
            scrollEventThrottle={500}
            removeClippedSubviews
            windowSize={7}
          />
        ) : (
          <View style={styles.typeToSearchTextContainer}>
            <Text style={styles.typeToSearchText}>Type to search</Text>
          </View>
        )}
      </SafeAreaView>
    </ToastProvider>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: Colors.white,
    color: Colors.black,
    flex: 1,
  },
  input: {
    margin: 8,
    borderWidth: 1,
    color: 'black',
  },
  text: {
    color: Colors.black,
  },
  loading: {
    position: 'absolute',
    right: 10,
    top: 10,
    color: Colors.black,
  },
  typeToSearchTextContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  typeToSearchText: {
    fontSize: 100,
    fontWeight: '100',
    color: '#0004',
  },
  list: {},
});

export default App;
