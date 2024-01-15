import React, { Component } from 'react'

import {
	View,
	Image,
	Dimensions,
	TextInput,
	TouchableWithoutFeedback,
	Text,
	FlatList,
	RefreshControl,
	ImageBackground,
	KeyboardAvoidingView,
	ScrollView,
	Modal,
	Linking,
	Alert,
	ToastAndroid,PermissionsAndroid,
	ActivityIndicator,AsyncStorage
} from 'react-native'
import PersianCalendarPicker from 'react-native-persian-calendar-picker';
import Material from 'react-native-vector-icons/MaterialIcons'
import StyleSheet from 'react-native-extended-stylesheet'
import Axios from 'axios'
import FastImage from 'react-native-fast-image'
import color from 'color'
import { config } from '../../../App'
import { state as store, orderType } from 'react-beep'
import MapView, { Marker } from 'react-native-maps'
import { Toast, Spinner, Icon } from 'native-base'
import { NavigationEvents, StackActions, NavigationActions, withNavigation } from 'react-navigation'
import { or } from "react-native-reanimated";
import  { launchCamera , launchImageLibrary} from 'react-native-image-picker';

import moment from 'moment-jalaali'
import { withTranslation } from 'react-i18next';
import { Turnover } from '.';

const Details = {
	0: 'سفارش بعد از تایید شما به تامین کننده ارسال و بررسی خواهد شد',
	// 2: 'سفارش شما توسط تامین کننده تایید شده و باید هزینه توسط شما پرداخت شود.',
	3: 'سفارش توسط تامین کننده دچار تغییراتی شده و باید مجددا توسط شما تایید شود. شما میتوانید محصولات حذف شده را به رنگ خاکستری مشاهده نمایید',
	4: 'سفارش توسط شما تایید شده و در مرحله بررسی توسط تامین کننده قرار دارد.',
	5: 'سفارش در مرحله ارسال توسط پیک میباشد.',
	6: 'سفارش توسط شما کنسل شده است و قابلیت بررسی ندارد.',
	7: 'سفارش به شما تحویل داده شده است.',
	8: 'پیک به فروشگاه رسیده و آماده گرفتن سفارش شما از فروشگاه است.',
	10: 'سفارش شما توسط تامین کننده تایید شده و باید هزینه توسط شما پرداخت شود.',
	12: 'سفارش توسط شما پرداخت شده است.',
	13: 'سفارش توسط شما حذف شده است.',
	14: 'سفارش توسط تامین کننده حذف شده است.',
	15: 'سفارش شما توسط پیک قبول شده است و در راه فروشگاه قرار دارد.',
}


const nameBankData = [
	'بانک ملی ایران',
	'بانک سپه',
	'بانک صنعت و معدن',
	'بانک کشاورزی',
	'بانک مسکن',
	'بانک توسعه صادرات ایران',
	'بانک توسعه تعاون',
	'پست بانک ایران',
	'بانک اقتصاد نوین',
	'بانک پارسیان',
	'بانک کارآفرین',
	'بانک سامان',
	'بانک سینا',
	'بانک خاورمیانه',
	'بانک شهر',
	'بانک دی',
	'بانک صادرات',
	'بانک ملت',
	'بانک تجارت',
	'بانک رفاه',
	'بانک حکمت ایرانیان',
	'بانک گردشگری',
	'بانک ایران زمین',
	'بانک قوامین',
	'بانک انصار',
	'بانک سرمایه',
	'بانک پاسارگاد',
	'بانک مشترک ایران - ونزوئلا',
	'بانک قرض الحسنه مهر ایران',
	'بانک قرض الحسنه رسالت',
]



class CartItem extends Component {
	state = {
		count: this.props.data.count,
		lazy: false,
		lock: this.props.data.deleted,//boolean
		modalVisible: false,
		disc: this.props.data.description,
		providerChange: Details[this.props.StatusID] === Details[3],


		////// add :rezaabasi
		customer: null

		// //add me rezaabasi
		// activePay: false


	};


	setModalVisible(visible) {
		this.setState({ modalVisible: visible })
	}

	componentDidMount() {
		if (!this.props.deleted)
			this.props.update_price(this.state.count * this.props.data.priceAfterOffer)
	}
	render() {
		return (
			<View style={{ marginVertical: 5, width: '85%', alignSelf: 'center', flexDirection: 'row-reverse', height: 70, justifyContent: 'space-between', alignItems: 'center' }} >
				<Modal
					animationType="slide"
					transparent={true}
					visible={this.state.modalVisible}
					onRequestClose={() => {
						this.setModalVisible(false)
					}}>
					<View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: color('gray').alpha(0.8).darken(0.2) }} >
						<View style={{ backgroundColor: 'white', height: 300, borderTopLeftRadius: 17, borderTopRightRadius: 17, alignItems: 'center' }} >
							<Text style={{ ...styles.TextBold, color: 'black', fontSize: 18, margin: 10 }} >توضیحات {this.props.data.name}</Text>

							<View style={{ flex: 1, marginVertical: 5, width: '90%', borderRadius: 17, borderWidth: 0.5, borderColor: 'gray' }} >
								<TextInput
									placeholder='توضیحات شما'
									multiline
									value={this.state.disc}
									onChangeText={(disc) => this.setState({ disc })}
									style={[styles.TextLight, { padding: 10, textAlignVertical: 'top', flex: 1, ...styles.TextRegular }]}
								/>
							</View>

							<TouchableWithoutFeedback
								onPress={async () => {
									try {
										let res = await Axios.put('order/cart', {
											'ORDER_ID': this.props.data.ORDER_ID,
											'PRODUCT_ID': this.props.data.productStoreId,
											'COUNT': this.state.count,
											'DESCRIPTION': this.state.disc
										})
										this.setModalVisible(!this.state.modalVisible)

									} catch (error) {
										console.log(error)
									}
								}}
							>
								<View style={{ ...styles.button, margin: 20, alignSelf: 'center', width: 170, justifyContent: 'center' }} >

									<Text style={[styles.TextBold, { color: 'white', textAlign: 'center' }]} >تایید </Text>
								</View>
							</TouchableWithoutFeedback>
						</View>
					</View>
				</Modal>

				{
					!this.props.deleted && this.props.StatusID != 4 ?
						<TouchableWithoutFeedback
							onPress={() => {
								this.setModalVisible(true)
							}}>
							<View style={{ padding: 5 }} >
								<Material name='note-add' size={25} />
							</View>
						</TouchableWithoutFeedback> :
						<View style={{ width: 27, height: 27, padding: 5 }} />
				}
				<View style={{ backgroundColor: 'white', height: '100%', elevation: 2, width: '80%', marginRight: 0, borderRadius: 7, overflow: 'hidden', flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }} >
					{
						this.props.deleted ?
							<View style={{ ...StyleSheet.absoluteFill, backgroundColor: 'rgba(200,200,200,0.7)', zIndex: 100, justifyContent: 'center', alignItems: 'center' }} >
								{/* <Text style={{ ...styles.TextBold, color: 'black', fontSize: 16 }} >موجود نمی باشد</Text> */}
							</View>
							: null
					}
					{/* <FastImage source={{ uri: config.BaseUrl + config.ProductSubUrl + this.props.data.image }} style={{ height: '100%', width: 70 }} resizeMode='contain' /> */}
					<FastImage source={{ uri: config.ImageBaners + config.ProductSubUrl + this.props.data.image }} style={{ height: '100%', width: 70 }} resizeMode='contain' />

