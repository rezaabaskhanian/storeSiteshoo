import React from 'react';
import {View, ImageBackground, StyleSheet,Alert, Text,BackHandler,Image, TouchableOpacity, AsyncStorage} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import Category from "./category/category";
import Product from "./product/Product";
import {ScrollView} from 'react-native-gesture-handler';
import {Item, Input, Icon} from 'native-base';
import Axios from "axios";

export default function Landing(props) {
    const [categories, setCategories] = React.useState([]);
    const [offers, setOffers] = React.useState([]);
    const [sells, setSells] = React.useState([]);
    const [data, setData] = React.useState(false);

    React.useEffect(() => {
        AsyncStorage.getItem('token').then(token => {
            if (token) {
                setData(true)
            }
        });
        Axios.get('categories').then(res => {
            if (res && res.data) {
                setCategories(res.data)
            }
        });
        Axios.get('landing/most-offers').then(res => {
            if (res && res.data) {
                setOffers(res.data.most_offers)
            }
        });
        Axios.get('landing/most-sells').then(res => {
            if (res && res.data) {
                setSells(res.data.most_offers)
            }
        });
        getPrams()
    }, []);

   
    // React.useEffect(() => {
    //     const backAction = () => {
    //         Alert.alert("Hold on!", "آیا از بستن برنامه مطمین هستید؟", [
    //             {
    //                 text: "خیر",
    //                 onPress: () => null,
    //                 style: "cancel"
    //             },
    //             { text: "بله", onPress: () => BackHandler.exitApp() }
    //         ]);
    //         return true;
    //     };
    //
    //     const backHandler = BackHandler.addEventListener(
    //         "hardwareBackPress",
    //         backAction
    //     );
    //
    //     return () => backHandler.remove();
    // }, []);
    return (
        <View>
            <ScrollView>

                <ImageBackground source={require('../../assest/headerBack.png')} style={styles.image}>
                    <View style={styles.search}>
                        <TouchableOpacity onPress={() => {
                            if(data){
                                props.navigation.navigate('Tab')
                            }else{
                                props.navigation.navigate('Auth')
                            }
                        }}>
                            <Icon type={'FontAwesome5'} name='user-circle' style={{zIndex: 6, color: 'white'}}/>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.site}>
                        <Image source = {require('../../assest/logo.png')} style = {{width: '90%', height: '40%'}} resizeMode = 'contain'/>
                        <Text style={{fontSize: wp('7'),color: '#fff',fontFamily: 'IRANYekanRegular'}}>
                            ورامال یه خرید باحال
                        </Text>
                    </View>
                </ImageBackground>

                {/*<Category navigation={props.navigation} data={categories}/>*/}
                {categories.length>0?<Category token={data} navigation={props.navigation} data={categories}/>:null}
                {offers.length>0?<Product token={data} navigation={props.navigation} title={'بیشترین تخفیف ها'} data={offers}/>:null}
                {sells.length>0?<Product token={data} navigation={props.navigation} title={'پر فروش ترین ها'} data={sells}/>:null}

            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column"
    },
    image: {
        resizeMode: "cover",
        height: hp('35%'),
        width: wp('100%'),
        position: 'relative',
        top: -50,
    },
    text: {
        color: "grey",
        fontSize: 30,
        fontWeight: "bold"
    },
    search: {
        paddingTop: hp('11%'),
        paddingRight: wp('5%'),
        paddingLeft: wp('5%'),
        alignItems: 'flex-end'
    },
    site:{
        justifyContent:'center',
        alignItems: 'center',
    }
});
