/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 * @lint-ignore-every XPLATJSCOPYRIGHT1
 */

import React from 'react'
import {
	FlatList,
	Linking,
	Text,
	View,
	Dimensions,
	TouchableWithoutFeedback,
	AsyncStorage,
	ActivityIndicator,
	Clipboard,
	TouchableOpacity,
	TextInput, Platform, KeyboardAvoidingView
} from 'react-native'

import Material from 'react-native-vector-icons/MaterialIcons'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import FastImage from 'react-native-fast-image'
import StyleSheet from 'react-native-extended-stylesheet'

const { width } = Dimensions.get('window')

const LORM ='دوستان و آشنایان خود را به سامانه دعوت کنید و تخفیف بگیرید!\n' +
	'این کاربران می توانند از کد معرفی شما به عنوان کد تخفیف اولین خرید خود استفاده کنند\n' +
	'با اتمام اولین سفارش کاربر مورد نظر، یک کد تخفیف برای شما ارسال خواهد شد'
const LORM1 = 'لطفا شماره تلفن همراه مورد نظر را برای ارسال پیامک کد تخفیف خرید اول را وارد کنید.'
const PICTURE = 'https://picsum.photos/250/100/?random'
import { Appbar, TouchableRipple } from 'react-native-paper'
import Axios from 'axios'
import { Toast } from 'native-base'


export default class App extends React.Component {

	state = {
		data: '',
		phoneNumber: '',
		comments: [],
		bookmark: false,
		loading: true,
		lazy: false

	}


	async componentDidMount() {
		this.setState({ loading: false })

		Axios.get('/users/getReferralCode').then( ({data})=>{
			this.setState({
				data:data.REFERRAL_CODE
			});
			console.warn(data)
		}).catch(err=>{
			console.warn(err.response)
		})
	}

	_onSend = async () => {
		try {
			this.setState({ lazy: true });
			if (this.state.phoneNumber&&this.state.data) {
				let data={"REFERRAL_CODE":this.state.data,"SEND_USER":this.state.phoneNumber}
				Axios.put('users/sendReferralCode', data).then(res=>{
					if(res){
						Toast.show({
							text: `پیامک معرفی با موقیت ارسال شد`,
							type: 'success'
						})
						this.setState({ lazy: false,phoneNumber:'' });

					}else{
						Toast.show({
							text: `خطا در ارسال پیامک معرفی`,
							type: 'warning'
						})
						this.setState({ lazy: false,phoneNumber:'' });

					}
				})
			} else {
				Toast.show({
					text: `شماره موبایل را به درستی وارد نکرده اید.`,
					type: 'warning'
				})
				this.setState({ lazy: false,phoneNumber:'' });

			}
		} catch (error) {
			console.warn(error.response)
			error.response ?
				Toast.show({
					text: error.response.data.message,
					type: 'danger',
					buttonText: 'تایید',
					buttonStyle: {
						borderColor: 'white',
						borderWidth: 1,
						margin: 5,
						borderRadius: 7
					}
				}) :
				Toast.show({
					text: 'خطا در برقراری ارتباط، لطفا ارتباط خود را بررسی کنید!',
					type: 'danger',
					buttonText: 'تایید',
					buttonStyle: {
						borderColor: 'white',
						borderWidth: 1,
						margin: 5,
						borderRadius: 7
					}
				})
			this.setState({ lazy: false })
		}
	};


