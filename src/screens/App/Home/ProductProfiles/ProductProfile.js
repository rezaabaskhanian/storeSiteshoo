import { StyleSheet, Text, View ,ActivityIndicator,ScrollView} from 'react-native'
import React,{useEffect,useState} from 'react'
import HeaderRoot from './HeaderRoot';
import ProductSlider from './ProductSlider'
import {GetProduct} from '../ProductProfiles/Services'
import { config } from '../../../../App';
import Header from '../../../App/component/BackHeader'
import ProductFeature from './ProductFeature'
import ActionsCarts from './AddToCart/ActionsCarts';
const ProductProfile = (props) => {
	const [data,setData]=useState([])
	const item=props.navigation.getParam('item', [])
	const [image,setImage]=useState([])

	useEffect(() => {
		const fetchProduct = async () => {
		  const getData = await GetProduct(item.ID);
		  addPath(getData?.product?.productImages)
		  setData([getData]);
		}
	  
		fetchProduct();
	  }, []);

	  const addPath = (data)=>{
		const newImages =[]
          data.map((e)=>{
		     let path =null
			path= config.ImageBaners + config.ProductSubUrl + e.IMAGE
			newImages.push(path)
		  })
		  setImage(newImages)
	  } 
  return (
	<View>
		{
			data.length ==0 ?
			     <View style={{flex:1,justifyContent:'center',alignItems:'center',alignSelf:'center'}}>
					<ActivityIndicator size="large" color="#00ff00"/>

				</View>

				:
				<>
			
				<ScrollView>
				<Header headerText={data[0]?.product.NAME}/>
				<HeaderRoot route={props.navigation.getParam('Route', [])} name={data[0]?.product.NAME}/>
				<ProductSlider images={image}/>
				<ProductFeature data={data[0]?.product} price={data[0]?.product_store_prices}/>
				<ActionsCarts data={data[0]} />
				</ScrollView>
			
				</>
		}

	
	</View>
  )
}

export default ProductProfile

const styles = StyleSheet.create({})
