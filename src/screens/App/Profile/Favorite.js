/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component, PureComponent } from 'react'
import { Platform, Text, View, FlatList, Dimensions, ActivityIndicator, TouchableWithoutFeedback, RefreshControl } from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import { Appbar } from 'react-native-paper'
import FastImage from 'react-native-fast-image'

const { width } = Dimensions.get('window')

import Material from 'react-native-vector-icons/MaterialIcons'
import Axios from 'axios'
import { config } from '../../../App'
import { NavigationEvents } from 'react-navigation'
import color from 'color'
import { Tab, Tabs, Toast } from 'native-base'
import BackHeader from '../component/BackHeader'

import { withTranslation } from 'react-i18next';
class RenderProduct extends Component {
	state = {
		data: [],
		loading: true
	}



	render() {
		const {t} =this.props
		const { item } = this.props
		const hasOff = 0
		return (
			<TouchableWithoutFeedback onPress={() =>
				item.PRODUCT_STORE_ID ?
					this.props.navigation.push('ProductProfile', { item: { ...item.product, ID: item.PRODUCT_STORE_ID } }) :
					Toast.show({
						text: 'مشکلی در پیدا کردن محصول پیش آمده است',
						type: 'danger'
					})
			} >
				<View style={{ height: 190, width: 140, backgroundColor: 'white', margin: 5, borderRadius: 7, elevation: 1 }} >
					{/* {
						item.product.productImages ?
							<FastImage source={{ uri: config.BaseUrl + config.ProductSubUrl + (item.product.IMAGE_URL ? item.product.IMAGE_URL : 'default.png') }} resizeMode='cover' style={{ width: '100%', height: 115, borderRadius: 7 }} /> :
							<FastImage source={require('../../../assest/no_data.png')} resizeMode='cover' style={{ width: '100%', height: 115, borderRadius: 7 }} />
					} */}

					{
						item.product.IMAGE ?
							// <FastImage source={{ uri: config.BaseUrl + config.ProductSubUrl + item.product.IMAGE }} resizeMode='cover' style={{ width: '100%', height: 115, borderRadius: 7 }} /> :
							<FastImage source={{ uri: config.ImageBaners + config.ProductSubUrl + item.product.IMAGE }} resizeMode='cover' style={{ width: '100%', height: 115, borderRadius: 7 }} /> :
							<FastImage source={require('../../../assest/no_data.png')} resizeMode='cover' style={{ width: '100%', height: 115, borderRadius: 7 }} />
					}

					<Text style={{ ...styles.TextBold, paddingHorizontal: 5 }} numberOfLines={2} >{item.product.NAME}</Text>
					{
						hasOff ?
							<View style={{ flexDirection: 'row-reverse', alignItems: 'center' }} >
								<Text style={{ ...styles.TextRegular, paddingHorizontal: 5, fontSize: 12, textDecorationStyle: 'dotted', textDecorationLine: 'line-through' }} >{config.priceFix(item.PRICE)} {t('currency-unit')}</Text>
								<View style={{ width: 10 }} />

								<Text style={{ ...styles.TextRegular, paddingHorizontal: 5, fontSize: 12, color: 'red' }} >{config.priceFix(item.price_offer.PRICE)} {t('currency-unit')}</Text>

							</View>
							:
							<Text style={{ ...styles.TextRegular, paddingHorizontal: 5, fontSize: 12 }} >{item.product.productPrices.length > 0 ? config.priceFix(item.product.productPrices[0].PRICE) : 0} {t('currency-unit')}</Text>
					}
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

class RenderItem extends PureComponent {

	render() {
		const { item } = this.props
		console.log('store', item)
		return (
			<TouchableWithoutFeedback
				onPress={() => this.props.navigation.push('StoreProfile', { item: item.store })}
			>

				<View style={{ height: 100, width: width - 20, backgroundColor: 'white', margin: 5, borderRadius: 5, flexDirection: 'row-reverse', elevation: 3 }} >
					<FastImage source={{ uri: config.ImageBaseUrl + ((item.store.store_images && item.store.store_images.length > 0 && item.store.store_images[0].ADDRESS) ? item.store.store_images[0].ADDRESS : 'defultStore.png') }} resizeMode='stretch' style={{ height: '100%', width: 100 }} />
					<View style={{ justifyContent: 'center', flex: 1, alignItems: 'flex-end', paddingHorizontal: 20, flexDirection: 'column', }} >
						<Text style={[styles.TextBold, { color: 'black', textAlign: 'center', fontSize: 12 }]} >{item.store.NAME}</Text>
						<Text style={[styles.TextBold, { color: 'gray', textAlign: 'center', fontSize: 12 }]} >{item.store.DESCRIPTION}</Text>
					</View>
					{/* <View style={{ justifyContent: 'center', alignItems: 'center', padding: 10 }} >
						<View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center' }} >
							<Material name='av-timer' style={{ marginHorizontal: 5 }} />
							<Text style={[styles.TextBold, { color: 'gray', textAlign: 'center', fontSize: 12 }]} >۳۰ دقیقه</Text>
						</View>
						<View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center' }} >
							<Material name='navigation' style={{ marginHorizontal: 5 }} />
							<Text style={[styles.TextBold, { color: 'gray', textAlign: 'center', fontSize: 12 }]} >5 کیلومتر</Text>
						</View>
					</View> */}
				</View>
			</TouchableWithoutFeedback>
		)
	}
}

 class App extends Component {

	state = {
		products: [],
		stores: [],
		selectedAddress: {},
		loading: true
	}

	componentDidMount() {
		this.fetchData()
	}

	fetchData = async () => {
		try {
			this.setState({ loading: true })
			let products = await Axios.get('users/getLike')
			console.warn('products', products.data)
			this.setState({ loading: false, products: products.data })

			Axios.get('stores/UserStore').then(({ data }) => {
				console.log('fave', data)
				this.setState({ stores: data })
			})
		} catch (error) {
			this.setState({ loading: false })
		}
	}

	render() {
		const {t} =this.props
		if (this.state.loading)
			return (
				<View style={styles.container}>
					<BackHeader headerText={t('favorite')} />
					<View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} >
						<ActivityIndicator />
					</View>
				</View>
			)
		return (
			<View style={styles.container}>
				<NavigationEvents
					onWillFocus={async () => {
						try {
							this.setState({ loading: true })
							let address = await Axios.get('users/address')
							this.setState({ selectedAddress: address.data.find((item) => item.SELECTED == 1), loading: false })
						} catch (error) {
							this.setState({ loading: false })

						}
					}}
				/>
				<BackHeader headerText={t('favorite')}  />
				{/* <View style={{ paddingHorizontal: 10, height: 60, justifyContent: 'space-between', flexDirection: 'row-reverse', alignItems: 'center' , backgroundColor:color('white').darken(0.1) }} >
					<Text style={{ ...styles.TextRegular, color: 'black', fontSize: 16 }} >آدرس : <Text style={{ fontSize: 13 }} > {this.state.selectedAddress.ADDRESS}</Text></Text>
					<TouchableWithoutFeedback
						onPress={() => this.props.navigation.navigate('Address')}
					>
					<View style={{ ...styles.button }} >
						<Material name='edit' color='white' size={17} />
						<Text style={[styles.TextBold, { color: 'white', textAlign: 'center', fontSize: 12 }]} >ویرایش</Text>
					</View>
					</TouchableWithoutFeedback>
				</View> */}
				{/*<Tabs prerenderingSiblingsNumber={1} locked initialPage={0} style={{ marginTop: 10, backgroundColor: 'transparent', elevation: 0, alignItems: 'center' }} contentProps={{ nestedScrollEnabled: true }} tabContainerStyle={{ backgroundColor: StyleSheet.value('$MainColor'), width: 200, elevation: 0, borderRadius: 24, transform: [{ scaleX: -1 }] }} tabBarUnderlineStyle={{ backgroundColor: 'transparent' }}>*/}
				{/*	<Tab heading={'محصول'} tabStyle={{ backgroundColor: 'transparent', width: 80, borderRadius: 24, margin: 5, transform: [{ scaleX: -1 }] }} activeTabStyle={{ backgroundColor: 'white', margin: 5, borderRadius: 17, transform: [{ scaleX: -1 }] }} textStyle={{ ...styles.TextRegular, color: 'white' }} activeTextStyle={{ ...styles.TextBold, color: StyleSheet.value('$MainColor') }}>*/}
				{
					this.state.products.length === 0 ?
						<View style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', marginTop: 10 }} >
							<FastImage source={require('../../../assest/no_data.png')} resizeMode='contain' style={{ width, height: 200 }} />
						</View> :

						<FlatList
							keyExtractor={(item, index) => index.toString()}
							data={this.state.products}
							numColumns={2}
							style={{ marginTop: 10 }}
							contentContainerStyle={{ alignItems: 'center' }}
							renderItem={({ item }) => <RenderProduct {...this.props} item={item} />}
							refreshControl={
								<RefreshControl
									onRefresh={this.fetchData}
									refreshing={this.state.loading}
								/>
							}
						/>
				}
				{/*	</Tab>*/}
				{/*	<Tab heading={'فروشگاه'} tabStyle={{ backgroundColor: 'transparent', width: 80, borderRadius: 24, margin: 5, transform: [{ scaleX: -1 }] }} activeTabStyle={{ backgroundColor: 'white', margin: 5, borderRadius: 17, transform: [{ scaleX: -1 }] }} textStyle={{ ...styles.TextRegular, color: 'white' }} activeTextStyle={{ ...styles.TextBold, color: StyleSheet.value('$MainColor') }}>*/}
				{/*		{*/}
				{/*			this.state.stores.length == 0 ?*/}
				{/*				<View style={{ width: '100%', height: '100%', flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white', marginTop: 10 }} >*/}
				{/*					<FastImage source={require('../../../assest/no_data.png')} resizeMode='contain' style={{ width, height: 200 }} />*/}
				{/*				</View> :*/}

				{/*				<FlatList*/}
				{/*					keyExtractor={(item, index) => index.toString()}*/}
				{/*					data={this.state.stores}*/}
				{/*					style={{ marginTop: 10 }}*/}
				{/*					contentContainerStyle={{ alignItems: 'center' }}*/}
				{/*					renderItem={({ item }) => <RenderItem {...this.props} item={item} />}*/}
				{/*					refreshControl = {*/}
				{/*						<RefreshControl*/}
				{/*							onRefresh = {this.fetchData}*/}
				{/*							refreshing = {this.state.loading}*/}
				{/*						/>*/}
				{/*					}*/}
				{/*				/>*/}
				{/*		}*/}
				{/*	</Tab>*/}
				{/*</Tabs>*/}

			</View>
		)
	}
}
export default withTranslation()(App)


const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: 'white'
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
		width: 80,
		height: 30,
		backgroundColor: '$MainColor',
		flexDirection: 'row-reverse',
		alignItems: 'center',
		justifyContent: 'center'
	}
})