	render() {
		if (this.state.loading) {
			return (
				<View style={styles.container}>
					<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
						<TouchableWithoutFeedback
							onPress={() => this.props.navigation.goBack()}
							hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
						>
							<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: StyleSheet.value('$MainColor') }} size={30} />
						</TouchableWithoutFeedback>
						<Text style={{ ...styles.textBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} >معرفی به دوستان</Text>
					</View>
					<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }} >
						<ActivityIndicator />
					</View>
				</View>
			)
		}

		return (
			<View style={styles.container}>

				<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
					<TouchableWithoutFeedback
						onPress={() => this.props.navigation.goBack()}
						hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
					>
						<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: StyleSheet.value('$MainColor') }} size={30} />
					</TouchableWithoutFeedback>
					<Text style={{ ...styles.textBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} >معرفی به دوستان</Text>
				</View>
				<KeyboardAvoidingView
					behavior="padding"
					enabled={Platform.OS == 'android' ? false : true}
					style={{ width: '100%', justifyContent: 'center', flex: 1 }}
				>
				<View style={{ width: '100%', padding: 20 }} >
					<Text style={[styles.textLight, { padding: 10, color: 'black', fontSize: 12 }]} >{LORM}</Text>
				</View>
				<View style={{ alignItems: 'center', padding: 5 }} >
					<Text style={{ ...styles.textLight, margin: 5 }} >کد معرف</Text>
					<TouchableOpacity
						onPress={ ()=>{
							Toast.show({
								text: 'کد معرف شما با موفقیت کپی شد!',
								position:'top'
							})
							Clipboard.setString(this.state.data)
						}}
						style={{ width: 150, justifyContent: 'center', alignItems: 'center', height: 40, borderWidth: 0.5, borderColor: 'gray' }} >
						<Text style={{ margin: 5 }} >{this.state.data}</Text>

					</TouchableOpacity>
				</View>
				<View style={{ width: '100%', padding: 20 }} >
					<Text style={[styles.textLight, { padding: 10, color: 'black', fontSize: 12 }]} >{LORM1}</Text>
				</View>
				<View style={{ alignItems: 'center', padding: 5 }} >
					<View
						style={{
							flexDirection: 'row-reverse',
							alignItems: 'center',
							width: '85%',
							borderRadius: 17,
							borderWidth: 0.5,
							height: 40,
							borderColor: 'gray'
						}}
					>
						<Material
							name="call"
							size={16}
							style={{ marginLeft: 10, color: 'gray' }}
						/>
						<TextInput
							keyboardType="number-pad"
							value={this.state.phoneNumber}
							onChangeText={phoneNumber => this.setState({ phoneNumber })}
							placeholder="شماره تماس"
							style={{
								...styles.TextLight,
								flex: 1,
								paddingHorizontal: 10,
								textAlign: 'right'
							}}
						/>
					</View>

				</View>
				<View style={{ alignItems: 'center', padding: 5 }}>
					<TouchableWithoutFeedback
						disabled={this.state.lazy}
						onPress={this._onSend}
					>
						{this.state.lazy ? (
							<ActivityIndicator style={{ margin: 10 }} />
						) : (
							<View style={styles.button}>
								<Material
									name="exit-to-app"
									color="white"
									size={20}
									style={{ marginLeft: 10, position: 'absolute', left: 0 }}
								/>
								<Text
									style={[
										styles.TextBold,
										{ color: 'white', textAlign: 'center' }
									]}
								>
									ارسال
								</Text>
							</View>
						)}
					</TouchableWithoutFeedback>
				</View>
				</KeyboardAvoidingView>
			</View>
		)
	}

}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '$BackgroundColor'
	},
	header: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		height: 70,
		paddingTop: 22
	},
	headerTitle: {
		fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold',
		color: '$MainColor',
		textAlign: 'center',
		fontSize: 26,
	},
	textBold: {

		fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold',
	},
	textRegular: {

		fontFamily: 'IRANYekanRegular',
		fontWeight: '$WeightRegular',
	},
	textLight: {

		fontFamily: '$IRANYekanLight',
		fontWeight: '$WeightLight',
	},


	itemTitle: {
		fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold',
		textAlign: 'center',
		fontSize: 25,
		color: 'black'
	},
	buttons: {
		flexDirection: 'row',
		backgroundColor: 'white',
		height: 60,
		width: '70%',
		borderRadius: 50,
		marginBottom: 20,
		justifyContent: 'space-between',
		alignItems: 'center',
		elevation: 4,
		overflow: 'hidden'
	},
	button: {
		borderRadius: 17,
		width: '50%',
		height: 40,
		backgroundColor: '$MainColor',
		marginTop: 10,
		flexDirection: 'row-reverse',
		alignItems: 'center',
		justifyContent: 'center'
	}
})
