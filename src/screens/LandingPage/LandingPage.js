import * as React from 'react';
import {
    Text,
    Image,
    View,
    TouchableOpacity,
    ScrollView,
    AsyncStorage,
    FlatList
} from 'react-native'
import { Grid, Row } from 'react-native-easy-grid'
import { menu } from './svg'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Item, Input, Icon, Toast } from 'native-base';
import BannerSlider from "./bannerSlider";
import Axios from "axios";
import { config } from "../../App";
import FastImage from "react-native-fast-image";
import ProductItem from "../App/Home/ProductItem/ProductItem";
import { debounce } from "underscore";
import Material from "react-native-vector-icons/MaterialIcons";
import { Appbar } from "react-native-paper";
import StyleSheet from 'react-native-extended-stylesheet'
import { Beep, on, state as store } from "react-beep";
import { BeepProp } from "../../store/BeepProp";
import { Component } from "react";
import moment from 'moment-jalaali'
import { RenderItem } from '../App/Home/StoreProfile/RenderItem'

class NotiTabBarIcon extends Beep(BeepProp, Component) {
    constructor(props) {
        super(props);
        this.state = {
            count: 0
        }
    }

    render() {
        on('cart_count', value => {
            if (value === this.state.count) {
                this.setState({
                    count: value
                })
            }
        });
        return (<Text
            style={{
                color: '#fff8fd',
                position: 'absolute',
                top: 1,
                right: 1,
                margin: -1,
                minWidth: 13,
                height: 13,
                borderRadius: 7,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#FF0000',
                textAlign: 'center',
                fontSize: 9
            }}>{parseInt(store.cart_count)}</Text>
        )

    }
}