					<View style={{ flex: 1, paddingVertical: 5, paddingHorizontal: 10, flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center' }} >
						<View style={{ flex: 1 }} >
							<Text numberOfLines={2} style={{ ...styles.TextBold, color: 'black', fontSize: 10 }} >{this.props.data.name}</Text>

							<Text style={{ ...styles.TextRegular, color: 'gray', fontSize: 11, textDecorationLine: (this.props.data.price !== this.props.data.priceAfterOffer) ? 'line-through' : 'none' }} >{config.priceFix(this.props.data.price)} تومان</Text>
							<Text style={{ ...styles.TextRegular, color: 'green', fontSize: 11, display: (this.props.data.price !== this.props.data.priceAfterOffer) ? 'flex' : 'none' }} >{config.priceFix(this.props.data.priceAfterOffer)} تومان</Text>
						</View>
						<View style={{ flexDirection: 'row-reverse', alignItems: 'center', width: 80, justifyContent: 'space-between' }} >
							{
								(this.props.StatusID === 0) ?
									// (this.props.StatusID != 7) ?
									// this.state.OrderData &&
									// (this.state.OrderData.CONFIRM_BY_PROVIDER == 0 && this.state.OrderData.CONFIRM_BY_CUSTOMER == 1) ?
									<>
										<TouchableWithoutFeedback disabled={this.props.deleted} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }} onPress={async () => {

											let temp = this.state.count + 1
											this.setState({ lazy: true, count: temp })
											this.props.update_price(this.props.data.priceAfterOffer)
											Axios.put('order/cart', {
												'ORDER_ID': this.props.data.ORDER_ID,
												'PRODUCT_ID': this.props.data.id,
												'COUNT': temp,
												'DESCRIPTION': this.state.disc
											}).then((res) => {
												this.setState({ lazy: false })

											
											}).catch(err => {
												console.log(err)
												this.props.update_price(-1 * this.props.data.priceAfterOffer)
												this.setState({ lazy: false, count: this.state.count - 1 })
											})
											



										}} >
											<View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderColor: 'black', borderRadius: 5, borderWidth: 0.5 }} >
												<Material name='add' size={15} />
											</View>
										</TouchableWithoutFeedback>
										<Text style={{ ...styles.TextRegular, color: 'black', fontSize: 12, textAlign: 'center', alignSelf: 'center', padding: 5 }} >{this.state.count}</Text>
										<TouchableWithoutFeedback disabled={this.props.deleted} hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }} onPress={async () => {
											if (this.state.count > 0) {
												try {

													await this.setState({ lazy: true, count: this.state.count - 1 })
													this.props.update_price(-1 * this.props.data.priceAfterOffer)
													let q = await Axios.put('order/cart', {
														'ORDER_ID': this.props.data.ORDER_ID,
														'PRODUCT_ID': this.props.data.productStoreId,
														'COUNT': this.state.count,
														'DESCRIPTION': this.state.disc
													})
													await this.setState({ lazy: false })

												} catch (error) {
													this.props.update_price(this.props.data.priceAfterOffer)

													await this.setState({ lazy: false, count: this.state.count + 1 })
												}
											}
										}} >
											<View style={{ width: 20, height: 20, justifyContent: 'center', alignItems: 'center', borderColor: 'black', borderRadius: 5, borderWidth: 0.5 }} >
												<Material name='remove' size={15} />
											</View>
										</TouchableWithoutFeedback>
									</> :
									<Text style={{ ...styles.TextRegular, color: 'black', fontSize: 12, textAlign: 'center', alignSelf: 'center', padding: 5 }} >
										{'تعداد: ' + this.state.count}
									</Text>
							}

						</View>
					</View>
				</View>
				{
					!this.props.deleted && this.state.providerChange ?
						<TouchableWithoutFeedback
							onPress={async () => {
								try {
									this.props.deleteItem(this.props.data)
								} catch (error) {
									Toast.show({
										text: error.response.data.message,
										type: 'danger',
										duration: 3000,
										buttonText: 'تایید',
										buttonStyle: { borderColor: 'white', borderWidth: 1, margin: 5, borderRadius: 7 }
									})
								}
							}}
						>
							<View style={{ padding: 5 }} >
								<Material name='delete' size={25} />
							</View>
						</TouchableWithoutFeedback> :
						<View style={{ width: 27, height: 27, padding: 5 }} />
				}


			</View>
		)
	}
}
const options = {
	title: 'Select Avatar',
	customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
	storageOptions: {
	  skipBackup: true,
	  path: 'images',
	},
  }
class VeramalOrders extends Component {

	constructor(props) {
		super(props);
		this.onDateChange = this.onDateChange.bind(this),


			this.state = {

				loading: true,
				data: [],
				OrderData: this.props.navigation.getParam('item', {}),
				off: '',
				comment: '',

				hasWallet: false,
				selectedStartDate: null,
				
				showCalendar: false,
				idSayad: '',
				idCheque: '',
				nameBank: 'نام بانک',
				nameAccount: '',
				showBanks: false,

				showCart: false,

				cartName: '',
				cartNumber: '',
				cartNumberStore: '',
				traceNo: '',
				idPay: false,

				showCash:false,

				image:null,
				response:null,
				loadButton:false,

				send: [
					{
						id: '0',
						title: 'ارسال از طریق پیک'
					},
					{
						id: '1',
						title: 'تحویل در محل'
					}
				],
				paySelected: '',
				payment: [
					// {
					// 	id: '1',
					// 	title: 'آنلاین',
					// 	enable: true
					// },
					//  {
					// 	id: '2',
					// 	title: 'پرداخت در محل',
					// 	enable: true
					// },

					// {
					// 	id: '5',
					// 	title: 'کارت به کارت',
					// 	enable: true
					// },
				],
				deleteItems: []

			}
	}

	async componentDidMount() {
	

		try {
			// this.setState({
			// 	loading: false
			// })
			this.fetchLog()
			this.getModules()
			this.getCard()
			this.getIdPay()
		} catch (error) {
			console.log(error)
		}

	}
	
	getCard() {
		Axios.get('features/card_info').then((data) => {
			const newPayment = [...this.state.payment]

			if (data.data[0].CARD_NAME!==null){
				newPayment.push({ id: '11', title: 'کارت به کارت', enable: true }),
				this.setState({
                      payment:newPayment,
					cartName: data.data[0].CARD_NAME,
					// cartNumber: data.data[0].CARD_NUMBER
					cartNumberStore: data.data[0].CARD_NUMBER
				})
				 }
			})
	}

	// getModules = async () => {

	// 	//2077 زرین پال
	// 	// 
	// 	try {
	// 		 let getWallet = await Axios.get('features/get_modules')
		
	// 		let Test = getWallet.data.getModules.filter((item) => item.ID == '2005')  //کیف پول
	// 		let cheque = getWallet.data.getModules.filter((item) => item.ID == '2008') // چک
			
	// 		let Idpays = getWallet.data.getModules.filter((item) => item.ID == '2010') // آیدی پی

	// 		let showCash=getWallet.data.getModules.filter((item) => item.ID == '4103') // پرداخت با پوز
	// 		let onSitePay =getWallet.data.getModules.filter((item) => item.ID == '2079') // پرداخت در محل 
    //         let zarinPal =getWallet.data.getModules.filter((item) => item.ID == '2077') // زرین پال
	// 		let sama =getWallet.data.getModules.filter((item) => item.ID == '2039') // سما
	// 		let rayanPay =getWallet.data.getModules.filter((item) => item.ID == '3031') // رایان پی
	// 		let nextPay =getWallet.data.getModules.filter((item) => item.ID == '3035') // nextPay


