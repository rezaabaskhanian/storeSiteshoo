import React, { Component } from 'react'
import { View, FlatList, TouchableWithoutFeedback, Image, TouchableOpacity } from 'react-native'
import { Text, Icon, Spinner, Fab } from 'native-base'
import StyleSheet from 'react-native-extended-stylesheet'

import Axios from 'axios'
import { config } from '../../../App'
import Material from 'react-native-vector-icons/MaterialIcons'
import ProductItem from './ProductItem/ProductItem'
import { withTranslation } from 'react-i18next';
import i18next from '../../../services/lang/i18next'
 class ProductSubCats extends Component {

	// static navigationOptions = {
	// 	tabBarLabel: (opt) => <Text style={{ ...styles.tabBarIcon, color: opt.focused ? colors.primary : colors.light }}> محصولات </Text>,
	// 	tabBarIcon: (opt) => <Icon color={opt.focused ? colors.primary : colors.light} type='material-community' name='package' />
	// }
	constructor(props){
		super(props)
		let headerText = this.props.navigation.getParam('headerText', ' ')
		this.state = {
			data: [],
			loading: true,
			routes: [...this.props.navigation.getParam('Route', []), headerText],
			headerText
		}
	}
	componentDidMount() {
		this.Fetchdata()
	}

	Fetchdata = async () => {
		this.setState({ loading: true })
		const item = this.props.navigation.getParam('item', {})
		if (item.PRODUCT_ID !== 0)
			Axios.get('stores/' + item.STORE_ID + '/levelproduct/' + item.PRODUCT_ID).then(async ({ data }) => {
				if(data.length>0){
					for (let value of data) { //check
						try{
							let response = await Axios.get('stores/' + item.STORE_ID + '/sortGenelogyproduct/' + value.PRODUCT_ID)
							this.setState((prevState) => ({
								data: [...prevState.data, {
									PRODUCT_ID: value.PRODUCT_ID,
									STORE_ID: value.STORE_ID,
									NAME: value.product.NAME,
									LEAF: value.product.LEAF,
									SHOW_MORE:true,
									CHILD_PRODUCTS: response.data
								}]
							}))

						} catch(error){
							console.log('[CategoryError ' + value + ']', error.data)
						}
					}
				}else{
					// let response = await Axios.get('stores/' + item.STORE_ID + '/sortGenelogyproduct/' + item.PRODUCT_ID)
					let response = await Axios.post('/landing/product_slider/' + item.PRODUCT_ID)
					let dataTest =response.data
					//  const newData= await dataTest.map(data=>({...data,ID:item.CHILD_PRODUCTS[0].ID}) )
					// const newData= await dataTest.map(data=>( Object.assign(data, {PRODUCT_STORE_ID:})) )
					 const newData= await dataTest.map(({PRODUCT_STORE_ID:ID,...rest})=>({ID,...rest}) )
					console.log(newData,'newData')
					this.setState((prevState) => ({
						data: [...prevState.data, {
							PRODUCT_ID: item.PRODUCT_ID,
							STORE_ID: item.STORE_ID,
							NAME: item.NAME,
							LEAF: item.LEAF,
							SHOW_MORE:false,
							CHILD_PRODUCTS: newData
							// CHILD_PRODUCTS: dataTest
						}]
					}))
				}
				this.setState({ loading: false })
			}).catch(err => {
				console.warn(err.response)
				this.setState({ loading: false })
			})
	}

	render() {
		const {t} =this.props
		return (
			<View style={{ flexDirection: 'column', flex: 1, backgroundColor: '#eee' }} >
				<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
					<Text style={{ ...styles.TextBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} >
						{this.state.headerText}
					</Text>
					<TouchableWithoutFeedback
						onPress={() => this.props.navigation.goBack()}
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
					>
						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: '#43B02A' }} size={30} />
					</TouchableWithoutFeedback>
				</View>
				<FlatList
					horizontal
					inverted
					data = {this.state.routes}
					keyExtractor = {(item, index) => index.toString()}
					style = {{padding: 8, maxHeight: 40, height: 40}}
					renderItem = {({item, index}) => (
						<View style = {{flexDirection: 'row-reverse', height: 30}}>
							<TouchableWithoutFeedback onPress = {() => {
								this.props.navigation.pop(this.state.routes.length - index - 1)
							}}>
								<View /*style = {{
									padding: 2, elevation: 2, borderRadius: 15,
									backgroundColor: '#ddd', alignItems: 'center',
									justifyContent: 'center', height: 25
								}}*/>
									<Text style = {{...styles.TextRegular, color: StyleSheet.value('$MainColor'), width: '100%', fontSize: 14}}>
										{item}
									</Text>
								</View>
							</TouchableWithoutFeedback>
							{
								index < (this.state.routes.length - 1) ?
									<Text style = {styles.TextRegular}>{' < '}</Text> :
									<Text style = {styles.TextRegular}>{'  '}</Text>
							}
						</View>
					)}
				/>
				<View style={{ flex: 1 }}>
					<FlatList
						data={this.state.data}
						style = {{marginTop: 4}}
						keyExtractor={(item, index) => 'num' + index}
						renderItem={({ item, index }) => (
							<RenderItem
								item={item}
								navigation={this.props.navigation}
								routes={this.state.routes}
								index={index}
							/>
						)}
					/>
					{
						this.state.loading &&
						<Spinner style = {{position: 'absolute', bottom: 0, backgroundColor: 'transparent', alignSelf: 'center'}}/>
					}
					{/* <Fab style={{ backgroundColor: Colors.primary }} onPress={_ => this.props.navigation.navigate('AddProductPage')}>
						<Icon name='add' />
					</Fab> */}
				</View>

			</View>

		)
	}
}

