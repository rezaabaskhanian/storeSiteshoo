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
    Alert, AsyncStorage
} from 'react-native'
import StyleSheet, { flatten } from 'react-native-extended-stylesheet'
import { Appbar } from 'react-native-paper'
import FastImage from 'react-native-fast-image'
import color from 'color'
import { NavigationEvents } from 'react-navigation'
import Material from 'react-native-vector-icons/MaterialIcons'
import CartIcon from 'react-native-vector-icons/FontAwesome'
import Axios from 'axios'
import { config } from '../../../App'
import { Toast, Input, Button, Item, Spinner, CheckBox } from 'native-base'
import { BeepProp } from '../../../store/BeepProp'
import { state as store, orderType, Beep } from 'react-beep'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


class NooteBook extends Beep(BeepProp, Component) {
    state = {
        count: this.props.dataDetail?.COUNT ?this.props.dataDetail?.COUNT :this.props.data.COUNT  ,
        data: this.props.data,
        dataDetail:this.props.dataDetail,
        lazy: false,
        lock: this.props.data.DELETED,
        modalVisible: false,
        disc: this.props.data.DESCRIPTION,
        // confirm: this.props.confirm.CONFIRM_BY_CUSTOMER
    };

    setModalVisible(visible) {
        this.setState({ modalVisible: visible })
    }


    componentDidMount() {
        if (!this.state.lock)
            this.props.update_price(this.state.count * this.props.data.PRICE_AFTER_OFFER)
    }

