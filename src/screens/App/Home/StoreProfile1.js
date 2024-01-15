/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React, { Component, PureComponent } from 'react'
import {
	Platform,
	Text,
	View,
	Animated,
	Dimensions,
	ActivityIndicator,
	ScrollView,
	TouchableWithoutFeedback,
	FlatList
} from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import { Appbar, FAB } from 'react-native-paper'
import FastImage from 'react-native-fast-image'

const { width } = Dimensions.get('window')

import Material from 'react-native-vector-icons/MaterialIcons'
import Axios from 'axios'
import { config } from '../../../App'

const AnimatedFastImage = Animated.createAnimatedComponent(FastImage)
const AnimatedMaterial = Animated.createAnimatedComponent(Material)

const HEADER_MAX_HEIGHT = 200
const HEADER_MIN_HEIGHT = 60
const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT

class RenderItem extends Component {
	state = {
		data: [],
		loading: true
	};

	render() {
		const { item } = this.props

		return (
			<View style={{ width: '100%', padding: 10 }}>
				<View style={{ alignItems: 'flex-start', paddingHorizontal: 5 }}>
					<Text
						style={[
							styles.TextBold,
							{ color: 'black', textAlign: 'center', fontSize: 16 }
						]}
					>
						{item.NAME}
					</Text>
					<FlatList
						horizontal
						inverted
						data={item.CHILD_PRODUCTS}
						keyExtractor={(item, index) =>
							item.ID ? item.ID.toString() : index.toString()
						}
						showsHorizontalScrollIndicator={false}
						renderItem={({ item }) => {
							let hasOff = item.PRICE
								? item.PRICE != item.price_offer.PRICE
								: false
							return (
								<TouchableWithoutFeedback
									onPress={() =>
										this.props.navigation.push('ProductProfile', { item })
									}
								>
									<View
										style={{
											height: 170,
											width: 140,
											backgroundColor: 'white',
											margin: 5,
											borderRadius: 7,
											elevation: 1
										}}
									>
										<FastImage
											source={{ uri: config.BaseUrl + item.IMAGE }}
											resizeMode="cover"
											style={{ width: '100%', height: 115, borderRadius: 7 }}
										/>
										<Text style={{ ...styles.TextBold, paddingHorizontal: 5 }}>
											{item.NAME}
										</Text>
										{/* {
                    hasOff ?
                      <View style={{ flexDirection: 'row-reverse', alignItems: 'center' }} >
                        <Text style={{ ...styles.TextRegular, paddingHorizontal: 5, fontSize: 12, textDecorationStyle: 'dotted', textDecorationLine: 'line-through' }} >{item.PRICE} تومان</Text>
                        <View style={{ width: 10 }} />

                        <Text style={{ ...styles.TextRegular, paddingHorizontal: 5, fontSize: 12, color: 'red' }} >{item.price_offer.PRICE} تومان</Text>

                      </View>
                      :
                      <Text style={{ ...styles.TextRegular, paddingHorizontal: 5, fontSize: 12 }} >{item.PRICE} تومان</Text>
                  } */}
									</View>
								</TouchableWithoutFeedback>
							)
						}}
					/>
				</View>
			</View>
		)
	}
}

class RenderProduct extends Component {
	state = {
		loading: true
	};