	// 		nextPay[0] ?
	// 		nextPay[0].ID == '3035' ? [this.state.payment.push(2, 0, { id: '11', title: 'nextPay', enable: true })] : null
	// 		:null

    //         rayanPay[0] ?
	// 		rayanPay[0].ID == '3031' ? [this.state.payment.push(2, 0, { id: '10', title: 'rayanPay', enable: true })] : null
	// 		:null

	// 		sama[0] ?
	// 		sama[0].ID == '2039' ? [this.state.payment.push(2, 0, { id: '9', title: 'سما', enable: true })] : null
	// 		:null

	// 		 zarinPal[0] ?
	// 		 zarinPal[0].ID == '2077' ? [this.state.payment.push(2, 0, { id: '8', title: 'زرین پال', enable: true })] : null
	// 		 :null
			
	// 		// onSitePay.length !== 0  ? this.setState({ showCash: true }) : this.setState({payment: this.state.payment.slice(1, 2)})
	// 		onSitePay[0] ?
	// 		onSitePay[0].ID == '2079' ? [this.state.payment.concat(2, 0, { id: '6', title: 'پرداخت رد محل', enable: true })] : null
	// 		:null
			
	// 		showCash[0] ?
	// 		showCash[0].ID == '4103' ? [this.state.payment.concat(2, 0, { id: '7', title: 'پرداخت با پوز', enable: true })] : null// showCash.length !== 0  ? this.setState({ showCash: true }) : this.setState({ payment: this.state.payment.slice(1, 2)})
	// 		:null
			
	// 		Idpays[0].ID == '2010' ? [this.setState({ idPay: true })] : console.log('noPay')

	// 		Test[0] ?
	// 			Test[0].ID == '2005' ? [this.state.payment.concat(2, 0, { id: '3', title: 'کیف پول', enable: true })] : console.log('hasNotWallet')

	// 			// this.setState({ payment: [...this.state.payment, a] })
	// 			:
	// 			null

	// 		cheque[0].ID == '2008' ? [this.state.payment.push({ id: '4', title: 'پرداخت با چک', enable: true })] : console.log('hasNotCheque')


	// 	}
	// 	catch (e) {
	// 		console.log(e)
	// 	}
	// }

	 getModules = async () => {
		const jobStatus =await AsyncStorage.getItem('jobStatus')
		console.log(jobStatus,'jobStatus')
		try {
		  const getWallet = await Axios.get('features/get_modules');
		  const modules = getWallet.data.getModules;
	  
		  const paymentMethods = {
			'2005': { id: '1', title: 'کیف پول', enable: true },
			'2008': { id: '2', title: 'پرداخت با چک', enable: true },
			'2010': { id: '3', title: 'آیدی پی', enable: true },
			'4103': { id: '4', title: 'پرداخت با پوز', enable: true },
			'2079': { id: '5', title: 'پرداخت در محل', enable: true },
			'2077': { id: '6', title: 'زرین پال', enable: true },
			'2039': { id: '7', title: 'سما', enable: true },
			'3031': { id: '8', title: 'رایان پی', enable: true },
			'3035': { id: '9', title: 'nextPay', enable: true },
			'2020': { id: '10', title: 'کسر از حقوق', enable:jobStatus ==! null ? true :false} 
			 
		  };
		  const newPayment = [...this.state.payment]
		  for (const moduleId in paymentMethods) {
			const module = modules.find((item) => item.ID == moduleId);
		
			if (module !=undefined) {
			//   this.state.payment.push(1, 0, paymentMethods[moduleId]);
			newPayment.push(paymentMethods[moduleId]);
			}
		  }
	  
		  if (this.state.payment.length === 0) {
			console.log('No payment methods available.');
		  }
	  
		  const hasShowCash = modules.some((item) => item.ID === '4103');
		  if (hasShowCash) {
			this.setState({ showCash: true });
		  }
	  
		  const hasIdPay = modules.some((item) => item.ID === '2010');
		  if (hasIdPay) {
			this.setState({ idPay: true });
		  }

		  this.setState({ payment: newPayment });
		} catch (e) {
		  console.log(e);
		}
	  };

	fetchLog = async () => {
		try {
			this.setState({ loading: true })
			let orders = {};

			///////////
			let customer_Id = await Axios.get('order/new/0/0/1')
			this.setState({ customer: customer_Id.data[0].CUSTOMER_ID })

			try {

				
				orders = await Axios.get('order/new/' + ((this.state.OrderData && this.state.OrderData.ORDER_ID) ? this.state.OrderData.ORDER_ID : this.state.OrderData.ID) + '/0/3')

			} catch (e) {
				console.log(e)
			}
			let order = {
				products: [],
				OFFER_VALUE_SUM: 0,
				OFFER_COURIER_SUM: 0,
				OFFER_INVOICE_SUM: 0,
				OFFER_PRODUCT_SUM: 0,
			}
			
			for (let item of orders.data) {

				order['ORDER_ID'] = item.ORDER_ID
				order['PAYMENTTYPE_NAME'] = item.PAYMENTTYPE_NAME
				order['ORDER_DATE'] = item.ORDER_DATE
				order['ORDER_TIME'] = item.ORDER_TIME
				order['CUSTOMER_NAME'] = item.NAME
				order['CONFIRM_BY_CUSTOMER'] = item.CONFIRM_BY_CUSTOMER
				order['CONFIRM_BY_PROVIDER'] = item.CONFIRM_BY_PROVIDER
				order['ORDER_STATUS_ID'] = item.ORDER_STATUS_ID
				order['COMMENTS'] = item.COMMENTS
				order['ORDER_STATUS_NAME'] = item.ORDER_STATUS_NAME
				order['PAYMENT_STATUS'] = item.PAYMENT_STATUS
				order['PAYMENT_STATUS_NAME'] = item.PAYMENT_STATUS_NAME
				order['ORDER_VALUE_WITHOUT_COURIER'] = item.ORDER_VALUE_WITHOUT_COURIER
				order['CORIER_VALUE'] = item.CORIER_VALUE
				order['COURIER_AVATAR'] = item.COURIER_AVATAR
				order['CUSTOMER_ADDRESS'] = item.CUSTOMER_ADDRESS
				order['STORE_NAME'] = item.STORE_NAME
				order['STORE_PHONE'] = item.STORE_PHONE
				order['STORE_EMAIL'] = item.STORE_EMAIL
				order['COURIER_NAME'] = item.COURIER_NAME
				order['COURIER_PHONE'] = item.COURIER_PHONE
				order['COURIER_PELAK'] = item.COURIER_PELAK
				order['ORDER_DATE'] = item.ORDER_DATE
				order['ORDER_DELIVERY_DATE'] = item.ORDER_DELIVERY_DATE
				order['ORDER_DELIVERY_TIME'] = item.ORDER_DELIVERY_TIME
				order['ORDER_DELIVERY_TIME_2'] = item.ORDER_DELIVERY_TIME_2
				order['ORDER_VALUE_WITH_COURIER'] = item.ORDER_VALUE_WITH_COURIER
				order['CUSTOMER_NUMBER'] = item.CUSTOMER_NUMBER
				order['CUSTOMER_EMAIL'] = item.CUSTOMER_EMAIL
				order['STORE_ADDRESS'] = item.STORE_ADDRESS
				order['OFFER_VALUE_SUM'] += item.OFFER_VALUE_SUM ? item.OFFER_VALUE_SUM : 0
				order['COURIER_AVATAR'] = item.COURIER_AVATAR
				order['CONFIRM_BY_CUSTOMER'] = item.CONFIRM_BY_CUSTOMER
				order['DELETED'] = item.ORDER_DELETED
				order['COURIER_LOCATION_X'] = item.COURIER_X
				order['OFFER_COURIER_SUM'] = item.OFFER_COURIER_SUM
				order['OFFER_INVOICE_SUM'] = item.OFFER_INVOICE_SUM
				order['OFFER_PRODUCT_SUM'] = item.OFFER_PRODUCT_SUM
				order['products'].push({
					id: item.CRAT_ID,
					ORDER_ID: item.ORDER_ID,
					name: item.PRODUCT_NAME,
					count: item.PRODUCT_COUNT,
					price: item.PRICE,
					totalPrice: item.PRICE_SUM,
					offerValueSum: item.OFFER_VALUE_SUM,
					priceAfterOffer: item.OFFER_VALUE_SUM ? item.PRICE - (item.OFFER_VALUE_SUM / item.PRODUCT_COUNT) : item.PRICE,
					unitId: item.PRODUCT_UNIT_ID,
					unit: item.PRODUCT_UNIT_NAME,
					description: item.DESCRIPTION,
					deleted: item.ORDER_PRODUCT_DELETED !== 0,
					productStoreId: item.PRODUCT_STORE_ID,
					image: item.PRODUCT_IMAGE
				})
			}
			let user = await Axios.get('users/me')
			let wallet = await Axios.get('wallet/' + user.data.ID)
			this.setState({
				loading: false,
				wallet: wallet.data.FINANCIAL_BALANCE_AFTER,
				OrderData: order,
				items: order.products
			})
		} catch (error) {
			console.warn(error)
		}
	}
	confirmOrder = () => {
		Axios.get(`/order/confirm/${this.state.OrderData.ORDER_ID}`).then(({ data }) => {
			Toast.show({
				type: 'success',
				text: 'سفارش شما با موفقیت تایید شد!'
			})
			this.props.navigation.goBack()
			this.props.navigation.getParam('FetchData', () => { })()
		}).catch(err => {
			Toast.show({
				type: 'danger',
				text: `خطا در ثبت سفارش کد( ${err.response.code})`
			})
			console.log(err.response)
		})
	}
	deleteItems = () => {
		Alert.alert('هشدار', 'آیا از ویرایش سفارش مطمئن هستید؟', [
			{
				text: 'بله',
				onPress: async () => {

					let deleted = []
					this.state.deleteItems.map(item => {
						deleted.push({ ID: item })
					})
					this.setState({ deleteItems: [] })
					let data = {
						DELETE: deleted,
						ORDER_ID: this.state.OrderData.ORDER_ID
					}
					await Axios.put('order/ProductReplacementCustomer', data)
					Toast.show({
						type: 'success',
						text: 'سفارش با موفقیت ویرایش شد'
					})
					this.fetchLog()
				}
			},
			{
				text: 'خیر',
				style: 'cancel'
			}
		])
	}

