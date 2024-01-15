import { StyleSheet, Text, View ,TouchableOpacity } from 'react-native'
import React,{useState} from 'react'
import { config } from '../../../../App'
import { useTranslation } from 'react-i18next';
import {EditCart}from './Services'
import Material from 'react-native-vector-icons/MaterialIcons'
import { BeepProp } from '../../../../store/BeepProp'
import { state as store, Beep } from 'react-beep'
const ProductItemProfile = (props) => {
    const [state,setState]=useState({ show: false,count: 0, lazy: false,ORDER_ID: 0})
        
       
    const item = props.item 
    let hasOff = item.product_store_prices[0] ?
    item.product_store_prices[0].PRICE_AFTER_OFFER !== item.product_store_prices[0].PRICE :
    false
let before = item.product_store_prices[0] ? config.priceFix(item.product_store_prices[0].PRICE) : config.priceFix(0)
let after = item.product_store_prices[0] ? config.priceFix(item.product_store_prices[0].PRICE_AFTER_OFFER) : config.priceFix(0) 


 timeout = null
closeModal = () => setState({ show: false })

resetTimeOut = () => {
    clearTimeout(timeout)
    timeout = setTimeout(closeModal(), 7000)
}
const { t, i18n } = useTranslation();
  return (
    <TouchableOpacity
                onPress={() =>
                    props.navigation.push('ProductProfile', {
                        item: {...item.product, PRODUCT_ID: item.PRODUCT_ID, ID: item.ID},
                        Route: [...props.routes,props.ProductName]  
                    }) } > 
                <View
                    style={styles.viwContainer}
                >
                    {hasOff ? (
                        <View style={{ position: 'absolute', right: 0, zIndex: 1000 }} >
                            <View
                                style={[
                                    styles.triangle,
                                    { position: 'absolute', top: 0, right: 0 }
                                ]}
                            />
                           
                        </View>
                    ) : null}
                    <View>
                        <FastImage
                            source={{ uri: config.ImageBaners + config.ProductSubUrl + item.product.IMAGE }}
                            resizeMode="contain"
                            style={{ width: '100%', height: 115, borderRadius: 7, marginTop: 5 }}
                        />
                        <Text
                            numberOfLines={2}
                            style={{...styles.TextBold, paddingHorizontal: 5,fontSize: 13 }}>
                            {item.product.NAME}
                        </Text>
                    </View>
                    {hasOff ? (
                        <View
                            style={{ flexDirection: 'row-reverse', alignItems: 'center' }}
                        >
                            <Text
                                style={{
                                    ...styles.TextRegular,
                                    paddingHorizontal: 5,
                                    fontSize: 12,
                                    textDecorationStyle: 'dotted',
                                    textDecorationLine: 'line-through',
                                    
                                    fontFamily: i18n.language=="en" ? null : 'IRANYekanRegular',
                                }}
                            >
                                {config.priceFix(before)} {t('currency-unit')}
                            </Text>
                            <View style={{ width: 10 }} />

                            <Text
                                style={{
                                    ...styles.TextRegular,
                                    paddingHorizontal: 5,
                                    fontSize: 12,
                                    color: 'red',
                                   fontFamily: i18n.language=="en" ? null : 'IRANYekanRegular',
                                }}
                            >
                                {config.priceFix(after)} {t('currency-unit')}
                            </Text>
                        </View>
                    ) : (
                        <Text
                            style={{
                                ...styles.TextRegular,
                                paddingHorizontal: 5,
                                fontSize: 12,
                               fontFamily: i18n.language=="en" ? null : 'IRANYekanRegular',
                            }}>
                            {config.priceFix(before)} {t('currency-unit')}
                        </Text>
                    )}
                  
                    {
                        state.show &&
                        <View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2000 }}>
                            <View style={styles.viwBottomBascket}>
                                <View style={styles.viwBotton}>
                                    <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                        onPress={ () => {

                                            if (!state.lazy){

                                                setState({
                                                    lazy: true,
                                                    count: store.cart[item.ID] + 1
                                                })
                                                resetTimeOut()
                                                EditCart(state.ORDER_ID,'',item.ID,store.cart[item.ID],'').then(()=>{
                                                    setState({ lazy: false })
                                                }).catch(()=>{
                                                    setState({
                                                        lazy: false,
                                                        count: store.cart[item.ID] - 1
                                                    })})}
                                         } } >

                                        <View style={styles.viwAdd}>
                                            <Material name='add' size={15} />
                                        </View>
                                    </TouchableWithoutFeedback>

                                    <Text style={{
                                        ...styles.TextRegular,
                                        color: 'black',
                                        fontSize: 12,
                                        textAlign: 'center',
                                        alignSelf: 'center',
                                        padding: 5,
                                        fontFamily: i18n.language=="en" ? null : 'IRANYekanRegular',
                                    }}>{store.cart[item.ID]}</Text>

                                    <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
                                        onPress={async () => {
                                            if (store.cart[item.ID] > 0 && !state.lazy) {
                                                if (store.cart[item.ID] == 1) {
                                                    try {
                                                        resetTimeOut()
                                                        
                                                        let q = await Axios.delete('/order/cart/' + item.ID)
                                                        setState({
                                                            lazy: true,
                                                            show: false
                                                        })
                                                    } catch (error) {
                                                    }
                                                    return
                                                }
                                                    setState({
                                                        lazy: true,
                                                        count: store.cart[item.ID] - 1
                                                    })
                                                    resetTimeOut()
                                                    EditCart(state.ORDER_ID,'',item.ID,store.cart[item.ID],'').then(()=>{
                                                        setState({ lazy: false })
                                                    }).catch(()=>{
                                                        setState({
                                                            lazy: false,
                                                            count: store.cart[item.ID] + 1
                                                        })})}
                                        }}>
                                        <View style={styles.viwRemove}>
                                            <Material name='remove' size={15} />
                                        </View>
                                    </TouchableWithoutFeedback>

                                </View>
                            </View>
                            <View style={{
                                position: 'absolute', width: '100%', height: '100%',
                                backgroundColor: 'gray', opacity: 0.4, zIndex: 2000
                            }} />
                        </View>
                    }
                </View>
            </TouchableOpacity>
  )
}

export default ProductItemProfile

const styles = StyleSheet.create({

    viwContainer:{
        height: 190,
        width: 140,
        backgroundColor: 'white',
        margin: 5,
        overflow: 'hidden',
        // padding: 5,
        borderRadius: 7,
        elevation: 1,
        justifyContent: 'space-between',
        zIndex: 1
    },
    viwAdd:{
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderRadius: 5,
        borderWidth: 0.5
    },
    viwRemove:{
        width: 20,
        height: 20,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderRadius: 5,
        borderWidth: 0.5
    },
    viwBottomBascket:{
        position: 'absolute',
        top: 5,
        left: 5,
        right: 5,
        backgroundColor: 'white',
        borderRadius: 4,
        elevation: 2,
        zIndex: 2002,
        alignItems: 'center',
        justifyContent: 'center'
    },
    viwBotton:{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        width: 80,
        justifyContent: 'space-between'
    }


})