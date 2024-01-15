import React, { Component, useEffect, useState } from 'react'
import { View, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, AsyncStorage, Image } from 'react-native'
import { Text, Toast } from 'native-base'
import StyleSheet from 'react-native-extended-stylesheet'
import Axios from 'axios'
import { config } from '../../../../App'
import Material from 'react-native-vector-icons/MaterialIcons'
import { state as store, on, Beep } from 'react-beep'
import FastImage from 'react-native-fast-image'
import { NavigationEvents } from 'react-navigation'

import { BeepProp } from '../../../../store/BeepProp'

import NotiTabbarIcon from './NotiTabbarIcon'
import {Colors} from '../../../../styles/index'


export default function ProductItem(props) {

    const [showImage,setShowImage]=useState(false)
  
    const item = props.item;
    const stepCount = item.PRODUCT_UNIT_ID === 1 ? 0.5 : 1;
    let hasOff = item.PRICE_AFTER_OFFER ? item.PRICE_AFTER_OFFER !== item.PRICE : false;
    let before = item.PRICE ? item.PRICE : item.SYSTEM_PRICE;
    let after = item.PRICE_AFTER_OFFER;
    handleError = () => (
       setShowImage(true)
      );

    return (
        <TouchableWithoutFeedback
            onPress={() => {
                if (props.routeName === 'landing') {
                    item.ID = item.PRODUCT_STORE_ID
                    props.navigation.navigate('ProductProfile', {
                        item
                    })
                } else if (props.routeName === 'store') {
                    props.navigation.navigate('ProductProfile', {
                        item
                    })
                } else {
                    props.navigation.push('ProductProfile', {
                        item,
                        Route: props.routes
                    })
                }
            }}
        >
            <View style={styles.viwhCard} >
                {hasOff ? (
                    <View style={{ position: 'absolute', right: 0, zIndex: 1000 }}>
                        <View
                            style={[
                                styles.triangle,
                                { position: 'absolute', top: 0, right: 0 }
                            ]}
                        />
                        <Text
                            style={{
                                ...styles.TextRegular,
                                color: 'white',
                                fontSize: 12,
                                position: 'absolute',
                                right: 2,
                                top: 2
                            }}
                        >
                            {props.mode === 'landing' ? item.OFFER_PERCENTAGE : (((item.PRICE - item.PRICE_AFTER_OFFER) / item.PRICE) * 100).toFixed(0)}
                            %
                        </Text>
                    </View>

                ) : null}
                <View>
                    {
                        item.IMAGE == null ?
                            <Image source={require('../../../../assest/productNew.png')} style={{ width: '100%', height: 90, borderRadius: 7, marginTop: 5 }}
                                resizeMode='contain' />
                            :
                            <FastImage
                                // source={{ uri: config.BaseUrl + config.ProductSubUrl + item.IMAGE }}
                                source={showImage? require('../../../../assest/productNew.png'): { uri: config.ImageBaseUrlProduct + item.IMAGE }}
                                onError={handleError}
                                resizeMode="contain"
                                style={{ width: '100%', height: 90, borderRadius: 7, marginTop: 5 }}
                            />
                    }


                    <Text
                        numberOfLines={2}
                        style={{
                            ...styles.TextBold,
                            paddingHorizontal: 5,
                            fontSize: 13
                        }}
                    >
                        {props.item.NAME}
                    </Text>

                </View>
                {hasOff ? (
                    <View style={styles.viwHasOff}  >
                        <Text
                            style={{
                                ...styles.TextRegular,
                                paddingHorizontal: 5,
                                fontSize: 12,
                                textDecorationStyle: 'dotted',
                                textDecorationLine: 'line-through'
                            }}
                        >
                            {config.priceFix(before)}
                        </Text>
                        {/*<View style={{width: 10}}/>*/}

                        <Text
                            style={{
                                ...styles.TextRegular,
                                paddingHorizontal: 5,
                                fontSize: 14,
                                color: 'red'
                            }}
                        >
                            {config.priceFix(after)} تومان
                            {/* {config.priceFix(after)} $ */}
                        </Text>
                    </View>
                ) : (
                    <Text
                        style={{
                             ...styles.TextRegular,
                            paddingHorizontal: 5,
                            fontSize: 12
                        }}
                    >
                        {/* {config.priceFix(before)} تومان */}
                       {/* {config.priceFix(before)} $ */}
                        {config.priceFix(before) ==1  ?  'تماس بگیرید' : `${config.priceFix(before)} تومان` }
                    </Text>
                )}
               
               {config.priceFix(before) ==1  ?  null : < NotiTabbarIcon item={item}/>  }
                
               

               
            </View>
        </TouchableWithoutFeedback>
    )
}

const styles = StyleSheet.create({
    viwhCard:{
        height: 190,
        width: 140,
        backgroundColor: 'white',
        margin: 5,
        overflow: 'hidden',
        borderRadius: 7,
        elevation: 1,
        justifyContent: 'space-between',
        zIndex: 1
    },
    viwHasOff:{
        
            flexDirection: 'row-reverse',
            flexWrap: 'wrap',
            alignItems: 'center',
            marginBottom: 5,
            justifyContent: 'space-between'
        
    },
    TextBold: {
        fontFamily: '$IRANYekanBold',
        fontWeight: '$WeightBold'
    },
    TextRegular: {
        fontFamily: 'IRANYekanRegular',
        fontWeight: '$WeightRegular',
        fontSize: 13
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        elevation: 2
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 40,
        borderTopWidth: 40,
        borderLeftColor: 'transparent',
        borderTopColor: 'purple',
        transform: [{ rotate: '0deg' }]
    },
    storeName: {
        fontFamily: 'IRANYekanRegular',
        fontWeight: '$WeightRegular',
        fontSize: 13,
        marginRight: 6
    }
})