	PayOrder = () => {

		if (this.state.paySelected == ''){
			
			Toast.show({
				type: 'warning',
				text: `لطفا نحوه پرداخت را مشخص کنید`
			})
		}
	
			else if (this.state.paySelected === '3') {
	
				// this.state.idPay ?
	
					Axios.post('/payment/idpay_token', {
						'ResNum': this.state.OrderData.ORDER_ID,
						// 'PayType': 'app',
						// 'RedirectType': 'payment',
						'Amount': this.state.OrderData.ORDER_VALUE_WITH_COURIER * 10,
						'Name': this.state.OrderData.CUSTOMER_NAME
						// 'TOTAL': this.state.OrderData.ORDER_VALUE_WITH_COURIER,
						// 'URID': this.state.customer
	
					}).then(async (response) => {
				   
	
						ToastAndroid.show('در حال انتقال به صفحه بانک', ToastAndroid.SHORT)
						Linking.openURL(response.data.link)
					}).catch(err => {
						Toast.show({
							type: 'danger',
							text: `خطا در ثبت سفارش کد( ${err.response.code})`
						})
						console.log(err.response)
					})
			}
            else if(this.state.paySelected=='6'){
				
					// Axios.post('/payment/pay', {
						Axios.post('/payment/zarinpalToken', {
							'ResNum': this.state.OrderData.ORDER_ID,
							'PayType': 'app',
							// 'RedirectType': 'payment',
							// 'amount': this.state.OrderData.ORDER_VALUE_WITH_COURIER * 10,
							// 'TOTAL': this.state.OrderData.ORDER_VALUE_WITH_COURIER,
							// 'URID': this.state.customer
		
		
						}).then(async (response) => {
						
							ToastAndroid.show('در حال انتقال به صفحه بانک', ToastAndroid.SHORT)
							Linking.openURL(response.data.url)
						}).catch(err => {
							Toast.show({
								type: 'danger',
								text: `خطا در ثبت سفارش کد( ${err.response.code})`
							})
							console.log(err.response)
						})
			}

			else if (this.state.paySelected === '2') {
	
				this.state.nameBank == 'نام بانک' || this.state.selectedStartDate == null ||
					this.state.idCheque == '' || this.state.nameAccount == '' || this.state.idSayad ? ToastAndroid.show('لطفا همه موارد را پر کنید', ToastAndroid.SHORT) :
					Axios.post('/payment/cheque', {
						'BANK': this.state.nameBank,
						'DATE': this.state.selectedStartDate,
						'NUMBER': this.state.idCheque,
						'ORDER_ID': this.state.OrderData.ORDER_ID,
						'OWNER': this.state.nameAccount,
						'SAYAD_ID': this.state.idSayad,
						'payment_type': 7
	
					}).then(response => {
						ToastAndroid.show('در حال پرداخت', ToastAndroid.SHORT)
						this.fetchLog()
						this.setState({ paySelected: 1 })
	
					}).catch(err => {
						Toast.show({
							type: 'danger',
							text: `خطا در ثبت سفارش کد( ${err.response.code})`
						})
						console.log(err.response)
					})
			}
	
			else if (this.state.paySelected === '11') {
				this.setState({loadButton:true})
				const cartNumber =this.state.cartNumber.replace(/\s/g, '')
				let formData = new FormData()
				this.state.cartNumber == '' || this.state.selectedStartDate == null || this.state.traceNo == '' || this.state.image ==null ?
					ToastAndroid.show('لطفا همه موارد را پر کنید', ToastAndroid.SHORT) :
					
							// formData.append('name' , 'AVATAR')
							formData.append('IMAGE', {
								  uri: this.state.response.assets[0].uri,
								//  uri: 'file://' + this.state.response.path,
								name: this.state.response.assets[0].fileName,
								type: this.state.response.assets[0].type
							})
							
							
							formData.append('CardMaskPan', cartNumber)
							formData.append('DATE', this.state.selectedStartDate.toString())
							formData.append('ORDER_ID', this.state.OrderData.ORDER_ID);
							formData.append('TraceNo', this.state.traceNo);
							formData.append('UR_ID', this.state.customer);
							formData.append('payment_type', 4);
							console.log(formData,'formData')
	
					Axios.post(`${config.ImageBaners}/api/payment/card_to_card`,formData).then(response => {
						
						ToastAndroid.show('در حال انتقال به صفحه بانک', ToastAndroid.SHORT)
						this.fetchLog()
						this.setState({ paySelected: 1 ,loadButton:false})
	
					}).catch(err => {
						Toast.show({
							type: 'danger',
							text: `خطا در ثبت سفارش کد( ${err})`
						})
						this.setState({ loadButton:false})
						console.log(err)
					})
			}

			else {
				Axios.post('/payment/cart', {
					'payment_type': this.state.paySelected,
					'payment_status': 1,
					'ORDER_ID': this.state.OrderData.ORDER_ID
				}).then(async (response) => {
				
					// store.cart[0]
					// store.cart_count = 0;
					// store.cart = {}
					
					// setTimeout(() => {
					// 	const resetAction = StackActions.reset({
					// 		index: 0,
					// 		actions: [NavigationActions.navigate({ routeName: 'LandingModule' })],
					// 	})
					// 	this.props.navigation.dispatch(resetAction)
					// }, 2000);
					Toast.show({
						type: 'success',
						text: 'پرداخت انجام شد '
					})
					
					await this.fetchLog()
					this.props.navigation.getParam('FetchData', () => { })()
	
				}).catch(err => {
					Toast.show({
						type: 'danger',
						text: `خطا در ثبت سفارش کد( ${err.response.code})`
					})
					console.log(err.response)
				})
			}



   
	}

