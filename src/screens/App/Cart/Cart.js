/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component, PureComponent } from 'react'
import {
    Text,
    View,
    Dimensions,
    ActivityIndicator,
    TouchableWithoutFeedback,
    TextInput,
    ScrollView,
    Modal,
    Alert, AsyncStorage,
    TouchableOpacity,
    Linking
} from 'react-native'
import StyleSheet, { flatten } from 'react-native-extended-stylesheet'
import { Appbar } from 'react-native-paper'
import FastImage from 'react-native-fast-image'
import color from 'color'
import { NavigationEvents } from 'react-navigation'
import Material from 'react-native-vector-icons/MaterialIcons'
import Axios from 'axios'
import { config } from '../../../App'
import { Toast, Input, Button, Item, Spinner, CheckBox } from 'native-base'
import { BeepProp } from '../../../store/BeepProp'
import { state as store, orderType, Beep } from 'react-beep'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import  CartDetail from './CartProductDetail'
import { withTranslation } from 'react-i18next';
class CartItem extends Beep(BeepProp, Component) {
    state = {
        count: this.props.data.COUNT,
        data: this.props.data,
        lazy: false,
        lock: this.props.data.DELETED,
        modalVisible: false,
        disc: this.props.data.DESCRIPTION,
        confirm: this.props.confirm.CONFIRM_BY_CUSTOMER,
        showImage:false,
        phone:''
    };

    setModalVisible(visible) {
        this.setState({ modalVisible: visible })
    }

    handleError  (){
        this.setState({showImage:true})
    }
       
     getPhone =async()=>{
        AsyncStorage.getItem('NewPhoneNumber').then((data)=>{
   
          this.setState({
            phone:data
          })
        })
     }  

    updateCart() {
        Axios.get('order/OrderProductCounter').then((response) => {
            store.cart_count = response.data[0].COUNTER
        }).catch((error) => {
            console.log('add errror', error)
        })
    }

    componentDidMount() {
        if (!this.state.lock)
            this.props.update_price(this.state.count * this.props.data.PRICE_AFTER_OFFER)
        this.getPhone()
    }

