// import React from 'react'
// import { ImageBackground, Text, View, Modal, TouchableWithoutFeedback, Image, ScrollView } from 'react-native'
//
// import Material from 'react-native-vector-icons/MaterialIcons'
// import { Icon, Item, Input, Button } from 'native-base'
// import Entypo from 'react-native-vector-icons/Entypo'
// import StyleSheet from 'react-native-extended-stylesheet'
//
//
// const data = [
// 	// {
// 	// 	header: 'مراحل ثبت سفارش در ورامال :',
// 	// 	image: require('../../../assest/delivery.png'),
// 	// 	text: 'اولین مرحله برای ثبت سفارش در ورامال ورود به اپلیکیشن مشتری می باشد. اگر نام کاربری ایجاد نکرده اید می توانید ثبت نام کنید و کاربر جدیدی در سامانه ما باشید. سپس با انتخاب دسته فروشگاهی موردنظر می توانید همه فروشگاه ها و یا نزدیک ترین فروشگاه به خود را بیابید. حالا در اینجا می توانید کالا های مورد نظر خود راانتخاب کنید و به سبدخرید اضافه کنید. در سبد خرید می توانید تمامی محصولاتی که سفارش داده شده اند را ببینید. بعد از تایید شدن سبد خرید، میتوانید یک یا همه فاکتورها را برای تامین کننده های همان فروشگاه ارسال و تایید نهایی کنید. در صفحه فاکتور آدرس و زمان ارسال را معیین نمایید. در بخش پروفایل، و سفارش های من می توانید سفارش هایی که تا کنون ثبت شده را ببینید. نکته مهم این است که هر فاکتور بعد از تایید مشتری باید تایید تامین کننده را هم به دنبال داشته باشد. لذا اگر تامین کننده تغییری در فاکتور شما ایجاد نماید (تغییر در تعداد یا اصل سفارش)، در بخش مدیریت سفارش ها میتوانید تغییر حاصله را مساهده نمایید. در صورتی که مورد تایید شما بود، مجددا به تامین کننده ارسال نمایید. در مرحله بعد باید نوع پرداخت سفارش را انتخاب نموده و پس از آن ارسال سفارش در زمان معین انجام خواهد گرفت. '
// 	// },
// 	// {
// 	// 	header: 'عضویت سریع در ورامال',
// 	// 	image: require('../../../assest/delivery.png'),
// 	// 	text:'عضویت نام 1 -   وارد صفحه نخست ورامال شده و ثبت نام را انتخاب کنید 2 -   فیلد های مورد نیاز را پر کنید 3 -   سپس کد تاییدی که به شماره همراه تان ارسال شد را وارد و تایید کنید ورود به ورامال اگر پیش تر در ورامال ثبت نام کرده اید، می توانید با استفاده از گزینه زیر و با وارد کردن نام کاربری یا شماره موبایل خود به همراه رمز عبور وارد سامانه شوید '
// 	// },
// 	{
// 		header: 'نحوه ارسال محصول توسط ورامال',
// 		image: require('../../../assest/delivery.png'),
// 		text: 'نحوه ارسال محصول شما : بعد از ثبت سفارش نهایی شما در صورتی که درگاه بانکی یا نقدی را انتخاب نمایید هزینه پیک از شما کسر خواهد شد و طبق روز و ساعتی که انتخاب میکنید محصول به آن آدرس نهایی که ثبت کرده اید ارسال خواهد شد.'
// 	},
// 	{
// 		header: 'چگونه آدرس جدیدی تعریف کنم ؟',
// 		image: require('../../../assest/delivery.png'),
// 		text: 'بعد از ثبت نام وارد پروفایل خود شوید. در سمت راست شما یک لیست نمایش داده می شود . در لیستی که مشاهده میکنیدآدرس های من را انتخاب کنید و اگر آدرسی ثبت کرده باشید در لیست قابل مشاهده می باشد . ولی اگر تاکنون آدرسی ثبت نکرده اید ثبت آدرس جدید را بزنید و مشخصات مربوطه را کامل کنید . جالب است بدانید شما می توانید چند آدرس داشته باشیدو هر آدرسی که انتخاب کنید سفارش شما به همان آدرس فرستاده خواهد شد . دقت کنید که آدرس پیش فرض شما اولین آدرس که ثبت میکنید می باشد.'
// 	},
// 	{
// 		header: 'چرا تامیین کننده باید محصول را تایید کند ؟',
// 		image: require('../../../assest/delivery.png'),
// 		text: 'زمانی که شما سفارشی را ثبت میکنید نیاز هست که سفارش شما توسط فروشگاه تایید شود و بعد می توانید سفارش خود را در حساب کاربری و سفارش های من مشاهده کنید . اینکار صرفا برای این است که آن محصول توسط فروشگاه موجود باشد و یا مشکلی نداشته باشد . اگر فروشگاه مورد نظر شما مشکلی برای ارسال محصول نداشت تایید می کند و محصول ارسال خواهد شد.'
// 	},
// ]
//
// export default class ReturnOf extends React.Component {
// 	state = {
// 		searchText: '',
// 		showModal1: false,
// 		showModal2: false
// 	}
// 	renderModal1 = () => {
// 		let close = () => this.setState({showModal1: false})
// 		let data = [
// 			'اولین مرحله برای ثبت سفارش در ورامال ورود به اپلیکیشن مشتری می باشد.',
// 			'اگر نام کاربری ایجاد نکرده اید می توانید ثبت نام کنید و کاربر جدیدی در سامانه ما باشید.',
// 			'سپس با انتخاب دسته فروشگاهی موردنظر می توانید همه فروشگاه ها و یا نزدیک ترین فروشگاه به خود را بیابید.',
// 			'حالا در اینجا می توانید کالا های مورد نظر خود راانتخاب کنید و به سبدخرید اضافه کنید.',
// 			'در سبد خرید می توانید تمامی محصولاتی که سفارش داده شده اند را ببینید.',
// 			'بعد از تایید شدن سبد خرید، میتوانید یک یا همه فاکتورها را برای تامین کننده های همان فروشگاه ارسال و تایید نهایی کنید.',
// 			'در صفحه فاکتور آدرس و زمان ارسال را معیین نمایید.',
// 			'در بخش پروفایل، و سفارش های من می توانید سفارش هایی که تا کنون ثبت شده را ببینید.',
// 			'نکته مهم این است که هر فاکتور بعد از تایید مشتری باید تایید تامین کننده را هم به دنبال داشته باشد. لذا اگر تامین کننده تغییری در فاکتور شما ایجاد نماید (تغییر در تعداد یا اصل سفارش)، در بخش مدیریت سفارش ها میتوانید تغییر حاصله را مساهده نمایید. در صورتی که مورد تایید شما بود، مجددا به تامین کننده ارسال نمایید',
// 			'در مرحله بعد باید نوع پرداخت سفارش را انتخاب نموده و پس از آن ارسال سفارش در زمان معین انجام خواهد گرفت.',
// 		]
// 		return(
// 			<Modal
// 				onRequestClose={close}
// 				onDismiss={close}
// 				visible={this.state.showModal1}
// 			>
// 				<ScrollView style={styles.container}>
// 					<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
// 						<Text style={{ ...styles.textBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} >مراحل ثبت سفارش در ورامال</Text>
// 						<TouchableWithoutFeedback
// 							onPress={() => close() }
// 							hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
// 						>
// 							<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: '#43B02A' }} size={30} />
// 						</TouchableWithoutFeedback>
// 					</View>
// 					{
// 						data.map((value, index) => (
// 							<View style={{ flexDirection: 'row-reverse', alignItems: 'center' }} key={index}>
// 								<Entypo name='dot-single' size={20} color={'#43B02A'} />
// 								<Text style={[styles.textRegular, {flex: 1}]} numberOfLines = {5}>{value}</Text>
// 							</View>
// 						))
// 					}
// 				</ScrollView>
// 			</Modal>
// 		)
// 	}
// 	renderModal2 = () => {
// 		let close = () => this.setState({showModal2: false})
// 		let data = [
// 			'1 -   وارد صفحه نخست ورامال شده و ثبت نام را انتخاب کنید',
// 			'2 -   فیلد های مورد نیاز را پر کنید',
// 			'3 -   سپس کد تاییدی که به شماره همراه تان ارسال شد را وارد و تایید کنید',
// 		]
// 		return(
// 			<Modal
// 				onRequestClose={close}
// 				onDismiss={close}
// 				visible={this.state.showModal2}
// 			>
// 				<ScrollView style={styles.container}>
// 					<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
// 						<Text style={{ ...styles.textBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} >عضویت سریع در ورامال</Text>
// 						<TouchableWithoutFeedback
// 							onPress={() => close()}
// 							hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
// 						>
// 							<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: '#43B02A' }} size={30} />
// 						</TouchableWithoutFeedback>
// 					</View>
// 					{
// 						data.map((value, index) => (
// 							<View style={{ flexDirection: 'row-reverse', alignItems: 'center' }} key={index}>
// 								<Entypo name='dot-single' size={20} color={'#43B02A'} />
// 								<Text style={[styles.textRegular, {flex: 1}]} numberOfLines = {5}>{value}</Text>
// 							</View>
// 						))
// 					}
// 				</ScrollView>
// 			</Modal>
// 		)
// 	}
// 	render() {
// 		return (
// 			<ScrollView style={styles.container}>
// 				<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
// 					<Text style={{ ...styles.textBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} >راهنما</Text>
// 					<TouchableWithoutFeedback
// 						onPress={() => this.props.navigation.goBack()}
// 						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
// 					>
// 						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: '#43B02A' }} size={30} />
// 					</TouchableWithoutFeedback>
// 				</View>
// 				<ImageBackground
// 					source = {require('../../../assest/IMG-bg_help.jpg')}
// 					style = {{width: '100%', height: 200, paddingTop: 32}}
// 				>
// 					<View style = {{flexDirection: 'row-reverse', alignSelf: 'center', justifyContent: 'center', alignItems: 'center'}}>
// 						<Icon name = 'md-cart' type = 'Ionicons' style = {{fontSize: 25, color: 'white'}}/>
// 						<Text style = {[styles.textBold, {color: 'white'}]}>ورامال</Text>
// 					</View>
// 					<Text style = {[styles.textRegular, {color: 'white', alignSelf: 'center'}]}>چطور از ورامال استفاده کنیم؟</Text>
// 					<Item bordered regular style = {{width: '80%', elevation: 4, backgroundColor: 'white', margin: 8, borderRadius: 4, alignSelf: 'center'}}>
// 						<TouchableWithoutFeedback
//
// 						>
// 							<Icon name = 'search' style = {{fontSize: 18}}/>
// 						</TouchableWithoutFeedback>
// 						<Input
// 							onChangeText = {(searchText) => this.setState({searchText})}
// 							value = {this.state.searchText}
// 							placeholder = 'جستجوی راهنما'
// 							style = {styles.textRegular}
// 						/>
// 					</Item>
// 				</ImageBackground>
//
// 				<View style = {{width: '100%', backgroundColor: 'white', padding: 8}}>
// 					<Text style = {[styles.textBold, {color: 'gray', textAlign: 'center'}]}>در چه مورد راهنمایی لازم دارید؟</Text>
// 				</View>
//
// 				<View style = {{width: '100%', flexDirection: 'row-reverse', padding: 8}}>
// 					<TouchableWithoutFeedback onPress = {() => this.setState({showModal2: true})}>
// 						<View style={styles.cardBtns}>
// 							<Image
// 								source = {require('../../../assest/problem_express.png')}
// 								style = {{width: 60, height: 60}}
// 							/>
// 							<Text style = {[styles.textBold, {color: 'green', fontSize: 12, flex: 1, textAlign: 'center'}]} numberOfLines = {2}>عضویت سریع</Text>
// 						</View>
// 					</TouchableWithoutFeedback>
// 					<TouchableWithoutFeedback onPress = {() => this.setState({showModal1: true})}>
// 						<View style={styles.cardBtns}>
// 							<Image
// 								source = {require('../../../assest/problem-orders.png')}
// 								style = {{width: 60, height: 60}}
// 							/>
// 							<Text style = {[styles.textBold, {color: 'green', fontSize: 12, flex: 1, textAlign: 'center'}]} numberOfLines = {2}>ثبت سفارش در ورامال</Text>
// 						</View>
// 					</TouchableWithoutFeedback>
// 				</View>
//
// 				<View style = {{width: '100%', backgroundColor: 'white', padding: 8}}>
// 					<Text style = {[styles.textBold, {color: 'gray', textAlign: 'center'}]}>می خواهید بیشتر بدانید؟</Text>
// 				</View>
//
// 				{
// 					data.map((value, index) => <Items item = {value} key = {index}/>)
// 				}
//
// 				<View style = {{width: '100%', backgroundColor: 'white', padding: 8, marginTop: 8}}>
// 					<Text style = {[styles.textBold, {color: 'gray', textAlign: 'center'}]}>
// 					اگر سوالی دارید می توانید توسط یکی از راه های ارتباطی با ما در تماس باشید
// 					</Text>
// 					<Button bordered onPress = {() => this.props.navigation.replace('ContactUs')} style = {{width: '70%', alignSelf: 'center', justifyContent: 'center', marginTop: 8}}>
// 						<Text style = {[styles.textBold, {color: 'green'}]}>تماس با ما</Text>
// 					</Button>
// 				</View>
// 				{this.renderModal1()}
// 				{this.renderModal2()}
// 			</ScrollView>
// 		)
// 	}
//
// }
//
// class Items extends React.Component{
// 	state = {
// 		expanded: false
// 	}
// 	render(){
// 		const {
// 			item
// 		} = this.props
//
// 		return(
// 			<View style={{
// 				flexDirection:'column',
// 				margin: 5 ,
// 				borderRadius: 5 ,
// 				backgroundColor: 'white',
// 				elevation: 4,
// 				padding: 16
// 			}}>
// 				<View style = {{flexDirection: 'row-reverse', alignItems: 'center'}}>
// 					<Image
// 						source = {item.image}
// 						style = {{width: 50, height: 50}}
// 					/>
// 					<Text style={{...styles.textRegular, flex:1 , color : '#50c189' }}>
// 						{item.header}
// 					</Text>
//
// 					<TouchableWithoutFeedback
// 						style={{
// 							padding:10,
// 							backgroundColor: '#f2fcf9',
// 						}}
// 						onPress={ ()=> {this.setState({expanded : !this.state.expanded})}}
// 					>
// 						<Icon
// 							type='Entypo'
// 							name={this.state.expanded ? 'chevron-up' : 'chevron-down'}
// 							style={{
// 								color : '#50c189'
// 							}}
// 						/>
// 					</TouchableWithoutFeedback>
// 				</View>
// 				{
// 					this.state.expanded &&
// 					<View style = {{padding: 8}}>
// 						<Text style = {styles.textRegular}>{item.text}</Text>
// 					</View>
// 				}
// 			</View>
// 		)
// 	}
// }
//
// const styles = StyleSheet.create({
// 	container: {
// 		flex: 1,
// 		backgroundColor: '#eee'
// 	},
// 	textBold: {
// 		fontFamily: '$IRANYekanBold',
// 		fontWeight: '$WeightBold',
// 		color: 'black'
// 		// fontWeight: 'bold',
// 	},
// 	textRegular: {
// 		fontFamily: '$IRANYekanRegular',
// 		fontWeight: '$WeightRegular'
// 	},
// 	cardBtns: {
// 		width: '45%',
// 		height: 70,
// 		margin: 8,
// 		flexDirection: 'row-reverse',
// 		borderRadius: 4,
// 		elevation: 4,
// 		backgroundColor: 'white',
// 		alignItems: 'center',
// 		justifyContent: 'center'
// 	}
//
// })
import React from 'react'
import { ScrollView, Text, View, Dimensions, TouchableWithoutFeedback, Image, ActivityIndicator } from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import Material from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import { state as store } from "react-beep";
import axios from "axios";
import { config } from "../../../App";