export default function Landing(props) {
    const [categories, setCategories] = React.useState([]);
    const [banners, setBanners] = React.useState([]);
    const [offers, setOffers] = React.useState([]);
    const [currentOffers, setCurrentOffers] = React.useState([]);
    const [sells, setSells] = React.useState([]);
    const [searchTerm, setSearchTerm] = React.useState("");
    const [stores, setStores] = React.useState([]);
    const [data, setData] = React.useState(false);
    const [times, setTimes] = React.useState([]);
    const [productCategories, setProductCategories] = React.useState([]);
    const [logo, setLogo] = React.useState(false);
    const [banner, setBanner] = React.useState(false);



    React.useEffect(() => {
        fetchData()
        AsyncStorage.getItem('token').then(token => {
            if (token) {
                setData(true)
            }
        });
        Axios.get(`stores/child-first/${store.storeId}`).then(res => {
            if (res && res.data) {
                setCategories(res.data)
            }
        });

        Axios.get('landing/all-store').then(res => {
            if (res && res.data) {
                setStores(res.data.most_offers)
            }
        });
        Axios.get('offers/Currentoffer').then(res => {
            if (res && res.data) {
                setCurrentOffers(res.data)
            }
        });
        Axios.get('landing/banner_app').then(res => {
            console.log(config.BaseUrl + '/assets/img/banner/' + item.VALUE, 'banerDatasssss')
            if (res && res.data) {
                let data = [];
                for (let item of res.data) {
                    data.push(config.BaseUrl + '/assets/img/banner/' + item.VALUE)
                }
                setBanners(data)
            }
            // console.log(banners, 'banners')
        });
        Axios.get(`landing/mostsells/${store.storeId}`).then(res => {
            if (res && res.data) {
                console.warn(res.data);
                setSells(res.data.most_offers)
            }
        });
        Axios.get(`landing/mostoffers/${store.storeId}`).then(res => {
            console.log(1, res)
            if (res && res.data) {
                setOffers(res.data.most_offers)
            }
        }).catch(err => {
            console.log(1, err)
        });

        Axios.get('order/cart').then(({ data }) => {
            let cart = data
            let finalCount = 0
            for (let item of cart.data) {
                for (let sub of item.order_products) {
                    if (sub.product_store.product.PRODUCT_UNIT_ID === 1) {
                        finalCount += 1;
                    } else {
                        finalCount += sub.COUNT;
                    }
                }
            }
            store.cart_count = finalCount;

        });

        Axios.get('order/notes').then(({ data }) => {
            let note = data
            let finalCountNote = 0
            for (let item of note.data) {
                for (let sub of item.order_products) {
                    if (sub.product_store.product.PRODUCT_UNIT_ID === 1) {
                        finalCountNote += 1;
                    } else {
                        finalCountNote += sub.COUNT;
                    }
                }
            }
            store.note_count = finalCountNote;

        });

    }, []);

    function getDayNumberJalali(day) {
        switch (day + 1) {
            case 1:
                return 3;
            case 2:
                return 4;
            case 3:
                return 5;
            case 4:
                return 6;
            case 5:
                return 7;
            case 6:
                return 1;
            case 7:
                return 2;
        }
    }
    function fetchData() {
        let storeId = store.storeId
        Axios.get(`stores/${storeId}`)
            .then(store => {
                let store_images = store.data.store_images
                let data = {};
                store_images.forEach(item => {
                    if (item.store_image_category)
                        data = { ...data, [item.store_image_category.NAME_ENG]: item.ADDRESS_URL }
                    if (item.NAME === 'logo') {
                        setLogo(item.ADDRESS)
                    }
                    if (item.NAME === 'banner') {
                        setBanner(item.ADDRESS)
                    }
                });
                const today = moment(new Date()).day();
                const todayJalali = getDayNumberJalali(today);
                let wh = store.data.store_hours.find(
                    item => item.WEEK_DAY === todayJalali
                );
                if (wh && wh.HOLIDAY === 1) {
                    wh = undefined
                }
                setTimes(wh)
                let productTemp = []
                console.log(storeId, 'storeId')
                Axios.get(
                    'stores/' + storeId + '/StoreCategories'
                ).then(async (response) => {
                    for (let value of response.data.slice(0, 3)) {
                        try {
                            let sortGenelogyproduct = await Axios.get(
                                `stores/${storeId}/sortGenelogyproduct/${value.PRODUCT_ID}`
                            )
                            if (sortGenelogyproduct.data[0] != null) {
                                productTemp.push({
                                    CHILD_PRODUCTS: sortGenelogyproduct.data,
                                    IMAGE: value.IMAGE,
                                    NAME: value.NAME,
                                    ID: value.ID,
                                    LEAF: value.LEAF,
                                    STORE_ID: value.STORE_ID,
                                    PRODUCT_ID: value.PRODUCT_ID,
                                })
                                setProductCategories(productTemp)
                            }

                        } catch (error) {
                            console.log('[CategoryError ' + value + ']', error.data)
                        }
                    }
                }).catch((errorHour) => {
                    console.log(errorHour)
                })
            })
            .catch(error => {
                console.log('main ERROR', error)
            })
    }
    const onChangeTextDelayed = debounce((text) => search(text), 3500);
    const onChangeText = (text) => {
        setSearchTerm(text);
        onChangeTextDelayed(text)
    };
    const search = (text) => {
        if (text.length > 2) {
            AsyncStorage.getItem('token').then(token => {
                if (token) {
                    props.navigation.navigate('Search', { text: text })
                } else {
                    props.navigation.navigate('Auth')
                }
            });
        }
    };
    return (
        <ScrollView>

            <Grid style={{ backgroundColor: '#fff' }}>
                <Row size={3} style={styles.searchBack}>
                    <Appbar.Header style={{
                        backgroundColor: '#ffebeb'
                        , paddingHorizontal: 10,
                        justifyContent: 'space-between',
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                    }}>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate('Tab')
                        }}>
                         
                        </TouchableOpacity>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>

                            {/* <Image source={store.setting ? { uri: config.BaseUrl + '/assets/img/settings/' + store.setting.LOGO } : require('../../assest/varamal.png')} */}
                            <Image source={store.setting ? { uri: config.ImageBaseUrl + '/assets/img/settings/' + store.setting.LOGO } : null}
                                style={{ width: '100%', height: '50%' }}
                                resizeMode='contain' />
                            <Text style={{ ...styles.TextBold, color: 'black', fontSize: 14 }}>{store.setting.DESCRIPTION}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={async () => {
                                props.navigation.navigate('Cart')
                            }}
                        >
                            {/*<View>*/}
                            {/*    <Material*/}
                            {/*        name="shopping-basket"*/}
                            {/*        color={StyleSheet.value('$MainColor')}*/}
                            {/*        size={30}*/}
                            {/*    />*/}
                            {/*    <NotiTabBarIcon/>*/}
                            {/*</View>*/}
                        </TouchableOpacity>
                    </Appbar.Header>
                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                        {
                            times ?
                                <>
                                    <View style={{ flexDirection: 'row-reverse' }}>
                                        <Material name="access-time" color="white" style={{ margin: 5 }} />
                                        <Text
                                            style={{
                                                ...styles.TextRegular,
                                                color: 'black',
                                                fontSize: 11,
                                                textAlign: 'center',
                                            }}
                                        >
                                         ساعت کاری امروز :
                                        </Text>
                                    </View>
                                    {(times.START_TIME != '' || times.START_TIME != '0') &&
                                        (times.END_TIME != '' || times.END_TIME != '0') &&
                                        <Text
                                            style={{
                                                ...styles.TextRegular,
                                                color: 'black',
                                                fontSize: 11,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {(times.START_TIME2 != '0:00' && times.END_TIME2 != '0:00') ? 'صبح: ' + (times.START_TIME + ' الی ' + times.END_TIME) : '' + (times.START_TIME + ' الی ' + times.END_TIME)}
                                        </Text>
                                    }
                                    {
                                        (times.START_TIME2 != '0:00') &&
                                        (times.END_TIME2 != '0:00') &&
                                        <Text
                                            style={{
                                                ...styles.TextRegular,
                                                color: 'black',
                                                fontSize: 11,
                                                textAlign: 'center',
                                            }}
                                        >
                                            {'عصر: ' + times.START_TIME2 + ' الی ' + times.END_TIME2}
                                        </Text>
                                    }
                                </>
                                :
                                <View style={{
                                    flexDirection: 'row-reverse',
                                    backgroundColor: 'red',
                                    marginTop: 10,
                                    padding: 2,
                                    borderRadius: 3
                                }}>
                                    <Text
                                        style={{
                                            ...styles.TextRegular,
                                            color: 'black',
                                            fontSize: 11,
                                            textAlign: 'center',
                                        }}>امروز تعطیل هستیم</Text>
                                </View>
                        }
                    </View>

                    {/*<View style={{marginTop: hp('3%'), elevation: 5}}>*/}
                    {/*    <Item rounded style={{backgroundColor: '#fff'}}>*/}
                    {/*        <Input placeholder='جستجوی برند یا محصول'*/}
                    {/*               value={searchTerm}*/}
                    {/*               onChangeText={text => onChangeText(text)}*/}
                    {/*        />*/}
                    {/*        <TouchableOpacity onPress={() => {*/}
                    {/*            props.navigation.navigate('Search', {text: searchTerm})*/}
                    {/*        }}><Icon active name='search'/></TouchableOpacity>*/}
                    {/*    </Item>*/}
                    {/*</View>*/}

                </Row>

                <Row size={9} style={{ backgroundColor: '#ddd', flexDirection: 'column' }}>


                    {
                        
                        banners.length > 0 ?
                        
                            <View style={{ marginTop: hp('3%'), }}>
                                <BannerSlider data={banners} />
                            </View>
                            : null
                    }

                    {currentOffers.length > 0 && <View style={styles.rowTitle}>
                        <Text style={styles.sectionTitle}>سه شنبه بازار</Text>
                    </View>}

                    {currentOffers.length > 0 && <View style={[{}, styles.rowTitle]}>
                        <FlatList
                            horizontal
                            inverted
                            data={currentOffers}
                            keyExtractor={(item, index) =>
                                item.NAME + '_' + index
                            }
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => {
                                item.ID = item.PRODUCT_STORE_ID;
                                item.NAME = item.PRODUCT_NAME;
                                item.OFFER_PERCENTAGE = item.PERCENTAGE
                                return (
                                    <ProductItem item={item} navigation={props.navigation} mode={'landing'}
                                        login={data} />
                                )
                            }}
                        />
                    </View>}
                    {/*<View style={[{marginLeft: wp('5%'), marginTop: hp('3%')}]}>*/}
                    {/*    <FastImage source={require('./img/banner6.png')} resizeMode={'contain'}*/}
                    {/*               style={{width: wp('90%'), height: hp('20%'), borderRadius: wp('5%')}}/>*/}
                    {/*</View>*/}

                    <View style={[{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'baseline'
                    }, styles.rowTitle]}>
                        <TouchableOpacity onPress={() => {
                            props.navigation.navigate('Category')
                        }}>
                            <Text style={{ color: '#1FB52B', paddingLeft: 15, fontFamily: 'IRANYekanRegular' }}>
                                بیشتر
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.sectionTitle}>همه دسته بندی ها</Text>
                    </View>

                    <View
                        style={[{ flexDirection: 'row', marginRight: wp('5%'), marginLeft: wp('5%') }, styles.rowTitle]}>
                        {categories.slice(0, 3).map((item, index) => {
                            return (
                                <TouchableOpacity onPress={() => {
                                    props.navigation.navigate('Category')
                                }} style={styles.categories}>
                                    <View style={styles.category}>
                                        <FastImage
                                            source={{ uri: config.BaseUrl + '/assets/img/categories/category_logo/' + item.PRODUCT_NAME }}
                                            style={styles.categoryImg}
                                        />
                                    </View>

                                    <Text style={{ fontFamily: 'IRANYekanRegular' }}>
                                        {item.NAME}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                    <View
                        style={[{ flexDirection: 'row', marginRight: wp('5%'), marginLeft: wp('5%') }, styles.rowTitle]}>
                        {categories.slice(4, 7).map((item, index) => {
                            return (
                                <TouchableOpacity onPress={() => {
                                    // props.navigation.navigate('Stores', {ID: item.ID})
                                    props.navigation.navigate('Category')
                                }} style={styles.categories}>
                                    <View style={styles.category}>
                                        <FastImage
                                            source={{ uri: config.BaseUrl + '/assets/img/categories/category_logo/' + item.PRODUCT_NAME }}
                                            style={styles.categoryImg}
                                            resizeMode={'cover'}
                                        />
                                    </View>

                                    <Text style={{ fontFamily: 'IRANYekanRegular' }}>
                                        {item.NAME}
                                    </Text>
                                </TouchableOpacity>
                            )
                        })}
                    </View>

                    <View style={styles.rowTitle}>
                        <Text style={styles.sectionTitle}>پرفروش ترین ها</Text>
                    </View>

                    <View style={[{}, styles.rowTitle]}>
                        <FlatList
                            horizontal
                            inverted
                            data={sells}
                            keyExtractor={(item, index) =>
                                item.NAME + '_' + index
                            }
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => {
                                item.IMAGE = item.IMAGE_ADDRESS;
                                item.ID = item.PRODUCT_STORE_ID;
                                return (
                                    <ProductItem item={item} navigation={props.navigation} mode={'landing'}
                                        login={data} />
                                )
                            }}
                        />
                    </View>

                    <View style={styles.rowTitle}>
                        <Text style={styles.sectionTitle}>بیشترین تخفیف ها</Text>
                    </View>
                    <View style={[{}, styles.rowTitle]}>
                        <FlatList
                            horizontal
                            inverted
                            data={offers}
                            keyExtractor={(item, index) =>
                                item.NAME + '_' + index
                            }
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => {
                                item.IMAGE = item.IMAGE_ADDRESS;
                                item.ID = item.PRODUCT_STORE_ID
                                return (
                                    <ProductItem item={item} navigation={props.navigation} mode={'landing'}
                                        login={data} />
                                )

                            }}
                        />
                    </View>

                    {productCategories.length === 0
                        ? null
                        : productCategories.map((item, index) => {
                            return (
                                <>
                                    <View style={styles.rowTitle} key={index}>
                                        <Text style={styles.sectionTitle}>{item.NAME}</Text>
                                    </View>
                                    <View style={[{}, styles.rowTitle]}>
                                        <FlatList
                                            horizontal
                                            inverted
                                            data={item.CHILD_PRODUCTS}
                                            keyExtractor={(item, index) =>
                                                item.NAME + '_' + index
                                            }
                                            showsHorizontalScrollIndicator={false}
                                            renderItem={({ item }) => {
                                                // item.IMAGE = item.IMAGE_ADDRESS;
                                                // item.ID = item.PRODUCT_ID
                                                return (
                                                    <ProductItem item={item} navigation={props.navigation} mode={'store'} />
                                                )
                                            }}
                                        />
                                    </View>

                                </>
                                // <RenderItem
                                //     key={'category' + index}
                                //     {...props}
                                //     item={item}
                                //     storeName={store.setting.NAME}
                                // />
                            )
                        })}
                    <View style={styles.footer}>
                        <Text style={{ color: '#fff', fontFamily: 'IRANYekanRegular' }}>
                            {store.setting.DESCRIPTION}
                        </Text>
                    </View>
                </Row>
            </Grid>
        </ScrollView>
    )
}

