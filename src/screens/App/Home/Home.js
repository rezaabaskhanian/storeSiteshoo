/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component, PureComponent } from 'react';
import { state as store } from 'react-beep'
import {
    Platform,
    Text,
    View,
    FlatList,
    Dimensions,
    TouchableWithoutFeedback,
    ImageBackground,
    Image,
    RefreshControl,
    TouchableOpacity,
    Alert, AsyncStorage, Animated
} from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet'
import { Appbar, TouchableRipple, ActivityIndicator } from 'react-native-paper'
import FastImage from 'react-native-fast-image'

import Material from 'react-native-vector-icons/MaterialIcons';
import Axios from 'axios';
import { config } from '../../../App';
import { NavigationActions, NavigationEvents, StackActions } from 'react-navigation'
import color from 'color'
import { Icon, Toast } from 'native-base';


class RenderItem extends PureComponent {
    state = {
        routes: [...this.props.navigation.getParam('Route', []), 'دسته بندی ها']
    }
    render() {
        const { item, index } = this.props
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    // item.PRODUCT_PARENT_ID == 58 ?
                    // 	this.props.navigation.push('StoreCategory', { ID: item.PRODUCT_ID, NAME: item.NAME })
                    // 	:
                    // item.LEAF === 1 ?
                    //     this.props.navigation.push('StoreProducts', {
                    //         item,
                    //         Route: this.state.routes
                    //     }) :
                    this.props.navigation.push('ProductSubCats', {
                        item,
                        PRODUCT_ID: item.PRODUCT_ID,
                        headerText: item.NAME,
                        Route: this.state.routes
                    })
                }} >
                <View style={
                    [
                        { backgroundColor: 'white', height: 100, flex: 1, margin: 5, borderRadius: 5, elevation: 2 },
                        index % 2 === 0 ? { flexDirection: 'row-reverse' } : { flexDirection: 'row' }
                    ]
                }>
                    <FastImage
                        // source={{ uri: config.BaseUrl + '/assets/img/categories/category_logo/' + item.LOGO }}
                        source={{ uri: config.BaseUrl + config.CategorySubUrl + item.CATEGORY_LOGO }}
                        resizeMode='cover'
                        style={[{ height: 100, width: 100 }, index % 2 === 0 && { transform: [{ scaleX: -1 }] }]}
                    />
                    <View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-end', paddingHorizontal: 20 }} >
                        <Text style={[styles.TextBold, { color: 'black', textAlign: 'center', fontSize: 12 }]} >
                            {item.NAME}
                        </Text>
                        <Text style={[styles.TextRegular, { color: 'black', textAlign: 'center', fontSize: 12 }]} >
                            {item.DESCRIPTION}
                        </Text>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }
}

export default class App extends Component {

    state = {
        data: [],
        selectedAddress: {},
        loading: false,
        refreshing: false,
        isGuest: false,
        width: Dimensions.get('window').width,
        scrollY: new Animated.Value(0),
        like: false,
        count: 0
    }

    componentDidMount() {
        this.fetchData()
        this.fetchMainCategories()

        this.updateCartCount()
        AsyncStorage.getItem('isGuest').then(guest => {
            if (guest === '1') {
                this.setState({
                    isGuest: true
                })
            }
        })
        Dimensions.addEventListener('change', this.onOrientationChange)
    }

    fetchMainCategories = async () => {
        try {
            let cats = await Axios.get(`stores/${store.storeId}/StoreCategories`)
            this.setState({ data: cats.data, loading: false })
        } catch (error) {
            console.log(error, error.response)
            this.setState({ loading: false })
        }
    }

    componentWillUnmount() {
        Dimensions.removeEventListener('change', this.onOrientationChange)
    }

    async updateCartCount() {
        let cart = await Axios.get('order/cart')
        let note = await Axios.get('order/notes')

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
    }

    onOrientationChange = ({ window }) => this.setState({ width: window.width }, () => console.warn(this.state.width))

    fetchData = async () => {
        try {
            this.setState({ loading: true })
            let address = await Axios.get('users/address')
            this.setState({ selectedAddress: address.data.find((item) => item.SELECTED === 1) })

            this.setState({ data: cats.data, loading: false, refreshing: false })
        } catch (error) {
            console.log(error);
            if (error.response.status > 499) {
                Toast.show({
                    text: 'مشکلی از سمته سرور وجود دارد لطفا دوباره امتحان کنید !',
                    type: 'danger',
                    duration: 3000,
                    buttonText: 'تایید',
                    buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                })
            }
            this.setState({ loading: false, refreshing: false })
            console.log(error)
        }
    }

    async onRefresh() {
        await this.setState({ refreshing: true });
        this.fetchData()
    }

