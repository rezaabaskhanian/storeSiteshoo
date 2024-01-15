import React, { Component } from 'react'
import { Text, View, TouchableWithoutFeedback, Dimensions, Modal, FlatList } from 'react-native'
import Material from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialNormal from 'react-native-vector-icons/MaterialIcons'
import StyleSheet from 'react-native-extended-stylesheet'
import Axios from 'axios'
import { Card, ActionSheet, Spinner, Toast } from 'native-base'
import { config } from '../../../App'
import FastImage from 'react-native-fast-image'
import { Colors } from 'react-native-paper'
import { TextTicker } from '../component';
import BackHeader from '../component/BackHeader';

const { width } = Dimensions.get('screen')

const BUTTONS = [
	{
		text: 'بیشترین قیمت',
		icon: 'american-football',
		iconColor: '#2c8ef4'
	},
	{
		text: 'کمترین قیمت',
		icon: 'american-football',
		iconColor: '#2c8ef4'
	},
	{
		text: 'بیشترین تخفیف',
		icon: 'american-football',
		iconColor: '#2c8ef4'
	},
	{
		text: 'کمترین تخفیف',
		icon: 'american-football',
		iconColor: '#2c8ef4'
	},
]

export class StoreProducts extends Component {
	constructor(props) {
		super(props)
		this.item = this.props.navigation.state.params.item
		this.state = {
			data: [],
			showFilter: false,
			routes: [...this.props.navigation.getParam('Route', []), this.item.NAME],
		}
	}
	componentDidMount() {
		console.log('[STORE Products]', this.item)
		console.log(`/api/stores/${this.item.STORE_ID}/sortGenelogyproduct/${this.item.PRODUCT_ID}`, 'majidddddd')
		Axios.get(`/stores/${this.item.STORE_ID}/sortGenelogyproduct/${this.item.PRODUCT_ID}`).then(({ data }) => {
			console.log(
				'data is: ', data
			)
			this.setState({
				data,
			})
		}).catch(err => {
			console.log(err.response)
		})
	}

	onActionsheetPress = (index) => {
		switch (index) {
			case 0:
				this.setState((prevState) => ({
					data: [...prevState.data.sort((a, b) => {
						let Pa = a.PRICE ? a.PRICE : a.SYSTEM_PRICE
						let Pb = b.PRICE ? b.PRICE : b.SYSTEM_PRICE
						return Pb - Pa
					})]
				}))
				break
			case 1:
				this.setState((prevState) => ({
					data: [...prevState.data.sort((a, b) => {
						let Pa = a.PRICE ? a.PRICE : a.SYSTEM_PRICE
						let Pb = b.PRICE ? b.PRICE : b.SYSTEM_PRICE
						return Pa - Pb
					})]
				}))
				break
			case 2:
				this.setState((prevState) => ({
					data: [...prevState.data.sort((a, b) => {
						let Pa = a.PRICE ? a.PRICE : a.SYSTEM_PRICE
						let Pb = b.PRICE ? b.PRICE : b.SYSTEM_PRICE
						return Math.abs(Pb - b.PRICE_AFTER_OFFER) - Math.abs(Pa - a.PRICE_AFTER_OFFER)
					})]
				}))
				break
			case 3:
				this.setState((prevState) => ({
					data: [...prevState.data.sort((a, b) => {
						let Pa = a.PRICE ? a.PRICE : a.SYSTEM_PRICE
						let Pb = b.PRICE ? b.PRICE : b.SYSTEM_PRICE
						return Math.abs(Pa - a.PRICE_AFTER_OFFER) - Math.abs(Pb - b.PRICE_AFTER_OFFER)
					})]
				}))
				break
		}
	}

	onFilterConfirm = () => {

	}

