import React, { Component } from 'react'
import {
    Text,
    View,
    TextInput,
    TouchableWithoutFeedback,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
    ActivityIndicator,
    AsyncStorage
} from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import Material from 'react-native-vector-icons/MaterialIcons'
import MaterialCommunity from 'react-native-vector-icons/MaterialCommunityIcons'
import FastImage from 'react-native-fast-image'
import Axios from 'axios'
import { StackActions, NavigationActions } from 'react-navigation'
import { CheckBox, Toast } from 'native-base'

import DeviceInfo from 'react-native-device-info';
import { state as store } from "react-beep";
import Counter from "../../component/Counter";
import { config } from '../../App';

const { width } = Dimensions.get('window')
import { withTranslation } from 'react-i18next';
 class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            phoneNumber: '',
            password: '',
            err: '',
            pusheId: '',
            name: '',
            referralCode: '',
            secureTextEntry: true,
            lazy: false,
            step: 'phone',//code,codeForRegister,password,
            disabledSendAgain: true,
            pastTime: '',
            theme:'',
            authChecked:false,
        };
    }




    componentDidMount() {
             
        AsyncStorage.getItem('theme').then(theme => {
            this.setState({
                theme:theme
            })
        })

        console.warn(this.props.navigation.getParam('isGuest'),'erorr isGuest')
        // PushPole.getId(pusheId => {
        //     this.setState({
        //         pusheId
        //     })
        // })
    }

    // loginWithEmail =async ()=>{



    // }


    loginWithPassword = async () => {
        try {
            this.setState({ lazy: true })
            let { data } = await Axios.post('auth/local', {
                USER_NAME: this.state.phoneNumber,
                PASSWORD: this.enNumbers(this.state.password),
                PUSH_ID: this.state.pusheId,
                VERSION: DeviceInfo.getBuildNumber(),
                VERSION_TYPE: "1"
            })
            if (data.ROLE_ID === 1) {

                if (this.props.navigation.getParam('isGuest')) {
                    ///
                    AsyncStorage.setItem('PhoneNumber', this.state.phoneNumber)
                    ///
                    let guest = await AsyncStorage.getItem('profile')
                    guest = JSON.parse(guest);
                    Axios.defaults.headers = {
                        Authorization: 'Bearer ' + data.TOKEN.toString()
                    }
                    console.log('guest.USER_ROLE_ID:', guest.USER_ROLE_ID, 'data.USER_ROLE_ID:', data.USER_ROLE_ID)
                    await Axios.put('order/CustomerOrder', { UR_ID: guest.USER_ROLE_ID, CUSTOMER_ID: data.USER_ROLE_ID })
                    await Axios.put('order/CustomerAddress', {
                        UR_ID: guest.USER_ROLE_ID,
                        CUSTOMER_ID: data.USER_ROLE_ID
                    })
                    await AsyncStorage.setItem('profile', JSON.stringify(data))
                    await AsyncStorage.setItem('token', data.TOKEN.toString())
                    await AsyncStorage.setItem('isGuest', '0')

                    // this.props.navigation.navigate('Home');
                    const resetAction = StackActions.reset({
                        index: 0,
                        key:null,
                        actions: [NavigationActions.navigate({ routeName: 'Tab' })],
                    })
                    this.props.navigation.dispatch(resetAction)
                    this.updateCartCount()
                    Toast.show({
                        text: 'شما با موفقیت وارد شدید!',
                        type: 'success',
                        position: 'top'
                    })
                } else {
                    ////
                    AsyncStorage.setItem('PhoneNumber', this.state.phoneNumber)

                    ////
                    AsyncStorage.setItem('profile', JSON.stringify(data))
                    AsyncStorage.setItem('token', data.TOKEN.toString())
                    AsyncStorage.setItem('isGuest', '0')
                    Axios.defaults.headers = {
                        Authorization: 'Bearer ' + data.TOKEN.toString()
                    }
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Landing' })],
                    })
                    this.props.navigation.dispatch(resetAction)
                    this.updateCartCount()
                    Toast.show({
                        text: 'شما با موفقیت وارد شدید!',
                        type: 'success',
                        position: 'top'
                    })
                }

            } else {
                Toast.show({
                    text: `شماره شما با عنوان ${data.ROLE} در سیستم موجود است!`,
                    type: 'warning'
                })
            }
            this.setState({ err: '', lazy: false })
        } catch (error) {
            console.warn(error.response , 'erorr taeid')
            error.response ?
                Toast.show({
                    text: error.response.data.message,
                    type: 'danger',
                    buttonText: 'Ok',
                    buttonStyle: {
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 7
                    }
                }) :
                Toast.show({
                    text: 'خطا در اتصال، لطفاً اتصال خود را بررسی کنید!',
                    type: 'danger',
                    buttonText: 'Ok',
                    buttonStyle: {
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 7
                    }
                })
            this.setState({ lazy: false })
        }
    };
    loginWithOtp = async () => {
        try {
            let body = { OTP: this.state.password, USER_NAME: this.state.phoneNumber }
            this.setState({ lazy: true })
            console.log(this.props.navigation.getParam('isGuest'))
            if (this.props.navigation.getParam('isGuest')) {
                let guest = await AsyncStorage.getItem('profile')
                guest = JSON.parse(guest);
                body['USER_ID'] = guest.ID
                Axios.put('users/verify', body).then(async res => {
                    if (res.data && res.data.CODE === 200) {
                        if (this.state.step === 'code') {
                            let { data } = await Axios.post('auth/local', {
                                USER_NAME: this.state.phoneNumber,
                                PASSWORD: this.state.phoneNumber + this.state.password,
                                PUSH_ID: this.state.pusheId,
                                VERSION: DeviceInfo.getBuildNumber(),
                                VERSION_TYPE: "1"
                            })
                            if (data.ROLE_ID === 1) {
                                if (this.props.navigation.getParam('isGuest')) {
                                    let guest = await AsyncStorage.getItem('profile')
                                    guest = JSON.parse(guest);
                                    Axios.defaults.headers = {
                                        Authorization: 'Bearer ' + data.TOKEN.toString()
                                    }
                                    await Axios.put('order/CustomerOrder', {
                                        UR_ID: guest.USER_ROLE_ID,
                                        CUSTOMER_ID: data.USER_ROLE_ID
                                    })
                                    await Axios.put('order/CustomerAddress', {
                                        UR_ID: guest.USER_ROLE_ID,
                                        CUSTOMER_ID: data.USER_ROLE_ID
                                    })
                                    await AsyncStorage.setItem('profile', JSON.stringify(data))
                                    await AsyncStorage.setItem('token', data.TOKEN.toString())
                                    await AsyncStorage.setItem('isGuest', '0')

                                    // this.props.navigation.navigate('Home');
                                    const resetAction = StackActions.reset({
                                        index: 0,
                                        key:null,
                                        actions: [NavigationActions.navigate({ routeName: 'Tab' })],
                                    })
                                    this.props.navigation.dispatch(resetAction)
                                    this.updateCartCount()
                                    Toast.show({
                                        text: 'شما با موفقیت وارد شدید!',
                                        type: 'success',
                                        position: 'top'
                                    })
                                } else {
                                    AsyncStorage.setItem('profile', JSON.stringify(data))
                                    AsyncStorage.setItem('token', data.TOKEN.toString())
                                    AsyncStorage.setItem('isGuest', '0')
                                    Axios.defaults.headers = {
                                        Authorization: 'Bearer ' + data.TOKEN.toString()
                                    }
                                    const resetAction = StackActions.reset({
                                        index: 0,
                                        actions: [NavigationActions.navigate({ routeName: 'Landing' })],
                                    })
                                    this.props.navigation.dispatch(resetAction)
                                    this.updateCartCount()
                                    Toast.show({
                                        text: 'شما با موفقیت وارد شدید!',
                                        type: 'success',
                                        position: 'top'
                                    })
                                }

                            } else {
                                Toast.show({
                                    text: `شماره شما با عنوان ${data.ROLE} در سیستم موجود است!`,
                                    type: 'warning'
                                })
                            }
                        } else if (this.state.step === 'codeForRegister') {
                            this.setState({ step: 'register' })
                        }

                    } else {
                        Toast.show({
                            text: `The entered code is not correct!`,
                            type: 'warning'
                        })
                    }
                    this.setState({ err: '', lazy: false })

                }).catch(err => {
                    this.setState({ err: '', lazy: false })

                })
            } else {
                Axios.put('users/verify', body).then(async res => {
                    if (res.data && res.data.CODE === 200) {
                        if (this.state.step === 'code') {
                            let { data } = await Axios.post('auth/local', {
                                USER_NAME: this.state.phoneNumber,
                                PASSWORD: this.state.phoneNumber + this.state.password,
                                PUSH_ID: this.state.pusheId,
                                VERSION: DeviceInfo.getBuildNumber(),
                                VERSION_TYPE: "1"
                            })
                            if (data.ROLE_ID === 1) {
                                if (this.props.navigation.getParam('isGuest')) {
                                    let guest = await AsyncStorage.getItem('profile')
                                    guest = JSON.parse(guest);
                                    Axios.defaults.headers = {
                                        Authorization: 'Bearer ' + data.TOKEN.toString()
                                    }
                                    await Axios.put('order/CustomerOrder', {
                                        UR_ID: guest.USER_ROLE_ID,
                                        CUSTOMER_ID: data.USER_ROLE_ID
                                    })
                                    await Axios.put('order/CustomerAddress', {
                                        UR_ID: guest.USER_ROLE_ID,
                                        CUSTOMER_ID: data.USER_ROLE_ID
                                    })
                                    await AsyncStorage.setItem('profile', JSON.stringify(data))
                                    await AsyncStorage.setItem('token', data.TOKEN.toString())
                                    await AsyncStorage.setItem('isGuest', '0')

                                    // this.props.navigation.navigate('Home');
                                    const resetAction = StackActions.reset({
                                        index: 0,
                                        key:null,
                                        actions: [NavigationActions.navigate({ routeName: 'Tab' })],
                                    })
                                    this.props.navigation.dispatch(resetAction)
                                    this.updateCartCount()
                                    Toast.show({
                                        text: 'شما با موفقیت وارد شدید !',
                                        type: 'success',
                                        position: 'top'
                                    })
                                } else {
                                    AsyncStorage.setItem('profile', JSON.stringify(data))
                                    AsyncStorage.setItem('token', data.TOKEN.toString())
                                    AsyncStorage.setItem('isGuest', '0')
                                    Axios.defaults.headers = {
                                        Authorization: 'Bearer ' + data.TOKEN.toString()
                                    }
                                    const resetAction = StackActions.reset({
                                        index: 0,
                                        actions: [NavigationActions.navigate({ routeName: 'Landing' })],
                                    })
                                    this.props.navigation.dispatch(resetAction)
                                    this.updateCartCount()
                                    Toast.show({
                                        text: 'شما با موفقیت وارد شدید!',
                                        type: 'success',
                                        position: 'top'
                                    })
                                }

                            } else {
                                Toast.show({
                                    text: `شماره شما با عنوان ${data.ROLE} درسیستم موجود است`,
                                    type: 'warning'
                                })
                            }
                        } else if (this.state.step === 'codeForRegister') {
                            this.setState({ step: 'register' })
                        }

                    } else {
                        Toast.show({
                            text: `کد وارد شده صحیح نیست!`,
                            type: 'warning'
                        })
                    }
                    this.setState({ err: '', lazy: false })

                }).catch(err => {
                    this.setState({ err: '', lazy: false })

                })
            }


        } catch (error) {
            console.warn(error.response,'erorr taeid')
            error.response ?
                Toast.show({
                    text: error.response.data.message,
                    type: 'danger',
                    buttonText: 'Ok',
                    buttonStyle: {
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 7
                    }
                }) :
                Toast.show({
                    text: 'خطا در اتصال، لطفا اتصال خود را بررسی کنید!', 
                 type: 'danger',
                    buttonText: 'Ok',
                    buttonStyle: {
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 7
                    }
                })
            this.setState({ lazy: false })
        }
    };
    signUpUser = async () => {
        try {
            if (this.props.navigation.getParam('isGuest')) {
                let guest = await AsyncStorage.getItem('profile')
                guest = JSON.parse(guest);
                Axios.put('users/guest', {
                    NAME: this.state.name,
                    NATIONAL_CODE: '',
                    OTP: 1,
                    PASSWORD: this.state.password,
                    USER_ID: guest.ID,
                    USER_NAME: this.state.phoneNumber,
                    PASTIME: this.state.pastTime
                }).then(async res => {
                    if (res.data && res.data) {
                        let { data } = await Axios.post('auth/local', {
                            USER_NAME: this.state.phoneNumber,
                            PASSWORD: this.state.phoneNumber + this.state.password,
                            PUSH_ID: this.state.pusheId,
                            VERSION: DeviceInfo.getBuildNumber(),
                            VERSION_TYPE: "1"
                        })
                        if (data.ROLE_ID === 1) {
                            AsyncStorage.setItem('profile', JSON.stringify(data))
                            AsyncStorage.setItem('token', data.TOKEN.toString())
                            AsyncStorage.setItem('isGuest', '0')
                            Axios.defaults.headers = {
                                Authorization: 'Bearer ' + data.TOKEN.toString()
                            }
                            // this.props.navigation.navigate('LandingModule');
                            const resetAction = StackActions.reset({
                                index: 0,
                                actions: [NavigationActions.navigate({ routeName: 'Landing' })],
                            })
                            this.props.navigation.dispatch(resetAction)
                            this.updateCartCount()
                        }
                        this.setState({ lazy: false })

                    } else {
                        Toast.show({
                            text: `خطا در ثبت نام`,
                            type: 'warning'
                        })
                    }
                })

            } else {
                this.setState({
                    lazy: true
                })
                let userBody = {
                    NAME: this.state.name,
                    USER_NAME: this.state.password,
                    PASSWORD: this.state.PASSWORD,
                    PASTIME: this.state.pastTime
                }
                if (this.state.REFERRAL_CODE) {
                    userBody['REFERRAL_CODE'] = this.state.REFERRAL_CODE
                }
                // let register = await Axios.post('users', userBody);
                console.log('test', userBody)
                // console.log('teest pastTime', register)
                Toast.show({
                    text: 'شما با موفقیت وارد شدید!',
                    type: 'success',
                    duration: 3000,
                    buttonText: 'Ok',
                    buttonStyle: {
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 7
                    }
                })
                this.setState({
                    lazy: false
                })
                let { data } = await Axios.post('auth/local', {
                    USER_NAME: this.state.phoneNumber,
                    PASSWORD: this.state.phoneNumber + this.state.password,
                    PUSH_ID: this.state.pusheId,
                    VERSION: DeviceInfo.getBuildNumber(),
                    VERSION_TYPE: "1"
                })
                if (data.ROLE_ID === 1) {
                    AsyncStorage.setItem('profile', JSON.stringify(data))
                    AsyncStorage.setItem('token', data.TOKEN.toString())
                    AsyncStorage.setItem('isGuest', '0')
                    Axios.defaults.headers = {
                        Authorization: 'Bearer ' + data.TOKEN.toString()
                    }
                    // this.props.navigation.navigate('LandingModule');
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Landing' })],
                    })
                    this.props.navigation.dispatch(resetAction)
                    this.updateCartCount()
                }
                this.setState({ lazy: false })

            }
        } catch (error) {
            console.warn(error.response,'erorr taeid')
            error.response ?
                Toast.show({
                    text: error.response.data.message,
                    type: 'danger',
                    buttonText: 'بله',
                    buttonStyle: {
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 7
                    }
                }) :
                Toast.show({
                    text: 'خطا در اتصال، لطفا اتصال خود را بررسی کنید!',
                    type: 'danger',
                    buttonText: 'Ok',
                    buttonStyle: {
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 7
                    }
                })
            this.setState({ lazy: false })
        }
    }
    signUp = async () => {
        try {
            if (this.state.referralCode && this.state.referralCode.length > 0) {
                Axios.post('users/ReferralCode', {
                    REFERRAL_CODE: this.state.referralCode
                }).then(({ data }) => {
                    this.signUpUser()
                }).catch(err => {
                    this.setState({ lazy: false });
                    Toast.show({
                        text: 'کد شناسایی نامعتبر است.',
                        type: 'danger'
                    })
                });
            } else {
                this.signUpUser()
            }
        } catch (error) {
            console.warn(error.response,'error referal')
            error.response ?
                Toast.show({
                    text: error.response.data.message,
                    type: 'danger',
                    buttonText: 'بله',
                    buttonStyle: {
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 7
                    }
                }) :
                Toast.show({
                    text: 'خطا در اتصال، لطفا اتصال خود را بررسی کنید!',
                    type: 'danger',
                    buttonText: 'بله',
                    buttonStyle: {
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 7
                    }
                })
            this.setState({ lazy: false })
        }
    };

    checkForLogin = async () => {
        try {
            this.setState({ lazy: true })
            Axios.put('users/CheckUser', {
                USER_NAME: this.state.phoneNumber

            }).then(async ({ data }) => {
                console.log(data, 'testOtp')
                if (data.OTP === 0) {
                    this.setState({ step: 'password', err: '', lazy: false })
                } else if (data.OTP === 1) {

                    Axios.put('users/usercreateotp', {
                        USER_NAME: this.state.phoneNumber,
                        USER_ID: data.USER_ID
                    }).then(result => {
                        this.setState({ step: 'code', err: '', lazy: false })
                        ////
                        AsyncStorage.setItem('PhoneNumber', this.state.phoneNumber)
                  
                        ////////////////
                    })
                }
            }).catch(async e => {
                console.log('eeeerrr', e)
                Toast.show({
                    text: 'چنین شماره ایی موجود نیست لطفا ثبت نام کنید ',
                    type: 'danger',
                    buttonText: 'Ok',
                    buttonStyle: {
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 7
                    }
                })
                this.setState({  lazy: false })
                setTimeout(() => {
                    this.props.navigation.navigate('SignUp')

                }, 2500);
                // var getOtpBody;
                // if (this.props.navigation.getParam('isGuest')) {
                //     let guest = await AsyncStorage.getItem('profile')
                //     guest = JSON.parse(guest);
                //     console.log(JSON.stringify(guest, null, 5))
                //     getOtpBody = {
                //         "USER_NAME": guest.USER_NAME,
                //         "USER_ID": guest.ID,
                //         "SECOND_USER_NAME": this.state.phoneNumber
                //     }
                // } else {
                //     let guest = await AsyncStorage.getItem('profile')
                //     guest = JSON.parse(guest);
                //     getOtpBody = {
                //         "USER_NAME": guest.USER_NAME,
                //         "USER_ID": guest.ID,
                //         "SECOND_USER_NAME": this.state.phoneNumber
                //     }
                // }
                // console.log('getOtpBody', getOtpBody)
                // Axios.put('users/userotp', getOtpBody).then(res => {
                //     if (res && res.data) {
                //         this.setState({ step: 'codeForRegister', err: '', lazy: false, disabledSendAgain: true })
                //     }
                // })

            })

        } catch (error) {
            console.warn(error.response,'errror taeid')
            error.response ?
                Toast.show({
                    text: error.response.data.message,
                    type: 'danger',
                    buttonText: 'Ok',
                    buttonStyle: {
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 7
                    }
                }) :
                Toast.show({
                    text: 'Error connecting, please check your connection!',
                    type: 'danger',
                    buttonText: 'Ok',
                    buttonStyle: {
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 7
                    }
                })
            this.setState({ lazy: false })
        }
    }

    async updateCartCount() {
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


        let cart = await Axios.get('order/cart')
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

    enNumbers(value) {
        var persianNumbers = {
            '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
            '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
            // in case you type with arabic keyboard:
            '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
            '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
        };

        return value.split("").reduce(function (result, char) {
            if (char in persianNumbers) {
                return result + persianNumbers[char]
            }
            return result + char;
        }, "");
    }

    renderContentByStep(t) {
        if (this.state.step === 'phone') {
            return (
                <>
                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            width: '85%',
                            borderRadius: 17,
                            borderWidth: 0.5,
                            height: 40,
                            borderColor: 'gray'
                        }}
                    >
                        <Material
                            name="call"
                            size={16}
                            style={{ marginLeft: 10, color: 'gray' }}
                        />
                        <TextInput
                            keyboardType="numeric"
                            maxLength={11}
                            value={this.state.phoneNumber}
                            onChangeText={phoneNumber => this.setState({ phoneNumber })}
                            placeholder= {t('phone-number')}
                            style={{
                                ...styles.TextLight,
                                flex: 1,
                                paddingHorizontal: 10,
                                textAlign: 'right'
                            }}
                        />
                    </View>
                    {this.state.err === '' ? null : (
                        <Text
                            style={[styles.TextBold, { color: 'red', textAlign: 'center' }]}
                        >
                            {this.state.err}
                        </Text>
                    )}
                
                    
                    <TouchableWithoutFeedback
                        disabled={this.state.lazy}
                        onPress={this.checkForLogin}
                        // onPress={()=>{
                        //     const resetAction = StackActions.reset({
                        //         index: 0,
                        //         key:null,
                        //         actions: [NavigationActions.navigate({ routeName: 'Tab', })],
                        //     })
                        //     this.props.navigation.dispatch(resetAction)
                        // }}
                        
                    >
                        {this.state.lazy ? (
                            <ActivityIndicator style={{ margin: 10 }} />
                        ) : (
                            <View style={styles.button}>
                                <Material
                                    name="exit-to-app"
                                    color="white"
                                    size={20}
                                    style={{ marginLeft: 10, position: 'absolute', left: 0 }}
                                />
                                <Text
                                    style={[
                                        styles.TextBold,
                                        { color: 'white', textAlign: 'center' }
                                    ]}
                                >
                                    {t('confirm-phone-number')}
                                </Text>
                            </View>
                        )}
                    </TouchableWithoutFeedback>
                </>
            )
        } else if (this.state.step === 'register') {
            return (
                <>
                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            width: '85%',
                            borderRadius: 17,
                            borderWidth: 0.5,
                            height: 40,
                            borderColor: 'gray'
                        }}
                    >
                        <TextInput
                            value={this.state.name}
                            onChangeText={name => this.setState({ name })}
                            placeholder={t('firstname-lastname')}
                            style={{
                                ...styles.TextLight,
                                flex: 1,
                                paddingHorizontal: 10,
                                textAlign: 'right'
                            }}
                        />
                    </View>
                    <View
                        style={{
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            width: '85%',
                            borderRadius: 17,
                            borderWidth: 0.5,
                            height: 40,
                            borderColor: 'gray'
                        }}
                    >
                        <TextInput
                            value={this.state.referralCode}
                            onChangeText={referralCode => this.setState({ referralCode })}
                            placeholder="identifier-code"
                            style={{
                                ...styles.TextLight,
                                flex: 1,
                                paddingHorizontal: 10,
                                textAlign: 'right'
                            }}
                        />
                    </View>


                    {
                        
                           this.state.theme == 6 ?
                                <View
                                    style={{
                                        flexDirection: 'row-reverse',
                                        alignItems: 'center',
                                        width: '85%',
                                        borderRadius: 17,
                                        borderWidth: 0.5,
                                        height: 40,
                                        borderColor: 'gray'
                                    }}
                                >

                                    <TextInput
                                        value={this.state.pastTime}
                                        onChangeText={pastTime => this.setState({ pastTime })}
                                        placeholder={t('favorite-pastime')}
                                        style={{
                                            ...styles.TextLight,
                                            flex: 1,
                                            paddingHorizontal: 10,
                                            textAlign: 'right'
                                        }}
                                    />
                                </View>
                                : null
                     

                    }

                    {this.state.err === '' ? null : (
                        <Text
                            style={[styles.TextBold, { color: 'red', textAlign: 'center' }]}
                        >
                            {this.state.err}
                        </Text>
                    )}
                    <TouchableWithoutFeedback
                        disabled={this.state.lazy}
                        onPress={this.signUp()}
                    >
                        {this.state.lazy ? (
                            <ActivityIndicator style={{ margin: 10 }} />
                        ) : (
                            <View style={styles.button}>
                                <Material
                                    name="exit-to-app"
                                    color="white"
                                    size={20}
                                    style={{ marginLeft: 10, position: 'absolute', left: 0 }}
                                />
                                <Text
                                    style={[
                                        styles.TextBold,
                                        { color: 'white', textAlign: 'center' }
                                    ]}
                                >
                                    {t('signup')}
                                </Text>
                            </View>
                        )}
                    </TouchableWithoutFeedback>
                </>
            )
        } else if (this.state.step === 'code' || this.state.step === 'codeForRegister') {
            return (
                <>
                    <View
                        style={{
                            marginTop: 10,
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            width: '85%',
                            borderRadius: 17,
                            borderWidth: 0.5,
                            height: 40,
                            borderColor: 'gray'
                        }}
                    >
                        <Material
                            name="lock"
                            size={16}
                            style={{ marginLeft: 10, color: 'gray' }}
                        />
                        <TextInput
                            keyboardType="numeric"
                            value={this.state.password}
                            onChangeText={password => this.setState({ password })}
                            placeholder={t('code')}
                            style={{
                                ...styles.TextLight,
                                flex: 1,
                                paddingHorizontal: 10,
                                textAlign: 'right'
                            }}
                        />
                    </View>
                    {this.state.err === '' ? null : (
                        <Text
                            style={[styles.TextBold, { color: 'red', textAlign: 'center' }]}
                        >
                            {this.state.err}
                        </Text>
                    )}
                    <TouchableWithoutFeedback
                        disabled={this.state.lazy}
                        onPress={this.loginWithOtp}
                    >
                        {this.state.lazy ? (
                            <ActivityIndicator style={{ margin: 10 }} />
                        ) : (
                            <View style={styles.button}>
                                <Material
                                    name="exit-to-app"
                                    color="white"
                                    size={20}
                                    style={{ marginLeft: 10, position: 'absolute', left: 0 }}
                                />
                                <Text
                                    style={[
                                        styles.TextBold,
                                        { color: 'white', textAlign: 'center' }
                                    ]}
                                >
                                    {t('log-in')}
                                </Text>
                            </View>
                        )}
                    </TouchableWithoutFeedback>
                    {this.state.disabledSendAgain ?
                        <Counter counterGone={() => this.setState({ disabledSendAgain: false })} /> : null}
                    {!this.state.disabledSendAgain ? <TouchableWithoutFeedback onPress={this.checkForLogin}>
                        <View style={styles.button}>
                            <Material
                                name="exit-to-app"
                                color="white"
                                size={20}
                                style={{ marginLeft: 10, position: 'absolute', left: 0 }}
                            />
                            <Text
                                style={[
                                    styles.TextBold,
                                    { color: 'white', textAlign: 'center' }
                                ]}
                            >
                                {t('resend-code')}
                            </Text>
                        </View>
                    </TouchableWithoutFeedback>
                        : null}
                    <Text
                        style={[
                            styles.TextLight,
                            {
                                color: 'black',
                                textAlign: 'center',
                                fontSize: 12,
                                marginTop: 10
                            }
                        ]}
                    >
                        {t('phone-incorrect?')}
                        <TouchableWithoutFeedback
                            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                            onPress={() => this.setState({ step: 'phone' })}
                        >
                            <Text style={{ color: StyleSheet.value('$MainColor') }}>
                              {t('change-phone')}
                            </Text>
                        </TouchableWithoutFeedback>
                    </Text>
                </>
            )
        } else if (this.state.step === 'password') {
            return (
                <>
                    <View
                        style={{
                            marginTop: 10,
                            flexDirection: 'row-reverse',
                            alignItems: 'center',
                            width: '85%',
                            borderRadius: 17,
                            borderWidth: 0.5,
                            height: 40,
                            borderColor: 'gray'
                        }}
                    >
                        <Material
                            name="lock"
                            size={16}
                            style={{ marginLeft: 10, color: 'gray' }}
                        />
                        <TextInput
                            keyboardType="visible-password"
                            value={this.state.password}
                            onChangeText={password => this.setState({ password })}
                            secureTextEntry={this.state.secureTextEntry}
                            placeholder={t("password")}
                            style={{
                                ...styles.TextLight,
                                flex: 1,
                                paddingHorizontal: 10,
                                // textAlign: 'right'
                            }}
                        />
                        <TouchableWithoutFeedback
                            hitSlop={{ top: 10, bottom: 10, right: 10, left: 10 }}
                            onPress={() =>
                                this.setState({
                                    secureTextEntry: !this.state.secureTextEntry
                                })
                            }
                        >
                            <View style={{ padding: 5 }}>
                                {this.state.secureTextEntry ? (
                                    <MaterialCommunity
                                        name="eye-off"
                                        size={16}
                                        style={{ marginRight: 10, color: 'gray' }}
                                    />
                                ) : (
                                    <MaterialCommunity
                                        name="eye"
                                        size={16}
                                        style={{ marginRight: 10, color: 'gray' }}
                                    />
                                )}
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                    {this.state.err === '' ? null : (
                        <Text
                            style={[styles.TextBold, { color: 'red', textAlign: 'center' }]}
                        >
                            {this.state.err}
                        </Text>
                    )}
                    <TouchableWithoutFeedback
                        disabled={this.state.lazy}
                        onPress={this.loginWithPassword}
                    >
                        {this.state.lazy ? (
                            <ActivityIndicator style={{ margin: 10 }} />
                        ) : (
                            <View style={styles.button}>
                                <Material
                                    name="exit-to-app"
                                    color="white"
                                    size={20}
                                    style={{ marginLeft: 10, position: 'absolute', left: 0 }}
                                />
                                <Text
                                    style={[
                                        styles.TextBold,
                                        { color: 'white', textAlign: 'center' }
                                    ]}
                                >
                        {t('log-in')}
                                </Text>
                            </View>
                        )}
                    </TouchableWithoutFeedback>
                    <Text
                        style={[
                            styles.TextLight,
                            {
                                color: 'black',
                                textAlign: 'center',
                                fontSize: 12,
                                marginTop: 10
                            }
                        ]}
                    >
                        {t('phone-incorrect?')}
                        <TouchableWithoutFeedback
                            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                            onPress={() => this.setState({ step: 'phone' })}
                        >
                            <Text style={{ color: StyleSheet.value('$MainColor') }}>
                                {t('change-phone')}
                            </Text>
                        </TouchableWithoutFeedback>
                    </Text>

                    <Text
                        style={[
                            styles.TextLight,
                            {
                                color: 'black',
                                textAlign: 'center',
                                fontSize: 12,
                                marginTop: 10
                            }
                        ]}
                    >
                        {t('forget-pass')}
                        <TouchableWithoutFeedback
                            hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                            onPress={() => this.props.navigation.navigate('Forgotpassword',{pushId:this.state.pusheId,deviceId:DeviceInfo.getBuildNumber(),
                                isGuest :this.props.navigation.getParam('isGuest')})}
                        >
                            <Text style={{ color: StyleSheet.value('$MainColor') }}>
                            {t('forget-pass')}                         
                               </Text>
                        </TouchableWithoutFeedback>{' '}

                    </Text>
                </>
            )
        }

    }

    render() {
        const {t}=this.props
        return (
            <View style={styles.container}>
                {/* <FastImage
                    source={require('../../assest/login_img.png')}
                    resizeMode="cover"
                    style={{ width, height: 130 }}
                /> */}
                <KeyboardAvoidingView
                    behavior="padding"
                    enabled={Platform.OS === 'android' ? false : true}
                    style={{ width: '100%', justifyContent: 'center', flex: 1 }}
                >
                    <View
                        style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
                    >
                        <View style={{ alignItems: 'center', marginBottom: 30 }}>
                            <FastImage
                                source={store.setting ? { uri: config.ImageBaners + '/assets/img/settings/' + store.setting.LOGO } : require('../../assest/logo.png')}
                                resizeMode="contain"
                                style={{ width: 200, height: 100 }}
                            />
                            <Text style={[styles.TextLight]}>
                                {store.setting.NAME}
                            </Text>
                        </View>
                        {this.renderContentByStep(t)}
                    </View>
                </KeyboardAvoidingView>
            </View>
        )
    }
}
export default withTranslation()(App);
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '$BackgroundColor',
        alignItems: 'center'
    },
    TextLight: {
        // fontFamily: '$IRANYekanLight',
        fontWeight: '$WeightLight'
    },
    TextBold: {
        // fontFamily: '$IRANYekanBold',
        fontWeight: '$WeightBold'
    },
    // TextRegular: {
    // 	fontFamily: '$IRANYekanRegular',
    // 	fontWeight: '$WeightRegular'
    // },
    // TextInput: {
    // 	fontFamily: '$IRANYekanLight',
    // 	fontWeight: '$WeightLight',
    // 	height: 50,
    // 	textAlign: 'right'
    // },
    button: {
        borderRadius: 17,
        width: '50%',
        height: 40,
        backgroundColor: '$MainColor',
        marginTop: 10,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center'
    }
})

