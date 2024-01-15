import React from 'react';
import {View, StyleSheet, Text, TouchableWithoutFeedback} from 'react-native'
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {config} from "../../../App";
import FastImage from "react-native-fast-image";

export default function ProductItem(props) {
    return (
        <TouchableWithoutFeedback
            onPress={() => {
                if (props.token && props.token === true) {
                    props.navigation.navigate('ProductProfile', {
                        item: {...props.data, ID: props.data.PRODUCT_STORE_ID},
                        Route: [props.data.STORE_NAME]
                    })
                } else {
                    props.navigation.navigate('Auth')
                }
            }
            }>
            <View style={styles.main}>
                <View style={styles.item}>
                    {+props.data.OFFER_VALUE > 0 ? <View style={styles.offTag}>
                        <Text style={[{color: '#fff'}, styles.text]}>{props.data.OFFER_PERCENTAGE} ٪</Text>
                    </View> : null}

                    <FastImage
                        source={{uri: config.BaseUrl + '/assets/img/products/' + props.data.IMAGE_ADDRESS}}
                        resizeMode="contain"
                        style={{width: '100%', height: 115, borderRadius: 7, marginTop: 5}}
                    />

                    <View style={styles.details}>
                        <Text style={styles.name}>
                            {props.data.NAME}
                        </Text>
                        {/*<Button style={styles.add}>*/}
                        {/*    <Text style={{color:'#fff',fontSize:hp('1.5%')}}>*/}
                        {/*        افزودن به سبد*/}
                        {/*    </Text>*/}
                        {/*</Button>*/}
                    </View>

                    <View style={styles.details}>
                        {+props.data.OFFER_VALUE > 0 ? <View>
                            <Text style={[styles.prePrice, styles.text]}>
                                {props.data.PRICE} تومان
                            </Text>

                            <Text style={styles.text}>
                                {props.data.PRICE_AFTER_OFFER} تومان
                            </Text>
                        </View> : <Text style={styles.text}>
                            {props.data.PRICE} تومان
                        </Text>}

                    </View>

                    <View>

                    </View>
                </View>

            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    main: {
        alignItems: 'center',
        marginLeft: wp('3%'),
        marginBottom: hp('4%')
    },

    item: {
        elevation: 8,
        width: wp('40%'),
        height: hp('27%'),
        backgroundColor: '#fff',
        borderRadius: wp('4%'),
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative'
    },
    img: {
        width: wp('25%'),
        resizeMode: 'contain'
    }, img1: {
        marginTop: hp('5%'),
        width: wp('25%'),
        height: '100%'
    },
    offTag: {
        position: 'absolute',
        backgroundColor: '#53b63e',
        borderTopLeftRadius: wp('4%'),
        borderBottomRightRadius: wp('4%'),
        left: 0,
        top: 0,
        zIndex: 10,
        paddingLeft: wp('3%'),
        paddingRight: wp('3%'),
        paddingTop: hp('0.5%'),
        paddingBottom: hp('0.5%')
    },
    details: {
        alignItems: 'flex-end',
        justifyContent: 'space-between',

        flexDirection: 'row-reverse',
        width: wp('40%'),
        paddingRight: wp('2%'),
        paddingLeft: wp('2%'),
        marginBottom: hp('2%')
    },
    text: {
        fontFamily: 'IRANYekanRegular',
    },
    name: {
        fontFamily: 'IRANYekanRegular',
        fontSize: 11
    },
    add: {
        backgroundColor: 'rgba(55,205,150,0.61)',
        height: hp('3%'),
        paddingLeft: wp('2%'),
        paddingRight: wp('2%'),
    },
    prePrice: {
        textDecorationLine: 'line-through',
        fontSize: hp('2%')
    }
});
