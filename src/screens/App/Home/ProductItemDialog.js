import {TouchableWithoutFeedback, View} from "react-native";
import Axios from "axios";
import {state as store} from "react-beep";
import Material from "react-native-vector-icons/MaterialIcons";
import {Text} from "native-base";
import React from "react";
import StyleSheet from "react-native-extended-stylesheet";

export default function ProductItemDialog(props) {
    return(
        <View style={{position: 'absolute', width: '100%', height: '100%', zIndex: 2000}}>
            <View style={{
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
            }}>
                <View style={{
                    flexDirection: 'row-reverse',
                    alignItems: 'center',
                    width: 80,
                    justifyContent: 'space-between'
                }}>
                    <TouchableWithoutFeedback hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
                                              onPress={async () => {
                                                  if (!props.data.lazy) try {
                                                      props.setData({...props.data, lazy: true, count: props.data.count + 1})
                                                      await Axios.put('order/cart', {
                                                          'ORDER_ID': props.data.orderId,
                                                          'PRODUCT_ID': '',
                                                          'PRODUCT': props.item.ID,
                                                          'COUNT': props.data.count,
                                                          'DESCRIPTION': null
                                                      });
                                                      store.cart_count += 1
                                                      props.setData({...props.data, lazy: false})
                                                      props.resetTimeOut()
                                                  } catch (error) {
                                                      store.cart_count -= 1
                                                      props.setData({...props.data, lazy: false, count: props.data.count - 1})
                                                      props.resetTimeOut()
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
                            <Material name='add' size={15}/>
                        </View>
                    </TouchableWithoutFeedback>

                    <Text style={{
                        ...styles.TextRegular,
                        color: 'black',
                        fontSize: 12,
                        textAlign: 'center',
                        alignSelf: 'center',
                        padding: 5
                    }}>{props.data.count}</Text>

                    <TouchableWithoutFeedback hitSlop={{top: 10, left: 10, right: 10, bottom: 10}}
                                              onPress={async () => {
                                                  if (props.data.count > 0 && !props.data.lazy) {
                                                      if (props.data.count === 1) {
                                                          await Axios.delete('/order/cart/' + props.item.ID)
                                                          props.setData({
                                                              ...props.data,
                                                              lazy: true,
                                                              show: false,
                                                              count: 0
                                                          })
                                                          props.resetTimeOut()
                                                      } else {
                                                          try {
                                                              store.cart_count -= 1
                                                              props.setData({
                                                                  ...props.data,
                                                                  lazy: true,
                                                                  show: false,
                                                                  count: props.data.count - 1
                                                              })
                                                              await Axios.put('order/cart', {
                                                                  'ORDER_ID': props.data.orderId,
                                                                  'PRODUCT_ID': '',
                                                                  'PRODUCT': props.item.ID,
                                                                  'COUNT': props.data.count,
                                                                  'DESCRIPTION': null
                                                              })
                                                              props.setData({
                                                                  ...props.data,
                                                                  lazy: false
                                                              })
                                                          } catch (error) {
                                                              store.cart_count += 1
                                                              props.setData({
                                                                  ...props.data,
                                                                  lazy: false,
                                                                  count: props.data.count + 1
                                                              })
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
                            {props.data.count === 1 ? <Material name='delete' size={15}/> :
                                <Material name='remove' size={15}/>}
                        </View>
                    </TouchableWithoutFeedback>

                </View>
            </View>
            <View style={{
                position: 'absolute', width: '100%', height: '100%',
                backgroundColor: 'gray', opacity: 0.4, zIndex: 2000
            }}/>
        </View>
    )
}
const styles = StyleSheet.create({
    TextBold: {
        fontFamily: '$IRANYekanBold',
        fontWeight: '$WeightBold'
    },
    TextRegular: {
        fontFamily: 'IRANYekanRegular',
        fontWeight: '$WeightRegular',
        fontSize: 13
    },
    header: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        overflow: 'hidden',
        elevation: 2
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 30,
        borderTopWidth: 30,
        borderLeftColor: 'transparent',
        borderTopColor: 'purple',
        transform: [{rotate: '0deg'}]
    }
})
