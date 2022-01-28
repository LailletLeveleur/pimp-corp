import './App.css';
import Mint from "./Mint/Mint";
import PimpList from "./PimpList/PimpList";
import { useEffect, useState } from "react";
import { getUserNFTList } from './Interactions/ContractInteractions.js'
import {
  FlatList,
  View,
  Dimensions,
  Text,
  StyleSheet,
  Image,
  Button,
  ImageBackground
} from "react-native";
import { userNFTsWithIndex } from './Interactions/Constant.js';



function App() {
  const [userNFTs, setUserNFTs] = useState([]);
  const [count, setCount] = useState(true);
  const [selectedCharacterList, updateSelectedCharacterList] = useState([]);

  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const styles = StyleSheet.create({
    slide: {
      height: windowHeight,
      width: windowWidth,
      justifyContent: "center",
      alignItems: "center",
    },
    slideImage: { width: windowWidth * 0.1, height: windowHeight * 0.1 },
    slideTitle: { fontSize: 24 },
    slideSubtitle: { fontSize: 18 },

    pagination: {
      position: "relative",
      bottom: 8,
      width: "100%",
      justifyContent: "bottom",
      flexDirection: "row",
    },
    paginationDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginHorizontal: 2,
    },
    paginationDotActive: { backgroundColor: "lightblue" },
    paginationDotInactive: { backgroundColor: "gray" },

    carousel: { flex: 1 },
  });

  useEffect(() => setCount(currentCount => currentCount + 1), []);

  useEffect(async () => {
    console.log("App.effect => before ", userNFTs);
    const response = await getUserNFTList();
    const listWithIndex = userNFTsWithIndex(response.userNFTList)
    setUserNFTs(listWithIndex);
    console.log("App.effect => after ", userNFTs);
    setCount(currentCount => currentCount + 1);
  }, [])


  const onSelectCharacter = (key) => {
    console.log('update selected w/ ', key);
    updateSelectedCharacterList(arr => [...arr, key]);
    console.log(selectedCharacterList);
    setCount(currentCount => currentCount + 1);
  }

  const backgroundImageSource = "http://img.over-blog-kiwi.com/1/18/22/61/20141011/ob_bab9dd_sin-city-a-dame-to-kill-for-marv-poste.jpg";

  return (
    <ImageBackground source={backgroundImageSource} style={styles.image}>
      {/* <Text style={styles.text}>Child content</Text> */}
      
      <View style={styles.middle} >
                <Image source={{
                    uri: "webapp\public\dodolasaumur.gif"
                }}
                style={
                    {
                        width: 50,
                        height: 50,
                      }
                }
                ></Image>
            </View>
      <View>
        <Mint setUserNFTs={setUserNFTs} setCount={setCount} />
      </View>
      <View>
        <FlatList
          data={userNFTs}
          // data={slideList}
          style={styles.carousel}
          renderItem={({ item }) =>
            <View style={styles.slide}>
              <Image source={{ uri: item.imageURI }} style={styles.slideImage}></Image>
              <Text style={styles.slideTitle}>{item.name}</Text>
              <Text style={styles.slideSubtitle}>{item.hp}</Text>
              <button id={item.key} className="character-mint-button" onClick={() => onSelectCharacter(item.key)}>Select for Fight</ button>
            </View>}
          pagingEnabled
          horizontal
          keyExtractor={(item) => item.key}
          showsHorizontalScrollIndicator={false}
          bounces={true}
        />
      </View>
    </ImageBackground>
  )
}

export default App