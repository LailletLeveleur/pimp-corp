import React, { useCallback, memo, useRef, useState, useEffect } from "react";
import {
    FlatList,
    View,
    Dimensions,
    Text,
    StyleSheet,
    Image,
} from "react-native";
import { getUserNFTList } from "../Interactions/ContractInteractions";





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

// const slideList = Array.from({ length: 30 }).map((_, i) => { // inject data here
//   return {
//     id: i,
//     image: `https://picsum.photos/1440/2842?random=${i}`,
//     title: `This is the title ${i + 1}!`,
//     subtitle: `This is the subtitle ${i + 1}!`,
//   };
// });

const charaterNFTList = async () => {
    console.log("Carousel init");
    const { userNFTList, } = await getUserNFTList();
    console.log("Carousel => ", userNFTList);
    return userNFTList;
}

const Slide = memo(function Slide({ data }) {
    console.log('Slide.data => ', data)
    return (
        <View style={styles.slide}>
            <Image source={{ uri: data.imageURI }} style={styles.slideImage}></Image>
            <Text style={styles.slideTitle}>{data.name}</Text>
            <Text style={styles.slideSubtitle}>{data.hp}</Text>
        </View>
    );
});

function Pagination({ index }) {
    return (
        <View style={styles.pagination} pointerEvents="none">
            {charaterNFTList.map((_, i) => {
                //   {slideList.map((_, i) => {
                return (
                    <View
                        key={i}
                        style={[
                            styles.paginationDot,
                            index === i
                                ? styles.paginationDotActive
                                : styles.paginationDotInactive,
                        ]}
                    />
                );
            })}
        </View>
    );
}

export default function Carousel() {
    const [index, setIndex] = useState(0);
    const indexRef = useRef(index);
    const [listToRender, setListToRender] = useState([]);

    useEffect(async () => {
        const list = await charaterNFTList();
        setListToRender(list);
    }, [])

    indexRef.current = index;
    const onScroll = useCallback((event) => {
        const slideSize = event.nativeEvent.layoutMeasurement.width;
        const index = event.nativeEvent.contentOffset.x / slideSize;
        const roundIndex = Math.round(index);

        const distance = Math.abs(roundIndex - index);

        // Prevent one pixel triggering setIndex in the middle
        // of the transition. With this we have to scroll a bit
        // more to trigger the index change.
        const isNoMansLand = 0.4 < distance;

        if (roundIndex !== indexRef.current && !isNoMansLand) {
            setIndex(roundIndex);
        }
    }, []);

    const flatListOptimizationProps = {
        initialNumToRender: 0,
        maxToRenderPerBatch: 1,
        removeClippedSubviews: true,
        scrollEventThrottle: 16,
        windowSize: 2,
        keyExtractor: useCallback(s => String(s.id), []),
        getItemLayout: useCallback(
            (_, index) => ({
                index,
                length: windowWidth,
                offset: index * windowWidth,
            }),
            []
        ),
    };

    const renderItem = useCallback(function renderItem({ item }) {
        return <Slide data={item} />;
    }, []);

    return (

        <>
            {console.table('listToRender => ', listToRender)}
            <FlatList
                data={listToRender}
                // data={slideList}
                style={styles.carousel}
                renderItem={renderItem}
                pagingEnabled
                horizontal
                showsHorizontalScrollIndicator={false}
                bounces={false}
                // onScroll={onScroll}
                {...flatListOptimizationProps}
            />
            <Pagination index={index}></Pagination>
            <p>DONE !</p>
        </>
    );
}