    render() {
        const {t} =this.props
        const stepCount = (this.state.data && this.state.data.product_store && this.state.data.product_store.product) ? this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? 0.5 : 1 : 0
        if (this.state.count === 0) return null

      
        return (
            
            <View style={{
                flex: 1,
                marginVertical: 5,
                width: '100%',
                alignSelf: 'center',
                flexDirection: 'row-reverse',
                height: 70,
                justifyContent: 'space-between',
                alignItems: 'center',
                zIndex: 1
            }}>
           
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state.modalVisible}
                    onRequestClose={() => {
                        this.setModalVisible(false)
                    }}>
                    <View style={{
                        flex: 1,
                        justifyContent: 'flex-end',
                        backgroundColor: color('gray').alpha(0.8).darken(0.2)
                    }}>
                        <View style={{
                            backgroundColor: 'white',
                            height: 300,
                            borderTopLeftRadius: 17,
                            borderTopRightRadius: 17,
                            alignItems: 'center'
                        }}>
                            <Text style={{
                                ...styles.TextBold,
                                color: 'black',
                                fontSize: 18,
                                margin: 10
                            }}> { t('details')}  {(this.state.data && this.state.data.product_store && this.state.data.product_store.product) ? this.props.data.product_store.product.NAME : ''}</Text>
                            <View style={{
                                flex: 1,
                                marginVertical: 5,
                                width: '90%',
                                borderRadius: 17,
                                borderWidth: 0.5,
                                borderColor: 'gray'
                            }}>
                                <TextInput
                                    placeholder={t('your-description')}
                                    multiline
                                    value={this.state.disc}
                                    onChangeText={(disc) => this.setState({ disc })}
                                    style={[styles.TextLight, {
                                        padding: 10,
                                        textAlignVertical: 'top',
                                        flex: 1, ...styles.TextRegular
                                    }]}
                                />
                            </View>
                            <TouchableWithoutFeedback
                                onPress={() => {
                                    try {
                                        Axios.put('order/cart', {
                                            'ORDER_ID': this.props.data.ORDER_ID,
                                            'PRODUCT_ID': this.props.data.ID,
                                            'COUNT': this.state.count,
                                            'DESCRIPTION': this.state.disc
                                        })
                                        this.setModalVisible(!this.state.modalVisible)

                                    } catch (error) {
                                        console.log(error, error.response)
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

                                    <Text style={[styles.TextBold, { color: 'white', textAlign: 'center' }]}> {t('send')}</Text>
                                </View>
                            </TouchableWithoutFeedback>

                        </View>
                    </View>
                </Modal>

                <View style={{
                    backgroundColor: 'white',
                    height: '100%',
                    width: '85%',
                    marginLeft: 0,
                    marginRight: 0,
                    borderRadius: 7,
                    overflow: 'hidden',
                    flexDirection: 'row-reverse',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    {
                        this.state.lock ?
                            <View style={{
                                ...StyleSheet.absoluteFill,
                                backgroundColor: 'rgba(200,200,200,0.9)',
                                zIndex: 100,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}>
                                <Text style={{ ...styles.TextBold, color: 'black', fontSize: 16 }}>{t('does-not-exist')}</Text>
                            </View>
                            : null
                    }
                    <FastImage
                    onError={()=>this.handleError()}
                        source={this.state.showImage? require('../../../assest/productNew.png'):{ uri: config.ImageBaners + config.ProductSubUrl + ((this.state.data && this.state.data.product_store && this.state.data.product_store.product) ? this.props.data.product_store.product.IMAGE : '') }}
                        // source={{ uri: config.BaseUrl + config.ProductSubUrl + ((this.state.data && this.state.data.product_store && this.state.data.product_store.product) ? this.props.data.product_store.product.IMAGE : '') }}
                        style={{ height: '100%', width: 70 }} resizeMode='contain' />

                    <View style={{
                        flex: 1,
                        paddingVertical: 5,
                        paddingHorizontal: 10,
                        flexDirection: 'column',
                        justifyContent: 'flex-end'
                    }}>
                        <View style={{ flex: 1 }}>
                            {
                                this.state.data.PRICE_AFTER_OFFER == 1 ? 
                                <TouchableOpacity style={{marginTop:20,alignSelf: 'flex-end',justifyContent:'space-around',flexDirection:'row'}} onPress={()=>Linking.openURL(`tel:${this.state.phone}`)}>
                                  
                                  <Material name='phone' size={15} color={'green'} />
                                    <Text style={{
                                    ...styles.TextBold,
                                    color: 'black',
                                    fontSize: 10,
                                    alignSelf: 'flex-end',
                                    // marginTop:20,
                                    marginLeft:5
                                }}>
                                        {t('call')}
                                    </Text>
                                </TouchableOpacity>
                                :

                                <>
                             
                          
                            <Text numberOfLines={1}
                                style={{
                                    ...styles.TextBold,
                                    color: 'black',
                                    fontSize: 10,
                                    alignSelf: 'flex-end'
                                }}>
                                    {(this.state.data && this.state.data.product_store && this.state.data.product_store.product)
                                     ? this.props.data.product_store.product.NAME : ''}</Text>
                                     
                            {(this.props.data.PRICE_AFTER_OFFER !== this.props.data.PRICE) && <Text style={{
                                ...styles.TextRegular, color: 'gray', fontSize: 9, textDecorationStyle: 'dotted',
                                textDecorationLine: 'line-through'
                            }}>{config.priceFix(this.props.data.PRICE)} {t('currency-unit')}</Text>}
                                         
                            <Text style={{
                                ...styles.TextRegular,
                                color: (this.props.data.PRICE_AFTER_OFFER !== this.props.data.PRICE) ? '#273c1a' : 'gray',
                                fontSize: 11,
                                backgroundColor: '#c7ff99',
                                width: wp('20%'),
                                alignSelf: 'flex-end'
                            }}>{config.priceFix(this.props.data.PRICE_AFTER_OFFER)} {t('currency-unit')}</Text>

                            <Text style={{
                                ...styles.TextRegular,
                                color: 'gray',
                                fontSize: 11,
                                alignSelf: 'flex-end'
                            }}>{t('all')} {config.priceFix(this.props.data.PRICE_AFTER_OFFER * (store.cart[this.props.data.product_store.ID]
                                 ? store.cart[this.props.data.product_store.ID] : this.props.data.COUNT))} {t('currency-unit')}</Text>
                                     </>}

                        </View>
                        {
                            this.state.confirm ?
                                <View style={{ padding: 10 }}>
                                    <Text style={{
                                        ...styles.TextRegular,
                                        color: 'black',
                                        fontSize: 12,
                                        textAlign: 'center',
                                        alignSelf: 'center',
                                        padding: 5
                                    }}>{this.state.count}</Text>

                                </View> :

                                <View style={{
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center',
                                    width: 85,
                                    justifyContent: 'space-between'
                                }}>
                                    <TouchableWithoutFeedback disabled={this.state.lock}
                                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                        onPress={async () => {
                                            let stepPrice = this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? 0.5 : 1
                                            if (!this.state.lazy) try {
                                                Axios.put('order/cart', {
                                                    'ORDER_ID': this.props.data.ORDER_ID,
                                                    'PRODUCT_ID': this.props.data.ID,
                                                    'COUNT': this.state.count + stepCount,
                                                    'DESCRIPTION': this.state.disc
                                                }).then(async res => {
                                                    store.cart[this.props.data.product_store.ID] = this.state.count + stepCount;
                                                    await this.setState({ count: this.state.count + stepCount })
                                                    store.cart_count += this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? 0 : 1
                                                    this.props.update_price(stepPrice * this.props.data.PRICE_AFTER_OFFER);
                                                    this.props.update_cart()
                                                });
                                                await this.setState({ lazy: false })
                                            } catch (error) {
                                                console.warn(error, 'errrrrr')
                                            }
                                        }}>
                                        <View style={{
                                            width: 20,
                                            height: 20,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderColor: 'black',
                                            borderRadius: 5,
                                            borderWidth: 0.5
                                        }}>
                                            <Material name='add' size={15} color={'green'} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                    <Text style={{
                                        ...styles.TextRegular,
                                        color: 'black',
                                        fontSize: 12,
                                        textAlign: 'center',
                                        alignSelf: 'center',
                                        padding: 5
                                    }}>{this.state.count}</Text>
                                    <TouchableWithoutFeedback disabled={this.state.lock ? true : false}
                                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                        onPress={async () => {
                                            let stepPrice = this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? -0.5 : -1
                                            if (this.state.count > 0 && !this.state.lazy) {
                                                if (this.state.count === (this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? 0.5 : 1)) {
                                                    try {
                                                        Axios.delete('/order/cart/' + this.props.data.ID).then(async res => {
                                                            await this.setState({ count: 0 })
                                                            store.cart_count -= 1
                                                            store.cart[this.props.data.product_store.ID] = 0;
                                                            this.props.update_price(stepPrice * this.props.data.PRICE_AFTER_OFFER)
                                                            this.props.update_cart()
                                                        })
                                                    } catch (error) {
                                                        console.warn(error)
                                                    }
                                                } else {
                                                    try {
                                                        Axios.put('order/cart', {
                                                            'ORDER_ID': this.props.data.ORDER_ID,
                                                            'PRODUCT_ID': this.props.data.ID,
                                                            'COUNT': this.state.count - stepCount,
                                                            'DESCRIPTION': this.state.disc
                                                        }).then(async res => {
                                                            await this.setState({ count: this.state.count - stepCount })
                                                            store.cart_count -= this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? 0 : 1
                                                            this.props.update_price(stepPrice * this.props.data.PRICE_AFTER_OFFER)
                                                            store.cart[this.props.data.product_store.ID] = this.state.count;
                                                            this.props.update_cart()

                                                        })
                                                        await this.setState({ lazy: false })
                                                    } catch (error) {
                                                        console.warn(error, 'errorr')
                                                    }
                                                }
                                            }
                                        }}>
                                        <View style={{
                                            width: 20,
                                            height: 20,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            borderColor: 'black',
                                            borderRadius: 5,
                                            borderWidth: 0.5
                                        }}>
                                            <Material name='remove' size={15} color={'red'} />
                                        </View>
                                    </TouchableWithoutFeedback>

                                    <TouchableWithoutFeedback disabled={this.state.lock ? true : false}
                                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                        onPress={async () => {
                                            try {
                                                Axios.delete(
                                                    '/order/cart/' + this.props.data.ID
                                                ).then(async res => {
                                                    store.cart_count -= this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? 1 : this.state.count
                                                    await this.setState({ lazy: true })
                                                    store.cart[this.props.data.product_store.ID] = 0;
                                                    await this.setState({ lazy: false, /*count: 0*/ }, () => this.props.update_price(-this.state.count * this.props.data.PRICE_AFTER_OFFER))
                                                    this.props.delete(this.props.data.ID)
                                                    this.props.update_cart()
                                                })
                                            } catch (error) {
                                            }
                                        }}>
                                        <View style={{
                                            width: 20,
                                            height: 20,
                                            marginRight: wp('3%'),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                            borderColor: 'black',
                                            borderRadius: 5,
                                            borderWidth: 0.5
                                        }}>
                                            <Material name='delete' color={'orange'} size={15} />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>


                        }
                    </View>
                </View>
                {
                    this.state.confirm ?
                        <View />
                        :
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.setModalVisible(true)
                            }}>
                            <View style={{ padding: 15, }}>
                                <Material name='note-add' size={25} />
                            </View>
                        </TouchableWithoutFeedback>
                }

            </View>
        )
    }
}

 class App extends Beep(BeepProp, Component) {

    state = {
        data: [],
        loading: true,
        price: 0,
        offerValue: store.offerValue,
        code: store.code,
        isGuest: false,
        showCode: true,
        themesId:null
    }

    updateCart() {
        Axios.get('order/OrderProductCounter').then((response) => {
            store.cart_count = response.data[0].COUNTER
        }).catch((error) => {
            console.log('add errror', error)
        })
    }

    async goToFactor() {
        let order_type = await Axios.get('order/creat_order_type/' + store.storeId)
        store.orderType = order_type.data.CREAT_ORDER_TYPE

        


        /////////////////////////////////
        await this.setState({ loading: true })
        let selected = [];
        let unSelected = [];
        for (let item of this.state.data) {
            if (item.checked) {
                selected.push(item.ID)
            } else {
                unSelected.push(item.ID)
            }
        }

        this.state.data.forEach(async (item, index) => {
    
            await Axios.post('order/calcCourierValue', { ORDER_ID: item.ID })
            if (index === this.state.data.length - 1) {
                let selected = [];
                let unSelected = [];
                for (let item of this.state.data) {
                    if (item.checked) {
                        selected.push(item.ID)
                    } else {
                        unSelected.push(item.ID)
                    }
                }
                let cart = await Axios.get('order/cart')
                

                let rawData = cart.data.filter((item) => item.CONFIRM_BY_CUSTOMER === 0 && item.order_products[0] != null).map(item => {
                    let ret = {
                        STORE_ID: item.STORE_ID,
                        ID: item.ID,
                        order_products: item.order_products,
                        store: item.store,
                        item: { CORIER_VALUE: item.CORIER_VALUE },
                        confirm: {
                            CONFIRM_BY_CUSTOMER: item.CONFIRM_BY_CUSTOMER,
                            CONFIRM_BY_PROVIDER: item.CONFIRM_BY_PROVIDER
                        },
                        user_role: {
                            ID: item.user_role ? item.user_role.ID : 0
                        },
                        checked: selected.indexOf(item.ID) > -1,
                        ...item
                    };
                    return ret
                });
                let offer = await Axios.get('offers/autoApply', { ORDER_ID: item.ID })
                try {
                    if (this.state.code.length > 0 && store.offerValue > 0) {
                        Axios.post('offers/code', {
                            CODE: this.state.code,
                            SELECT: selected,
                            UNSELECT: unSelected,
                        }).then(async response => {
                            if (response.data.OFFERVALUE > 0 && this.state.offerValue === response.data.OFFERVALUE) {
                                await this.setState({
                                    data: rawData,
                                    code: this.state.code,
                                    loading: false,
                                    offerValue: this.state.amount
                                })
                                this.props.navigation.push('CartDetail', {
                                    items: rawData.filter((value) => value.checked && value.confirm.CONFIRM_BY_CUSTOMER !== 1),
                                    code: this.state.code,
                                    unSelected: unSelected,
                                    offerValue: store.offerValue,
                                    offerSum: offer.data
                                })
                            } else {
                                await this.setState({ loading: false, code: '', offerValue: 0 })
                                store.code = '';
                                store.offerValue = 0;
                                Toast.show({
                                    text: response.data.message ? response.data.message : 'The entered discount code is not correct !',
                                    type: 'danger',
                                    duration: 3000,
                                    buttonText: 'Ok',
                                    buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                                })

                            }

                        })

                    } else {
                        await this.setState({
                            data: rawData,
                            code: this.state.code,
                            offerValue: this.state.amount,
                            loading: false
                        })
                        this.props.navigation.push('CartDetail', {
                            items: rawData.filter((value) => value.checked && value.confirm.CONFIRM_BY_CUSTOMER !== 1),
                            code: this.state.code,
                            offerValue: store.offerValue,
                            offerSum: offer.data
                        })
                    }

                } catch (error) {
                    if (error.response.status > 499) {
                        Toast.show({
                            text: 'There is a problem on the server side, please try again!',
                            type: 'danger',
                            duration: 3000,
                            buttonText: 'Ok',
                            buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                        })
                    } else {
                        Toast.show({
                            text: 'The entered discount code is not valid!',
                            type: 'danger',
                            duration: 3000,
                            buttonText: 'Ok',
                            buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                        })
                    }
                    this.setState({ loading: false })
                }

            }
        })
    }

    cartwithoutloading = async () => {
        this.setState({ loading: true })
        try {
            let cart = await Axios.get('order/cart')
            
            
            let rawData = cart.data.filter((item) => item.CONFIRM_BY_CUSTOMER === 0 && item.order_products[0] != null).map(item => {
                let ret = {
                    STORE_ID: item.STORE_ID,
                    ID: item.ID,
                    order_products: item.order_products,
                    store: item.store,
                    item: { CORIER_VALUE: item.CORIER_VALUE },
                    confirm: {
                        CONFIRM_BY_CUSTOMER: item.CONFIRM_BY_CUSTOMER,
                        CONFIRM_BY_PROVIDER: item.CONFIRM_BY_PROVIDER
                    },
                    user_role: {
                        ID: item.user_role ? item.user_role.ID : 0
                    },
                    checked: true,
                    ...item
                };
                return ret
            });
            this.setState({ data: rawData, loading: false, code: store.code, offerValue: store.offerValue })
        } catch (error) {
            if (error.response.status >= 500) {
                Toast.show({
                    text: 'Server error',
                    type: 'danger',
                    duration: 3000,
                    buttonText: 'Ok',
                    buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                })
            }
            this.setState({ loading: false })
        }
    }
    cartUpdate = async ({ code, amount }) => {

        try {
            await this.setState({ loading: true, price: 0 });
            let cart = await Axios.get('order/cart');

            
            AsyncStorage.setItem('jobStatus',cart.data[0].user_role.user.user_additional.JOB_STATUS )
        

            let offer
            ////
            if (cart.data.length === 0) {
                ////
                this.setState({
                    loading: false,
                    data: '',
                })
            }
            ///
            else {
                ///// 
                offer = await Axios.get('offers/autoApply/1', { ORDER_ID: cart.data[0].ID })
                
                let rawData = cart.data.filter((item) => item.CONFIRM_BY_CUSTOMER === 0 && item.order_products[0] != null).map(item => {
                    // let offer=await Axios.get('offers/autoApply',{ORDER_ID:item.ID})

                    let ret = {
                        STORE_ID: item.STORE_ID,
                        ID: item.ID,
                        order_products: item.order_products,
                        store: item.store,
                        item: { CORIER_VALUE: item.CORIER_VALUE },
                        confirm: {
                            CONFIRM_BY_CUSTOMER: item.CONFIRM_BY_CUSTOMER,
                            CONFIRM_BY_PROVIDER: item.CONFIRM_BY_PROVIDER
                        },
                        user_role: {
                            ID: item.user_role ? item.user_role.ID : 0
                        },
                        checked: true,
                        ...item
                    };
                    return ret
                });

              
                this.setState({
                    data: rawData,
                    loading: false,
                    code: store.code,
                    offerValue: store.offerValue,
                    showCode: (offer && offer.data) ? offer.data.FIRST_ORDER === 0 : true
                })
            }
        }

        catch (error) {
           
            if (error.response.status > 499) {
                Toast.show({
                    text: 'There is a problem on the server side, please try again !',
                    type: 'danger',
                    duration: 3000,
                    buttonText: 'Ok',
                    buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                })
            }
            this.setState({ loading: false })
        }
    }

    async updateCartCount() {
        let cart = await Axios.get('order/getCartCount')
        
        // let finalCount = 0
        // for (let item of cart.data) {
        //     for (let sub of item.order_products) {
        //         if (sub.product_store.product.PRODUCT_UNIT_ID === 1) {
        //             finalCount += 1;
        //         } else {
        //             finalCount += sub.COUNT;
        //         }
        //     }
        // }
        // store.cart_count = finalCount;

        let finalCount = 0
        for (let item of cart.data) {
            // for (let sub of item.order_products) {
            if (item.PRODUCT_UNIT_ID === 1) {
                finalCount += 1;
            } else {
                finalCount += item.COUNT;
            }
            // }
        }
        store.cart_count = finalCount;
    }

    async componentDidMount() {
        this.updateCartCount()
        AsyncStorage.getItem('isGuest').then(async guest => {
            await this.setState({ isGuest: guest === '1' })
        })
              AsyncStorage.getItem('theme').then(async theme => {
            await this.setState({ themesId: theme })
        })
        await this.setState({ code: store.code, offerValue: store.offerValue });
        this.cartUpdate({ code: this.state.code, offerValue: this.state.offerValue })
    }

    update_price = (q) => {
        this.setState((state) => {
            let price = state.price + Number(q)
            return { price }
        })
        // this.cartUpdate({code: this.state.code, offerValue: this.state.offerValue})
    }
    update_price_checked = () => {
        let data = this.state.data.filter((value) => value.checked), price = 0
        data.forEach((value) =>
            value.order_products.forEach((product) => price += product.COUNT * product.PRICE_AFTER_OFFER)
        )
        this.setState({ price })
    }

    removeOffCode = async () => {
        store.code = '';
        store.offerValue = 0;
        await this.setState({ loading: false, code: '', offerValue: 0 });
        this.cartUpdate({ code: '', amount: 0 })
    };

    submitOffCode = async () => {
        try {
            let selected = [];
            let unSelected = [];
            for (let item of this.state.data) {
                if (item.checked) {
                    selected.push(item.ID)
                } else {
                    unSelected.push(item.ID)
                }
            }
            await this.setState({ loading: true })
            Axios.post('offers/code', {
                CODE: this.state.code,
                SELECT: selected,
                UNSELECT: unSelected,
            }).then(async response => {
                if (response.data.OFFERVALUE > 0) {
                    store.code = this.state.code;
                    store.offerValue = response.data.OFFERVALUE;
                    await this.setState({ loading: false, code: this.state.code, offerValue: response.data.OFFERVALUE });
                    this.cartUpdate({ code: this.state.code, amount: response.data.OFFERVALUE })
                } else {
                    await this.setState({ loading: false, code: this.state.code, amount: 0 });
                    Toast.show({
                        text: response.data.message ? response.data.message : 'The entered discount code is not valid!',
                        type: 'danger',
                        duration: 3000,
                        buttonText: 'Ok',
                        buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                    })
                }
            }).catch(async err => {
                await this.setState({ loading: false, code: this.state.code, amount: 0 });
                Toast.show({
                    text: 'The entered discount code is not valid!',
                    type: 'danger',
                    duration: 3000,
                    buttonText: 'Ok',
                    buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                })
            });

        } catch (error) {
            if (error.response.status > 499) {
                Toast.show({
                    text: 'There is a problem on the server side, please try again!',
                    type: 'danger',
                    duration: 3000,
                    buttonText: 'Ok',
                    buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                })
            } else {
                Toast.show({
                    text: 'The entered discount code is not valid !',
                    type: 'danger',
                    duration: 3000,
                    buttonText: 'Ok',
                    buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                })
            }
            this.setState({ loading: false })
        }
    }


    render() {
        const {t} =this.props
        if (this.state.loading)
            return (
                <View style={styles.container}>
                    <Appbar.Header style={{ backgroundColor: 'white' }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ ...styles.TextBold, color: 'black', fontSize: 18 }}> {t('cart')} </Text>
                        </View>
                    </Appbar.Header>
                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <ActivityIndicator />
                    </View>
                </View>
            )
        return (
            <View style={styles.container}>
                <NavigationEvents
                    onDidFocus={() =>
                        this.cartUpdate({ code: this.state.code, offerValue: this.state.offerValue })}
                // onWillFocus={() => this.cartUpdate({ code: this.state.code, offerValue: this.state.offerValue })}
                />
                <Appbar.Header style={{ backgroundColor: 'white', borderBottomWidth: 0.5, borderBottomColor: 'gray' }}>
                    <TouchableWithoutFeedback
                        onPress={async () => {
                            Alert.alert(t('delete'), t('sure-delete?'), [
                                {
                                    text: 'yes',
                                    onPress: async () => {
                                        try {
                                            await Axios.delete('order/cart')
                                            this.cartUpdate({ code: this.state.code, offerValue: this.state.offerValue })
                                            store.cart_count = 0;
                                            store.cart = {}

                                            Toast.show({
                                                text: t('success-delete'),
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
                                        } catch (error) {
                                            Toast.show({
                                                text: error.response.data.message,
                                                type: 'danger',
                                                duration: 3000,
                                                buttonText: 'Ok',
                                                buttonStyle: {
                                                    borderColor: 'white',
                                                    borderWidth: 1,
                                                    margin: 5,
                                                    borderRadius: 7
                                                }
                                            })
                                        }
                                    }

                                },
                                {
                                    text: 'No'
                                }
                            ])
                        }}
                    >
                        <View style={{ padding: 10, position: 'absolute', left: 0 }}>
                            <Material name='remove-shopping-cart' color='gray' size={20} />
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ ...styles.TextBold, color: 'black', fontSize: 18 }}>{t('cart')}</Text>
                    </View>


                </Appbar.Header>
                {/*{this.state.showCode &&*/}
                {/*<OffCode cartUpdate={this.cartUpdate} data={this.state.data} code={store.code}*/}
                {/*         offerValue={store.offerValue}/>}*/}
                {this.state.showCode &&
                    <Item style={{ padding: 4, margin: 4 }}>
                        {this.state.offerValue > 0 ?
                            <Button small style={{ width: '15%', backgroundColor: '#ffbcbf' }} onPress={this.removeOffCode}>
                                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    {
                                        this.state.loading ?
                                            <Spinner style={{ flex: 1, margin: 4 }} color='white' /> :
                                            <Text
                                                style={[styles.TextRegular, {
                                                    color: '#5d0400',
                                                    textAlign: 'center'
                                                }]}>{t('delete')}</Text>
                                    }
                                </View>
                            </Button> :
                            <Button small style={{ width: '15%', backgroundColor: '#e1ffe4' }} onPress={this.submitOffCode}>
                                <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                    {
                                        this.state.loading ?
                                            <Spinner style={{ flex: 1, margin: 4 }} color='white' /> :
                                            <Text style={[styles.TextRegular, {
                                                color: '#43b02a',
                                                textAlign: 'center'
                                            }]}>{t('send')}</Text>
                                    }
                                </View>
                            </Button>}
                        <Input
                            onChangeText={(off) => this.setState({ code: off })}
                            placeholder={this.state.offerValue > 0 ? t('offer-code')+ `${this.state.offerValue}`  + t('is-active'): t('enter-offer-code')}
                            disabled={this.state.offerValue > 0}
                            style={[styles.TextRegular, { fontSize: 12 }]}
                        />
                    </Item>}
                         

                {this.state.data.length > 0 && <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
               
                    <View style={{ flex: 1, backgroundColor: 'white', paddingVertical: 10 }}>
                        {
                            this.state.data.map((element, index) => {
                                if (element.order_products[0] != null ) return (
                                    <View
                                        key={'element_' + index.toString()}
                                        style={[
                                            element.checked ?
                                                { borderColor: '#f3f3f3' } :
                                                { borderColor: '#aaa' },
                                            { borderWidth: 1, margin: 8, borderRadius: 5, }
                                        ]}
                                    >
                                        <View style={[
                                            { /*paddingHorizontal: 10,*/
                                                height: 40,
                                                flexDirection: 'row-reverse',
                                                alignItems: 'center',
                                                paddingHorizontal: wp('5%'),
                                                borderTopLeftRadius: 5,
                                                borderTopRightRadius: 5,
                                                zIndex: 2001,
                                                justifyContent: 'space-between'
                                            },
                                            element.checked ? { backgroundColor: '#e1ffe4' } : { backgroundColor: '#aaa' }
                                        ]}>
                                            <Text style={{ ...styles.TextBold, color: 'black', fontSize: 16 }}>

                                                {element.store.NAME}
                                            </Text>

                                            <Text style={{ ...styles.TextBold, fontSize: 10, color: '#c6c6c6' }}>
                                            {t('invoice')} ({element.ID})
                                            </Text>
                                            <CheckBox checked={element.checked} onPress={() =>
                                                this.setState((prevState) => ({
                                                    data: prevState.data.map((value, i) => {
                                                        if (i == index) return {
                                                            ...value,
                                                            checked: !value.checked
                                                        }
                                                        else return value
                                                    })
                                                }), this.update_price_checked)
                                            } color={StyleSheet.value('$MainColor')} />
                                        </View>
                                        {


                                        element.order_products.map((item, i) => {
                                           
                                                return (
                                                     item.order_product_details.length == 0 ? 
                                                    <CartItem
                                                        t={t}
                                                        key={'cart_' + item.product_store.PRODUCT_ID.toString()}
                                                        update_cart={this.cartwithoutloading}
                                                        update_price={this.update_price}
                                                        data={item}
                                                        confirm={element.confirm}
                                                        delete={(id) => this.setState((prevState) => ({
                                                            data: prevState.data.map((value, j) => {
                                                                if (j == index) return {
                                                                    ...value,
                                                                    order_products: value.order_products.filter((value) => value.ID != id)
                                                                }
                                                                else return value
                                                            })
                                                        }))}
                                                    />
                                                    :
                                                    item.order_product_details.map((items,i)=>{
                                                        return(
                                                  <CartDetail
                                                        // key={'cart_' + item.ORDER_PRODUCT_ID.toString()}
                                                        update_cart={this.cartwithoutloading}
                                                        update_price={this.update_price}
                                                        data={item}
                                                        dataDetail={items}
                                                        confirm={element.confirm}
                                                        deleteOrder={(id) => {
                                                            
                                                        }
                                                                        
                                                                // if (j == index) return {
                                                                //     ...value,
                                                                //     order_products: value.order_products.filter((value) => value.ID != id)
                                                                // }
                                                                // else return value
                                                           
                                                        }
                                                    />
                                                        )

                                                    })
                                                    
                                                    
                                                    

                                                )
                                            })
                                        }

                                        {
                                            !element.checked &&
                                            <View style={{
                                                position: 'absolute', height: '100%', width: '100%',
                                                backgroundColor: 'gray', opacity: 0.5, zIndex: 2000
                                            }} />
                                        }
                                    </View>
                                )
                                else return null
                            })
                        }
                    </View>
                </ScrollView>}
                {this.state.data.length > 0 && this.state.price > 0 ? <TouchableWithoutFeedback
                    onPress={async () => {
                        
                        if (this.state.isGuest) {
                            let token = await AsyncStorage.getItem('token')
                            await AsyncStorage.removeItem('token')
                            await AsyncStorage.removeItem('isGuest')
                            this.props.navigation.navigate('Auth', { token, isGuest: true })
                        } else if(this.state.themesId == 6 && store.cart_count < 5 ) {
           
                 Toast.show({
                    text: 'برای ادامه ، سبد خرید باید بیشتر از 5 قلم محصول داشته باشد',
                    type: 'danger',
                    duration: 5000,
                    buttonText: 'تایید',
                    buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                })
                  
                        }
                        else{
                               this.goToFactor()
                         
                        }
                    }}
                >
                    <View style={{ ...styles.continue, position: 'absolute', bottom: 10, alignSelf: 'center' }}>
                        {!this.state.isGuest ?
                            <Text style={[styles.TextBold, { color: '#ff5f5f', fontSize: 14 }]}> {t('set-delivery-time')}</Text> :
                            <Text style={[styles.TextBold, { color: '#ff5f5f', fontSize: 14 }]}> {t('enter-and-continue')}</Text>}
                    </View>
                </TouchableWithoutFeedback> :
                    <View style={{ justifyContent: 'center', padding: 10 }}>
                        <Text style={{ textAlign: 'center', ...styles.TextRegular }}>{t('cart-empty')} </Text>
                    </View>
                }

            </View>
        )
    }


}

export default withTranslation()(App)

class OffCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            off: props.code,
            amount: props.offerValue
        };
    }


    removeOffCode = async () => {
        store.code = '';
        store.offerValue = 0;
        await this.setState({ loading: false, off: '', amount: 0 });
        this.props.cartUpdate({ code: '', amount: 0 })
    };

    submitOffCode = async () => {
        try {
            let selected = [];
            let unSelected = [];
            for (let item of this.props.data) {
                if (item.checked) {
                    selected.push(item.ID)
                } else {
                    unSelected.push(item.ID)
                }
            }
            await this.setState({ loading: true })
            Axios.post('offers/code', {
                CODE: this.state.off,
                SELECT: selected,
                UNSELECT: unSelected,
            }).then(async response => {
                store.code = this.state.off;
                store.offerValue = response.data.OFFERVALUE;
                await this.setState({ loading: false, off: this.state.off, amount: response.data.OFFERVALUE });
                this.props.cartUpdate({ code: this.state.off, amount: response.data.OFFERVALUE })
            }).catch(async err => {
                await this.setState({ loading: false, off: this.state.off, amount: 0 });
                Toast.show({
                    text: 'کد تخفیف وارد شده معتبر نمی باشد!',
                    type: 'danger',
                    duration: 3000,
                    buttonText: 'تایید',
                    buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                })
            });

        } catch (error) {
            if (error.response.status > 499) {
                Toast.show({
                    text: 'مشکلی از سمت سرور وجود دارد لطفا دوباره امتحان کنید !',
                    type: 'danger',
                    duration: 3000,
                    buttonText: 'تایید',
                    buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                })
            } else {
                console.warn(error.response)
                Toast.show({
                    text: 'کد تخفیف وارد شده معتبر نمی باشد!',
                    type: 'danger',
                    duration: 3000,
                    buttonText: t('ok'),
                    buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                })
            }
            this.setState({ loading: false })
        }
    }

    render() {

        return (
            <Item style={{ padding: 4, margin: 4 }}>
                {this.state.amount > 0 ?
                    <Button small style={{ width: '15%', backgroundColor: '#ffbcbf' }} onPress={this.removeOffCode}>
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            {
                                this.state.loading ?
                                    <Spinner style={{ flex: 1, margin: 4 }} color='white' /> :
                                    <Text
                                        style={[styles.TextRegular, { color: '#5d0400', textAlign: 'center' }]}>{t('delete')}</Text>
                            }
                        </View>
                    </Button> :
                    <Button small style={{ width: '15%', backgroundColor: '#e1ffe4' }} onPress={this.submitOffCode}>
                        <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                            {
                                this.state.loading ?
                                    <Spinner style={{ flex: 1, margin: 4 }} color='white' /> :
                                    <Text style={[styles.TextRegular, {
                                        color: '#43b02a',
                                        textAlign: 'center'
                                    }]}>{t('confirm')}</Text>
                            }
                        </View>
                    </Button>}
                <Input
                    onChangeText={(off) => this.setState({ off })}
                    placeholder={this.state.amount > 0 ? t('enter-offer-code')+ `${this.state.amount} `+ t('is-active') : t('enter-offer-code')}
                    disabled={this.state.amount > 0}
                    style={[styles.TextRegular, { fontSize: 12 }]}
                />
            </Item>
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
        width: '85%',
        height: 30,
        backgroundColor: '$MainColor',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    continue: {
        borderWidth: 1,
        borderColor: '#ff5f5f',
        backgroundColor: '#fff',
        width: wp('95%'),
        flexDirection: 'row-reverse',
        justifyContent: 'center',
        borderRadius: wp('2%'),
        padding: 8
    }
})