	render() {
		console.log('   ', this.state.data)
		return (
			<View style={{ flex: 1, backgroundColor: '#eee' }}>
				<BackHeader headerText={this.item.NAME} />
				{/* <Text> {JSON.stringify(this.props.navigation.state.params.item)} </Text> */}

				<View style={{ flexDirection: 'row', width: '100%', padding: 8, backgroundColor: 'white', elevation: 2, alignItems: 'center', justifyContent: 'center' }}>
					<TouchableWithoutFeedback onPress={() =>
						ActionSheet.show({
							options: BUTTONS,
							title: 'sort',
						}, this.onActionsheetPress)
					}>
						<View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
							<Text style={{ ...styles.TextRegular }}>sort</Text>
							<Material name='sort' size={16} />
						</View>
					</TouchableWithoutFeedback>
					<TouchableWithoutFeedback onPress={() => this.setState({ showFilter: true })}>
						<View style={{ flexDirection: 'row', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
							<Text style={{ ...styles.TextRegular }}>filter</Text>
							<Material name='filter' size={16} />
						</View>
					</TouchableWithoutFeedback>
				</View>

				<FlatList
					horizontal
					inverted
					data={this.state.routes}
					keyExtractor={(item, index) => index.toString()}
					style={{ padding: 8, maxHeight: 40, height: 40, paddingLeft: 8 }}
					renderItem={({ item, index }) => (
						<View style={{ flexDirection: 'row-reverse', height: 30, width: null }}>
							<TouchableWithoutFeedback onPress={() => {
								this.props.navigation.pop(this.state.routes.length - index - 1)
							}}>
								<View style={{ flex: 1 }} /*style = {{
									padding: 2, elevation: 2, borderRadius: 15, 
									backgroundColor: '#ddd', alignItems: 'center', 
									justifyContent: 'center', height: 25
								}}*/>
									<Text style={{ ...styles.TextRegular, color: StyleSheet.value('$MainColor'), width: '100%' }}>
										{item}
									</Text>
								</View>
							</TouchableWithoutFeedback>
							{
								index < (this.state.routes.length - 1) ?
									<Text style={styles.TextRegular}>{' < '}</Text> :
									<Text style={styles.TextRegular}>{'  '}</Text>
							}
						</View>
					)}
				/>
				<View style={{ flex: 1 }}>
					<FlatList
						// style={{flexGrow:0 , flexShrink : 0}}
						data={this.state.data}
						numColumns={2}
						ref={(ref) => this.FlatList = ref}
						keyExtractor={(item, index) => 'product' + index}
						renderItem={({ item, i }) => (
							// <Item data={item} navigation={this.props.navigation} routes={this.state.routes} />
							<ProductItem item={item} navigation={this.props.navigation} routes={this.state.routes} />
						)}
					/>
				</View>
				<FilterModal
					visible={this.state.showFilter}
					close={() => this.setState({ showFilter: false })}
					confirm={this.onFilterConfirm}
				/>
			</View>
		)
	}
}

class ProductItem extends Component {
	constructor(props) {
		super(props)
		this.state = {
			show: false,
			count: 0,
			lazy: false,
			ORDER_ID: 0,
			item: this.props.item
		}
		this.timeout = null
	}

	closeModal = () => {
		this.setState({ show: false })
		Toast.show({
			text: this.state.item.NAME + ' به تعداد ' + this.state.count + ' به سبد خرید شما اضافه شد.',
			type: 'success'
		})
	}

	resetTimeOut = () => {
		clearTimeout(this.timeout)
		this.timeout = setTimeout(this.closeModal, 7000)
	}

	render() {
		const item = this.props.item
		// let hasOff = item.price_offer.OFFER
		// let before = item.price_offer.PRICE
		// 	? item.price_offer.PRICE
		// 	: item.SYSTEM_PRICE
		// let after = before - item.price_offer.OFFER
		let hasOff = item.PRICE_AFTER_OFFER ? item.PRICE_AFTER_OFFER != item.PRICE : false
		let before = item.PRICE ? item.PRICE : item.SYSTEM_PRICE
		let after = item.PRICE_AFTER_OFFER
		return (
			<TouchableWithoutFeedback
				onPress={() =>
					this.props.navigation.push('ProductProfile', {
						item,
						Route: this.props.routes
					})
				}
			>
				<View
					style={{
						height: 190,
						width: '46%',
						backgroundColor: 'white',
						margin: '2%',
						overflow: 'hidden',
						// padding: 5,
						borderRadius: 7,
						elevation: 1,
						justifyContent: 'space-between',
						zIndex: 1
					}}
				>
					{hasOff ? (
						<View
							style={{ position: 'absolute', right: 0, zIndex: 1000 }}
						>
							<View
								style={[
									styles.triangle,
									{ position: 'absolute', top: 0, right: 0 }
								]}
							/>
							{/* <Text
													style={{
														...styles.TextRegular,
														color: 'white',
														fontSize: 8,
														position: 'absolute',
														right: 2,
														top: 2
													}}
												>
													{item.price_offer.OFEER} %
												</Text> */}
						</View>
					) : null}
					<View>
						<FastImage
							source={{ uri: config.ImageBaners + config.ProductSubUrl + item.IMAGE }}
							// source={{ uri: config.BaseUrl + config.ProductSubUrl + item.IMAGE }}
							resizeMode="contain"
							style={{ width: '100%', height: 115, borderRadius: 7, marginTop: 5 }}
						/>
						{/* <TextTicker
												style={{
													...styles.TextBold,
													paddingHorizontal: 5,
													flexDirection: 'row-reverse',
													textAlign: 'right',
													fontSize: 13
												}}
												duration={5000}
												loop
												bounce = {false}
												repeatSpacer={30}
												marqueeDelay={3000}
											>
												{item.NAME}
											</TextTicker> */}
						<Text
							numberOfLines={2}
							style={{
								...styles.TextBold,
								paddingHorizontal: 5,
								fontSize: 13
							}}
						>
							{item.NAME}
						</Text>
					</View>
					{hasOff ? (
						<View
							style={{ flexDirection: 'row-reverse', alignItems: 'center', marginBottom: 8 }}
						>
							<Text
								style={{
									...styles.TextRegular,
									paddingHorizontal: 5,
									fontSize: 12,
									textDecorationStyle: 'dotted',
									textDecorationLine: 'line-through'
								}}
							>
								{config.priceFix(before)} تومان
							</Text>
							<View style={{ width: 10 }} />

							<Text
								style={{
									...styles.TextRegular,
									paddingHorizontal: 5,
									fontSize: 12,
									color: 'red'
								}}
							>
								{config.priceFix(after)} تومان
							</Text>
						</View>
					) : (
							<Text
								style={{
									...styles.TextRegular,
									paddingHorizontal: 5,
									fontSize: 12,
									marginBottom: 8
								}}
							>
								{config.priceFix(before)} تومان
							</Text>
						)}
					<TouchableWithoutFeedback onPress={() =>
						Axios.post('order/cart', {
							'PRODUCT_ID': item.ID,
							'COUNT': 1,
							'DESCRIPTION': null
						}).then((response) => {
							console.log('add', response)
							this.setState({ ORDER_ID: response.data.ORDER_ID, count: 1, show: true })
							this.resetTimeOut()

						}).catch((error) => {
							console.log('add errror', error)
						})
					}>
						<View style={{
							backgroundColor: 'white', justifyContent: 'center', alignItems: 'center',
							borderRadius: 50, width: 25, height: 25,
							borderColor: StyleSheet.value('$MainColor'),
							borderWidth: 1, position: 'absolute', overflow: 'hidden',
							top: 4, left: 4
						}}>

							{
								this.state.count == 0 ?
									<MaterialNormal name='add' size={20} color={StyleSheet.value('$MainColor')} /> :
									<Text style={{
										...styles.TextRegular,
										width: '100%',
										height: '100%',
										backgroundColor: StyleSheet.value('$MainColor'),
										color: 'white',
										textAlign: 'center'
									}}>
										{this.state.count}
									</Text>
							}
						</View>
					</TouchableWithoutFeedback>
					{
						this.state.show &&
						<View style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 2000 }}>
							<View style={{ position: 'absolute', top: 5, left: 5, right: 5, backgroundColor: 'white', borderRadius: 4, elevation: 2, zIndex: 2002, alignItems: 'center', justifyContent: 'center' }}>
								<View style={{ flexDirection: 'row-reverse', alignItems: 'center', width: 80, justifyContent: 'space-between' }} >
									<TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }} onPress={async () => {
										if (!this.state.lazy) try {
											await this.setState({ lazy: true, count: this.state.count + 1 })
											this.resetTimeOut()
											// this.props.update_price(item.PRICE_AFTER_OFFER)
											let q = await Axios.put('order/cart', {
												'ORDER_ID': this.state.ORDER_ID,
												'PRODUCT_ID': '',
												'PRODUCT': item.ID,
												'COUNT': this.state.count,
												'DESCRIPTION': null
											})
											console.log('add: ', q)
											await this.setState({ lazy: false })

										} catch (error) {
											// this.props.update_price(-1 * item.PRICE_AFTER_OFFER)

											await this.setState({ lazy: false, count: this.state.count - 1 })
											console.log('add error: ', error.response)
										}

									}} >

										<View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderColor: 'black', borderRadius: 5, borderWidth: 0.5 }} >
											<MaterialNormal name='add' size={15} />
										</View>
									</TouchableWithoutFeedback>

									<Text style={{ ...styles.TextRegular, color: 'black', fontSize: 12, textAlign: 'center', alignSelf: 'center', padding: 5 }} >{this.state.count}</Text>

									<TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }} onPress={async () => {
										if (this.state.count > 0 && !this.state.lazy) {
											if (this.state.count == 1) {
												try {
													this.resetTimeOut()
													let q = await Axios.delete('/order/cart/' + item.ID)
													await this.setState({ lazy: true, show: false })

													// this.props.update_price(-1 * item.PRICE_AFTER_OFFER)

													// this.props.update_cart()
												} catch (error) {
													// this.props.update_cart()
												}
												return
											}
											try {
												await this.setState({ lazy: true, count: this.state.count - 1 })
												this.resetTimeOut()
												// this.props.update_price(-1 * item.PRICE_AFTER_OFFER)
												let q = await Axios.put('order/cart', {
													'ORDER_ID': this.state.ORDER_ID,
													'PRODUCT_ID': '',
													'PRODUCT': item.ID,
													'COUNT': this.state.count,
													'DESCRIPTION': null
												})
												await this.setState({ lazy: false })

											} catch (error) {
												// this.props.update_price(item.PRICE_AFTER_OFFER)

												await this.setState({ lazy: false, count: this.state.count + 1 })
											}
										}
									}} >
										<View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderColor: 'black', borderRadius: 5, borderWidth: 0.5 }} >
											<MaterialNormal name='remove' size={15} />
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
			</TouchableWithoutFeedback>
		)
	}
}

