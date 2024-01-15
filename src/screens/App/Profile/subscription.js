import * as React from 'react';
import {
    Text, View, StyleSheet, FlatList, SafeAreaView, Image, ScrollView,ImageBackground
} from 'react-native';
import {heightPercentageToDP as hp, widthPercentageToDP as wp} from "react-native-responsive-screen";
import {Container, Header, Content, Accordion, List, ListItem, Left, Right, Icon} from "native-base";
import {LineChart, XAxis, Grid} from 'react-native-svg-charts'

import Navigator from "./Navigator";

export default function Subscription() {
    return (
        <>


            <View style={styles.wrapHomeBox2}>
                <ImageBackground source={require('../assets/bagPrice.png')} style={styles.image}>
                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                        <View style={{marginLeft:wp('16%')}}>
                            <Image source={require('../assets/img/homeBox.png')} style={styles.homeBoxImage}/>

                            <Text style={styles.homeBoxName}>
                                هوم باکس زرد
                            </Text>
                        </View>
                        <View style={{paddingTop:hp('3%'),marginRight: wp('6%')}}>
                            <Text style={styles.off}>
                                ۱۹۰۰۰۰  تومان
                            </Text>

                            <Text style={styles.afterOff}>
                                ۲۰۰۰۰۰ تومان
                            </Text>

                            <Text style={styles.count}>
                                ۲۰ ٪ تخفیف
                            </Text>
                        </View>
                    </View>
                </ImageBackground>

                <View style={{flexDirection: 'row', marginTop: hp('3%'), justifyContent: 'center'}}>
                    <Icon name={'cart-plus'} type={'FontAwesome5'}
                          style={{fontSize: wp('7%'), color: '#24DE9D'}}/>
                    <Icon name={'clipboard-list'} type={'FontAwesome5'}
                          style={{fontSize: wp('7%'), marginLeft: wp('4%'), color: '#24DE9D'}}/>
                </View>

                <View style={{flexDirection: 'row', marginTop: hp('2%'), marginRight: wp('3%'), marginLeft: wp('3%')}}>
                    <View style={styles.eachProduct}>
                        <Text>
                            ۲ عدد ماکاورنی
                        </Text>
                    </View>

                    <View style={styles.eachProduct}>
                        <Text>
                            ۲ عدد ماکاورنی
                        </Text>
                    </View>

                    <View style={styles.eachProduct}>
                        <Text>
                            ۲ عدد ماکاورنی
                        </Text>
                    </View>


                </View>

            </View>
        </>
    )
}

const styles = StyleSheet.create({
    wrapHomeBox: {
        elevation: 8,
        backgroundColor: '#fff',
        height: hp('40%'),
        width: wp('90%'),
        borderRadius: wp('5%'),
        alignSelf: 'center',
        marginTop: hp('2%'),
        // padding:wp('3%'),
        // flexDirection:'row',
        // justifyContent:'space-between'
    },
    homeBoxImage: {
        width: wp('24%'),
        height: hp('17%'),
        resizeMode: 'contain',
    },
    homeBoxName: {
        fontSize: wp('3.5%'),
        fontWeight: 'bold',
        textAlign: 'center',
        marginTop:hp('-1%'),
        color: '#fff'
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 70,
        borderTopWidth: 70,
        borderLeftColor: 'transparent',
        borderTopColor: 'purple',
        borderTopRightRadius: wp('5%'),
        transform: [{rotate: '0deg'}],
        position: 'absolute',
        right: wp('0%'),
        top: wp('0%')
    },
    afterOff: {
        fontSize: wp('4.5%'),
        textDecorationLine: "line-through",
        textDecorationStyle: "solid",
        textDecorationColor: "red",
        color: '#fff',
    },
    off: {
        fontSize: wp('6%'),
        fontWeight: 'bold',
        color: '#fff',

    },
    count:{
        color: '#fff',
        marginTop:hp('2%')
    },
    eachProduct: {
        backgroundColor: 'rgba(182,182,182,0.15)',
        borderStyle: 'dashed',
        borderColor: '#686868',
        borderWidth: 2,
        padding: wp('2%'),
        borderRadius: wp('3%'),
        marginRight: wp('2%')
    },
    wrapHomeBox2:{
        // elevation: 8,
        // backgroundColor: '#fff',
        // height: hp('40%'),
        // width: wp('90%'),
        // borderRadius: wp('5%'),
        alignSelf: 'center',
        marginTop: hp('2%'),
        borderBottomColor:'gray',
        borderBottomWidth:1,
        paddingBottom:hp('2%'),
        marginBottom:hp('2%')
    },
    image:{
        width:wp('90%'),
        height:hp('20%'),
        resizeMode: 'contain'
    }
});