	onDateChange=async(date)=> {	
	 const newDate= await date.toString()		
		 this.setState({ selectedStartDate: date, showCalendar: false })
	}


	openGallery= ()=>{

		const options = {
			mediaType: 'photo',
			includeBase64: true,
			maxHeight: 2000,
			maxWidth: 2000,
		  };
	  
		
		  launchImageLibrary(options, (response) => {
			if (response.didCancel) {
			  console.log('User cancelled image picker');
			} else if (response.error) {
			  console.log('Image picker error: ', response.error);
			} else {
				
				let imageUri = response.uri || response.assets?.[0]?.uri;
				// const source = { uri: response.uri };
				this.setState({
					response:response,
				  image: imageUri,
				});
			}

		})

	}

	handleCameraLaunch =async () => {
			const options = {
		  mediaType: 'photo',
		  includeBase64: true,
		saveToPhotos:true,
		 
		};
		const granted =await PermissionsAndroid.request(
			PermissionsAndroid.PERMISSIONS.CAMERA
		)
		if (granted ===PermissionsAndroid.RESULTS.GRANTED){
			const result=await launchCamera(options)
			this.setState({
						response:result,
						 image: result.assets[0].uri,
					})

		}
		// const options = {
		//   mediaType: 'photo',
		//   includeBase64: false,
		//   maxHeight: 2000,
		//   maxWidth: 2000,
		// };
	  
		// launchCamera(options, response => {
		//   if (response.didCancel) {
		// 	console.log('User cancelled camera');
		//   } else if (response.error) {
		// 	console.log('Camera Error: ', response.error);
		//   } else {
		// 	let imageUri = response.uri || response.assets?.[0]?.uri;
		// 	this.setState({
		// 		response:response,
		// 		  image: imageUri,
		// 	})
		// 	console.log(imageUri);
		//   }
		// });
	  }
	  _handlingCardNumber(number) {
  this.setState({
    cartNumber: number.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim()
  });
}


	render() {
		const {t} =this.props
		const { selectedStartDate } = this.state;
		const startDate = selectedStartDate ? selectedStartDate.format('jYYYY/jM/jD') : '';

         
		if (this.state.loading) return (
			<>
				<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >

				
					<TouchableWithoutFeedback
						onPress={() => this.props.navigation.goBack()}
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
					>
						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: StyleSheet.value('$MainColor') }} size={30} />
					</TouchableWithoutFeedback>
					<Text style={{ ...styles.TextBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} >{t('orders')} </Text>
				</View>
				<Spinner />
			</>
		)
		let status = this.state.OrderData.ORDER_STATUS_NAME