// const Item = (props) => {
// 	let item = props.data
// 	// let hasOff = item.price_offer.OFFER
// 	// let before = item.price_offer.PRICE
// 	// 	? item.price_offer.PRICE
// 	// 	: item.SYSTEM_PRICE
// 	// let after = before - item.price_offer.OFFER

// 	let hasOff = item.PRICE_AFTER_OFFER ? item.PRICE_AFTER_OFFER != item.PRICE : false
// 	let before = item.PRICE ? item.PRICE : item.SYSTEM_PRICE
// 	let after = item.PRICE_AFTER_OFFER
// 	return(
// 		<TouchableWithoutFeedback
// 			onPress={() =>
// 				props.navigation.push('ProductProfile', { 
// 					item,
// 					Route: props.routes
// 				})
// 			}
// 		>
// 			<View
// 				style={{
// 					height: 190,
// 					width: '46%',
// 					backgroundColor: 'white',
// 					margin: '2%',
// 					borderRadius: 7,
// 					elevation: 1,
// 					overflow: 'hidden'
// 				}}
// 			>
// 				<FastImage
// 					source={{ uri: config.BaseUrl + config.ProductSubUrl + item.IMAGE }}
// 					resizeMode="contain"
// 					style={{ width: '100%', height: 115, borderRadius: 7 }}
// 				/>
// 				<Text style={{ ...styles.TextRegular, paddingHorizontal: 5 }} numberOfLines={2}>
// 					{item.NAME}
// 				</Text>
// 				{/* <TextTicker
// 					style={{
// 						...styles.TextBold,
// 						paddingHorizontal: 5,
// 						flexDirection: 'row-reverse',
// 						textAlign: 'right',
// 						fontSize: 13
// 					}}
// 					duration={5000}
// 					loop
// 					bounce = {false}
// 					repeatSpacer={30}
// 					marqueeDelay={3000}
// 				>
// 					{item.NAME}
// 				</TextTicker> */}
// 				{hasOff ? (
// 					<View
// 						style={{ flexDirection: 'row-reverse', alignItems: 'center' }}
// 					>
// 						<Text
// 							style={{
// 								...styles.TextRegular,
// 								paddingHorizontal: 5,
// 								fontSize: 12,
// 								textDecorationStyle: 'dotted',
// 								textDecorationLine: 'line-through'
// 							}}
// 						>
// 							{config.priceFix(before)} تومان
// 						</Text>
// 						<View style={{ width: 10 }} />

