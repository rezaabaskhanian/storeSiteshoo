/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import color from 'color'
import React, { Component, PureComponent } from 'react'
import {
    Image, Text, View, Linking, Dimensions, ActivityIndicator,
    AsyncStorage, Alert, TouchableWithoutFeedback, ScrollView, TouchableOpacity, TextInput, Modal
} from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import { Appbar, TouchableRipple } from 'react-native-paper'
import { Icon, Input, Toast } from 'native-base'
import FastImage from 'react-native-fast-image'
import { StackActions, NavigationActions, withNavigationFocus } from 'react-navigation'
import Axios from 'axios'
import { config } from '../../../App'

import Material from "react-native-vector-icons/MaterialIcons";
import { state as store } from "react-beep";
import { withTranslation } from 'react-i18next';

class Profile extends Component {

    state = {
        loading: true,
        data: {},
        wallet: 0,
        amount: 1000,
        confPass: '',
        pass: '',
        otp: '',
        userId: '',
        showWalletDialog: false,
        showPassDialog: false,
        isGuest: false,
        list: [
            {
                id: '0',
                screen: 'OrderHistory',
                icon: 'shopping-basket',
                name: this.props.t('order-list'),
                type: 'MaterialIcons'
            },
            // {
            //     id: '13',
            //     screen: 'HomeBox',
            //     icon: 'shopping-basket',
            //     name: 'هوم باکس',
            //     type: 'MaterialIcons' 
            // },

            //   {
            //     id: '13',
            //     screen: 'Wheel_Luck',
            //     icon: 'camera',
            //     name: 'گردونه شانس',
            //     type: 'MaterialIcons'
            // },
            {
                id: '1',
                screen: 'Turnover',
                icon: 'attach-money',
                name: this.props.t('financial-management'),
                type: 'MaterialIcons'
            },
            {
                id: '2',
                screen: 'Favorite',
                icon: 'favorite',
                name: this.props.t('favorite'),
                type: 'MaterialIcons'
            },
            {
                id: '3',
                screen: null,
                icon: 'local-offer',
                name: this.props.t('discounts-offers'),
                type: 'MaterialIcons'
            },
            {
                id: '4',
                screen: 'ShareToFriends',
                icon: 'person-add',
                name : this.props.t('introduce-friends'),
                type: 'MaterialIcons'
            },
            {
                id: '5',
                screen: 'Rolls',
                icon: 'law',
                name: this.props.t('rules'),
                type: 'Octicons'
            },
            {
                id: '6',
                screen: 'Address',
                icon: 'location-on',
                name: this.props.t('manage-address'),
                type: 'MaterialIcons'
            },
            // {
            //     id: '7',
            //     screen: 'SupportPage',
            //     icon: 'phone',
            //     name: 'پشتیبانی',
            //     type: 'MaterialIcons'
            // },
            {
                id: '8',
                screen: 'Help',
                icon: 'help-circle',
                name : this.props.t('help'),
                type: 'MaterialCommunityIcons'
            },
            {
                id: '9',
                screen: 'FreqQuestions',
                icon: 'creative-commons',
                name: this.props.t('frequently-asked-questions'),
                type: 'FontAwesome5'
            },
            {
                id: '10',
                screen: 'ReturnOf',
                icon: 'backburger',
                 name: this.props.t('product-return-conditions'),
                type: 'MaterialCommunityIcons'
            },
            {
                id: '11',
                screen: 'ContactUs',
                icon: 'comment',
                name: this.props.t('contactus'),
                type: 'MaterialCommunityIcons'
            },
            {
                id: '12',
                screen: 'AboutUs',
                icon: 'users',
                name: this.props.t('about-us'),
                type: 'FontAwesome'
            }
        ],
        theme: ''
    }