    render() {
        console.log(store.cart ,'store.cart')

        const stepCount = (this.state.data && this.state.data.product_store && this.state.data.product_store.product) ? this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? 0.5 : 1 : 0
        if (this.state.count === 0) return null
        return (
            <View style={{
                flex: 1,
                marginVertical: 5,
                width: '100%',
                alignSelf: 'center',
                flexDirection: 'row-reverse',
                
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
                            }}>توضیحات {(this.state.data && this.state.data.product_store && this.state.data.product_store.product) ? this.props.data.product_store.product.NAME : ''}</Text>
                            <View style={{
                                flex: 1,
                                marginVertical: 5,
                                width: '90%',
                                borderRadius: 17,
                                borderWidth: 0.5,
                                borderColor: 'gray'
                            }}>
                                <TextInput
                                    placeholder='توضیحات شما'
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
                                            'DESCRIPTION': this.state.disc,
                                            'ORDER_PRODUCT_DETAIL_ID' :this.state.dataDetail ? this.state.dataDetail.ID :null
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

                                    <Text style={[styles.TextBold, { color: 'white', textAlign: 'center' }]}>تایید </Text>
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
                                <Text style={{ ...styles.TextBold, color: 'black', fontSize: 16 }}>موجود نمی باشد</Text>
                            </View>
                            : null
                    }
                    <FastImage

                        source={{ uri: config.ImageBaners + config.ProductSubUrl + ((this.state.data && this.state.data.product_store && this.state.data.product_store.product) ? this.props.data.product_store.product.IMAGE : '') }}
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
                            <Text numberOfLines={1}
                                style={{
                                    ...styles.TextBold,
                                    color: 'black',
                                    fontSize: 10,
                                    alignSelf: 'flex-end'
                                }}>{(this.state.data && this.state.data.product_store && this.state.data.product_store.product) ? this.props.data.product_store.product.NAME : ''}</Text>
                            {(this.props.data.PRICE_AFTER_OFFER !== this.props.data.PRICE) && <Text style={{
                                ...styles.TextRegular, color: 'gray', fontSize: 9, textDecorationStyle: 'dotted',
                                textDecorationLine: 'line-through'
                            }}>{config.priceFix(this.props.data.PRICE)} تومان</Text>}

                            <Text style={{
                                ...styles.TextRegular,
                                color: (this.props.data.PRICE_AFTER_OFFER !== this.props.data.PRICE) ? '#273c1a' : 'gray',
                                fontSize: 11,
                                backgroundColor: '#c7ff99',
                                width: wp('20%'),
                                alignSelf: 'flex-end'
                            }}>{config.priceFix(this.props.data.PRICE_AFTER_OFFER)} تومان</Text>

                            <Text style={{
                                ...styles.TextRegular,
                                color: 'gray',
                                fontSize: 11,
                                alignSelf: 'flex-end'
                            }}>کل: {config.priceFix(this.props.data.PRICE_AFTER_OFFER * (store.note[this.props.data.product_store.ID] ? store.note[this.props.data.product_store.ID] : this.props.dataDetail?.COUNT))} تومان</Text>


                        
                      
                      {
                       
                       this.state.dataDetail?.ProductFeature1 ? 
                                    <View style={{flexDirection:'row-reverse'}}>
                                    <Text numberOfLines={1}
                                style={{
                                    ...styles.TextBold,
                                    color: 'black',
                                    fontSize: 10,
                                    alignSelf: 'flex-end'
                                }}>{ 'رنگ : '}</Text>

                                <View style={{width:15,height:15,borderRadius:7.5 ,backgroundColor:this.state.dataDetail.ProductFeature1.VALUE,marginTop:2}}/>
                                     </View>
                                     :null
                                }
                                {
                                    this.state.dataDetail?.ProductFeature2 ? 
                                    <View style={{flexDirection:'row-reverse'}}>
                                    <Text numberOfLines={1}
                                style={{
                                    ...styles.TextBold,
                                    color: 'black',
                                    fontSize: 10,
                                    alignSelf: 'flex-end'
                                }}>{ 'سایز  : '}</Text>
                         <Text numberOfLines={1}
                                style={{
                                    ...styles.TextBold,
                                    color: 'black',
                                    fontSize: 10,
                                    alignSelf: 'flex-end'
                                }}>{ this.state.dataDetail.ProductFeature2.data.VALUE}</Text>
                              
                                     </View>
                                     :null
                                }

                       <View style={{
                                    flexDirection: 'row-reverse',
                                    alignItems: 'center',
                                    width: '100%',
                                    justifyContent: 'space-between',
                                    
                                }}>
                                    <TouchableWithoutFeedback disabled={this.state.lock}
                                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                        onPress={async () => {
                                            let stepPrice = this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? 0.5 : 1
                                            if (!this.state.lazy) try {
                                                Axios.put('order/cart', {
                                                    // 'ORDER_ID': this.props.data.ORDER_ID,
                                                    'PRODUCT_ID': this.props.data.ID,
                                                    'COUNT': this.state.count + stepCount,
                                                    'DESCRIPTION': this.state.disc,
                                                   'ORDER_PRODUCT_DETAIL_ID' :this.state.dataDetail ? this.state.dataDetail.ID :null
                                                    // 'ORDER_PRODUCT_DETAIL_ID' :null
                                                }).then(async res => {
                                                    store.note[this.props.data.product_store.ID] = this.state.count + stepCount;
                                                    await this.setState({ count: this.state.count + stepCount })
                                                    store.note_count += this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? 0 : 1
                                                    this.props.update_price(stepPrice * this.props.data.PRICE_AFTER_OFFER);
                                                    this.props.update_cart()
                                                });
                                                await this.setState({ lazy: false })
                                            } catch (error) {
                                                console.warn(error, 'errrrrr')
                                            }
                                        }}>
                                        <View style={{
                                            left:10,
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
                                                        Axios.delete('/order/cart/'+this.props.dataDetail.ORDER_PRODUCT_ID 
                                                        +'?ORDER_PRODUCT_DETAIL_ID='+this.state.dataDetail.ID).then(async res => {
                                                            await this.setState({ count: 0 })
                                                            store.note_count -= 1
                                                            store.note[this.props.data.product_store.ID] = 0;
                                                            this.props.update_price(stepPrice * this.props.data.PRICE_AFTER_OFFER)
                                                            this.props.update_cart()
                                                        })
                                                    } catch (error) {
                                                        console.warn(error)
                                                    }
                                                } else {
                                                    try {
                                                        Axios.put('order/cart', {
                                                            // 'ORDER_ID': this.props.data.ORDER_ID,
                                                            'PRODUCT_ID': this.props.data.ID,
                                                            'COUNT': this.state.count - stepCount,
                                                            'DESCRIPTION': this.state.disc,
                                                            // 'ORDER_PRODUCT_DETAIL_ID' :this.state.dataDetail.ID
                                                            // 'ORDER_PRODUCT_DETAIL_ID' :null
                                                            'ORDER_PRODUCT_DETAIL_ID' :this.state.dataDetail ? this.state.dataDetail.ID :null
                                                        }).then(async res => {
                                                            await this.setState({ count: this.state.count - stepCount })
                                                            store.note_count -= this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? 0 : 1
                                                            this.props.update_price(stepPrice * this.props.data.PRICE_AFTER_OFFER)
                                                            store.note[this.props.data.product_store.ID] = this.state.count;
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
                                            right:10,
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
                                            this.props.dataDetail ?  
                                           
                                                     Axios.delete(
                                                    '/order/cart/'+this.state.dataDetail.ORDER_PRODUCT_ID 
                                                    +'?ORDER_PRODUCT_DETAIL_ID='+this.state.dataDetail.ID
                                                ) .then(async res => {
                                                    store.note_count -= this.state.count
                                                    await this.setState({ lazy: true })
                                                    store.note[this.props.data.product_store.ID] = 0;
                                                    await this.setState({ lazy: false, /*count: 0*/ }, () => this.props.update_price(-this.state.count * this.props.data.PRICE_AFTER_OFFER))
                                                    // this.props.delete(this.props.dataDetail.ID)
                                                    this.props.update_cart()
                                                })

                                       
                                            :
                                            
                                                
                                                Axios.delete('/order/card/' + this.props.data.ID).then(async res => {
                                               store.note_count -= this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? 1 : this.state.count
                                               await this.setState({ lazy: true })
                                               store.note[this.props.data.product_store.ID] = 0;
                                               await this.setState({ lazy: false, /*count: 0*/ }, () => this.props.update_price(-this.state.count * this.props.data.PRICE_AFTER_OFFER))
                                               this.props.delete(this.props.data.ID)
                                               this.props.update_cart()
                                           })

                                  
                                            
                                        }}>
                                        <View style={{
                                            width: 25,
                                            height: 25,
                                            marginRight: wp('3%'),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                            borderColor: 'black',
                                            borderRadius: 5,
                                            borderWidth: 0.5
                                        }}>
                                            <Material name='delete' color={'orange'} size={20} />
                                        </View>
                                    </TouchableWithoutFeedback>


                                     <TouchableWithoutFeedback disabled={this.state.lock ? true : false}
                                        hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                        onPress={async () => {
                                            try {
                                                Axios.post('order/cart', {
                                               'PRODUCT_ID': this.props.data.product_store.ID,
                                              'COUNT': this.state.count,
                                               'DESCRIPTION': 'DESCRIPTION',
                                            //    'NOTE_BOOK': 1,
                                               'FEATURE_ID_IN1':this.state.dataDetail?.FEATURE_ID_1,
                                               'FEATURE_ID_IN2' :this.state.dataDetail?.FEATURE_ID_2

                                                    }).then(async datas => {
                                                  
                                                        store.cart[this.props.data.product_store.ID + 'orderId'] = datas.data.ORDER_ID;

                                                        if (store.cart[this.props.data.product_store.ID]) {
                                                            store.cart[this.props.data.product_store.ID] += datas.data.COUNT * stepCount;
                                                        } else {
                                                            store.cart[this.props.data.product_store.ID] = datas.data.COUNT * stepCount
                                                        }
                                                   store.cart_count += datas.data.COUNT
                                                   console.log(store.cart ,'store.cart')
                                                   this.props.dataDetail ?   
                                                   Axios.delete(
                                                    '/order/cart/'+this.props.dataDetail.ORDER_PRODUCT_ID 
                                                +'?ORDER_PRODUCT_DETAIL_ID='+this.state.dataDetail.ID
                                                  
                                                ).then(async res => {

                                                    
                                                    store.note_count -= this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? 1 : this.state.count
                                                    await this.setState({ lazy: true })
                                                    store.note[this.props.data.product_store.ID] = 0;
                                                    await this.setState({ lazy: false, /*count: 0*/ }, () => this.props.update_price(-this.state.count * this.props.data.PRICE_AFTER_OFFER))
                                                    //  this.props.delete(this.props.dataDetail.ID)
                                                    this.props.update_cart()
                                                })
                                                :

                                                 Axios.delete(
                                                    '/order/cart/' + this.props.data.ID
                                                ).then(async res => {
                           

                                                    store.note_count -= this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? 1 : this.state.count
                                                    await this.setState({ lazy: true })
                                                    store.note[this.props.data.product_store.ID] = 0;
                                                    await this.setState({ lazy: false, /*count: 0*/ }, () => this.props.update_price(-this.state.count * this.props.data.PRICE_AFTER_OFFER))
                                                    this.props.delete(this.props.data.ID)
                                                    this.props.update_cart()
                                                    
                                                })
                                                   
                                                })
                                            } catch (error) {
                                            }
                                        }}>
                                        <View style={{
                                            width: 25,
                                            height: 25,
                                            marginRight: wp('2%'),
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                            borderColor: 'black',
                                            borderRadius: 5,
                                            borderWidth: 0.5
                                        }}>
                                            <CartIcon name='cart-plus' color={'black'} size={20} />
                                        </View>
                                    </TouchableWithoutFeedback>

                                </View>
                       </View>







                    </View>

                    
                </View>
                {
                    
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

export default class App extends Beep(BeepProp, Component) {

    state = {
        data: [],
        loading: true,
        price: 0,
        offerValue: store.offerValue,
        code: store.code,
        isGuest: false,
        showCode: true
    }




    cartwithoutloading = async () => {
        
        this.setState({ loading: true })
        try {
            let note = await Axios.get('order/notes')
         
            this.setState({ data: note.data, loading: false, code: store.code, offerValue: store.offerValue })
        } catch (error) {
            if (error.response.status >= 500) {
                Toast.show({
                    text: 'خطای سرور',
                    type: 'danger',
                    duration: 3000,
                    buttonText: 'تایید',
                    buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                })
            }
            this.setState({ loading: false })
        }
    }
    cartUpdate = async ({ code, amount }) => {
        try {
            await this.setState({ loading: true, price: 0 });
            let Note = await Axios.get('order/notes');

            let offer
            ////
           
                ////
                this.setState({
                    loading: false,
                    data: Note.data,
                })
            
           
        }

        catch (error) {
            console.log(error, 'errors')
            if (error.response.status > 499) {
                Toast.show({
                    text: 'مشکلی از سمت سرور وجود دارد لطفا دوباره امتحان کنید !',
                    type: 'danger',
                    duration: 3000,
                    buttonText: 'تایید',
                    buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
                })
            }
            this.setState({ loading: false })
        }
    }


    async componentDidMount() {
        AsyncStorage.getItem('isGuest').then(async guest => {
            await this.setState({ isGuest: guest === '1' })
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


  createCart(ID, count) {
        const { item } = this.props.navigation.state.params
        this.setState({ lazy: true });
        Axios.post('order/cart', {
            'PRODUCT_ID': ID,
            'COUNT': count,
            'DESCRIPTION': 'DESCRIPTION'
        }).then((response) => {
            store.cart_count += (this.state.data.PRODUCT_UNIT_ID === 1 ? 1 : count);
            store.cart[item.ID + 'orderId'] = response.data.ORDER_ID;
            if (store.cart[item.ID]) {
                store.cart[item.ID] += count;
            } else {
                store.cart[item.ID] = count;
            }
            Toast.show({
                text: this.state.data.NAME + ' به تعداد ' + count + ' به سبد خرید شما اضافه شد.',
                type: 'success',
                position: 'top'
            });
            this.setState({ lazy: false, order: response.data.ORDER_ID })

        }).catch((error) => {
            // alert(JSON.stringify(error, null, 5))
            console.log('add errror', error)
        })
    }


    render() {
        if (this.state.loading)
            return (
                <View style={styles.container}>
                    <Appbar.Header style={{ backgroundColor: 'white' }}>
                        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                            <Text style={{ ...styles.TextBold, color: 'black', fontSize: 18 }}>دفترچه یادداشت</Text>
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
                            Alert.alert('حذف', 'آیا از خالی کردن دفترچه  خود اطمینان دارید ؟', [
                                {
                                    text: 'بله',
                                    onPress: async () => {
                                        try {
                                            await Axios.delete('order/notes')
                                            this.cartUpdate({ code: this.state.code, offerValue: this.state.offerValue })
                                            store.note_count = 0;
                                            store.note = {}

                                            Toast.show({
                                                text: ' با موفقیت حذف شد',
                                                type: 'success',
                                                duration: 3000,
                                                buttonText: 'تایید',
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
                                                buttonText: 'تایید',
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
                                    text: 'خیر'
                                }
                            ])
                        }}
                    >
                        <View style={{ padding: 10, position: 'absolute', left: 0 }}>
                            <Material name='remove-shopping-cart' color='gray' size={20} />
                        </View>
                    </TouchableWithoutFeedback>
                    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                        <Text style={{ ...styles.TextBold, color: 'black', fontSize: 18 }}>دفتر چه یادداشت</Text>
                    </View>
                </Appbar.Header>

                {this.state.data.length > 0 && <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
                    <View style={{ flex: 1, backgroundColor: 'white', paddingVertical: 10 }}>
                        {
                            this.state.data.map((element, index) => {
                                if (element.order_products[0] != null) return (
                                    <View
                                        key={'element_' + index.toString()}
                                        style={{ 
                                        
                                                 borderColor: '#f3f3f3' ,
                                                
                                             borderWidth: 1, margin: 8, borderRadius: 5, 
                                        }}
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
                                                justifyContent: 'space-between',
                                                backgroundColor: '#e1ffe4'
                                            },
                                            
                                        ]}>
                                            
                                        </View>
                                        {
                                            element.order_products.map((item, i) => {
                                                return (
                                                    item.order_product_details.length == 0 ?
                                                    <NooteBook
                                                        key={'cart_' + item.product_store.PRODUCT_ID.toString()}
                                                        update_cart={this.cartwithoutloading}
                                                        update_price={this.update_price}
                                                        data={item}
                                                        // confirm={element.confirm}
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
                                                          
                                                  <NooteBook
                                                        // key={'cart_' + item.ORDER_PRODUCT_ID.toString()}
                                                        update_cart={this.cartwithoutloading}
                                                        update_price={this.update_price}
                                                        data={item}
                                                         dataDetail={items}
                                                        confirm={element.confirm}
                                                        deleteOrder={(id) => {
                                                            console.log(id,'id')
                                                                         console.log(this.state.data,'id')
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
                                    
                                    </View>
                                )
                                else return null
                            })
                        }
                    </View>
                </ScrollView>}

              
                {
                    this.state.data.length > 0 && this.state.price > 0 ?
                        null
                        :
                        <View style={{ justifyContent: 'center', padding: 10 }}>
                            <Text style={{ textAlign: 'center', ...styles.TextRegular }}>دفترچه  يادداشت شما خالی است!</Text>
                        </View>
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
        fontFamily: '$IRANYekanRegular',
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