export default withTranslation()(ProductSubCats);

class RenderItem extends Component {
	state = {
		data: [],
		loading: true,
	};
 
	render() {
		
		const { item } = this.props
		if (!item.CHILD_PRODUCTS[0]) return null
		return (
			<View style={{ width: '100%', alignItems: 'flex-start', paddingHorizontal: 5, borderTopWidth: 0.5, borderTopColor: '#ddd', paddingTop: 8, marginTop: 8 }}>
				<View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', width: '100%', paddingHorizontal: 5 }}>
					<Text
						style={[
							styles.TextBold,
							{ color: 'black', textAlign: 'center', fontSize: 16 }
						]}
					>
						{item.NAME}
					</Text>

					{/* {console.log(item.CHILD_PRODUCTS,'item.LEAFnew')} */}
					{item.SHOW_MORE?
					<TouchableOpacity onPress={() =>
						item.LEAF === 1 ?
							this.props.navigation.push('StoreProducts', {
								item,
								'headerText': item.NAME,
								Route: this.props.routes
							}) :
							this.props.navigation.push('ProductSubCats', {
								item,
								'headerText': item.NAME,
								Route: this.props.routes
							})
					}>
						<Text style={[styles.TextRegular, { color: StyleSheet.value('$MainColor') }]}>{i18next.t('show-all')}</Text>
					</TouchableOpacity>:null}
				</View>
				{item.SHOW_MORE?<FlatList
					horizontal
					data={item.CHILD_PRODUCTS}
					inverted
					keyExtractor={(item, index) =>
						this.props.index + '_' + index
					}
					showsHorizontalScrollIndicator={false}
					style={{ width: '100%' }}
					renderItem={({ item }) => {
						return <ProductItem item = {item} navigation = {this.props.navigation} routes = {this.props.routes}/>
					}}
				/>:
				// {let ID=item.CHILD_PRODUCTS.PRODUCT_STORE_ID
				// 	console.log(ID,'IDDDD')}
				<FlatList
					data={item.CHILD_PRODUCTS}
					renderItem={({ item }) => {
						return <ProductItem item = {item} navigation = {this.props.navigation} routes = {this.props.routes}/>
					}}
					style={{ width: '100%' ,justifyContent:'center',alignItems:'center'}}
					//Setting the number of column
					numColumns={2}
					keyExtractor={(item, index) => index.toString()}
				/>}

			</View>
		)
	}
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
		transform: [{ rotate: '0deg' }]
	}
})
