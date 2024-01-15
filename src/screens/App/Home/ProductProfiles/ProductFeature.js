import { StyleSheet, Text, View,ScrollView } from 'react-native'
import React from 'react'
import { useTranslation } from 'react-i18next';
import { config } from '../../../../App';

const ProductFeature = (props) => {
    const data=props.data
    const Price =props.price[0]
    let PRICE = Price?.PRICE 
    let hasOff = Price ? Price.PRICE_AFTER_OFFER !== Price?.PRICE : false;
    let OFFERPRICE = Price?.PRICE_AFTER_OFFER;

    const { t, i18n } = useTranslation();
  return (
    <View  style={styles.container} >
<View style={styles.priceAll}>
<Text style={styles.txtPrice}>
{t('price')+ ' : '}
</Text>

{
      hasOff  ?
          <View style={styles.hasOff}>
            <Text style={{...styles.txtPrice,textDecorationLine: 'line-through'}}>
                   {PRICE}
            </Text>

            <Text style={{...styles.txtPrice,color:'red'}}>
            {OFFERPRICE}
              </Text>
        </View>
      :
        <View>
           <Text style={styles.txtPrice}>
                   {`${config.priceFix(PRICE) } تومان`}
            </Text>
          </View>
    }
    </View>

    <View>
    <Text style={styles.txtPrice}>
                   {`برند : `}
            </Text>

            <Text style={{...styles.txtPrice,alignSelf:'flex-end'}}>
             {`${data.product_brand?.NAME}`}
              </Text>
    </View>

    <View>
    <Text style={styles.txtPrice}>
                   {`توضیحات : `}
            </Text>
            <Text style={{...styles.txtPrice}}>
             {`${data.productAdditional?.SHORT_DESCRIPTION}`}
              </Text>
    </View>


    </View>
  )
}

export default ProductFeature

const styles = StyleSheet.create({

container:{
  
    paddingHorizontal:15
},
priceAll:{
},
hasOff:{
  flexDirection:'row'
},
txtPrice:{
  color: 'black',
  fontSize: 16,
  fontFamily:'IRANYekanRegular',
  fontWeight:'800'
}
})