	render() {
		const { item } = this.props
		return (
			<View style={{ width: '100%', padding: 10 }}>
				<View style={{ alignItems: 'flex-start', paddingHorizontal: 5 }}>
					<Text
						style={[
							styles.TextBold,
							{ color: 'black', textAlign: 'center', fontSize: 16 }
						]}
					>
						{item.CATEGORYNAME}
					</Text>
					<FlatList
						horizontal
						inverted
						data={item.data}
						keyExtractor={item => item.ID.toString()}
						showsHorizontalScrollIndicator={false}
						renderItem={({ item }) => {
							let hasOff = item.price_offer.OFFER
							let before = item.price_offer.PRICE
								? item.price_offer.PRICE
								: item.SYSTEM_PRICE
							let after = before - item.price_offer.OFFER
							return (
								<TouchableWithoutFeedback
									onPress={() =>
										this.props.navigation.push('ProductProfile', { item })
									}
								>
									<View
										style={{
											height: 190,
											width: 140,
											backgroundColor: 'white',
											margin: 5,
											overflow: 'hidden',
											padding: 5,
											borderRadius: 7,
											elevation: 1,
											justifyContent: 'space-between'
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
												<Text
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
											</Text>
											</View>
										) : null}
										<View>
											<FastImage
												source={{ uri: config.BaseUrl + item.IMAGE }}
												resizeMode="cover"
												style={{ width: '100%', height: 115, borderRadius: 7 }}
											/>
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
												style={{ flexDirection: 'row-reverse', alignItems: 'center' }}
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
													{before} تومان
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
													{after} تومان
											</Text>
											</View>
										) : (
											<Text
												style={{
													...styles.TextRegular,
													paddingHorizontal: 5,
													fontSize: 12
												}}
											>
												{after} تومان
											</Text>
										)}
									</View>
								</TouchableWithoutFeedback>
							)
						}}
					/>
				</View>
			</View>
		)
	}
}

export default class App extends Component {
	state = {
		scrollY: new Animated.Value(0),
		data: [],
		bestSellers: [],
		latest: [],
		productCategories: [],
		store: [],
		store_offers: [],
		loading: true,
		summaryLoading: true,
		BANNER: null,
		LOGO: null,
		empty: false,
		times: {}
	};

	async componentDidMount() {
		Axios.get(`stores/${this.props.navigation.state.params.item.ID}`)
			.then(store => {
				let store_images = store.data.store_images
				store_images.forEach(item => {
					if (item.store_image_category)
						this.setState({
							[item.store_image_category.NAME_ENG]: item.StoreImages
						})
				})

				let times = store.data.store_hours.find(
					item =>
						item[
						new Date()
							.toString()
							.substr(0, 3)
							.toUpperCase()
						] == 1
				)
				this.setState({ data: store.data, times }, () => {
					Axios.get(
						`stores/${this.props.navigation.state.params.item.ID}/summary`
					)
						.then(summary => {
							const productCategories = summary.data.productCategories
							console.log(summary, 'summary')
							this.setState(
								{
									store: summary.data.store,
									bestSellers: summary.data.bestSellers,
									latest: summary.data.latest,
									productCategories: Object.keys(productCategories).map(
										item => productCategories[item]
									),
									store_offers: summary.data.store_offers,
									summaryLoading: false
								},
								() => {
									if (
										this.state.bestSellers.length == 0 &&
										this.state.latest.length == 0 &&
										this.state.productCategories.length == 0
									) {
										this.setState({
											empty: true,
											loading: false
										})
									} else {
										this.setState({
											loading: false
										})
									}
								}
							)
						})
						.catch(sumerror => {
							this.setState({ summaryLoading: false, loading: false })
						})
				})
			})
			.catch(error => {
				this.setState({ loading: false, summaryLoading: false })
			})
	}