const { width } = Dimensions.get('window')

const topImage = require('../../../assest/super_market01.jpg')
import { withTranslation } from 'react-i18next';

class ReturnOf extends React.Component {
	state = {
		image: ''
	}
	componentDidMount() {
		axios.get(`landing/get_image_slider/${store.storeId}/2`).then(({ data }) => {
			this.setState({ image: data[0].IMAGE })
		})
	}

	render() {
		const {t} =this.props
		return (
			<View style={styles.container}>
				<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
					<Text style={{ ...styles.textBold, color: 'black', fontSize: 18, alignSelf: 'center', textAlign: 'center', position: 'absolute' }} > {t('guide')}</Text>
					<TouchableWithoutFeedback
						onPress={() => this.props.navigation.goBack()}
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
					>
						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: StyleSheet.value('$MainColor') }} size={30} />
					</TouchableWithoutFeedback>
				</View>
				<ScrollView>
					<Image source={{ uri: config.SettingBaseUrlPanel + this.state.image }} style={{ height: 290, width: '100%', resizeMode: 'cover' }} />
					<View style={{ padding: 15, textAlign: 'center' }}>
						<Text style={[styles.textRegular, { marginTop: 4, textAlign: 'center' }]}>{store.setting.GUIDE}</Text>
					</View>
				</ScrollView>
			</View>
		)
	}

}
export default withTranslation()(ReturnOf)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eee'
	},
	textBold: {
		fontFamily: '$IRANYekanBold',
		fontSize: 15,
		marginTop: 10,
		color: 'black',
		fontWeight: '$WeightBold',
	},
	textRegular: {
		flex: 1,
		fontFamily: '$IRANYekanRegular',
		fontWeight: '$WeightRegular',
		marginTop: 8
	},

})
