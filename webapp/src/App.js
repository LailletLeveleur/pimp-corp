import './App.css';
import Mint from "./Mint/Mint";
import PimpList from "./PimpList/PimpList";
import { useEffect, useState } from "react";
// import Carousel from './Carousel/Carousel';
import { getUserNFTList } from './Interactions/ContractInteractions.js'
import {
  FlatList,
  View,
  Dimensions,
  Text,
  StyleSheet,
  Image,
  Button
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
      position: "absolute",
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


  return (
    <div className="App">
      <div class="grid-container">
        <div class="grid-item">
          <div><h3>MINTABLEs</h3></div>
          <div>
            <h1>{count}</h1>
            <Mint setUserNFTs={setUserNFTs} setCount={setCount} />
          </div>
        </div>
        <div class="grid-item">
          UPDATE COUNT: {count}
        </div>
        <div class="grid-item">
          SELECTED CHARACTERS:
          <table>
            <caption>Selected character</caption>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">HP</th>
              <th scope="col">Max HP</th>
            </tr>
            {selectedCharacterList.map((i) => {
              console.log(i);
              const item = userNFTs[i];
              return (
                <tr>
                  <th scope="row">{item.name}</th>
                  <td>{item.hp}</td>
                  <td>{item.maxHp}</td>
                </tr>
              )
            })}
          </table>

        </div>
        <div class="grid-item">
          <div><h3>USER OWNED</h3></div>
          <div>
            {/* <View style={{ backgroundColor: "blue", flex: 0.3 }}> */}
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
            {/* </View> */}

          </div >

        </div>
      </div>
    </div>
  );
}

export default App