    render() {
        if (this.state.loading)
            return (
                <View style={styles.container}>
                    <Appbar.Header style={{ backgroundColor: 'white' }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            {/* <Text style={{ ...styles.TextBold, color: 'black', fontSize: 18 }} >ورامال</Text> */}
                            <Image
                                source={store.setting ? { uri: config.BaseUrl + '/assets/img/settings/' + store.setting.LOGO } : require('../../../assest/varamal.png')}
                                style={{ width: '100%', height: '50%' }} resizeMode='contain' />
                            <Text style={{ ...styles.TextBold, color: 'black', fontSize: 14 }}>{store.setting.DESCRIPTION}</Text>
                        </View>
                    </Appbar.Header>

                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <ActivityIndicator />
                    </View>
                </View>
            )
        return (
            <View style={styles.container}>
                <NavigationEvents
                    onWillFocus={async () => {
                        try {
                            this.setState({ loading: true })
                            let address = await Axios.get('users/address');
                            this.setState({
                                selectedAddress: address.data.find((item) => item.SELECTED == 1),
                                loading: false
                            })
                        } catch (error) {
                            if (error.response.status > 499) {
                                Toast.show({
                                    text: 'مشکلی از سمته سرور وجود دارد لطفا دوباره امتحان کنید !',
                                    type: 'danger',
                                    duration: 3000,
                                    buttonText: 'تایید',
                                    buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                                })
                            }
                            this.setState({ loading: false })

                        }
                    }}
                />
                <Image
                    source={require('../../../assest/back08.jpg')}
                    style={{ width: '100%', position: 'absolute', height: '100%' }}
                    resizeMode='repeat' resizeMethod='resize'
                />
                <Appbar.Header style={{
                    backgroundColor: 'white',
                    paddingHorizontal: 10,
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                }}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Tab')}>
                        {/*<Material name="home" size={30} color={StyleSheet.value('$MainColor')}/>*/}
                    </TouchableOpacity>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Image
                            source={store.setting ? { uri: config.BaseUrl + '/assets/img/settings/' + store.setting.LOGO } : require('../../../assest/varamal.png')}
                            style={{ width: '100%', height: '50%' }} resizeMode='contain' />
                        <Text style={{ ...styles.TextBold, color: 'black', fontSize: 14 }}>{store.setting.DESCRIPTION}</Text>
                        {/*<Image source={require('../../../assest/varamal.png')} style={{width: '100%', height: '50%'}}*/}
                        {/*       resizeMode='contain'/>*/}
                        {/*<Text style={{...styles.TextBold, color: 'black', fontSize: 14}}>ورامال ، یه خرید باحال</Text>*/}
                    </View>
                    <TouchableOpacity
                        onPress={async () => {
                            try {
                                if (!this.state.isGuest)
                                    Alert.alert('خروج', 'آیا از خروج اپ مطمئن هستید ؟', [
                                        {
                                            text: 'بله',
                                            onPress: async () => {
                                                // PushPole.getId(pusheId => {
                                                    Axios.put('/users/logout', {
                                                        // 'PUSH_ID': pusheId
                                                        'PUSH_ID': ''
                                                    }).then(async ({ data }) => {
                                                        if (data) {
                                                            store.cart_count = 0
                                                            await AsyncStorage.removeItem('token')
                                                            await AsyncStorage.removeItem('token')
                                                            const resetAction = StackActions.reset({
                                                                index: 0,
                                                                actions: [NavigationActions.navigate({ routeName: 'Tab' })],
                                                            })

                                                            this.props.navigation.dispatch(resetAction)
                                                        }
                                                    }).catch(err => {
                                                        Toast.show({
                                                            type: 'danger',
                                                            text: `خطا در ثبت سفارش کد( ${err.response.code})`
                                                        })
                                                        console.log(err.response)
                                                    })
                                                // })


                                            }
                                        },
                                        {
                                            text: 'خیر'
                                        }
                                    ])

                            } catch (error) {
                                console.log(error)
                            }
                        }}
                    >
                        <View>
                            <Icon name='exit-to-app'
                                color={this.state.isGuest ? 'white' : StyleSheet.value('$MainColor')} size={30}
                                type='MaterialIcons' style={{ color: this.state.isGuest ? 'white' : StyleSheet.value('$MainColor') }} />
                        </View>
                    </TouchableOpacity>

                </Appbar.Header>
                <View style={{
                    paddingHorizontal: 10,
                    height: 60,
                    justifyContent: 'space-between',
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    backgroundColor: color('white').darken(0.1)
                }}>
                    <Text style={{ ...styles.TextRegular, color: 'black', fontSize: 16 }}>آدرس : <Text
                        style={{ fontSize: 13 }}> {this.state.selectedAddress ? this.state.selectedAddress.NAME :
                            <Text style={{ color: 'red' }}>آدرسی انتخاب نشده است !</Text>}</Text></Text>
                    <TouchableWithoutFeedback
                        onPress={() => this.props.navigation.navigate('Address')}
                    >
                        <View style={{ ...styles.button }}>
                            <Material name='edit' color='white' size={17} />
                            <Text style={[styles.TextBold, {
                                color: 'white',
                                textAlign: 'center',
                                fontSize: 12
                            }]}>ویرایش</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
                {
                    this.state.data[0] &&
                    <FlatList
                        data={this.state.data}
                        renderItem={({ item, index }) => <RenderItem {...this.props} item={item} index={index} />}
                    />
                }
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    button: {
        borderRadius: 17,
        width: 80,
        height: 30,
        backgroundColor: '$MainColor',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center'
    }
});
