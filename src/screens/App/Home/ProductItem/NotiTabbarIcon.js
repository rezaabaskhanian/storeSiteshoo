
import React,{useEffect} from 'react'
import { View, TouchableWithoutFeedback, TouchableOpacity, ActivityIndicator, AsyncStorage, Image } from 'react-native'
import { Text, Toast } from 'native-base'
import StyleSheet from 'react-native-extended-stylesheet'
import Axios from 'axios'
import Material from 'react-native-vector-icons/MaterialIcons'
import { state as store, on, Beep } from 'react-beep'
import FastImage from 'react-native-fast-image'
import { CreateCart ,GetCart,EditCart} from './Services'
import {Colors} from '../../../../styles/index'
import { BeepProp } from '../../../../store/BeepProp'
import ShowModal from './ShowModal'
let timeout = null;

const NotiTabbarIcon = (props) => {
    const item = props.item;
    const stepCount = item.PRODUCT_UNIT_ID === 1 ? 0.5 : 1;
    let hasOff = item.PRICE_AFTER_OFFER ? item.PRICE_AFTER_OFFER !== item.PRICE : false;
    let before = item.PRICE ? item.PRICE : item.SYSTEM_PRICE;
    let after = item.PRICE_AFTER_OFFER;

    const [order, setOrder] = React.useState(store.cart[item.ID + 'orderId'] ? store.cart[item.ID + 'orderId'] : 0);
    const [data, setData] = React.useState({ show: false, lazy: false, orderId: 0 });
    const [count, setCount] = React.useState(store.cart[props.item.ID] ? store.cart[props.item.ID] : 0);
   
  
    const closeModal = () => {
        setData({ ...data, show: false })
    };

    const resetTimeOut = () => {
        clearTimeout(timeout);
        timeout = setTimeout(closeModal, 3000)
    };

   function  addToCart (ID, count, DESCRIPTION){
    CreateCart(ID, count, DESCRIPTION).then((res)=>{
        store.cart_count += 1;
        setData({ ...data, show: true, orderId: res.ORDER_ID });
        setOrder(res.ORDER_ID);
        setCount(stepCount);
        store.cart[props.item.ID + 'orderId'] = res.ORDER_ID;
        if (store.cart[item.ID]) {
            store.cart[item.ID] += stepCount;
        } else {
            store.cart[item.ID] = stepCount;
        }
        resetTimeOut()
    }).catch((e) => {
        Toast.show({
            text: 'برای خرید این محصول لطفا رنگ را اضافه کنید',
            type: 'danger',
            duration: 3000,
            buttonText: 'تایید',
            buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
        }) 
    })
  
   }



   const onPressAdd =async()=>{
    let cart=await GetCart().then((data)=>{return(data)})
  let ItemID =cart[0].order_products.find((data)=>{return data.product_store.ID==item.ID})
  let countTemp = store.cart[props.item.ID] ? store.cart[props.item.ID] : 0
              if (count !== countTemp && countTemp !== 0) {
                  setCount(countTemp)
              }
              if (!data.lazy)
                  try {
                      resetTimeOut()
                      setData({ ...data, lazy: true })
                      EditCart (ItemID.ID,ItemID.order_product_details  !==[] ? ItemID.order_product_details.FEATURE_ID:'',countTemp + stepCount,'')
                      .then(res => {
                        console.log(res,'resss')
                          if (res) {
                              if (store.cart[item.ID]) {
                                  store.cart[item.ID] += stepCount;
                              } else {
                                  store.cart[item.ID] = stepCount;
                              }
                              setCount(countTemp + stepCount);
                              store.cart_count += stepCount === 1 ? 1 : 0;
                              setData({ ...data, lazy: false })
                          }
                      }).catch(err => {
                          console.warn(err)
                          setData({ ...data, lazy: false })
                      });
                  } catch (error) {
                      console.warn(error);
                  } 
   }

   const onPressRemove =async ()=>{
    
    let cart=await GetCart().then((data)=>{return(data)})
    let ItemID =cart[0].order_products.find((data)=>{return data.product_store.ID==item.ID})
        let countTemp = store.cart[props.item.ID] ? store.cart[props.item.ID] : 0

        if (count > 0 && !data.lazy) {
            if ((stepCount === 1 && count === 1) || (stepCount === 0.5 && count === 0.5)) {
                Axios.post('order/cartapp/' + order, { PRODUCT_ID: item.ID }).then(res => {
                    console.log(res.data,'resss')
                    store.cart_count -= 1;
                    if (store.cart[item.ID]) {
                        store.cart[item.ID] = 0;
                    }
                    setData({
                        ...data,
                        lazy: true,
                        show: false
                    });
                    setCount(0)
                }).catch(err => {
                    console.log(err)
                })
            } else {
                try {
                    resetTimeOut();
                    setData({
                        ...data,
                        lazy: true,
                    });
                    resetTimeOut();
                    EditCart(ItemID.ID,ItemID.order_product_details  !==[] ? ItemID.order_product_details.FEATURE_ID:'',countTemp - stepCount,'')
                    .then(res => {
                        if (res) {
                            if (store.cart[item.ID]) {
                                store.cart[item.ID] -= stepCount;
                            } else {
                                store.cart[item.ID] = stepCount;
                            }
                            setCount(countTemp - stepCount);
                            store.cart_count -= stepCount === 1 ? 1 : 0;
                            setData({ ...data, lazy: false })
                        }
                    }).catch(err => {
                        console.log(err)
                    });

                } catch (error) {
                    console.warn(error);
                }
            }
        }
   }
  
          if ((props.mode === 'landing' && props.login) || props.mode === 'store' || !props.mode) {
            if (count > 0) {
                
                return (
                    data.show ? 
                    <ShowModal data ={data} count={count} onPressAdd={onPressAdd} onPressRemove={onPressRemove}/>
                    :
                                    <TouchableOpacity  style={styles.touchContainer}  onPress={() => {
                                        resetTimeOut();
                                        setData({ ...data, show: true })
                                    }}>
                                        <Text style={styles.txtCart}>
                                            {store.cart[item.ID]}
                                        </Text>
                                    </TouchableOpacity>   

                                )
                            } else if (item.PRODUCT_STATUS_ID==2) {
                                            return (<Text style={styles.txtUnavailbale}> ناموجود </Text>)
                                             }
                                             else {
                                            return (
                                                <TouchableOpacity style={styles.touchAdd} onPress={() => addToCart(props.item.ID, 1, '')}>
                                                    <Material name='add' size={20} color={Colors.GreenLight} />
                                                </TouchableOpacity>
                            
                                            )
                                        }
                                        
                                     }
}


const styles=StyleSheet.create({
   
   touchContainer: {
    position: 'absolute', overflow: 'hidden',
    justifyContent: 'center', alignItems: 'center',
    backgroundColor:Colors.GreenLight, 
    borderRadius:30/2, width: 30, height: 30,
    borderColor: Colors.GreenLight,
    borderWidth: 1, 
    top: 4, left: 4
    },
    txtCart:{
        fontFamily:'Iranian_Sans',
        fontWeight: 'bold',
        fontSize: 13,
       width: '100%',
       height: '100%',
       backgroundColor: Colors.GreenLight,
       color: 'white',
       textAlign: 'center',
   },
   txtUnavailbale:{
    fontFamily:'Iranian_Sans',
    fontWeight: 'bold',
    fontSize: 13,                                              
    width: '100%',
    height: '100%',
    color: 'gray',
    textAlign: 'left',
    position: 'absolute', overflow: 'hidden',
    top: 4, left: 4
},
touchAdd:{
    backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
    borderRadius: 50, width: 30, height: 30,
    borderColor: Colors.GreenLight,
    borderWidth: 1, position: 'absolute', overflow: 'hidden',
    top: 4, left: 4
}


})

export default NotiTabbarIcon