		// let activePay = false
		// store.orderType == 0 ? this.setState({ activePay: true }) : this.setState({ activePay: this.state.OrderData.ORDER_STATUS_ID == 10 })
		let activePay = this.state.OrderData.ORDER_STATUS_ID == 10
		const offer = this.state.OrderData.OFFER_COURIER_SUM + this.state.OrderData.OFFER_INVOICE_SUM + this.state.OrderData.OFFER_PRODUCT_SUM
		return (
			<View style={{ flex: 1, backgroundColor: 'rgb(242,242,242)' }}>
		
			
				<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
					<TouchableWithoutFeedback
						onPress={() => this.props.navigation.goBack()}
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
					>
						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: StyleSheet.value('$MainColor') }} size={30} />
					</TouchableWithoutFeedback>
					<Text style={{ ...styles.TextBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} >
						{/* {this.state.OrderData.STORE_NAME + ' (' + this.state.OrderData.ORDER_ID + ')'} */}
						{t('invoice-number') + ' (' + this.state.OrderData.ORDER_ID + ')'}
					</Text>
				</View>
				<ScrollView
					contentContainerStyle={{ paddingBottom: 60 }}
					refreshControl={
						<RefreshControl
							onRefresh={this.fetchLog}
							refreshing={this.state.loading}
						/>
					}
				>
					<View style={{ flexDirection: 'row-reverse', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, padding: 8 }}>
						<Text style={{ ...styles.TextBold, color: 'black', fontSize: 16 }} >{t('order-status')} </Text>
						<View style={{ backgroundColor: StyleSheet.value('$MainColor'), borderRadius: 15, padding: 8, alignItems: 'center', justifyContent: 'center' }}>
							<Text
								numberOfLines={1}
								style={{ fontFamily: StyleSheet.value('IRANYekanRegular'), color: 'white', fontWeight: StyleSheet.value('$WeightRegular'), fontSize: 11 }}>
								{status}
							</Text>
						</View>
					</View>

					{
						this.state.OrderData.ORDER_STATUS_ID && Details[this.state.OrderData.ORDER_STATUS_ID] &&
						<Text style={{ fontFamily: StyleSheet.value('IRANYekanRegular'), color: 'gray', fontWeight: StyleSheet.value('$WeightRegular'), fontSize: 11, textAlign: 'center' }}>
							{Details[this.state.OrderData.ORDER_STATUS_ID]}
						</Text>
					}

					<View style={{ paddingHorizontal: 10, height: 60, justifyContent: 'space-between', flexDirection: 'row-reverse', alignItems: 'center' }} >
						<Text style={{ ...styles.TextBold, color: 'black', fontSize: 16 }} >{t('detail-status')}</Text>
					</View>
					<View style={{ paddingHorizontal: 10, height: 60, justifyContent: 'space-between', flexDirection: 'row-reverse', alignItems: 'center' }} >
						<Text style={{ ...styles.TextBold, color: 'black', fontSize: 14 }}>
							{t('postag-date')}
							<Text style={{ fontFamily: StyleSheet.value('IRANYekanRegular'), color: 'gray', fontWeight: StyleSheet.value('$WeightRegular'), fontSize: 11, textAlign: 'center' }}>{this.state.OrderData.ORDER_DELIVERY_DATE} {this.state.OrderData.ORDER_DELIVERY_TIME} - {this.state.OrderData.ORDER_DELIVERY_TIME_2}</Text>
						</Text>
					</View>
					{this.state.OrderData.PAYMENTTYPE_NAME ? <View style={{ paddingHorizontal: 10, height: 60, justifyContent: 'space-between', flexDirection: 'row-reverse', alignItems: 'center' }} >
						<Text style={{ ...styles.TextBold, color: 'black', fontSize: 14 }}>
					{t('payment-type')}
							<Text style={{ fontFamily: StyleSheet.value('IRANYekanRegular'), color: 'gray', fontWeight: StyleSheet.value('$WeightRegular'), fontSize: 11, textAlign: 'center' }}>{this.state.OrderData.PAYMENTTYPE_NAME}</Text>
						</Text>
					</View> : null}




					<FlatList
						data={this.state.items}
						style={{ flexGrow: 0 }}
						renderItem={({ item, index }) =>
							<CartItem update_price={() => { }} deleted={item.deleted} deleteItem={(item) => {
								let deleteItems = this.state.deleteItems
								deleteItems.push(item.id)
								this.setState({ ...this.state, deleteItems })
								let products = this.state.items
								for (let sub of products) {
									if (sub.id === item.id) {
										sub.deleted = true
									}
								}
								this.setState({
									items: products
								})
							}} key={'cart_' + index.toString()} data={item} StatusID={this.state.OrderData.ORDER_STATUS_ID ? this.state.OrderData.ORDER_STATUS_ID : -1} />
						}
					/>
					{
						(activePay || store.orderType == 0) &&
						<View>
					
							<View style={{ paddingHorizontal: 10, height: 60, justifyContent: 'space-between', flexDirection: 'row-reverse', alignItems: 'center' }} >
								<Text style={{ ...styles.TextBold, color: 'black', fontSize: 16 }} > {t('payment-method')} </Text>
							</View>
							{
								this.state.payment.map((item, index) => {
									// if (item.id === '3') {
									// 	return (
									// 		<View key={item.id.toString()} style={{ flexDirection: 'row-reverse', alignItems: 'center', padding: 5, }} >
											
									// 			<TouchableWithoutFeedback
									// 				hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
									// 				onPress={() => this.state.wallet >= this.state.OrderData.ORDER_VALUE_WITH_COURIER ? this.setState({ paySelected: item.id }) : null}
									// 			>
									// 				<View style={{ width: 22, height: 25 }} >
									// 					{
									// 						this.state.paySelected === item.id ?
									// 							<View style={{ justifyContent: 'center', alignItems: 'center' }} >
									// 								<Material name='check-circle' size={20} color={StyleSheet.value('$MainColor')} />
									// 							</View> :
									// 							<Material name='check-circle' size={20} color='rgb(220,220,220)' />
									// 					}
									// 				</View>
									// 			</TouchableWithoutFeedback>
									// 			<Text style={[styles.TextRegular, { color: 'black', fontSize: 12, marginHorizontal: 10 }]} >{item.title} {this.state.wallet >= this.state.OrderData.ORDER_VALUE_WITH_COURIER ? null : '(اعتبار کافی نمی باشد.)'}</Text>

									// 		</View>
									// 	)
									// }

									// else if (item.id !== '3') {
										return (
											<View key={item.id} style={{ flexDirection: 'row-reverse', alignItems: 'center', padding: 5 }} >
													
												<TouchableWithoutFeedback
													hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
													onPress={() => item.enable ? this.setState({ paySelected: item.id }) : null}
												>
													<View style={{ width: 22, height: 25 }} >
														{
															this.state.paySelected === item.id ?
																<View style={{ justifyContent: 'center', alignItems: 'center' }} >
																	<Material name='check-circle' size={20} color={StyleSheet.value('$MainColor')} />
																</View> :
																<Material name='check-circle' size={20} color='rgb(220,220,220)' />
														}
													</View>
												</TouchableWithoutFeedback>
												<Text style={[styles.TextRegular, { color: 'black', fontSize: 12, marginHorizontal: 10 }]} >{item.title} {item.enable ? null : '(غیرفعال)'}</Text>

											</View>
										)
									// }

								})
							}
						</View>
					}


					{this.state.paySelected == '2' ?
						<View style={{ flex: 1, paddingHorizontal: 10, alignItems: 'center' }}>
							<View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
								<Text style={[styles.TextRegular, { color: 'black', fontSize: 14, marginHorizontal: 10 }]}>
									{`مشخصات چک`}
								</Text>
							</View>

							<TextInput
								value={this.state.idCheque}
								onChangeText={idCheque => this.setState({ idCheque })}
								placeholder='شماره چک' style={{ ...styles.TextRegular, color: 'black', width: '50%', alignSelf: 'center', marginVertical: 5, height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }} />

							<TouchableWithoutFeedback style={[styles.TextRegular, { width: '50%', alignSelf: 'center', marginVertical: 5, height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }]}
								onPress={() => { this.setState({ showCalendar: true }) }}
							>
								<View style={[styles.TextRegular, { width: '50%', justifyContent: 'center', marginVertical: 5, height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }]}>
									<Text style={[styles.TextRegular, { fontSize: 14, marginHorizontal: 5 }]}>

										{this.state.selectedStartDate == null ? 'زمان چک' : startDate}</Text>
								</View>

							</TouchableWithoutFeedback>
							{
								this.state.showCalendar ?
									<View style={{ backgroundColor: 'white' }}>

										<PersianCalendarPicker
											onDateChange={this.onDateChange}
											androidVariant={'nativeAndroid'}
											nextTitle={'  ماه بعد  '}
											previousTitle={'   ماه قبل   '}
											isRTL={false}
											textStyle={{ fontSize: 12 }}
										/>
									</View>
									: null
							}

							<TouchableWithoutFeedback style={[styles.TextRegular, { width: '50%', alignSelf: 'center', marginVertical: 10, height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }]}
								onPress={() => { this.setState({ showBanks: true }) }}
							>
								<View style={[styles.TextRegular, { alignItems: 'center', flexDirection: 'row-reverse', justifyContent: 'space-between', width: '50%', marginVertical: 5, height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }]}>
									<Text style={[styles.TextRegular, { fontSize: 14, marginHorizontal: 5 }]}>
										{this.state.nameBank}</Text>
									<Material name='arrow-drop-down' size={15} color='black' />
								</View>


							</TouchableWithoutFeedback>

							{this.state.showBanks ?
								nameBankData.map((data, index) => {
									return (
										<View style={{ flex: 1, paddingVertical: 10 }}>
											<TouchableWithoutFeedback onPress={() => { this.setState({ nameBank: data, showBanks: false }) }} style={{ flexDirection: 'row', }}>
												<View >
													<Text>
														{`${data}`}
													</Text>


												</View>

											</TouchableWithoutFeedback>

										</View>
									)
								})

								:
								null}

							<TextInput
								value={this.state.nameAccount}
								onChangeText={nameAccount => this.setState({ nameAccount })}
								placeholder='صاحب حساب' style={{ ...styles.TextRegular, color: 'black', width: '50%', alignSelf: 'center', marginTop: 10, height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }} />

							<TextInput
								value={this.state.idSayad}
								maxLength={16}
								onChangeText={idSayad => this.setState({ idSayad })}
								placeholder='شناسه صیاد' style={{ ...styles.TextRegular, color: 'black', width: '70%', alignSelf: 'center', marginTop: 10, height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }} />
						</View>

						:
						null
					}

					{this.state.paySelected == '11' ?
						<View style={{ flex: 1, paddingHorizontal: 10, alignItems: 'center' }}>
							<View style={{  marginTop: 10 }}>

							<View style={{ flex: 1, flexDirection: 'row-reverse', marginTop: 14 }}>
									<View style={{flex:1}}>
									<Text style={[styles.TextRegular, { fontSize: 12, marginHorizontal: 5, marginTop: 12 }]}>
										{`شماره کارت صاحب فروشگاه: `}
									</Text>

									<Text style={[styles.TextRegular, { fontSize: 12, marginHorizontal: 5, }]}>
										{`${this.state.cartName}`}
									</Text>
									</View>

									<TextInput
									editable={false}
										value={config.splitCardNumber(this.state.cartNumberStore)  }
										
										placeholder='' style={{ ...styles.TextRegular, color: 'black', width: '50%', alignSelf: 'center', height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }} />
								</View>

							<View style={{ flex: 1, flexDirection: 'row-reverse', marginTop: 14,justifyContent:'space-between' }}>
									<Text style={[styles.TextRegular, { fontSize: 12, marginHorizontal: 5, marginTop: 12 }]}>
										{`شماره کارت واریز کننده: `}
									</Text>

									<TextInput
									keyboardType={'phone-pad'}
									maxLength={19}
										value={this.state.cartNumber}
										onChangeText={cartNumber =>this._handlingCardNumber(cartNumber) }
										placeholder='شماره کارت' style={{ ...styles.TextRegular, color: 'black', width: '50%', alignSelf: 'center', height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }} />
								</View>
{/* 

								<View style={{ flex: 1, flexDirection: 'row-reverse', marginTop: 14 }}>
									<Text style={[styles.TextRegular, { fontSize: 12, marginHorizontal: 5, marginTop: 12 }]}>
										{`شماره کارت واریز کننده: `}
									</Text>

									<TextInput
										value={this.state.cartNumber}
										onChangeText={cartNumber => this.setState({ cartNumber })}
										placeholder='شماره کارت' style={{ ...styles.TextRegular, color: 'black', width: '50%', alignSelf: 'center', height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }} />
								</View>
{/* 
								<View style={{ flex: 1, flexDirection: 'row-reverse', marginTop: 14 }}>
									<Text style={[styles.TextRegular, { fontSize: 12, marginHorizontal: 5, marginTop: 12 }]}>
										{`نام صاحب کارت:    `}
									</Text>
									<TextInput
										value={this.state.cartName}
										onChangeText={cartName => this.setState({ cartName })}
										placeholder='نام صاحب کارت' style={{ ...styles.TextRegular, color: 'black', width: '50%', alignSelf: 'center', marginVertical: 5, height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }} />
								</View> */}


								<View style={{ flex: 1, flexDirection: 'row-reverse', marginTop: 14 ,justifyContent:'space-between'}}>
									<Text style={[styles.TextRegular, { fontSize: 12, marginHorizontal: 5, marginTop: 12 }]}>
										{`شماره پیگیری :`}
									</Text>
									<TextInput
										value={this.state.traceNo}
										onChangeText={traceNo => this.setState({ traceNo })}
										placeholder='123456' style={{ ...styles.TextRegular, color: 'black', width: '50%', alignSelf: 'center', marginVertical: 5, height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }} />

								</View>
								<View style={{ flex: 1, flexDirection: 'row-reverse', marginTop: 14 ,justifyContent:'space-between'}}>
									<Text style={[styles.TextRegular, { fontSize: 12, marginHorizontal: 5, marginTop: 12 }]}>
										{`انتخاب زمان :  `}
									</Text>
									<TouchableWithoutFeedback style={[styles.TextRegular, { width: '50%', alignSelf: 'center', marginVertical: 5, height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }]}
										onPress={() => { this.setState({ showCalendar: !this.state.showCalendar }) }}
									>
										<View style={[styles.TextRegular, { alignItems: 'center', flexDirection: 'row', width: '50%', justifyContent: 'space-around', marginVertical: 5, height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }]}>
											<Material name='arrow-drop-down' size={15} color='black' />
											<Text style={[styles.TextRegular, { fontSize: 14, marginHorizontal: 8 ,color:'black'}]}>
												{this.state.selectedStartDate == null ? 'زمان را انتخاب کنید ' : startDate}</Text>

										</View>

									</TouchableWithoutFeedback>
								</View>

								<View style={{ flex: 1,  flexDirection: 'row-reverse', marginTop: 14 ,justifyContent:'space-between'}}>
									<Text style={[styles.TextRegular, { fontSize: 12, marginHorizontal: 5, marginTop: 12 }]}>
										{`عکس فیش واریزی : `}
									</Text>
									<View style={{ flexDirection:'row' ,width:100,justifyContent:'space-between',alignItems:'center',
									marginVertical: 5, height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }}>
									{/* <View style={{flexDirection:'row',justifyContent:'space-between'}}> */}
									<TouchableWithoutFeedback onPress={ () => {this.openGallery() }}>
											<Material name="folder" size={25} />
									</TouchableWithoutFeedback>
									<TouchableWithoutFeedback onPress={ () => {this.handleCameraLaunch() }} style={{marginTop:10}} >
											<Material name="photo-camera" size={25} />
									</TouchableWithoutFeedback>
									{/* </View> */}
									</View>
								</View>
								<FastImage source={{ uri: this.state.image }} style={{marginTop:10, height: 90, width: 90, zIndex: -1 }} />

								{
									this.state.showCalendar ?
										<View style={{ backgroundColor: 'white' }}>

											<PersianCalendarPicker
												onDateChange={this.onDateChange}
												androidVariant={'nativeAndroid'}
												nextTitle={'  ماه بعد  '}
												previousTitle={'   ماه قبل   '}
												isRTL={false}
												textStyle={{ fontSize: 12 }}
											/>
										</View>
										: null
								}
							</View>
						</View>

						: null}



					{this.state.OrderData.ORDER_STATUS_ID != 4 &&
						<>
							<View style={{ paddingHorizontal: 10, height: 60, justifyContent: 'space-between', flexDirection: 'row-reverse', alignItems: 'center' }} >

								<Text style={{ ...styles.TextBold, color: 'black', fontSize: 16 }} >توضیحات</Text>
							</View>
							<TextInput
								value={this.state.comment}
								onChangeText={comment => this.setState({ comment })}
								placeholder='توضیحات خود را اینجا وارد کنید' style={{ ...styles.TextRegular, width: '90%', alignSelf: 'center', marginVertical: 5, height: 45, borderWidth: 1, borderColor: 'gray', borderRadius: 5 }} />

						</>}

					{
						this.state.OrderData.COURIER_NAME ?
							<>
								<View style={{ paddingHorizontal: 10, height: 60, justifyContent: 'space-between', flexDirection: 'row-reverse', alignItems: 'center' }} >
									<Text style={{ ...styles.TextBold, color: 'black', fontSize: 16 }} >اطلاعات راننده</Text>
								</View>

								<View style={{ flexDirection: 'row-reverse', flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: 'rgba(248,248,248,1)' }} >
									<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >نام راننده</Text>
									<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >
										{this.state.OrderData.COURIER_NAME}
									</Text>
								</View>
								<View style={{ flexDirection: 'row-reverse', flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: 'rgba(248,248,248,1)' }} >
									<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >شماره تلفن</Text>
									<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >
										{this.state.OrderData.COURIER_PHONE}
									</Text>
								</View>
								<View style={{ flexDirection: 'row-reverse', flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: 'rgba(248,248,248,1)' }} >
									<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >شماره پلاک</Text>
									<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >
										{this.state.OrderData.COURIER_PELAK}
									</Text>
								</View>
								<View style={{ flexDirection: 'row-reverse', flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: 'rgba(248,248,248,1)' }} >
									<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >تصویر</Text>
									<Image
										style={{

											backgroundColor: 'gray',
											height: 80,
											width: 80,
											borderRadius: 80
										}}
										source={{ uri: `${config.BaseUrl}/assets/img/couriers/${this.state.OrderData.COURIER_AVATAR}` }} />
								</View>
								{
									this.state.OrderData.COURIER_LOCATION_X ?
										<>
											<View style={{ paddingHorizontal: 10, height: 60, justifyContent: 'space-between', flexDirection: 'row-reverse', alignItems: 'center' }} >
												<Text style={{ ...styles.TextBold, color: 'black', fontSize: 16 }} >محل پیک</Text>
											</View>
											<View style={{ width: '90%', height: 160, alignSelf: 'center', borderWidth: 1, borderColor: 'gray' }} >
												<MapView
													cacheEnabled={true}
													pitchEnabled={false}
													rotateEnabled={false}
													scrollEnabled={false}
													zoomEnabled={false}
													showsCompass={false}
													style={{ flex: 1 }}
													initialCamera={{
														center: { latitude: this.state.OrderData.COURIER_LOCATION_X, longitude: this.state.OrderData.COURIER_LOCATION_Y },
														//center: { latitude: 36.326092, longitude: 59.4954196 },

														zoom: 15,
														pitch: 1,
														heading: 1
													}}
												>
													<Marker coordinate={{ latitude: this.state.OrderData.COURIER_LOCATION_X, longitude: this.state.OrderData.COURIER_LOCATION_Y }} >
														<View style={{ padding: 10 }}>
															<Material name='motorcycle' size={30} color='red' />
														</View>
													</Marker>
												</MapView>
											</View>
										</>
										: null

								}
							</> : null
					}
					<View style={{ paddingHorizontal: 10, height: 60, justifyContent: 'space-between', flexDirection: 'row-reverse', alignItems: 'center' }} >

						<Text style={{ ...styles.TextBold, color: 'black', fontSize: 16 }} >جزئیات هزینه</Text>
					</View>
					<View style={{ height: 120, width: '100%', backgroundColor: 'gray' }} >
						<View style={{ flexDirection: 'row-reverse', flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: 'rgba(248,248,248,1)' }} >
							<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >هزینه ارسال</Text>
							<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >
								{config.priceFix(this.state.OrderData.CORIER_VALUE)} تومان
							</Text>
						</View>
						<View style={{ flexDirection: 'row-reverse', flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: 'rgba(235,235,235,1)' }} >
							<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >مجموع سفارش بدون پیک</Text>
							<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >
								{config.priceFix(this.state.OrderData.ORDER_VALUE_WITHOUT_COURIER)} تومان
							</Text>
						</View>

						<View style={{ flexDirection: 'row-reverse', flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, backgroundColor: 'rgba(235,235,235,1)' }} >
							<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >مجموع سفارش </Text>
							<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >
								{config.priceFix(this.state.OrderData.ORDER_VALUE_WITH_COURIER)} تومان
							</Text>
						</View>
						{this.state.OrderData.OFFER_COURIER_SUM > 0 && <View style={{
							flexDirection: 'row-reverse', flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20,
							backgroundColor: 'rgba(248,248,248,1)'
						}} >
							<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >مجموع تخفیف ارسال</Text>
							<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >
								{config.priceFix(Math.abs(this.state.OrderData.OFFER_COURIER_SUM))} تومان
							</Text>
						</View>}
						{this.state.OrderData.OFFER_PRODUCT_SUM > 0 && <View style={{
							flexDirection: 'row-reverse', flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20,
							backgroundColor: 'rgba(248,248,248,1)'
						}} >
							<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >مجموع تخفیف کالا</Text>
							<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >
								{config.priceFix(Math.abs(this.state.OrderData.OFFER_PRODUCT_SUM))} تومان
							</Text>
						</View>}
						{this.state.OrderData.OFFER_INVOICE_SUM > 0 && <View style={{
							flexDirection: 'row-reverse', flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20,
							backgroundColor: 'rgba(248,248,248,1)'
						}} >
							<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >مجموع تخفیف کد</Text>
							<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >
								{config.priceFix(Math.abs(this.state.OrderData.OFFER_INVOICE_SUM))} تومان
							</Text>
						</View>}
						<View style={{
							flexDirection: 'row-reverse', flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20,
							backgroundColor: 'rgba(248,248,248,1)'
						}} >
							<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >مجموع تخفیف</Text>
							<Text style={[styles.TextRegular, { color: 'gray', fontSize: 14 }]} >
								{config.priceFix(Math.abs(offer))} تومان
							</Text>
						</View>
						<View style={{
							flexDirection: 'row-reverse', flex: 1, alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20,
							backgroundColor: 'rgba(235,235,235,0.85)'
						}} >
							<Text style={[styles.TextBold, { color: 'black', fontSize: 14 }]} >هزینه پرداختی</Text>
							<Text style={[styles.TextBold, { color: 'black', fontSize: 14 }]} >
								{config.priceFix(this.state.OrderData.ORDER_VALUE_WITH_COURIER)} تومان
							</Text>
							
						</View>
					</View>

				</ScrollView>
				{
					this.state.OrderData.CONFIRM_BY_CUSTOMER == 0 && this.state.OrderData.DELETED == 0 &&
					<TouchableWithoutFeedback
						onPress={this.confirmOrder}
					>
						<View style={{ ...styles.button, position: 'absolute', alignSelf: 'center', bottom: 20, width: 170, justifyContent: 'center' }} >
							<Material name='shopping-cart' color='white' size={20} style={{ marginLeft: 10, position: 'absolute', left: 0 }} />
							<Text style={[styles.TextBold, { color: 'white', textAlign: 'center' }]} >تایید سفارش</Text>
						</View>
					</TouchableWithoutFeedback>
				}
				{
					this.state.deleteItems.length > 0 &&
					<TouchableWithoutFeedback
						onPress={() => this.deleteItems()}
					>
						<View style={{ ...styles.button, position: 'absolute', alignSelf: 'center', bottom: 20, width: 170, justifyContent: 'center' }} >
							<Material name='shopping-cart' color='white' size={20} style={{ marginLeft: 10, position: 'absolute', left: 0 }} />
							<Text
								style={{
									color: '#fff8fd',
									position: 'absolute',
									top: 1,
									right: 1,
									margin: -1,
									minWidth: 13,
									height: 13,
									borderRadius: 7,
									alignItems: 'center',
									justifyContent: 'center',
									backgroundColor: '#FF0000',
									textAlign: 'center',
									fontSize: 9
								}}>{this.state.deleteItems.length}</Text>
							<Text style={[styles.TextBold, { color: 'white', textAlign: 'center' }]} >اعمال تغییرات</Text>
						</View>
					</TouchableWithoutFeedback>
				}
				{
					this.state.OrderData.ORDER_STATUS_NAME == 'پرداخت شده توسط مشتری' || this.state.OrderData.ORDER_STATUS_NAME == 'در انتظار تایید ادمین' ?
						null
						:
						(activePay || store.orderType == 0) &&
						<TouchableWithoutFeedback
							onPress={this.PayOrder}
						>
							{
								this.state.loadButton ?
								<ActivityIndicator size={'small'} color={'green'}/>
								: 
								<View style={{ ...styles.button, position: 'absolute', alignSelf: 'center', bottom: 20, width: 170, justifyContent: 'center' }} >
								<Material name='shopping-cart' color='white' size={20} style={{ marginLeft: 10, position: 'absolute', left: 0 }} />
								<Text style={[styles.TextBold, { color: 'white', textAlign: 'center' }]} >پرداخت</Text>
							</View>

							}
							
						</TouchableWithoutFeedback>
				}
			</View >
		)
	}
}

export default  withNavigation(withTranslation()(VeramalOrders)) 


const styles = StyleSheet.create({
	// container: {
	// 	flex: 1,
	// 	backgroundColor: '$BackgroundColor'
	// },
	TextBold: {
		fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold'
	},
	TextRegular: {
		fontFamily: '$IRANYekanRegular',
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