    fetchData = async () => {
        try {
            let user = await Axios.get('users/me')
            let wallet = await Axios.get('wallet/' + user.data.ID)
            this.setState({ data: user.data, loading: false, wallet: wallet.data.FINANCIAL_BALANCE_AFTER })
        } catch (error) {
            this.setState({ loading: false })
        }
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


    _onSend() {

       
        AsyncStorage.getItem('profile').then(data => {

            let datas =JSON.parse(data)

            
        AsyncStorage.setItem('PhoneNumber',datas.USER_NAME)
          
            Axios.put(`/users/usercreateotp`,{'USER_NAME': datas.USER_NAME }).then(({ data }) => {

            
                Toast.show({
                    text: 'کد برای شما ارسال شد ',
                    type: 'success',
                })
                setTimeout(() => {
                    this.setState({ showPassDialog: true })
                }, 2500),
                    // console.warn(data)
                    this.setState({ userId: data.ID })
            }).catch((err) => {
                
                Toast.show({
                    text: 'Server error',
                    type: 'warning',
                })
            })
        })
    }
    _SetCode() {
        AsyncStorage.getItem('PhoneNumber').then(phoneNumber => {
      
            Axios.put('/users/verify/', { 'USER_NAME': phoneNumber, 'OTP': this.state.otp }).then((data) => {
                this._SetPassword()
            }).catch(err => {
                Toast.show({
                    position: 'top',
                    text: 'The entered code is incorrect',
                    type: 'danger',
                })
            })
        })
    }
    _SetPassword() {
        AsyncStorage.getItem('PhoneNumber').then(phoneNumber => {

            if (this.state.pass.length < 4) {
                Toast.show({
                    position: 'top',
                    text: 'The password is at least 4 characters long!',
                    type: 'danger',
                })
            }
            if ((this.state.pass === this.state.confPass)) {

                Axios.put('/users/resetPassword', { 'USER_NAME': phoneNumber, 'OTP': this.state.otp, 'PASSWORD': this.state.pass, 'USER_ID': this.state.userId }).then(({ data }) => {
                    Toast.show({
                        position: 'top',
                        text: 'Password changed successfully!',
                        type: 'success'
                    })

                    this.setState({ loading: false, showPassDialog: false })

                }).catch(err => {
                  
                    Toast.show({
                        text: err.response.data.message
                    })

                })
            }
            else {

                Toast.show({
                    position: 'top',
                    text: 'The password and its repetition do not match!',
                    type: 'warning',
                })
            }
        })
    }

    getTheme = () => {
        AsyncStorage.getItem('theme').then(theme => {
            this.setState({ theme: theme })

        })
    }
 
		 

    async componentDidMount() {
     

        this.fetchData()
        this.getTheme()
        // AsyncStorage.getItem('isGuest').then(guest => {
            AsyncStorage.getItem('profile').then(data => {

                let datas =JSON.parse(data)
    
                
            AsyncStorage.setItem('PhoneNumber',datas?.USER_NAME)
       
            if (datas.ROLE_ID == '7') {
                this.setState({
                    isGuest: true,
                    theme: '',
                    list: [
                        {
                            id: '100',
                            screen: 'Auth',
                            icon: 'user',
                            name: this.props.t("log-in"),
                            type: 'FontAwesome'
                        },
                        // {
                        //     id: '13',
                        //     screen: 'HomeBox',
                        //     icon: 'shopping-basket',
                        //     name: 'هوم باکس',
                        //     type: 'MaterialIcons'
                        // },
                        {
                            id: '5',
                            screen: 'Rolls',
                            icon: 'law',
                            name: this.props.t('rules'),
                            type: 'Octicons'
                        },
                        {
                            id: '6',
                            screen: 'Address',
                            icon: 'location-on',
                            name: this.props.t("manage-address"),
                            type: 'MaterialIcons'
                        },
                        // {
                        //     id: '7',
                        //     screen: 'SupportPage',
                        //     icon: 'phone',
                        //     name: 'پشتیبانی',
                        //     type: 'MaterialIcons'
                        // },
                        {
                            id: '8',
                            screen: 'Help',
                            icon: 'help-circle',
                            name: this.props.t('guide'),
                            type: 'MaterialCommunityIcons'
                        },
                        {
                            id: '9',
                            screen: 'FreqQuestions',
                            icon: 'creative-commons',
                            name: this.props.t('frequently-asked-questions'),
                            type: 'FontAwesome5'
                        },
                        {
                            id: '10',
                            screen: 'ReturnOf',
                            icon: 'backburger',
                            name: this.props.t('product-return-conditions'),
                            type: 'MaterialCommunityIcons'
                        },
                        {
                            id: '11',
                            screen: 'ContactUs',
                            icon: 'comment',
                            name: this.props.t('contactus'),
                            type: 'MaterialCommunityIcons'
                        },
                        {
                            id: '12',
                            screen: 'AboutUs',
                            icon: 'users',
                            name:this.props.t('about-us'),
                            type: 'FontAwesome'
                        }
                    ]
                })
            }
        })
    }

    componentDidUpdate(prevProps) {
        if (prevProps.isFocused !== this.props.isFocused) {
            this.fetchData()
        }
    }

    render() {
        const { t } = this.props;
        if (this.state.loading)
            return (
                <View style={styles.container}>
                     
                    <Appbar.Header style={{ backgroundColor: 'white' }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ ...styles.TextBold, color: 'black', fontSize: 18 }}>{t('profile')}</Text>
                        </View>
                        {!this.state.isGuest && <TouchableWithoutFeedback
                            onPress={async () => {
                                try {
                                    Alert.alert(t('exit'), t('intention-to-leave?'), [
                                        {
                                            text: t('yes'),
                                            onPress: async () => {
                                                // PushPole.getId(pusheId => {
                                                    Axios.put('/users/logout', {
                                                        'PUSH_ID': ''
                                                    }).then(async ({ data }) => {
                                                        if (data) {
                                                            store.cart_count = 0
                                                            store.note_count = 0
                                                            await AsyncStorage.removeItem('token')
                                                            // this.props.navigation.navigate('Auth')
                                                            const resetAction = StackActions.reset({
                                                                index: 0,
                                                                key: undefined,
                                                                actions: [NavigationActions.navigate({ routeName: 'Auth' })],
                                                            })
                                                            this.props.navigation.dispatch(resetAction)
                                                        }
                                                    }).catch(err => {
                                                        Toast.show({
                                                            type: 'danger',
                                                            text: `خطا در ثبت کد سفارش( ${err.response.code})`
                                                        })
                                                        console.log(err.response)
                                                    })
                                                // })


                                            }
                                        },
                                        {
                                            text: 'نه'
                                        }
                                    ])

                                } catch (error) {
                                    console.log(error)
                                }
                            }}
                        >
                            <View style={{ padding: 5, position: 'absolute', left: 0 }}>
                                <Icon name='exit-to-app' color={StyleSheet.value('$MainColor')} size={25}
                                    type='MaterialIcons' style={{ color: StyleSheet.value('$MainColor') }} />
                            </View>
                        </TouchableWithoutFeedback>}

                    </Appbar.Header>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <ActivityIndicator />
                    </View>
                </View>
            )
        return (
            <View style={styles.container}>
                
                <Appbar.Header style={{ backgroundColor: 'white' }}>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ ...styles.TextBold, color: 'black', fontSize: 18 }}>{t('profile')}</Text>
                    </View>
                    {!this.state.isGuest && <TouchableWithoutFeedback
                        onPress={async () => {
                            try {
                                Alert.alert(t('exit'), t('intention-to-leave?'), [
                                    {
                                        text: t('yes'),
                                        onPress: async () => {
                                            // PushPole.getId(pusheId => {
                                                Axios.put('/users/logout', {
                                                    'PUSH_ID': ''
                                                }).then(async ({ data }) => {
                                                    if (data) {
                                                        store.cart_count = 0
                                                        store.note_count = 0
                                                        await AsyncStorage.removeItem('token')
                                                        const resetAction = StackActions.reset({
                                                            index: 0,
                                                            key:null,
                                                            actions: [NavigationActions.navigate({ routeName: 'HomeStack' })],
                                                        })
                                                        this.props.navigation.dispatch(resetAction)
                                                    }
                                                }).catch(err => {
                                                    Toast.show({
                                                        type: 'danger',
                                                        text: `خطا در ثبت کد سفارش( ${err.response.code})`
                                                    })
                                                    console.log(err.response)
                                                })
                                            // })


                                        }
                                    },
                                    {
                                        text: t('no')
                                    }
                                ])

                            } catch (error) {
                                console.log(error)
                            }
                        }}
                    >
                        <View style={{ padding: 5, position: 'absolute', left: 0 }}>
                            <Icon name='exit-to-app' color={StyleSheet.value('$MainColor')} size={25}
                                type='MaterialIcons' style={{ color: StyleSheet.value('$MainColor') }} />
                        </View>
                    </TouchableWithoutFeedback>}
                </Appbar.Header>
                <ScrollView>
                    <View style={{ height: 170, width: '100%' }}>
                        <View style={{ flex: 1, backgroundColor: StyleSheet.value('$BackgroundColor') }} />
                        <View style={{ flex: 1, backgroundColor: 'white' }} />
                        <TouchableWithoutFeedback
                            onPress={() => {
                                if (!this.state.isGuest) {
                                    this.props.navigation.push('EditProfile', { item: this.state.data })
                                }
                            }}
                        >
                            <View style={{
                                height: '100%',
                                paddingTop: 30,
                                width: '100%',
                                position: 'absolute',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>

                                <View style={{
                                    height: 80,
                                    width: 80,
                                    overflow: 'hidden',
                                    backgroundColor: 'white',
                                    borderRadius: 40
                                }}>
                                    {
                                        this.state.data.AVATAR ?

                                            <FastImage
                                                source={{ uri: config.BaseUrl + '/assets/img/users/' + this.state.data.AVATAR }}
                                                style={{ height: 80, width: 80 }}
                                            /> :
                                            <FastImage
                                                source={require('../../../assest/avatar.png')}
                                                style={{ height: 80, width: 80 }}
                                                tintColor={StyleSheet.value('$MainColor')}
                                            />
                                    }
                                </View>
                                <Text style={{
                                    ...styles.TextBold,
                                    color: 'black',
                                    fontSize: 16
                                }}>{this.state.data.NAME}</Text>
                                {!this.state.isGuest && <>
                                    <Text style={{
                                        ...styles.TextBold,
                                        color: 'black',
                                        fontSize: 13
                                    }}> {t('inventory')} {config.priceFix(this.state.wallet)} {t('currency-unit')}</Text>

                                    {
                                        this.state.theme == 6 ?
                                            [<Text style={{
                                                ...styles.TextBold,
                                                color: 'black',
                                                fontSize: 13
                                            }}> Points: {this.state.data.POINT} </Text>,
                                            <Text style={{
                                                ...styles.TextBold,
                                                color: 'black',
                                                fontSize: 13
                                            }}> Rank: {this.state.data.RANK} </Text>
                                            ]
                                            : null
                                    }
                                    <Text style={{
                                        ...styles.TextRegular,
                                        color: 'gray',
                                        fontSize: 13
                                    }}>{this.state.data.USER_NAME}</Text>
                                </>}
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                    {/* {!this.state.isGuest && <TouchableOpacity key={'0'} activeOpacity={0.8}
                        onPress={() => this.setState({ showWalletDialog: true })}
                        style={{
                            flexDirection: 'row',
                            height: 45,
                            justifyContent: 'flex-end',
                            paddingRight: 10,
                            marginLeft: 15,
                            marginTop: 4,
                            backgroundColor: '#F5F5F5',
                            paddingVertical: 5,
                            alignItems: 'center',
                            marginRight: 15,
                            borderRadius: 4,
                            marginBottom: 4,
                        }}>
                        <Text
                            style={{
                                ...styles.TextRegular,
                                fontSize: 15, marginRight: 30, color: '#76757B',
                                textAlign: 'right'
                            }}
                            fontWeight='Medium'
                        >
                            افزایش اعتبار
                        </Text>
                        <Icon
                            style={{ marginHorizontal: 10, color: StyleSheet.value('$MainColor') }}
                            name="add-circle-outline"
                            size={18}
                            type="MaterialIcons"
                        />
                    </TouchableOpacity>} */}
                    {!this.state.isGuest && <TouchableOpacity key={'0'} activeOpacity={0.8}
                        onPress={() => {
                            this._onSend()
                        }}
                        style={{
                            flexDirection: 'row',
                            height: 45,
                            justifyContent: 'flex-end',
                            paddingRight: 10,
                            marginLeft: 15,
                            marginTop: 30,
                            backgroundColor: '#F5F5F5',
                            paddingVertical: 5,
                            alignItems: 'center',
                            marginRight: 15,
                            borderRadius: 4,
                            marginBottom: 4,
                        }}>
                        <Text
                            style={{
                                ...styles.TextRegular,
                                fontSize: 15, marginRight: 30, color: '#76757B',
                                textAlign: 'right'
                            }}
                            fontWeight='Medium'
                        >
                    {t('change-pass')}
                        </Text>
                        <Material
                            name="lock"
                            size={18}
                            style={{ marginHorizontal: 10, color: StyleSheet.value('$MainColor') }}
                        />
                    </TouchableOpacity>}
                    {
                        this.state.list.map(item => {
                            return (
                                <TouchableOpacity key={item.id} activeOpacity={0.8}
                                    onPress={async () => {
                                        if (item.id === '100') {
                                            let token = await AsyncStorage.getItem('token')
                                            await AsyncStorage.removeItem('token')
                                            await AsyncStorage.removeItem('isGuest')
                                            this.props.navigation.navigate('Auth', { token, isGuest: true })
                                        } else {
                                            this.props.navigation.push(item.screen)
                                        }
                                    }}
                                    style={{
                                        flexDirection: 'row',
                                        height: 45,
                                        justifyContent: 'flex-end',
                                        paddingRight: 10,
                                        marginLeft: 15,
                                        marginTop: 4,
                                        backgroundColor: '#F5F5F5',
                                        paddingVertical: 5,
                                        alignItems: 'center',
                                        marginRight: 15,
                                        borderRadius: 4,
                                        marginBottom: 4,
                                    }}>
                                    <Text
                                        style={{
                                            ...styles.TextRegular,
                                            fontSize: 15, marginRight: 30, color: '#76757B',
                                            textAlign: 'right'
                                        }}
                                        fontWeight='Medium'
                                    >
                                        {item.name}
                                    </Text>
                                    <Icon
                                        style={{ marginHorizontal: 10, color: StyleSheet.value('$MainColor') }}
                                        name={item.icon}
                                        size={18}
                                        type={item.type}
                                    />
                                </TouchableOpacity>
                            )
                        })
                    }
                    <View style={{ flexDirection: 'row-reverse', justifyContent: 'space-around' }}>
                        <TouchableOpacity
                            onPress={() => Linking.openURL(store.allSetting['INSTAGRAM'])}
                            style={{
                                flexDirection: 'row', height: 45, width: 45,
                                justifyContent: 'center', marginLeft: 15, marginTop: 10,
                                backgroundColor: '#F5F5F5',
                                alignItems: 'center', marginRight: 15, borderRadius: 4, marginBottom: 10,
                            }}>
                            <Image
                                source={require('../../../assest/instagram.png')}
                                style={{
                                    color: '#76757B',
                                    height: 30, width: 30
                                }}
                            />

                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => Linking.openURL(store.allSetting['TELEGRAM'])}
                            style={{
                                flexDirection: 'row', height: 45, width: 45,
                                justifyContent: 'center', marginLeft: 15, marginTop: 10,
                                backgroundColor: '#F5F5F5',
                                alignItems: 'center', marginRight: 15, borderRadius: 4, marginBottom: 10,
                            }}>
                            <Image
                                source={require('../../../assest/telegram.png')}
                                style={{
                                    color: '#76757B',
                                    height: 30, width: 30
                                }}
                            />

                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => Linking.openURL(store.allSetting['FACEBOOK'])}
                            style={{
                                flexDirection: 'row', height: 45, width: 45,
                                justifyContent: 'center', marginLeft: 15, marginTop: 10,
                                backgroundColor: '#F5F5F5',
                                alignItems: 'center', marginRight: 15, borderRadius: 4, marginBottom: 10,
                            }}>
                            <Image
                                source={require('../../../assest/facebook.png')}
                                style={{
                                    color: '#76757B',
                                    height: 30, width: 30
                                }}
                            />

                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => Linking.openURL(store.allSetting['LINKEDIN'])}
                            style={{
                                flexDirection: 'row', height: 45, width: 45,
                                justifyContent: 'center', marginLeft: 15, marginTop: 10,
                                backgroundColor: '#F5F5F5',
                                alignItems: 'center', marginRight: 15, borderRadius: 4, marginBottom: 10,
                            }}>
                            <Image
                                source={require('../../../assest/linkedin.png')}
                                style={{
                                    color: '#76757B',
                                    height: 30, width: 30
                                }}
                            />

                        </TouchableOpacity>
                    </View>

                </ScrollView>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showWalletDialog}
                    onRequestClose={() => {
                        this.setState({ showWalletDialog: false })
                    }}>

                    <View style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        backgroundColor: color('gray').alpha(0.8).darken(0.2)
                    }}>
                        <View style={{
                            backgroundColor: 'white',
                            height: 250,
                            borderTopLeftRadius: 17,
                            borderTopRightRadius: 17,
                            alignItems: 'center'
                        }}>
                            <View>
                                <TouchableOpacity style={{ margin: 10, position: 'absolute', left: -90 }} onPress={() => {
                                    this.setState({ showWalletDialog: false })
                                }}>
                                    <Icon
                                        style={{ color: StyleSheet.value('$MainColor') }}
                                        name="cancel"
                                        size={18}
                                        type="MaterialIcons"
                                    />

                                </TouchableOpacity>
                                <Text style={{ ...styles.TextBold, color: 'black', fontSize: 18, margin: 10 }}> Increase
                                    Wallet credit</Text>
                            </View>
                            <Input
                                placeholder='موجودی (تومان)'
                                value={this.state.amount}
                                keyboardType="numeric"
                                onChangeText={(amount) => this.setState({ amount })}
                                style={[styles.TextLight, {
                                    padding: 10,
                                    textAlignVertical: 'top',
                                    flex: 0.2,
                                    borderRadius: 17,
                                    borderWidth: 0.5,
                                    borderColor: 'gray',
                                    width: '90%', ...styles.TextRegular
                                }]}
                            />

                            <TouchableWithoutFeedback
                                onPress={async () => {
                                    try {
                                        Axios.post('/payment/pay', {
                                            'resNum': 1,
                                            'PayType': 'app',
                                            'RedirectType': 'wallet',
                                            'URID': this.state.data.user_roles[0].ID,
                                            'amount': this.state.amount * 10,
                                            'TOTAL': this.state.amount,
                                        }).then(async (response) => {
                                          
                                            this.setState({ showWalletDialog: false, amount: 0 })
                                            Linking.openURL(response.data.url)
                                        }).catch(err => {
                                            Toast.show({
                                                type: 'danger',
                                                text: `خطا در ثبت کد سفارش ( ${err.response.code})`
                                            })
                                            console.log(err.response)
                                        })
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }}
                            >
                                <View style={{
                                    ...styles.button,
                                    margin: 20,
                                    alignSelf: 'center',
                                    width: 170,
                                    justifyContent: 'center'
                                }}>

                                    <Text
                                        style={[styles.TextBold, { color: 'white', textAlign: 'center' }]}>The payment </Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.showPassDialog}
                    onRequestClose={() => {
                        this.setState({ showPassDialog: false })
                    }}>


                    <View style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        backgroundColor: color('gray').alpha(0.8).darken(0.2)
                    }}>

                        <View style={{
                            backgroundColor: 'white',
                            height: 350,
                            borderTopLeftRadius: 17,
                            borderTopRightRadius: 17,
                            alignItems: 'center'
                        }}>
                            <View>
                                <TouchableOpacity style={{ margin: 10, position: 'absolute', left: -90 }} onPress={() => {
                                    this.setState({ showPassDialog: false })
                                }}>
                                    <Icon
                                        style={{ color: StyleSheet.value('$MainColor') }}
                                        name="cancel"
                                        size={18}
                                        type="MaterialIcons"
                                    />

                                </TouchableOpacity>
                                <Text style={{ ...styles.TextBold, color: 'black', fontSize: 18, margin: 10 }}> {t('change-pass')}</Text>
                            </View>
                            <Input
                                placeholder='کد ارسالی'
                                value={this.state.otp}
                                secureTextEntry={true}
                                onChangeText={(otp) => this.setState({ otp })}
                                style={[styles.TextLight, {
                                    paddingHorizontal: 10,
                                    marginBottom: 10,
                                    textAlignVertical: 'top',
                                    flex: 0.2,
                                    borderRadius: 17,
                                    borderWidth: 0.5,
                                    borderColor: 'gray',
                                    width: '90%', ...styles.TextRegular
                                }]}
                            />

                            <Input
                                placeholder={t('new-pass')}
                                value={this.state.pass}
                                secureTextEntry={true}
                                onChangeText={(pass) => this.setState({ pass })}
                                style={[styles.TextLight, {
                                    padding: 10,
                                    marginBottom: 10,
                                    textAlignVertical: 'top',
                                    flex: 0.2,
                                    borderRadius: 17,
                                    borderWidth: 0.5,
                                    borderColor: 'gray',
                                    width: '90%', ...styles.TextRegular
                                }]}
                            />

                            <Input
                                placeholder={t('repeat-pass')}
                                value={this.state.confPass}
                                secureTextEntry={true}
                                onChangeText={(confPass) => this.setState({ confPass })}
                                style={[styles.TextLight, {
                                    padding: 10,
                                    marginBottom: 10,
                                    textAlignVertical: 'top',
                                    flex: 0.2,
                                    borderRadius: 17,
                                    borderWidth: 0.5,
                                    borderColor: 'gray',
                                    width: '90%', ...styles.TextRegular
                                }]}
                            />

                            <TouchableWithoutFeedback
                                onPress={async () => {
                                    // this._SetCode()
                                    try {
                                        AsyncStorage.getItem('PhoneNumber').then(phoneNumber => {
                                        Axios.put('users/password', {
                                            "OLD_PASS": this.enNumbers(phoneNumber+this.state.otp),
                                            "NEW_PASS": this.enNumbers(this.state.pass),
                                            "CONFIRM_PASS": this.enNumbers(this.state.confPass)
                                        }).then(async (response) => {
                                           
                                            this.setState({ showPassDialog: false })
                                        }).catch(err => {
                                            this.setState({ showPassDialog: false })

                                            Toast.show({
                                                type: 'danger',
                                                text: `خطا در اعمال( ${err.response.code})`
                                            })
                                            console.log(err.response)
                                        })
                                    })
                                    } catch (error) {
                                        console.log(error)
                                    }
                                }}
                            >
                                <View style={{
                                    ...styles.button,
                                    margin: 20,
                                    alignSelf: 'center',
                                    width: 170,
                                    justifyContent: 'center'
                                }}>

                                    <Text
                                        style={[styles.TextBold, { color: 'white', textAlign: 'center' }]}>{t('confirm')}</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </View>
                </Modal>
            </View >
        )
    }
}

export default withNavigationFocus( withTranslation()(Profile))
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '$BackgroundColor'
    },
    TextBold: {
        // fontFamily: '$IRANYekanBold',
        fontWeight: '$WeightBold'
    },
    TextRegular: {
        // fontFamily: '$IRANYekanRegular',
        fontWeight: '$WeightRegular'
    },
    button: {
        borderRadius: 17,
        width: 80,
        height: 40,
        backgroundColor: '$MainColor',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'center'
    }

})
