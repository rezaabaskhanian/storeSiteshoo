/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react'
import { View, Dimensions, TouchableWithoutFeedback, Text, FlatList, Alert, ActivityIndicator, RefreshControl } from 'react-native'
import Material from 'react-native-vector-icons/MaterialIcons'

import FontAwesome from 'react-native-vector-icons/FontAwesome5'
import StyleSheet from 'react-native-extended-stylesheet'
import Axios from 'axios'
import { Tab, Tabs, CheckBox, Spinner, Toast } from 'native-base'
import { config } from '../../../App'
import moment from 'moment-jalaali'

const { width, height } = Dimensions.get('window')

import { withTranslation } from 'react-i18next';
 class VeramalOrders extends Component {

	state = {
		data: [],
		closedData: [],
		loading: true,
		deleting: false,
		enableDelete: true,
		enablePay: true
	}

	getColor(status) {
		let color = 'gray'
		switch (status.STATUS_ID) {
			case 0:
				color = 'skyblue'
				break
			case 1:
				color = 'pink'
				break
			case 2:
				color = 'green'
				break
			case 3:
				color = 'orange'
				break
		}
		return color
	}
	getText(status) {
		let text = ''
		text = status.order_status_dic.NAME
		// switch (status) {
		//   case 0:
		//       text = 'سبد خرید'
		//       break;

		//   case 1:
		//     text = 'جدید'
		//     break;
		//   case 2:
		//     text = 'تایید شده'
		//     break;
		//   case 3:
		//     text = 'برگردانده شده'
		//     break;
		//   case 4:
		//     text = 'در انتظار تایید '
		//     break;
		//   case 5:
		//     text = 'در حال ارسال'
		//     break;
		//   case 6:
		//     text = 'کنسل شده'
		//     break;
		//   case 7:
		//     text = 'تحویل شده'
		//     break;
		//   case 8:
		//     text = '<'
		//     break;
		//   case 9:
		//     text = '>'
		//     break;
		// }
		return text

	}

	componentDidMount() {
		this.FetchData()
	}

	FetchData = async () => {
		try {
			let data = await Axios.get('order/new/0/0/1')
			let closedData = await Axios.get('order/new/0/0/2')
			this.setState({
				loading: false,
				data: data.data.map((value) => ({ ...value, checked: false })),
				closedData: closedData.data
			})
		}
		catch (error) {
			console.warn(error.response.status)
			this.setState({
				loading: false
			})
			if (error.response.status === 404) {
				Toast.show({
					text: 'لیست سفارشات شما خالی است!',
					type: 'warning',
					position: 'top'
				})
			}
			Toast.show({
				text: 'خطای سرور! با پشتیبانی تماس بگیرید.',
				type: 'warning',
				position: 'top'
			})
		}

	}


	DeleteItem(id) {
		console.log(id, 'idddd')
		Axios.delete('order/' + id).then((data) => {
			console.log(data, 'delete')
			this.setState({ deleting: false }, this.FetchData)
			Toast.show({
				text: 'با موفقیت پاک شد',
				type: 'success'
			})
		}).catch((e) => { console.log(e, 'خطا در حذف رخ داده') })


	}

	DeleteMultiple = () => {
		Alert.alert('هشدار', 'آیا از حذف سفارشات مطمئن هستید؟', [
			{
				text: 'بله',
				onPress: () => {
					this.setState({ deleting: true })
					let deleteData = this.state.data.filter((val) => val.checked)
					deleteData.forEach(async (val, index) => {
						try {
							// console.log(JSON.stringify(val,null,5))
							await Axios.delete('order/' + val.ORDER_ID)
							if (index == deleteData.length - 1) {
								this.setState({ deleting: false }, this.FetchData)
								Toast.show({
									text: 'سفارشات با موفقیت پاک شدند.',
									type: 'success'
								})
							}
						} catch (error) {
							console.log('deleting PROBLEM', error, error.response)
						}
					})
				}
			},
			{
				text: 'خیر',
				style: 'cancel'
			}
		])

	}

	PayMultiple = () => {

	}

	render() {
		const {t} =this.props
		if (this.state.loading)
			return (
				<View style={styles.container}>
					<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
						<TouchableWithoutFeedback
							onPress={() => this.props.navigation.goBack()}
							hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
						>
							<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: StyleSheet.value('$MainColor') }} size={30} />
						</TouchableWithoutFeedback>
						<Text style={{ ...styles.TextBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} > {t('order-list')} </Text>
					</View>
					<View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }} >
						<ActivityIndicator />
					</View>
				</View>
			)

		function checkStatus(status) {
			if (status !== 5 &&
				status !== 7 &&
				status !== 8 &&
				status !== 9 &&
				status !== 10 &&
				status !== 12 &&
				status !== 15
			)
				return true
			else return false
		}

		return (
			<View style={{ flex: 1, backgroundColor: 'rgb(242,242,242)' }}>
				<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
					<TouchableWithoutFeedback
						onPress={() => this.props.navigation.goBack()}
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
					>
						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: StyleSheet.value('$MainColor') }} size={30} />
					</TouchableWithoutFeedback>
					<Text style={{ ...styles.TextBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} > {t('order-list')} </Text>

				</View>
				<Tabs prerenderingSiblingsNumber={1} locked initialPage={0} style={{ paddingTop: 10, backgroundColor: 'white', elevation: 0, alignItems: 'center' }} contentProps={{ nestedScrollEnabled: true }} tabContainerStyle={{ backgroundColor: StyleSheet.value('$MainColor'), width: 200, elevation: 0, borderRadius: 24, transform: [{ scaleX: -1 }] }} tabBarUnderlineStyle={{ backgroundColor: 'transparent' }}>
					<Tab heading={t('open-orders')} tabStyle={{ backgroundColor: 'transparent', width: 80, borderRadius: 24, margin: 5, transform: [{ scaleX: -1 }] }} activeTabStyle={{ backgroundColor: 'white', margin: 5, borderRadius: 17, transform: [{ scaleX: -1 }] }} textStyle={{ ...styles.TextRegular, color: 'white' }} activeTextStyle={{ ...styles.TextBold, color: StyleSheet.value('$MainColor') }}>
						<FlatList
							data={this.state.data}
							refreshControl={
								<RefreshControl
									onRefresh={this.FetchData}
									refreshing={this.state.loading}
								/>
							}
							keyExtractor={(item, index) => item.ORDER_ID.toString()}
							renderItem={({ item, index }) => {
								let text = item.ORDER_STATUS_NAME
								return (
									<TouchableWithoutFeedback
										onPress={() => {
											this.props.navigation.navigate('OrderDetail', { item, FetchData: this.FetchData })
										}}
									>
										<View style={{ width, height: 105, alignItems: 'center', justifyContent: 'center' }}>
											<View style={{ width: width - 20, overflow: 'hidden', shadowColor: 'black', shadowOffset: { height: 1, width: 0 }, shadowOpacity: 0.1, height: 95, paddingTop: 8, paddingBottom: 8, backgroundColor: 'white', elevation: 1, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 20, alignItems: 'center' }}>
												<View style={{ justifyContent: 'space-between', height: '100%', alignItems: 'center', width: 140 }}>
													<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100 }}>
														<Text style={{ fontFamily: StyleSheet.value('$IRANYekanLight'), color: 'black', fontWeight: StyleSheet.value('$WeightLight'), fontSize: 11 }}> {t('currency-unit')}</Text>
														<Text style={{ fontFamily: 'IRANYekanRegular', color: 'black', fontWeight: StyleSheet.value('$WeightRegular'), fontSize: 14, marginLeft: 5 }}>{config.priceFix(parseInt(item.ORDER_VALUE_WITHOUT_COURIER) + parseInt(item.CORIER_VALUE))}</Text>
														<Material name='local-offer' size={15} color='rgb(165,165,165)' />
													</View>
													<View style={{ backgroundColor: StyleSheet.value('$MainColor'), height: 30, borderRadius: 15, padding: 8, alignItems: 'center', justifyContent: 'center' }}>
														<Text numberOfLines={1} style={{ fontFamily: 'IRANYekanRegular', color: 'white', fontWeight: StyleSheet.value('$WeightRegular'), fontSize: 11 }}>{text}</Text>
													</View>

												</View>
												<View style={{ justifyContent: 'space-between', alignItems: 'flex-start', height: '100%', overflow: 'hidden', flex: 1 }}>
													<View style={{ flexDirection: 'row-reverse', alignSelf: 'flex-end' }}>
														{/* <CheckBox
															checked={item.checked}
															onPress={() =>
																this.setState((prevState) => ({
																	data: prevState.data.map((value, i) => {
																		if (i == index) return {
																			...value,
																			checked: !value.checked
																		}
																		else return value
																	}),
																	enableDelete: prevState.enableDelete && checkStatus(prevState.data[index].ORDER_STATUS_ID)
																}))
															}
															color={StyleSheet.value('$MainColor')}
															style={{ marginLeft: 16 }}
														/> */}
														<FontAwesome onPress={() => { console.log('ok'), this.DeleteItem(item.ORDER_ID) }} name='trash' size={18} color='rgb(165,165,165)' style={{ marginLeft: 16 }} />


														<Text style={{ fontFamily: 'IRANYekanRegular', color: 'black', fontWeight: StyleSheet.value('$WeightRegular'), fontSize: 14, marginLeft: 5, textAlign: 'right', alignSelf: 'flex-end' }}>
															{item.STORE_NAME + ' (' + item.ORDER_ID + ')'}
														</Text>
													</View>
													<View style={{ alignItems: 'center', flexDirection: 'row', width: '100%', justifyContent: 'flex-end' }}>
														<Text numberOfLines={1} style={{ flex: 1, fontFamily: '$IRANYekanLight', color: 'gray', fontWeight: StyleSheet.value('$WeightLight'), fontSize: 11, marginLeft: 5, textAlign: 'right' }}>{item.ADDRESS}</Text>
														<Material name='location-on' size={14} color='rgb(165,165,165)' style={{ marginLeft: 5 }} />
													</View>
													<View style={{ alignItems: 'center', flexDirection: 'row', width: '100%', justifyContent: 'flex-end' }}>
														<Text numberOfLines={1} style={{ flex: 1, fontFamily: StyleSheet.value('$IRANYekanLight'), color: 'gray', fontWeight: StyleSheet.value('$WeightLight'), fontSize: 11, marginLeft: 5, textAlign: 'right' }}>
															{item.ORDER_DELIVERY_DATE} {item.ORDER_DELIVERY_TIME}
														</Text>
														<Material name='date-range' size={14} color='rgb(165,165,165)' style={{ marginLeft: 5 }} />
													</View>
												</View>
											</View>
										</View>
									</TouchableWithoutFeedback>
								)
							}}
							ListEmptyComponent={<Text style={{ ...styles.TextRegular, flex: 1, textAlign: 'center', paddingTop: 30 }} > {t('no-order-list')}</Text>}
						/>
						{
							this.state.data.filter((value) => value.checked)[0] != null && this.state.enableDelete &&
							<View style={{ width: '100%', flexDirection: 'row', bottom: 10, position: 'absolute', justifyContent: 'space-around' }}>
								{
									this.state.deleting ?
										<View
											style={{
												...styles.button,
												paddingVertical: 20,
												paddingHorizontal: 20,
												justifyContent: 'center',
												alignItems: 'center',
												backgroundColor: 'red'
											}}
										>
											<Spinner color='white' />
										</View> :
										<TouchableWithoutFeedback onPress={this.DeleteMultiple}>
											<View
												style={{
													...styles.button,
													paddingVertical: 20,
													paddingHorizontal: 20,
													justifyContent: 'center',
													alignItems: 'center',
													backgroundColor: 'red'
												}}
											>
												<Text style={[styles.TextBold, { color: 'white', fontSize: 14 }]}>
											    {t('delete')}
												</Text>
											</View>
										</TouchableWithoutFeedback>
								}
								{/* {
									this.state.data.filter((value) =>
										value.ORDER_STATUS_ID ?
											value.ORDER_STATUS_ID == 10 && value.CONFIRM_BY_PROVIDER == 1 && value.CONFIRM_BY_CUSTOMER == 1 :
											false
									)[0] != null ?
										<TouchableWithoutFeedback onPress={this.PayMultiple}>
											<View
												style={{
													...styles.button,
													paddingVertical: 20,
													paddingHorizontal: 20,
													justifyContent: 'center',
													alignItems: 'center'
												}}
											>
												<Text style={[styles.TextBold, { color: 'white', fontSize: 14 }]}>
													پرداخت
												</Text>
											</View>
										</TouchableWithoutFeedback> :
										<View
											style={{
												...styles.button,
												paddingVertical: 20,
												paddingHorizontal: 20,
												justifyContent: 'center',
												alignItems: 'center',
												backgroundColor: 'gray'
											}}
										>
											<Text style={[styles.TextBold, { color: 'white', fontSize: 14 }]}>
												پرداخت
											</Text>
										</View>
								} */}
							</View>
						}
					</Tab>
					<Tab heading={t('closed-orders')} tabStyle={{ backgroundColor: 'transparent', width: 80, borderRadius: 24, margin: 5, transform: [{ scaleX: -1 }] }} activeTabStyle={{ backgroundColor: 'white', margin: 5, borderRadius: 17, transform: [{ scaleX: -1 }] }} textStyle={{ ...styles.TextRegular, color: 'white' }} activeTextStyle={{ ...styles.TextBold, color: StyleSheet.value('$MainColor') }}>
						<FlatList
							data={this.state.closedData}
							refreshControl={
								<RefreshControl
									onRefresh={this.FetchData}
									refreshing={this.state.loading}
								/>
							}
							keyExtractor={(item, index) => item.ORDER_ID.toString()}
							renderItem={({ item }) => {
								let text = item.ORDER_STATUS_NAME
								return (
									<TouchableWithoutFeedback
										onPress={() => {
											this.props.navigation.navigate('OrderDetail', { item })
										}}
									>

										<View style={{ width, height: 105, alignItems: 'center', justifyContent: 'center' }}>
											<View style={{ width: width - 20, overflow: 'hidden', shadowColor: 'black', shadowOffset: { height: 1, width: 0 }, shadowOpacity: 0.1, height: 95, paddingTop: 8, paddingBottom: 8, backgroundColor: 'white', elevation: 1, borderRadius: 5, flexDirection: 'row', justifyContent: 'space-between', paddingRight: 20, alignItems: 'center' }}>
												<View style={{ justifyContent: 'space-around', height: '100%', alignItems: 'center', width: 140 }}>
													<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: 100 }}>
														<Text style={{ fontFamily: StyleSheet.value('$IRANYekanLight'), color: 'black', fontWeight: StyleSheet.value('$WeightLight'), fontSize: 11 }}> {t('currency-unit')}</Text>
														<Text style={{ fontFamily: 'IRANYekanRegular', color: 'black', fontWeight: StyleSheet.value('$WeightRegular'), fontSize: 14, marginLeft: 5 }}>{config.priceFix(item.ORDER_VALUE_WITH_COURIER)}</Text>
														<Material name='local-offer' size={15} color='rgb(165,165,165)' />
													</View>
													<View style={{ backgroundColor: StyleSheet.value('$MainColor'), height: 22, borderRadius: 15, padding: 8, alignItems: 'center', justifyContent: 'center' }}>
														<Text numberOfLines={1} style={{ fontFamily: 'IRANYekanRegular', color: 'white', fontWeight: StyleSheet.value('$WeightRegular'), fontSize: 11 }}>{text}</Text>
													</View>
													{/* <View style={{ backgroundColor: '#07c05c', height: 22, borderRadius: 15, padding: 8, alignItems: 'center', justifyContent: 'center' }}>
											<Text numberOfLines={1} style={{ fontFamily: 'IRANYekanRegular', color: 'white', fontWeight: StyleSheet.value('$WeightRegular'), fontSize: 11 }}>{item.CONFIRM_BY_PROVIDER == 0 ? 'در انتظار تایید فروشگاه' : 'تایید شده'}</Text>
										</View> */}
												</View>
												<View style={{ justifyContent: 'space-between', alignItems: 'flex-start', height: '100%', overflow: 'hidden', flex: 1 }}>
													<View style={{ justifyContent: 'space-around', alignItems: 'flex-start', height: '100%', overflow: 'hidden', flex: 1 }}>
														<Text style={{ fontFamily: 'IRANYekanRegular', color: 'black', fontWeight: StyleSheet.value('$WeightRegular'), fontSize: 14, marginLeft: 5, textAlign: 'right', alignSelf: 'flex-end' }}>
															{item.STORE_NAME + ' (' + item.ORDER_ID + ')'}
														</Text>
														<View style={{ alignItems: 'center', flexDirection: 'row', width: '100%', justifyContent: 'flex-end' }}>
															<Text numberOfLines={1} style={{ flex: 1, fontFamily: StyleSheet.value('$IRANYekanLight'), color: 'gray', fontWeight: StyleSheet.value('$WeightLight'), fontSize: 11, marginLeft: 5, textAlign: 'right' }}>{item.ADDRESS}</Text>
															<Material name='location-on' size={14} color='rgb(165,165,165)' style={{ marginLeft: 5 }} />
														</View>
													</View>
													<View style={{ alignItems: 'center', flexDirection: 'row', width: '100%', justifyContent: 'flex-end' }}>
														<Text numberOfLines={1} style={{ flex: 1, fontFamily: StyleSheet.value('$IRANYekanLight'), color: 'gray', fontWeight: StyleSheet.value('$WeightLight'), fontSize: 11, marginLeft: 5, textAlign: 'right' }}>
															{item.ORDER_DELIVERY_DATE} {item.ORDER_DELIVERY_TIME}
														</Text>
														<Material name='date-range' size={14} color='rgb(165,165,165)' style={{ marginLeft: 5 }} />
													</View>

												</View>
											</View>
										</View>
									</TouchableWithoutFeedback>
								)
							}}
							ListEmptyComponent={<Text style={{ ...styles.TextRegular, flex: 1, textAlign: 'center', paddingTop: 30 }} > {t('no-order-list')} </Text>}
						/>
					</Tab>
				</Tabs>

			</View>
		)
	}
}

export default  withTranslation()(VeramalOrders)
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '$BackgroundColor'
	},
	TextBold: {
		fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold',
		fontSize: 12
	},
	TextRegular: {
		fontFamily: 'IRANYekanRegular',
		fontWeight: '$WeightRegular',
		fontSize: 13
	},
	button: {
		borderRadius: 17,
		width: '40%',
		height: 30,
		backgroundColor: '$MainColor',
		flexDirection: 'row-reverse',
		alignItems: 'center',
		justifyContent: 'space-between'
	}
})
