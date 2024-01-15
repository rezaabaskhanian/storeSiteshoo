// import React from 'react'
// import { FlatList, Text, View, Dimensions, TouchableWithoutFeedback, Platform, ActivityIndicator } from 'react-native'
//
// import Material from 'react-native-vector-icons/MaterialIcons'
// import StyleSheet from 'react-native-extended-stylesheet'
//
// const { width } = Dimensions.get('window')
//
//
// const data = [
// 	'در صورتیکه کالای ارسال شده با سفارش شما مغایرت دارد، تاریخ انقضای آن گذشته است و یا مهلت مصرف آن کوتاه است، می‌توانید آن را نهایتا تا 24 ساعت مرجوع کنید. در صورتیکه گزینه "پرداخت در محل" را انتخاب کرده باشید، میتوانید از پرداخت صورتحساب خودداری کنید و اگر پرداخت را به صورت آنلاین انجام دادید با ارسال کد سفارش به سامانه خدمات مشتریان، با شما تماس گرفته می‌شود و پیگیری از این طریق انجام می‌شود.',
// 	'در صورتیکه کالای ارسال شده با سفارش شما مغایرت دارد، تاریخ انقضای آن گذشته است و یا مهلت مصرف آن کوتاه است، می‌توانید آن را نهایتا تا 24 ساعت مرجوع کنید. در صورتیکه گزینه "پرداخت در محل" را انتخاب کرده باشید، میتوانید از پرداخت صورتحساب خودداری کنید و اگر پرداخت را به صورت آنلاین انجام دادید با ارسال کد سفارش به سامانه خدمات مشتریان، با شما تماس گرفته می‌شود و پیگیری از این طریق انجام می‌شود.',
// 	'در صورتی که دلیل مرجوعی انتخاب مشتری باشد هزینه حمل مرجوعی بر عهده مشتری می باشد.',
// 	'تمامی کالاهای آرایشی و بهداشتی (مراقبت پوست و مو) به دلیل ماهیت بهداشتی خود، قابلیت مرجوعی ندارند. لذا قبل از خرید حتما توضیحات محصول را مطالعه نموده و یا جهت راهنمایی با پشتیبانی تماس حاصل نمایید.',
// 	'در خصوص سفارشاتی که مربوط به سلامت کالاها، ناقص بودن سفارش، عدم تطابق کالاهای دریافتی با اقلام سفارش گذاری شده، سپری شدن تاریخ انقضا و یا مخدوش بودن بسته بندی اقلام سفارش باید در هنگام تحویل گرفتن کالا چک شود و سپس کد تحویل به مامور ارسال کالا تحویل داده شود. در صورت وجود هر گونه ایراد و یا اشکالی با واحد پشتیبانی ورامال تماس حاصل نمایید.',
// ]
//
// export default class ReturnOf extends React.Component {
//
// 	render() {
// 		return (
// 			<View style={styles.container}>
// 				<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
// 					<Text style={{ ...styles.textBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} >شرایط مرجوعی کالا</Text>
// 					<TouchableWithoutFeedback
// 						onPress={() => this.props.navigation.goBack()}
// 						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
// 					>
// 						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: '#43B02A' }} size={30} />
// 					</TouchableWithoutFeedback>
// 				</View>
// 				<FlatList
// 					data={data}
// 					renderItem={({ item, index }) => (
// 						<View style={{ flex: 1, padding: 10 }}>
// 							<Text style={styles.textRegular}>
// 								{index + 1 + '. ' + item}
// 							</Text>
// 						</View>
// 					)}
// 				/>
// 			</View>
// 		)
// 	}
//
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
// 		fontSize: 15,
// 		marginTop: 10,
// 		color: 'black'
// 		// fontWeight: 'bold',
// 	},
// 	textRegular: {
// 		fontFamily: '$IRANYekanRegular',
// 		fontWeight: '$WeightRegular'
// 	},
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
import { withTranslation } from 'react-i18next';
const { width } = Dimensions.get('window')

const topImage = require('../../../assest/super_market01.jpg')

 class ReturnOf extends React.Component {
	state = {
		image: ''
	}
	componentDidMount() {
		axios.get(`landing/get_image_slider/${store.storeId}/5`).then(({ data }) => {
			console.warn(data[0].IMAGE)
			this.setState({ image: `${config.SettingBaseUrlPanel}${data[0].IMAGE}` })
			console.warn(this.state.image)
		})
	}
	render() {
		const {t} =this.props
		return (
			<View style={styles.container}>
				<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
					<Text style={{ ...styles.textBold, color: 'black', fontSize: 18, alignSelf: 'center', textAlign: 'center', position: 'absolute' }} >{t('product-return-conditions')}</Text>
					<TouchableWithoutFeedback
						onPress={() => this.props.navigation.goBack()}
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
					>
						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: StyleSheet.value('$MainColor') }} size={30} />
					</TouchableWithoutFeedback>
				</View>
				<ScrollView>
					<Image source={{ uri: this.state.image }} style={{ height: 290, width: '100%', resizeMode: 'contain' }} />
					<View style={{ padding: 15, textAlign: 'center' }}>
						<Text style={[styles.textRegular, { marginTop: 4, textAlign: 'center' }]}>{store.setting.RETURN_OF_GOOD}</Text>
					</View>
				</ScrollView>
			</View>
		)
	}

}
export default  withTranslation()(ReturnOf)

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

