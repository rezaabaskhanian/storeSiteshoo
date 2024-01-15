
import { StyleSheet, Text, View,TouchableOpacity ,ActivityIndicator,TextInput} from 'react-native'
import React,{useEffect,useState,memo,useCallback} from 'react'
import Material from 'react-native-vector-icons/MaterialIcons'
import {EditCart} from '../Services'
import { Colors } from '../../../../../styles'

import { useTranslation } from 'react-i18next';
import RenderRemoveCount from './RenderRemoveCount'
import RenderAddCount from './RenderAddCount'
import { BeepProp } from '../../../../../store/BeepProp'
import { state as store, Beep } from 'react-beep'
import { object } from 'underscore'

const ActionsCarts = (props) => {
    const AddToCart= useCallback(()=>{


    },

    [])
    const [feature,setFeature]=useState({count: 0,lazy:false})

    const data=props.data

    // const  convertAddCart=(e)=>{
    //     setFeature({count:e})
    // }
    const { t, i18n } = useTranslation();

   const  onPressAdd=useCallback(() => {
    // const a =store.cart
    // const values = Object.values(a);
    // console.log(values[0],'data.IN_CART ')
    setFeature(prevFeature => ({
        ...prevFeature,
        count: prevFeature.count + 1
      }));
    
  },
   // dependencies array
 [feature.count]);
    const onPressRemove =useCallback(() => {
        setFeature(prevFeature => ({
            ...prevFeature,
            count: prevFeature.count - 1
          }));
      },
       // dependencies array
     [feature.count]);
  return (
    <View style={styles.viwContainer}>
        {console.log('render')}
        <View>
            <View style={[styles.button, {
                position: 'absolute',
                top: 5,
                left: 5,
                right: 5,
                borderRadius: 4,
                elevation: 2,
                zIndex: 2002,
                marginBottom: 20
            }]}>
                {feature.lazy ? <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <ActivityIndicator />
                </View> : <View style={styles.viwCart}>
                    <Material name='shopping-basket' style={{ color: 'black' }}
                        size={30} />

                <RenderAddCount onPress={onPressAdd}/>

<View style={styles.viwInput}>
       {/* <TextInput
  placeholderTextColor='black'
   style={[{height: 50, fontSize: 15, textAlign: 'center',alignSelf: 'center',fontFamily: 'IRANYekanRegular'}]}           
   placeholder={`0`}
  onChangeText={convertAddCart}
  value={feature.count}
 keyboardType={'numeric'}/> */}

 <Text style={{ fontSize: 15, textAlign: 'center',alignSelf: 'center',fontFamily: 'IRANYekanRegular'}}>
    {feature.count}
 </Text>
                    </View> 
                     <RenderRemoveCount onPress={onPressRemove}/>
                     <TouchableOpacity 
                              onPress={()=>{
               data.PRODUCT_STATUS_ID ==2 ? Toast.show({text: 'محصول موجود نیست', type: 'danger',position: 'top'  }) : 
               AddToCart()
                              }}
                              style={styles.touchAdd}>

                                         <Text style={[{fontSize:11,textAlign:'center'}]}>
                                     {data.PRODUCT_STATUS_ID ==2 ? t('does-not-exist') :t('add-to-cart')}
                                          </Text>
                                        </TouchableOpacity>
                </View>}

            </View>
            <View style={{
                position: 'absolute', width: '100%', height: '100%',
                backgroundColor: 'gray', opacity: 0.4, zIndex: 2000
            }} />
        </View>
    </View> 
  )
}

export default memo(ActionsCarts) 

const styles = StyleSheet.create({
viwCart :{
    flexDirection: 'row-reverse',
    alignItems: 'center',
   width: '100%',
    justifyContent: 'space-between'
},
touchAdd:{ width: 60,
    height: 40,
  justifyContent:'center',
    alignItems: 'center',
    borderColor: 'black',
    borderRadius: 5,
    borderWidth: 0.5},
    viwContainer:{
        flexDirection: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-around',
       
        paddingVertical:40,
        marginBottom: 50
    },
    button: {
        borderRadius: 17,
        padding: 10,
        backgroundColor: Colors.GreenLight,
        flexDirection: 'row-reverse',
        alignItems: 'center',
        // justifyContent: 'center'
    },
    viwInput:{ width: 30,
        height: 30,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: 'black',
        borderRadius: 5,
        borderWidth: 0.5}

})