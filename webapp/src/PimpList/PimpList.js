import './PimpList.css';
// import { useEffect, useState } from "react";
// import Carousel from './Carousel/Carousel';
// import { getUserNFTList } from './Interactions/ContractInteractions.js'
import {
  FlatList,
  View,
  Dimensions,
  Text,
  StyleSheet,
  Image,
  Button
} from "react-native";

const PimpList = ({ userNFTs }) => {

    /**
     * <div className=''>
            {userNFTs && userNFTs.map((character) => {
                <div className="character-item" key={character.name}>
                    <div className="name-container">
                        <p>{character.name}</p>
                        <p>{character.charisma}</p>
                        <p>{character.streetCred}</p>
                    </div>
                    <img src={character.imageURI} alt={character.name} />
                </div>
            }
            )
            }
        </div>
     */
    
  const { width: windowWidth, height: windowHeight } = Dimensions.get("window");
  const styles = StyleSheet.create({
    slide: {
        height: windowHeight,
        width: windowWidth,
        justifyContent: "center",
        alignItems: "center",
    },
    slideImage: { width: windowWidth * 0.4, height: windowHeight * 0.3 },
    slideTitle: { fontSize: 24 },
    slideSubtitle: { fontSize: 18 },

    pagination: {
        position: "absolute",
        bottom: 8,
        width: "100%",
        justifyContent: "center",
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

    return (
        <FlatList
            data={userNFTs}
            // data={slideList}
            style={styles.carousel}
            renderItem={({ item }) =>
                <View style={styles.slide}>
                    <Image source={{ uri: item.imageURI }} style={styles.slideImage}></Image>
                    <Text style={styles.slideTitle}>{item.name}</Text>
                    <Text style={styles.slideSubtitle}>{item.hp}</Text>
                    <Button
                        onPress={() => alert('You pressed something !!')}
                        title="Learn More"
                        color="#841584"
                        accessibilityLabel="Learn more about this purple button"
                    />
                </View>}
            pagingEnabled
            horizontal
            showsHorizontalScrollIndicator={false}
            bounces={true}
        />

    )

}

export default PimpList;