import {useRequest} from 'ahooks';
import React, {useEffect, useMemo, useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TextInput,
  Text,
} from 'react-native';
import * as querystring from 'query-string';
import debounce from 'debounce';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const GIPHY_KEY = 'lBkWp4xWgwegUbSnnms1bsvPMX0zoT2i'; // some dummy account, ok to include in git

const App: React.FC = () => {
  const [searchText, setSearchText] = useState('');

  const {data, run, loading} = useRequest(
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

  return (
    <>
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <TextInput
            style={styles.input}
            onChangeText={setSearchText}
            value={searchText}
          />
          <View style={styles.body}>
            {loading && <Text style={styles.text}>Loading</Text>}

            <Text style={styles.text}>
              {searchText && data
                ? JSON.stringify(data)
                : 'Please input some query'}
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
    color: Colors.black,
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
});

export default App;
