import {useRequest} from 'ahooks';
import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  Text,
  FlatList,
  ListRenderItem,
} from 'react-native';
import * as querystring from 'query-string';
import debounce from 'debounce';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import GifView from './GifView';
import {Gif, SearchResult} from './types';

const GIPHY_KEY = 'lBkWp4xWgwegUbSnnms1bsvPMX0zoT2i'; // some dummy account, ok to include in git

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
          numColumns={4}
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
    margin: 8,
    borderWidth: 1,
    color: 'black',
  },
  text: {
    color: Colors.black,
  },
  list: {},
});

export default App;