// 						<Text
// 							style={{
// 								...styles.TextRegular,
// 								paddingHorizontal: 5,
// 								fontSize: 12,
// 								color: 'red'
// 							}}
// 						>
// 							{config.priceFix(after)} تومان
// 						</Text>
// 					</View>
// 				) : (
// 					<Text
// 						style={{
// 							...styles.TextRegular,
// 							paddingHorizontal: 5,
// 							fontSize: 12
// 						}}
// 					>
// 						{config.priceFix(after)} تومان
// 					</Text>
// 				)}
// 			</View>
// 		</TouchableWithoutFeedback>
// 	)
// }

class FilterModal extends Component {
	state = {
		selectedBrand: -1,
		loading: true,
		data: []
	}

	componentDidMount() {
		Axios.get('productBrands').then(({ data }) => {
			console.log(
				'brands is: ', data
			)
			this.setState({
				data,
				loading: false
			})
		}).catch(err => {
			console.log('brands', err.response)
		})
	}

	render() {
		return (
			<Modal animated animationType='fade' visible={this.props.visible} onDismiss={this.props.close} onRequestClose={this.props.close}>
				<View style={{ flex: 1 }}>
					<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
						<Text style={[styles.TextBold, {
							fontSize: 18,
							textAlign: 'center',
							alignSelf: 'center',
							position: 'absolute'
						}]} >فیلتر محصولات</Text>
						<TouchableWithoutFeedback
							onPress={this.props.close}
							hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
						>
							<MaterialNormal name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: '#43B02A' }} size={25} />
						</TouchableWithoutFeedback>
					</View>
					{
						this.state.loading ?
							<Spinner /> :
							<View>
								<View style={{ paddingHorizontal: 10, height: 60, justifyContent: 'space-between', flexDirection: 'row-reverse', alignItems: 'center' }} >
									<Text style={{ ...styles.TextBold, color: 'black', fontSize: 16 }} > برند محصولات</Text>
								</View>
								{
									this.state.data.map((item, index) => {
										return (
											<View key={item.id.toString()} style={{ flexDirection: 'row-reverse', alignItems: 'center', padding: 5 }} >
												<TouchableWithoutFeedback
													hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
													onPress={() => this.setState({ selectedBrand: index })}
												>
													<View style={{ width: 22, height: 25 }} >
														{
															this.state.selectedBrand == index ?
																<View style={{ justifyContent: 'center', alignItems: 'center' }} >
																	<Material name='check-circle' size={20} color={StyleSheet.value('$MainColor')} />
																</View> :
																<Material name='check-circle' size={20} color='rgb(220,220,220)' />
														}
													</View>
												</TouchableWithoutFeedback>
												<Text style={[styles.TextRegular, { color: 'black', fontSize: 12, marginHorizontal: 10 }]} >{''}</Text>

											</View>
										)
									})
								}
							</View>
					}

