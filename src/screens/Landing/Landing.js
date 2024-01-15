import React, { Component } from 'react'
import { Text, View, ActivityIndicator, Dimensions, AsyncStorage, Animated, Easing, Linking, ToastAndroid } from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import { StackActions, NavigationActions,NavigationEvents } from 'react-navigation'

import Material from 'react-native-vector-icons/MaterialIcons'
import { Button } from 'native-base'
import FastImage from 'react-native-fast-image'
import Axios from 'axios'
import { Toast } from 'native-base'
import { config } from '../../App'
import ScrollingBackground from './ScrollingBackground'
import AnimatedView from './AnimatedView'
// import PushPole from "pushpole-react-native";
import DeviceInfo from "react-native-device-info";
import { state as store } from "react-beep";

const { width } = Dimensions.get('window')

import { version } from '../../../package.json';

import { withTranslation } from 'react-i18next';
 class App extends Component {
    state = {
        actice: 1,
        time: 45,
        pusheId: '',
        description: '',
        logo: '',
        update: false,
        updateUrl: '',

        showSign: false,
        // labelSign: 'درحال دریافت اطلاعات صبر کنید',
        labelSign: 'در حال دریافت اطلاعات ... لطفا صبر کنید ',
        phone: ''


    }

    componentDidMount() {
          const lang = this.props.i18n.language

          Axios.defaults.params = {
            // Add your default query parameters here
            // For example:
            lang: lang,
          }
    
        Axios.defaults.baseURL = config.BaseUrl + '/api/'
        Axios.get(`stores/sitisho/getByDomain/${config.Domain}`).then(({ data }) => {        
            if (data[0]) {
                store.storeId = data[0].ID;
                Axios.get(`landing/get_setting/${data[0].ID}`).then(res => {
                    if (res && res.data) {
                        store.setting = res.data;
                        this.setState({ logo: res.data.LOGO, description: res.data.DESCRIPTION, phone: res.data.PHONE })
                    }
                })
                Axios.get(`setting/${data[0].ID}`).then(res => {
                    if (res && res.data) {
                        let temp = {}
                        for (let item of res.data) {
                            temp[item.NAME] = item.VALUE;
                        }
                        store.allSetting = temp;
                    }
                })
            }
        })

        AsyncStorage.getItem('theme').then((data) => {
            if (data !== '2') {
                Axios.get('app-release/lastVersion/CUSTOMER').then(data => {
                    if (data.data.RELEASE == version) {
                        this.checkWithToken()
                    }
                })
            }
            else {
                this.setState({ showSign: true, labelSign: '' })
            }
        })
    }
    checkWithToken() {
        AsyncStorage.getItem('token').then(token => {
            Axios.interceptors.response.use(
                response => {
                    return response
                },
                error => {
                    if (error.response && error.response.status == 401) {
                        Toast.show({
                            text: 'اعتبار شما منقضی شده، لطفا دوباره وارد شوید!',
                            type: 'warning'
                        })
                        AsyncStorage.removeItem('token').then(() => {
                            this.props.navigation.navigate('Auth')
                        })
                    }
                    console.log(error.response)
                    return Promise.reject(error)
                }
            )
            this.timer = setTimeout(() => {
                if (token) {

                    this.updateCartCount()
                    this.updateNoteCount()
                    this.props.navigation.navigate('Tab')

                } 
                else {
                    let lang=this.props.i18n.language
                    AsyncStorage.getItem('seenIntro').then(seen => {
                        let username = '0' + new Date().getTime()
                        let guest = { "NAME": "کاربر میهمان", "USER_NAME": username, "PASSWORD": "123456", "OTP": 0, "NATIONAL_CODE": "" }
                        Axios.post(config.BaseUrl + '/api/users/guest', guest ,{params:{
                            lang:lang =='en'? lang :'fa'
                        }}).then(({ data }) => {

                            if (data.ID) {
                                Axios.post('auth/local', {
                                    USER_NAME: guest.USER_NAME,
                                    PASSWORD: guest.PASSWORD,
                                    VERSION: DeviceInfo.getBuildNumber(),
                                    VERSION_TYPE: "1"
                                },{params:{
                                    lang:lang =='en'? lang :'fa'
                                }}).then(res => {
                                    let response = res.data;
                                    AsyncStorage.setItem('profile', JSON.stringify(response))
                                    AsyncStorage.setItem('token', response.TOKEN.toString())
                                    AsyncStorage.setItem('isGuest', '1')
                                    Axios.defaults.headers = {
                                        Authorization: 'Bearer ' + response.TOKEN.toString()
                                    }
                                    this.props.navigation.navigate('Tab')
                                })
                            } else {
                                
                                this.props.navigation.navigate('Tab')

                                
                            }

                        })
                    })

                }
            }, 5000)
        })
    }


    async updateCartCount() {

        let cart = await Axios.get('order/cart')

        let finalCount = 0;
        for (let item of cart.data) {
            for (let sub of item.order_products) {
                //add for display counter in home
                // console.log(sub,'landing sub')
                     if ( sub.product_store.order_product_details){
                        for (let data of sub.order_product_details) {
                            store.cart[sub.product_store.ID] = data.COUNT 
                        }
                     }
                     else{
                        store.cart[sub.product_store.ID] = sub.COUNT 
                     }

                if (sub.product_store.product.PRODUCT_UNIT_ID === 1) {
                    finalCount += 1;
                } else {
                    finalCount += sub.COUNT;
                }
            }
        }
        store.cart_count = finalCount;


    }

    async updateNoteCount() {
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


    }

    componentWillUnmount() {
        clearInterval(this.timer)
    }

    render() {
        const {t}=this.props
        return (
            <View style={styles.container}>
                {/* <ScrollingBackground
                    style={{ backgroundColor: 'white', zIndex: 1 }}
                    speed={20}
                    direction={'up'}
                    images={[require('../../assest/splash/22.png')]}
                /> */}
                <AnimatedView />
                {
                    this.state.showSign ?
                        <View style={{ flexDirection: 'row', justifyContent: 'space-evenly', zIndex: 3 }}>
                            <Button block style={{ width: 100, marginTop: 20, backgroundColor: '#00e676' }}
                                onPress={() => ToastAndroid.show(`لطفا با شماره ${this.state.phone} تماس بگیرید`, ToastAndroid.LONG)} >
                                <Text style={{ textAlign: 'center', color: 'white' }}>
                                    ثبت نام
                                </Text>
                            </Button>
                            <Button block style={{ width: 100, marginTop: 20, backgroundColor: '#00e676' }} onPress={
                                () => {
                                    this.checkWithToken()
                                }
                            } >
                                <Text style={{ textAlign: 'center', color: 'white' }}>
                                    ورود
                                </Text>
                            </Button>
                        </View>
                        :
                        null
                }


                {
                    this.state.update ?
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, zIndex: 3 }}>
                            <Text style={{ textAlign: 'center', color: 'white' }}> جهت استفاده از برنامه لطفا برنامه خود را آپدیت کنید. </Text>
                            <Button block style={{ alignSelf: 'center', marginTop: 20, backgroundColor: '#00e676' }} onPress={
                                () => {
                                    Linking.openURL(this.state.updateUrl)
                                }
                            } >
                                <Text style={{ textAlign: 'center', color: 'white' }}>
                                    دریافت بروزرسانی
                                </Text>
                            </Button>
                        </View>
                        :
                        <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1, zIndex: 3 }}>
                            <ActivityIndicator />
                            <Text style={styles.TextRegular}>  {t('labelSign')}</Text>
                        </View>
                }
                <View style={styles.positionAbsolute} />
            </View>
          
        )
    }
}
export default withTranslation()(App);
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    TextBold: {
        fontFamily: '$IRANYekanBold',
        fontWeight: '$WeightBold',
        textAlign: 'center'
    },
    TextLight: {
        fontFamily: '$IRANYekanLight',
        fontWeight: '$WeightLight',
        textAlign: 'center'
    },
    TextRegular: {
        fontFamily: 'IRANYekanRegular',
        fontWeight: '$WeightRegular',
        textAlign: 'center',
        color: 'white'
    },
    positionAbsolute: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'black',
        opacity: 0.5,
        zIndex: 2
    }
})