	render() {
		const headerHeight = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
			extrapolate: 'clamp'
		})
		const LOGOTOP = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: [20, -70],
			extrapolate: 'clamp'
		})
		const DESCRIPTIONTOP = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: [150, 250],
			extrapolate: 'clamp'
		})
		const TIMETOP = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: [125, 250],
			extrapolate: 'clamp'
		})
		const NAMETOP = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: [100, 17],
			extrapolate: 'clamp'
		})
		const NAMESCALE = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: [1, 1.25],
			extrapolate: 'clamp'
		})
		const headeropacity = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: [0, 1],
			extrapolate: 'clamp'
		})
		const headercolor = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: ['white', 'black'],
			extrapolate: 'clamp'
		})
		const backcolor = this.state.scrollY.interpolate({
			inputRange: [0, HEADER_SCROLL_DISTANCE],
			outputRange: ['white', StyleSheet.value('$MainColor')],
			extrapolate: 'clamp'
		})
		if (this.state.loading) {
			return (
				<View style={styles.container}>
					<Appbar.Header style={{ backgroundColor: 'white' }}>
						<Appbar.BackAction
							color={StyleSheet.value('$MainColor')}
							onPress={() => this.props.navigation.goBack()}
						/>
						<View
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
								paddingRight: 48
							}}
						>
							<Text
								style={{ ...styles.TextBold, color: 'black', fontSize: 18 }}
							>
								{this.state.data.NAME}
							</Text>
						</View>
					</Appbar.Header>
					<View
						style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
					>
						<ActivityIndicator />
					</View>
				</View>
			)
		} else if (this.state.empty) {
			return (
				<View style={styles.container}>
					<Appbar.Header style={{ backgroundColor: 'white' }}>
						<Appbar.BackAction
							color={StyleSheet.value('$MainColor')}
							onPress={() => this.props.navigation.goBack()}
						/>
						<View
							style={{
								flex: 1,
								alignItems: 'center',
								justifyContent: 'center',
								paddingRight: 48
							}}
						>
							<Text
								style={{ ...styles.TextBold, color: 'black', fontSize: 18 }}
							>
								{this.state.data.NAME}
							</Text>
						</View>
					</Appbar.Header>
					<View
						style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}
					>
						<FastImage
							source={require('../../../assest/no_data.png')}
							style={{ width: 150, height: 150 }}
						/>
					</View>
				</View>
			)
		}
		return (
			<View style={styles.container}>
				{console.log('profile')}
				<ScrollView
					onScrollEndDrag={e => {
						if (e.nativeEvent.contentOffset.y < HEADER_SCROLL_DISTANCE / 2)
							this.ScrollView.scrollTo({ y: 0 })
						if (
							e.nativeEvent.contentOffset.y >= HEADER_SCROLL_DISTANCE / 2 &&
							e.nativeEvent.contentOffset.y < HEADER_SCROLL_DISTANCE
						)
							this.ScrollView.scrollTo({ y: HEADER_SCROLL_DISTANCE })
					}}
					ref={ref => (this.ScrollView = ref)}
					scrollEventThrottle={1}
					onScroll={Animated.event([
						{ nativeEvent: { contentOffset: { y: this.state.scrollY } } }
					])}
					style={{ flex: 1 }}
					contentContainerStyle={{
						paddingTop: HEADER_MAX_HEIGHT,
						paddingBottom: 50
					}}
				>
					{this.state.summaryLoading ? (
						<View
							style={{
								flex: 1,
								justifyContent: 'center',
								alignItems: 'center'
							}}
						>
							<ActivityIndicator />
						</View>
					) : (
						<View>
							<FlatList
								data={this.state.store_offers}
								horizontal
								inverted
								keyExtractor={item => item.ID}
								showsHorizontalScrollIndicator={false}
								renderItem={({ item }) => {
									return (
										<View
											style={{
												width: 200,
												height: 100,
												backgroundColor: 'white',
												margin: 5,
												borderRadius: 7,
												elevation: 2,
												flexDirection: 'row-reverse',
												justifyContent: 'space-between',
												alignItems: 'center'
											}}
										>
											<View style={{ flex: 1, height: '100%', padding: 10 }}>
												<Text
													style={{
														...styles.TextBold,
														textAlign: 'left',
														fontSize: 12
													}}
												>
													{item.offer.NAME}
												</Text>
												<Text style={{ ...styles.TextRegular, fontSize: 10 }}>
													{item.offer.DETAILS}
												</Text>
											</View>
											<View
												style={{
													justifyContent: 'center',
													alignItems: 'center',
													padding: 10
												}}
											>
												<FastImage
													resizeMode="cover"
													source={item.offer.OFFER_IMAGE ? { uri: config.BaseUrl + item.offer.OFFER_IMAGE } : require('../../../assest/no_data.png')}
													style={{ height: 50, width: 50 }}
												/>
											</View>
										</View>
									)
								}}
							/>
							{this.state.bestSellers.length == 0 ? null : (
								<RenderProduct
									{...this.props}
									item={{
										CATEGORYNAME: 'پر فروشترین ها',
										data: this.state.bestSellers
									}}
								/>
							)}
							{this.state.latest.length == 0 ? null : (
								<RenderProduct
									{...this.props}
									item={{
										CATEGORYNAME: 'جدیدترین ها',
										data: this.state.latest
									}}
								/>
							)}
							{this.state.productCategories.length == 0
								? null
								: this.state.productCategories.map(item => {
									return (
										<RenderItem
											key={item.ID.toString()}
											{...this.props}
											item={item}
										/>
									)
								})}
						</View>
					)}
				</ScrollView>

				<Animated.View
					style={[
						styles.header,
						{ height: headerHeight, backgroundColor: 'black' }
					]}
				>
					<AnimatedFastImage
						source={{ uri: config.BaseUrl + this.state.BANNER }}
						resizeMode="cover"
						style={{
							width,
							height: headerHeight,
							position: 'absolute',
							opacity: 0.3
						}}
					/>
					<AnimatedFastImage
						source={{ uri: config.BaseUrl + this.state.LOGO }}
						resizeMode="cover"
						style={{
							top: LOGOTOP,
							width: 70,
							height: 70,
							// borderRadius: 35,
							position: 'absolute',
							alignSelf: 'center'
						}}
					/>
					<Animated.View
						style={{
							height: headerHeight,
							position: 'absolute',
							opacity: headeropacity,
							width,
							backgroundColor: 'white'
						}}
					/>
					<Animated.Text
						style={{
							...styles.TextBold,
							color: headercolor,
							fontSize: 18,
							position: 'absolute',
							textAlign: 'center',
							alignSelf: 'center',
							top: NAMETOP,
							transform: [{ scale: NAMESCALE }]
						}}
					>
						{this.state.data.NAME}
					</Animated.Text>
					<Animated.View
						style={{
							flexDirection: 'row-reverse',
							top: TIMETOP,
							position: 'absolute',
							alignItems: 'center',
							alignSelf: 'center'
						}}
					>
						<Material name="access-time" color="white" style={{ margin: 5 }} />
						<Text
							style={{
								...styles.TextRegular,
								color: 'white',
								fontSize: 11,
								textAlign: 'center'
							}}
						>
							ساعت کاری :{' '}
							{this.state.times.START_TIME.split(':')[0] +
								':' +
								this.state.times.START_TIME.split(':')[1]}{' '}
			الی{' '}
							{this.state.times.END_TIME.split(':')[0] +
								':' +
								this.state.times.END_TIME.split(':')[1]}
						</Text>
					</Animated.View>

					<Animated.Text
						style={{
							...styles.TextRegular,
							color: 'white',
							fontSize: 15,
							position: 'absolute',
							textAlign: 'center',
							alignSelf: 'center',
							top: DESCRIPTIONTOP
						}}
					>
						{this.state.data.DESCRIPTION}
					</Animated.Text>
					<TouchableWithoutFeedback
						onPress={() => this.props.navigation.goBack()}
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
					>
						<AnimatedMaterial
							name="arrow-forward"
							style={{ alignSelf: 'flex-end', margin: 15, color: backcolor }}
							size={30}
						/>
					</TouchableWithoutFeedback>
				</Animated.View>
				<TouchableWithoutFeedback
					onPress={() =>
						this.props.navigation.push('StoreCategory', {
							ID: this.props.navigation.state.params.item.ID,
							NAME: this.state.data.NAME
						})
					}
				>
					<View
						style={{
							...styles.button,
							position: 'absolute',
							bottom: 10,
							alignSelf: 'center'
						}}
					>
						<Material name="edit" color="white" size={17} />
						<Text
							style={[
								styles.TextBold,
								{ color: 'white', textAlign: 'center', fontSize: 14 }
							]}
						>
							مشاهده همه دسته بندی ها
					</Text>
					</View>
				</TouchableWithoutFeedback>
			</View>
		)
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '$BackgroundColor'
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
		padding: 10,
		backgroundColor: '$MainColor',
		flexDirection: 'row-reverse',
		alignItems: 'center',
		justifyContent: 'center'
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