const styles = StyleSheet.create({
    searchBack: {
        backgroundColor: '#ffebeb',
        elevation: 7,
        padding: wp('5%'),
        flexDirection: 'column'
    },
    row: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: wp('90%')
    },
    logo: {
        width: wp('28%'),
        height: hp('6%'),
        resizeMode: 'contain'
    },
    sectionTitle: {
        fontSize: wp('5%'),
        fontFamily: 'IRANYekanRegular',
        marginTop: hp('2%')
    },
    rowTitle: {
        paddingRight: 15

    },
    stores: {
        marginRight: wp('5%'),
        marginLeft: wp('5%'),
        flexDirection: 'row',
        marginTop: hp('2%'),
        paddingTop: hp('2%'),
        paddingBottom: hp('2%'),
    },
    categories: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: wp('2%')
    },
    category: {
        elevation: 8,
        width: wp('28%'),
        height: hp('17%'),
        backgroundColor: '#fff',
        borderRadius: wp('5%'),
        marginTop: hp('3%'),
        marginBottom: hp('3%'),
        alignItems: 'center',
        justifyContent: 'center',
        padding: wp('10%')
    },
    categoryImg: {
        width: wp('20%'),
        height: hp('16%'),
        resizeMode: 'contain'
    },
    product: {
        elevation: 8,
        width: wp('46%'),
        height: hp('28%'),
        borderRadius: wp('5%'),
        backgroundColor: '#fff',
        marginTop: hp('2%'),
        marginRight: wp('2%')
    },
    productIMG: {
        width: wp('14%'),
        height: hp('10%'),
        marginTop: ('10%'),
        marginLeft: wp('17%')
    },
    offer: {
        position: 'absolute',
        backgroundColor: 'red',
        padding: wp('2%'),
        borderTopLeftRadius: wp('1%'),
        borderBottomLeftRadius: wp('1%'),
        top: hp('6%'),
        right: wp('0%')
    },
    TextBold: {
        fontFamily: '$IRANYekanBold',
        fontWeight: '$WeightBold'
    },
    footer: {
        backgroundColor: '#FF1212',
        padding: wp('5%'),
        alignItems: 'center',
        marginTop: hp('2%')
    }
});
