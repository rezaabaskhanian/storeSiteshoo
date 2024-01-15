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
import Axios from 'axios'
import { config } from '../../../App'
import { Toast, Input, Button, Item, Spinner, CheckBox } from 'native-base'
import { BeepProp } from '../../../store/BeepProp'
import { state as store, orderType, Beep } from 'react-beep'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { withTranslation } from 'react-i18next';

class CartItem extends Beep(BeepProp, Component) {
     state = {
         count: this.props.dataDetail.COUNT,
        data: this.props.data,
        dataDetail:this.props.dataDetail,
         lazy: false,
        lock: this.props.data.DELETED,
        modalVisible: false,
         disc: this.props.data.DESCRIPTION,
         confirm: this.props.confirm.CONFIRM_BY_CUSTOMER,
         
         priceGarantee:store.allSetting.GUARANTEE
    };

    
    setModalVisible(visible) {
        this.setState({ modalVisible: visible })
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
    }

    render(){
        const {t} =this.props
                //  {console.log(this.state.dataDetail.HAS_GUARANTEE,store.allSetting.GUARANTEE,'this.state.dataDetailthis.state.dataDetail')}
          const stepCount = (this.state.data && this.state.data.product_store && this.state.data.product_store.product) ? this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? 0.5 : 1 : 0
         return (

   
            <View style={{
                flex: 1,
                marginVertical: 5,
                width: '100%',
                alignSelf: 'center',
                flexDirection: 'row-reverse',
                // height: 70,
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
                            }}>{t('details')}{(this.state.data && this.state.data.product_store && this.state.data.product_store.product) ? this.props.data.product_store.product.NAME : ''}</Text>
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
                                            'DESCRIPTION': this.state.disc,
                                            'ORDER_PRODUCT_DETAIL_ID' :this.state.dataDetail?.ORDER_PRODUCT_ID
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

                                    <Text style={[styles.TextBold, { color: 'white', textAlign: 'center' }]}>{t('yes')}</Text>
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
                                }}>{(this.state.data && this.state.data.product_store && this.state.data.product_store.product) ? this.props.data.product_store.product.NAME  : ''}</Text>


                                {
                                    this.state.dataDetail.ProductFeature1 ? 
                                    <View style={{flexDirection:'row-reverse'}}>
                                    <Text numberOfLines={1}
                                style={{
                                    ...styles.TextBold,
                                    color: 'black',
                                    fontSize: 10,
                                    alignSelf: 'flex-end'
                                }}>{ 'color : '}</Text>

                                <View style={{width:15,height:15,borderRadius:7.5 ,backgroundColor:this.state.dataDetail?.ProductFeature1.VALUE,marginTop:2}}/>
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
                                }}>{ 'Size  : '}</Text>
                         <Text numberOfLines={1}
                                style={{
                                    ...styles.TextBold,
                                    color: 'black',
                                    fontSize: 10,
                                    alignSelf: 'flex-end'
                                }}>{ this.state.dataDetail?.ProductFeature2?.VALUE}</Text>
                              
                                     </View>
                                     :null
                                }

                                {this.state.dataDetail?.HAS_GUARANTEE==1 ?
                                 <View style={{flexDirection:'row-reverse'}}>
                                <Text style={{
                                    ...styles.TextRegular,
                                    color: 'black',
                                    fontSize: 12,
                                    textAlign: 'center',
                                    alignSelf: 'center',
                                    padding: 5
                                }}>{'It has a warranty'}</Text>
                                </View>
                            :null}
 {(this.props.data.PRICE_AFTER_OFFER !== this.props.data.PRICE) && <Text style={{
                                ...styles.TextRegular, color: 'gray', fontSize: 9, textDecorationStyle: 'dotted',
                                textDecorationLine: 'line-through'
                            }}>{this.state.dataDetail?.HAS_GUARANTEE == 0 ? config.priceFix(this.props.data.PRICE) : config.priceFix(this.props.data.PRICE+Number(store.allSetting.GUARANTEE)) } $</Text>}

 <Text style={{
                                ...styles.TextRegular,marginTop:3,
                                color: (this.props.data.PRICE_AFTER_OFFER !== this.props.data.PRICE) ? '#273c1a' : 'gray',
                                fontSize: 11,
                                backgroundColor: '#c7ff99',
                                width: wp('20%'),
                                alignSelf: 'flex-end'
                            }}>{this.state.dataDetail?.HAS_GUARANTEE == 1 ? config.priceFix( (this.props.data.PRICE_AFTER_OFFER +Number( store.allSetting.GUARANTEE)) *this.state.dataDetail?.COUNT ) :  config.priceFix(this.props.data.PRICE_AFTER_OFFER*this.state.dataDetail?.COUNT) 
                               } $</Text>
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

                                </View>
                                :
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
                                                    'HAS_GUARANTEE':this.state.dataDetail?.HAS_GUARANTEE,
                                                    'DESCRIPTION': this.state.disc,
                                                    'ORDER_PRODUCT_DETAIL_ID' :this.state.dataDetail.ID

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
                                                        Axios.delete('/order/cart/'+this.props.dataDetail.ORDER_PRODUCT_ID 
                                                +'?ORDER_PRODUCT_DETAIL_ID='+this.state.dataDetail?.ID
                                                        ).then(async res => {
                                                            console.log(res,'res')
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
                                                        console.log(stepCount,'stepCount')
                                                        Axios.put('order/cart', {
                                                            'ORDER_ID': this.props.data.ORDER_ID,
                                                            'PRODUCT_ID': this.props.data.ID,
                                                            'COUNT': this.state.count - stepCount,
                                                            'HAS_GUARANTEE':this.state.dataDetail?.HAS_GUARANTEE,
                                                            'DESCRIPTION': this.state.disc,
                                                            'ORDER_PRODUCT_DETAIL_ID' :this.state.dataDetail?.ID
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
                                            this.props.dataDetail ? 


                                                Axios.delete('/order/cart/'+this.props.dataDetail.ORDER_PRODUCT_ID 
                                                +'?ORDER_PRODUCT_DETAIL_ID='+this.state.dataDetail?.ID).then(async res => {
                                                    console.log(store.cart,'resDeletet')
                                                    store.cart_count -= this.state.count
                                                    await this.setState({ lazy: true })
                                                    store.cart[this.props.data.product_store.ID] = 0;
                                                    await this.setState({ lazy: false, /*count: 0*/ }, () => this.props.update_price(-this.state.count * this.props.data.PRICE_AFTER_OFFER))

                                                //    this.props.delete(this.state.dataDetail.ORDER_PRODUCT_ID)
                                                    this.props.update_cart()
                                                })
 
                                                :
                                                Axios.delete('/order/card/' + this.props.data.ID).then(async res => {
                                                    console.log(res,'res')
                                                    store.cart_count -= this.state.data.product_store.product.PRODUCT_UNIT_ID === 1 ? 1 : this.state.count
                                                    await this.setState({ lazy: true })
                                                    store.cart[this.props.data.product_store.ID] = 0;
                                                    await this.setState({ lazy: false, /*count: 0*/ }, () => this.props.update_price(-this.state.count * this.props.data.PRICE_AFTER_OFFER))

                                                //    this.props.delete(this.state.dataDetail.ORDER_PRODUCT_ID)
                                                    this.props.update_cart()
                                                })
                                            
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

 
 export default  withTranslation()(CartItem)



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