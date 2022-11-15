import { useEffect, useState } from "react";
import { FlatList, ScrollView, TouchableOpacity, Dimensions, StyleSheet, ActivityIndicator } from "react-native";
import { View, Text, Button, Image, Center } from "native-base";
import VerticalCard from "../components/VerticalCard";
import HorizontalCard from "../components/HorizontalCard";
import Header from "../components/Header";

import axios from "axios";

const Home = (props) => {

    const [currentButton, setCurrentButton] = useState([true, false, false, false, false]);
    const [searchQuery, setSearchQuery] = useState("");
    const [refresh, setRefresh] = useState(true);
    const [allNews, setAllNews] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleCurrentButton = (index) => {

        var temp = [false, false, false, false, false];
        temp[index] = true;
        setCurrentButton(temp);

    };

    const handleQuerySearch = (query) => {
        setSearchQuery(query);
        console.log("QUERY =>", query)
        getAllNews();
    }

    const getAllNews = () => {

        const url = `https://newsapi.org/v2/everything?q=${searchQuery}&sortBy=publishedAt&apiKey=cb6796f66c304b3085737fa8df014f5f`;
        setLoading(true);

        axios.get(url).then((res) => {
                res = res.data.articles;
                // res = res.articles;
                console.log(res);
                setAllNews(res);
                setLoading(false);
            }).catch(error  => {
                console.log(error);
            })
        
        setRefresh(!refresh);

    }

    useEffect(() => {
        getAllNews();
    }, [])


    const arr = [{ "name": "All", "b": 2 }, { "name": "Android", "b": 2 }, { "name": "Cricket", "b": 2 }, { "name": "Iphone", "b": 2 }, { "name": "Google", "b": 2 }]


    return (
        <>
            {loading ? (
                <View flex={1} justifyContent="center" >
                    <ActivityIndicator size="large" color="tomato" />
                    <Text color="tomato" alignSelf="center" >Loading...</Text>
                </View>
            ) : (
                <>
                    <Header />
                    <ScrollView flex={1} zIndex={1} >

                        <VerticalCard data={allNews} query={handleQuerySearch} />

                        <Text fontSize="20px" fontWeight="500" marginLeft={2} marginTop="2%" >Top Stories for you</Text>

                        <View marginTop="5%" ></View>

                        <View style={{ width: "100%" }}>
                            <FlatList
                                data={arr}
                                keyExtractor={item => item.id}
                                renderItem={({ item, index }) => (
                                    <>
                                        {currentButton[index] ? (
                                            <TouchableOpacity style={{ height: 30, justifyContent: "center", borderRadius: 10, backgroundColor: "#E56584", marginHorizontal: 4 }} >
                                                <Text alignSelf="center" color="white" fontSize="15px" fontWeight="400" px={8}>{item.name}</Text>
                                            </TouchableOpacity>
                                        ) : (
                                            <TouchableOpacity
                                                onPress={() => { handleCurrentButton(index); setSearchQuery(item.name); getAllNews(); }}
                                                style={{ height: 30, justifyContent: "center", borderRadius: 10, backgroundColor: "white", marginHorizontal: 4 }} >
                                                <Text alignSelf="center" color="black" fontSize="15px" fontWeight="400" px={8}>{item.name}</Text>
                                            </TouchableOpacity>
                                        )}

                                    </>


                                )}
                                extraData={refresh}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            />
                        </View>

                        <View marginTop="5%" ></View>

                        <HorizontalCard data={allNews} />

                        <View marginTop="15%" ></View>

                    </ScrollView>

                    <TouchableOpacity
                        onPress={() => { props.navigation.navigate("DetailsScreen", { data: arr }) }}
                        style={styles.buttonStyle} >
                        <Center>
                            <Image source={require("../assets/images/earthSearch.png")} width="20px" height="20px" alt="Image" />
                        </Center>
                        <Center>
                            <Text style={styles.buttonTextStyle} >Explore</Text>
                        </Center>
                    </TouchableOpacity>
                </>
            )
            }

        </>
    );
};



export default Home;

const styles = StyleSheet.create({
    buttonStyle: {
        backgroundColor: '#fc454e',
        width: 140,
        height: 49,
        borderRadius: 150,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: "center",
        position: 'absolute',
        bottom: 40,
        elevation: 2,
        zIndex: 2,
        flexDirection: "row",
    },
    buttonTextStyle: {
        color: 'white',
        fontSize: 18,
        fontWeight: "700",
        marginLeft: 6
    }
})
