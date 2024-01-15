// /**
//  * Sample React Native App
//  * https://github.com/facebook/react-native
//  *
//  * @format
//  * @flow
//  * @lint-ignore-every XPLATJSCOPYRIGHT1
//  */
//
// import React from 'react'
// import { FlatList, Linking, Text, View, Dimensions, TouchableWithoutFeedback, Platform, ActivityIndicator } from 'react-native'
//
// import Material from 'react-native-vector-icons/MaterialIcons'
// import FontAwesome from 'react-native-vector-icons/FontAwesome'
// import FastImage from 'react-native-fast-image'
// import StyleSheet from 'react-native-extended-stylesheet'
// import { Content } from 'native-base'
//
//
// const { width } = Dimensions.get('window')
//
//
// const data = [
//
// 	{
// 		title : 'رعایت حریم شخصی ',
// 		text : '  ورامال برای حریم شخصی‌ افراد احترام قائل است. بدین منظور اطلاعاتی‌ که از کاربران برای ثبت نام دریافت میشود به هیچ عنوان در اختیار شخص یا سازمانی قرار نخواهد گرفت و کاملا محرمانه است. مسئولیت حفظ و نگهداری رمز عبور به عهده کاربر می‌باشد، لذا از در اختیار گذاشتن رمز عبور خود به افراد دیگر خودداری کنید.'
// 	},
// 	{
// 		title : 'همکاری با تامین کننده ها',
// 		text : ' ورامال هم اکنون هیچ فروشگاهی ندارد. اساس کار ورامال بر این است که با فروشگاه های حقیقی وارد قرارداد میشود و سپس محصولات آنها را با نام همان فروشگاه در فضای مجازی (سامانه و اپلیکیشن ورامال) میفروشد. لذا از تامین کننده های محترم دعوت میشود با مراجعه به لینک ثبت نام در سایت ورامال و یا ارتباط با پشتیبانی نسبت به ثبت نام در این سامانه اقدام نمایند. '	},
// 	{
// 		title : 'عودت کالا',
// 		text : '  در صورتیکه کالای ارسال شده با سفارش شما مغایرت دارد، تاریخ انقضای آن گذشته است و یا مهلت مصرف آن کوتاه است، می‌توانید یک یا همه اجناس سبد خرید را مرجوع کنید. در صورتیکه گزینه "پرداخت نقدی" را انتخاب کرده باشید، میتوانید از پرداخت صورتحساب خودداری کنید و اگر پرداخت را به صورت آنلاین انجام داده باشید پیگیری از این طریق انجام می‌شود.'
// 	},
// 	{
// 		title : 'ارتباطات',
// 		text : ' هرگونه اطلاعاتی که در هنگام ثبت نام از جمله شماره‌ی تماس و پست الکترونیکی در اختیار ما در ورامال قرار می‌دهید، تنها اطلاعات رسمی و مورد تایید مشتری و هم‌چنین راه‌های ارتباطی ما و شما، جهت پاسخگویی و ارائه‌ی اطلاعیه‎‌ها به شما عزیزان خواهد بود. در صورت داشتن هرگونه سوال درباره حقوق کاربران میتوانید با شماره تلفن و یا پست الکترونیک ارتباط برقرار کنید.'
// 	}
//
// ]
//
// export default class App extends React.Component {
//
// 	render() {
// 		return (
// 			<View style={styles.container}>
// 				<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
// 					<TouchableWithoutFeedback
// 						onPress={() => this.props.navigation.goBack()}
// 						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
// 					>
// 						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: StyleSheet.value('$MainColor') }} size={30} />
// 					</TouchableWithoutFeedback>
// 					<Text style={{ ...styles.textBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} >قوانین و مقررات</Text>
// 				</View>
// 				<FlatList
// 					data={data}
// 					renderItem={({item , index})=>(
// 						<View style={{ flex : 1 , padding:10}}>
// 							<Text style={{...styles.textRegular , color : '#ff8c00' , fontSize :20}} >
// 								{index+1 + '. ' + item.title}
// 							</Text>
// 							<Text style={styles.textRegular}>
// 								{item.text}
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
// 		backgroundColor: '$BackgroundColor'
// 	},
// 	textBold: {
//
// 		fontFamily: '$IRANYekanBold',
// 		fontWeight: '$WeightBold',
// 	},
// 	textRegular: {
// 		fontFamily: 'IRANYekanRegular',
// 		fontWeight: '$WeightRegular',
// 	},
// 	textLight: {
//
// 		fontFamily: '$IRANYekanLight',
// 		fontWeight: '$WeightLight',
// 	},
//
// })
import React from 'react'
import { ScrollView, Text, View, Dimensions, TouchableWithoutFeedback, Image, ActivityIndicator } from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import Material from 'react-native-vector-icons/MaterialIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import {state as store} from "react-beep";

const { width } = Dimensions.get('window')

const topImage = require('../../../assest/super_market01.jpg')
import { withTranslation } from 'react-i18next';
 class App extends React.Component {

	render() {
		const {t} =this.props
		return (
			<View style={styles.container}>
				<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
					<Text style={{ ...styles.textBold, color: 'black', fontSize: 18, alignSelf: 'center', textAlign: 'center', position: 'absolute' }} >{t('rules')}</Text>
					<TouchableWithoutFeedback
						onPress={() => this.props.navigation.goBack()}
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
					>
						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: StyleSheet.value('$MainColor') }} size={30} />
					</TouchableWithoutFeedback>
				</View>
				<ScrollView>
					{/*<Image source={topImage} style={{height:290,width:'100%', resizeMode:'cover'}}/>*/}
					<View style={{padding:15,textAlign:'center'}}>
						<Text style={[styles.textRegular, { marginTop: 4,textAlign:'center' }]}>{store.setting.RULES}</Text>
					</View>
				</ScrollView>
			</View>
		)
	}

}
export default withTranslation()(App) 
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
		fontFamily: 'IRANYekanRegular',
		fontWeight: '$WeightRegular',
		marginTop: 8
	},

})

