import React from "react";
import {
    FlatList,
    View,
    Dimensions,
    Text,
    StyleSheet,
    Image,
    Button,
    VirtualizedList,
    SafeAreaView
} from "react-native";

const MintableCharacter = ({ name, hp, maxHp, imageURI, characterIndex, id, onMintPressed }) => (

        <View style={styles.container}>
            <View style={styles.top} >
                <Text>name {name}</Text>
            </View>
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
            <View style={styles.bottom} >
                <Button onPress={() => onMintPressed(() => characterIndex.toNumber())} title="Mint" />
            </View>
        </View>
);


const MintableCharacters = ({ list, onMintPressed }) => {
    return (
        list.map(function (item, index) {
            return <MintableCharacter name={item.name} hp={item.hp} maxHp={item.maxHp} imageURI={item.imageURI} characterIndex={item.characterIndex} id={item.id} onMintPressed={onMintPressed} />
        })
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "space-between",
        backgroundColor: "#fff",
        padding: 20,
        margin: 10,
    },
    top: {
        flex: 0.3,
        backgroundColor: "grey",
        borderWidth: 5,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    middle: {
        flex: 0.3,
        backgroundColor: "beige",
        borderWidth: 5,
    },
    bottom: {
        flex: 0.3,
        backgroundColor: "pink",
        borderWidth: 5,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
});

export default MintableCharacters;