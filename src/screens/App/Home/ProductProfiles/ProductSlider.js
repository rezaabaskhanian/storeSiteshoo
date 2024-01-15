import { StyleSheet, Text, View,Image,Dimensions } from 'react-native'
import React ,{memo}from 'react'
import { SliderBox } from "react-native-image-slider-box";


const ProductSlider = (props) => {
    const { width } = Dimensions.get('window')
  return (
    <View style={{paddingVertical:35,paddingRight:10}}>


  {
    props.iamges?.length ==0 ?
    <Image
  
    source={require('../../../../assest/cart.png')}
    resizeMode='contain'
    style={{ width, height: 300 }}
/>

    :
    <SliderBox
    images={props.images}
    sliderBoxHeight={200}
    
    dotColor="#FFEE58"
    inactiveDotColor="#90A4AE"
  //   paginationBoxVerticalPadding={20}
    autoplay
    circleLoop
  //   resizeMethod={'resize'}
  //   resizeMode={''}
    paginationBoxStyle={{
      
      bottom: 0,
      padding: 0,
      alignItems: "center",
      alignSelf: "center",
      justifyContent: "center",
      paddingVertical: 10
    }}
    dotStyle={{
      width: 10,
      height: 10,
      borderRadius: 5,
      marginHorizontal: 0,
      padding: 0,
      margin: 0,
      backgroundColor: "rgba(128, 128, 128, 0.92)"
    }}
    ImageComponentStyle={{borderRadius: 15, width: '97%', marginTop: 5}}
    imageLoadingColor="#2196F3"
    autoplayInterval={8000}
  />
  }
    </View>
  )
}

export default ProductSlider

const styles = StyleSheet.create({})