					<TouchableWithoutFeedback
						onPress={this.props.confirm}
					>
						<View style={{ ...styles.button, position: 'absolute', alignSelf: 'center', bottom: 20, width: 170, justifyContent: 'center' }} >
							<MaterialNormal name='check-circle' color='white' size={20} style={{ marginLeft: 10, position: 'absolute', left: 0 }} />
							<Text style={[styles.TextBold, { color: 'white', textAlign: 'center' }]} >اعمال</Text>
						</View>
					</TouchableWithoutFeedback>
				</View>
			</Modal>
		)
	}
}
// const Item = (props)=>{
// 	const {data} = props
// 	return(
// 		<TouchableWithoutFeedback
// 			onPress={() => 
// 			{
// 				// data.PRODUCT_PARENT_ID == 58 ? 
// 				// 	props.navigation.push('StoreProducts', { item : data  })
// 				// 	:
// 				props.navigation.push('ProductProfile', { item : data })
// 			}
// 			} >
// 			<View style={{ backgroundColor: 'white', flexDirection: 'row-reverse', height: 100, width: width / 2 - 10, margin: 5, borderRadius: 5, elevation: 2 }} >
// 				{
// 					data.PRODUCT_IMAGE ? 
// 						<FastImage source={{ uri: config.BaseUrl + data.IMAGE }} resizeMode='cover' style={{ height: '100%', width: '55%' }} />
// 						:
// 						<FastImage source={require('../../../assest/noimage.png')} resizeMode='stretch' style={{ height: '100%', width: '55%', backgroundColor : 'gray'}} />
// 				}
// 				<View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-start', paddingHorizontal: 20 }} >
// 					<Text style={[styles.TextBold, { color: 'black', textAlign: 'center', fontSize: 12 }]} >{data.NAME}</Text>
// 				</View>
// 			</View>
// 		</TouchableWithoutFeedback>
// 	)
// }


const styles = StyleSheet.create({
	TextBold: {
		fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold'
	},
	TextRegular: {
		fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold'
	},
	button: {
		borderRadius: 17,
		width: 80,
		height: 30,
		backgroundColor: '$MainColor',
		flexDirection: 'row-reverse',
		alignItems: 'center',
		justifyContent: 'center'
	}
})
