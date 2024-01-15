import React from 'react'
import {
    View,
    Text,
    TouchableWithoutFeedback,
    Dimensions,
    ScrollView,
    FlatList,
    ActivityIndicator,
    TextInput
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import FastImage from "react-native-fast-image";
import { config } from "../../../App";
import StyleSheet from "react-native-extended-stylesheet";
import { on } from "react-beep";
import moment from "moment-jalaali";
import Material from "react-native-vector-icons/MaterialIcons";
import Axios from "axios";
import { Accordion, Tab, Toast } from "native-base";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {useTranslation} from 'react-i18next';
const { width } = Dimensions.get('window')

export default function ProductItem(props) {
    const {t}=useTranslation()
    const _listEmptyComponent = () => {
        return (
            <View style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <Text style={{ fontFamily: 'IRANYekanRegular', }}> {t('no-product-found')}</Text>
            </View>
        )
    };
    const loading = props.loading;
    const _renderHeader = (item, expanded) => {
        return (
            <View style={{
                flexDirection: 'row-reverse',
                padding: 10,
                justifyContent: 'space-between',
                margin: 2,
                alignItems: 'center',
                backgroundColor: 'rgb(255,197,55)'
            }}>
                <Text style={{ ...styles.TextBold }}>
                    {' '}{props.data[item].storeName}
                </Text>
                {expanded
                    ? <Material style={{ fontSize: 18 }} name="keyboard-arrow-up" />
                    : <Material style={{ fontSize: 18 }} name="keyboard-arrow-down" />}
            </View>
        )
    };

    return (
        <View style={styles.container}>
            {loading ? <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 50 }}>
                <ActivityIndicator size="large" />
            </View> :
                <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
                    {
                        props.data && props.data.products && props.data.products.length > 0 ?
                            <>


                                <FlatList
                                    data={props.data.products}
                                    keyExtractor={(_, index) => 'products' + index}
                                    ListEmptyComponent={_listEmptyComponent}
                                    renderItem={({ item, index }) => (
                                        <TouchableWithoutFeedback
                                            onPress={() => {
                                                if (item.GROUP_PRODUCT_ID) {
                                                    props.navigation.push('HomeBox', { item })
                                                } else {
                                                    console.log(item, 'oooo')
                                                    // props.navigation.navigation.push('HomeBox', { item })
                                                    props.navigation.push('ProductProfile', { item })

                                                }
                                            }}>
                                            <View style={{
                                                height: 100,
                                                width: width - 20,
                                                backgroundColor: 'white',
                                                margin: 5,
                                                borderRadius: 5,
                                                flexDirection: 'row-reverse',
                                                elevation: 1
                                            }}>
                                                {item.OFFER_PERCENTAGE > 0 ? (
                                                    <View
                                                        style={{ position: 'absolute', left: 0, zIndex: 1000 }}
                                                    >
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
                                                            {item.OFFER_PERCENTAGE}
                                                            %
                                                        </Text>
                                                    </View>

                                                ) : null}

                                                <FastImage
                                                    source={item.IMAGE != null ? { uri: config.ImageBaseUrlProduct + item.IMAGE } : require('../../../assest/no_data.png')}
                                                    resizeMode='contain'
                                                    style={{ height: '100%', width: 100 }} />
                                                <View style={{
                                                    justifyContent: 'center',
                                                    flex: 1,
                                                    alignItems: 'flex-end',
                                                    paddingHorizontal: 20
                                                }}>
                                                    <Text style={[styles.TextBold, {
                                                        color: 'black',
                                                        textAlign: 'right',
                                                        fontSize: 12
                                                    }]}>{item.NAME}</Text>
                                                    <Text style={[styles.TextBold, {
                                                        color: 'gray',
                                                        textAlign: 'right',
                                                        fontSize: 12
                                                    }]}>{item.BRAND_NAME}</Text>

                                                </View>
                                                {item.OFFER_PERCENTAGE > 0 ? (
                                                    <View
                                                        style={{
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            padding: 10
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                ...styles.TextRegular,
                                                                paddingHorizontal: 5,
                                                                color: 'gray',
                                                                textAlign: 'center',
                                                                fontSize: 12,
                                                                textDecorationStyle: 'dotted',
                                                                textDecorationLine: 'line-through'
                                                            }}
                                                        >
                                                            {config.priceFix(item.PRICE)} $
                                                        </Text>
                                                        <View style={{ width: 10 }} />

                                                        <Text
                                                            style={{
                                                                ...styles.TextRegular,
                                                                paddingHorizontal: 5,
                                                                fontSize: 12,
                                                                color: 'red'
                                                            }}
                                                        >
                                                            {config.priceFix(item.PRICE_AFTER_OFFER)} $
                                                        </Text>
                                                    </View>
                                                ) : (

                                                        <View style={{
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            padding: 10
                                                        }}>
                                                            <Text style={[styles.TextBold, {
                                                                color: 'gray',
                                                                textAlign: 'center',
                                                                fontSize: 12
                                                            }]}>{config.priceFix(item.PRICE)} $</Text>
                                                        </View>
                                                    )}


                                            </View>
                                        </TouchableWithoutFeedback>

                                    )}
                                />
                            </> :
                            <View style={{
                                width: '100%',
                                height: '100%',
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: 'white',
                                marginTop: 10
                            }}>
                                <FastImage source={require('../../../assest/no_data.png')} resizeMode='contain'
                                    style={{ width, height: 170 }} />
                                <Text style={styles.notFound}> {t('no-product-found')}  </Text>
                            </View>
                    }
                </ScrollView>
            }

        </View>

    )
}
const styles = StyleSheet.create({
    container: {
        flex: 0.7,
        backgroundColor: '$BackgroundColor'
    },
    TextBold: {
        fontFamily: '$IRANYekanBold',
        fontWeight: '$WeightBold'
    },
    TextRegular: {
        fontFamily: 'IRANYekanRegular',
        fontWeight: '$WeightRegular'
    },
    image: {},
    button: {
        borderRadius: 17,
        width: 80,
        height: 30,
        backgroundColor: '$MainColor',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center'
    },
    notFound: {
        fontFamily: '$IRANYekanBold',
        fontWeight: '$WeightBold',
        fontSize: 18,
        marginTop: hp('2%')
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
    }
});
