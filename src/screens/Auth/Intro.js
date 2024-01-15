import React, { Component } from 'react'
import { Text, View, Image, StyleSheet, AsyncStorage } from 'react-native'
import AppIntroSlider from 'react-native-app-intro-slider'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

import { s1, s2, s3, slider1, slider2, slider3 } from "../../assest/svg";
import Axios from "axios";
import DeviceInfo from "react-native-device-info";
import { config } from '../../App'

const slides = [
	{
		key: 's5',
		title: 'ورامال',
		text: 'یه خرید باحال!',
		class: 'image1',
		width: '300',
		height: '360',
		image: s1,
		backgroundColor: '#22bcb5',
	},
	{
		key: 's1',
		title: 'ارسال سریع!',
		text: 'پوشش دهی تمام نقاط شهر',
		class: 'image2',
		width: '300',
		height: '360',
		image: s2,
		backgroundColor: '#59b2ab',
	},
	{
		key: 's2',
		title: 'پرداخت آسان!',
		text: 'حضوری، آنلاین',
		class: 'image3',
		width: '300',
		height: '360',
		image: s3,
		backgroundColor: '#febe29',
	},
	// {
	// 	key: 's3',
	// 	title: 'پرداخت آسان!',
	// 	text: 'حضوری، آنلاین',
	// 	image: require('../../assest/intro/payment.png'),
	// 	backgroundColor: '#22bcb5',
	// },
	// {
	// 	key: 's4',
	// 	title: 'پشتیبانی آنلاین!',
	// 	image: require('../../assest/intro/saport_t.png'),
	// 	backgroundColor: '#22bcb5',
	// },

]

const SlideItem = ({ item }) => (
	// <View style={styles.slide}>
	//     <Text style={styles.title}>{item.title}</Text>
	//     <Text style={styles.text}>{item.text}</Text>
	//     <Image style={styles.image} source={item.image}/>
	// </View>
	<View>
		<View style={styles1.center}>
			<Text style={styles1.title}>{item.title}</Text>
			<Text style={styles1.des}>{item.text}</Text>

			{/*<View style={styles.image1}>*/}
			{/*    <SvgUri width={'600'} height={'360'} source={require('../assets/splasher/slider1.svg')}/>*/}
			{/*</View>*/}

			<View style={styles1[item.class]}>
				{/* <SvgUri width={item.width} height={item.height} svgXmlData={item.image} /> */}
			</View>

			{/*<View style={styles.image3}>*/}
			{/*    <SvgUri width={'600'} height={'360'} source={require('../assets/splasher/slider3.svg')}/>*/}
			{/*</View>*/}
		</View>

	</View>
)


export class IntroPage extends Component {
	_onDone = () => {
		AsyncStorage.setItem('seenIntro', 'true')
		let username = '0' + new Date().getTime()
		let guest = { "NAME": "کاربر میهمان", "USER_NAME": username, "PASSWORD": "123456", "OTP": 0, "NATIONAL_CODE": "" }
		Axios.post(config.BaseUrl + '/api/users/guest', guest).then(({ data }) => {
			if (data.ID) {
				Axios.post('auth/local', {
					USER_NAME: guest.USER_NAME,
					PASSWORD: guest.PASSWORD,
					VERSION: DeviceInfo.getBuildNumber(),
					VERSION_TYPE: "1"
				}).then(res => {
					let response = res.data;
					AsyncStorage.setItem('profile', JSON.stringify(response))
					AsyncStorage.setItem('token', response.TOKEN.toString())
					AsyncStorage.setItem('isGuest', '1')
					Axios.defaults.headers = {
						Authorization: 'Bearer ' + response.TOKEN.toString()
					}
					this.props.navigation.navigate('LandingPage')
				})
			} else {
				this.props.navigation.navigate('LandingPage')
			}

		})
	}

	render() {
		return (
			<AppIntroSlider
				renderItem={SlideItem}
				slides={slides}
				onDone={() => this._onDone()}
				nextLabel=''
				activeDotStyle={{
					backgroundColor: '#59b2ab',
				}}
				renderDoneButton={() => <Text style={{
					fontFamily: 'IRANYekanRegular',
					color: '#c4c4c4',
					fontSize: 20,
					textAlign: 'left',
					width: wp('90%')
				}}>پایان</Text>}
			/>
		)
	}
}


const styles = StyleSheet.create({
	// mainContent: {
	// 	flex: 1,
	// 	alignItems: 'center',
	// 	justifyContent: 'space-around',
	// },
	image: {
		width: 320,
		height: 320,
		// backgroundColor:'red',
		justifyContent: 'center',
		alignSelf: 'center',
		resizeMode: 'contain'
	},
	slide: {
		flex: 1,
		backgroundColor: '#64a25a',
		justifyContent: 'center'
	},
	text: {
		color: 'rgba(255, 255, 255, 0.8)',
		backgroundColor: 'transparent',
		fontFamily: 'IRANYekanRegular',
		fontSize: 22,
		textAlign: 'center',
		paddingHorizontal: 16,

	},
	title: {
		fontSize: 32,
		fontFamily: 'IRANYekanBold',
		color: 'white',
		backgroundColor: 'transparent',
		textAlign: 'center',
		marginBottom: 16,
	},
})
const styles1 = StyleSheet.create({
	wrap: {
		backgroundColor: 'white',
		fontFamily: 'IRANYekanRegular',
		width: wp('100%'),
		height: hp('100%'),
	},
	buttonCircle: {
		width: 40,
		height: 40,
		fontFamily: 'IRANYekanRegular',
		backgroundColor: 'rgba(0, 0, 0, .2)',
		borderRadius: 20,
		justifyContent: 'center',
		alignItems: 'center',
	},
	title: {
		color: '#43b02a',
		fontFamily: 'IRANYekanRegular',
		fontSize: hp('7%')
	},
	center: {
		flexDirection: 'column',
		alignItems: 'center',
		fontFamily: 'IRANYekanRegular',
		paddingTop: hp('5%')
	},
	des: {
		color: '#53b63e',
		fontSize: hp('4.5%'),
		fontFamily: 'IRANYekanRegular',
		marginTop: hp('3%')
	},
	image1: {
		marginTop: hp('10%'),
		width: wp('100%'),
		// justifyContent:'flex-start',
		alignItems: 'center',
	},
	image2: {
		// width:wp('100%'),
		marginTop: hp('10%'),

		justifyContent: 'center',
		alignItems: 'center',
		paddingBottom: hp('5%')
	},
	image3: {
		marginTop: hp('10%'),
		width: wp('100%'),
		// justifyContent:'flex-start',
		alignItems: 'center',
	}
});
