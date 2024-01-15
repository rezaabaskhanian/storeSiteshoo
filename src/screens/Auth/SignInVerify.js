import React, { Component } from 'react'
import {
	Text,
	View,
	TextInput,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	Platform,
	Dimensions,
	AsyncStorage
} from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'

import FastImage from 'react-native-fast-image'
import StyleSheet from 'react-native-extended-stylesheet'
import Material from 'react-native-vector-icons/MaterialIcons'
import { Button, Appbar } from 'react-native-paper'
import Axios from 'axios'
import { Toast } from 'native-base'
import Counter from '../../component/Counter'
const { width } = Dimensions.get('window')
import { withTranslation } from 'react-i18next';
 class App extends Component {
	state = {
		USER_NAME: this.props.navigation.getParam('USER_NAME', '0'),
		PASSWORD: this.props.navigation.getParam('PASSWORD', '0'),
		userId: this.props.navigation.getParam('userId', 0),
		OTP: '',
		disabledSendAgain:true
	};
	_onSend = () => {
		Axios.put('users/verify', {
			OTP: this.state.OTP,
			USER_NAME: this.state.USER_NAME,
			USER_ID:this.state.userId
		}).then( async (response) => {
			//
			// this.props.navigation.pop(2)

			let {data} = await Axios.post('auth/local', {
				USER_NAME: this.state.USER_NAME,
				PASSWORD: this.state.PASSWORD
			})
			// console.warn(data.ROLE)
			if(data.ROLE_ID === 1 ){
				AsyncStorage.setItem('profile' , JSON.stringify(data))
				AsyncStorage.setItem('token', data.TOKEN.toString())
				Axios.defaults.headers = {
					Authorization: 'Bearer ' + data.TOKEN.toString()
				}
				// const resetAction = StackActions.reset({
				// 	index: 0,
				// 	key: null,
				// 	actions: [NavigationActions.navigate({ routeName: 'Tab' })]
				// })
				// this.props.navigation.dispatch(resetAction)
				// this.props.navigation.navigate('Landing');
				const resetAction = StackActions.reset({
					index: 0,
					key:null,
					actions: [NavigationActions.navigate({ routeName: 'Landing' })],
				})
				this.props.navigation.dispatch(resetAction)
				Toast.show({
					text: 'You have successfully entered!',
					type: 'success',
					position: 'top'
				})
			}else{
				Toast.show({
					text: `Your number with title${data.ROLE} Available in the system!`,
					type: 'warning'
				})
			}

		}).catch((error) => {
			console.warn(error)
			Toast.show({
				text: 'There was a problem checking the code.',
				type: 'danger'
			})
		})
	};

	_onCodeRequest = () => {
		Axios.get(`users/otp/${this.state.USER_NAME}`).then( async (response) => {
				if(response){
					this.setState({
						disabledSendAgain:true
					})
					Toast.show({
						text: `درخواست مجدد کد با موفقیت ثبت شد`,
						type: 'success'
					})
				}




		}).catch((error) => {
			console.warn(error)
			Toast.show({
				text: 'There was a problem checking the code.',
				type: 'danger'
			})
		})
	};
	render() {
		const {t}=this.props
		return (
			<View style={styles.container}>
				<FastImage
					source={require('../../assest/login_img.png')}
					resizeMode="cover"
					style={{ width, height: 130 }}
				/>

				<View
					style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
				>
					<FastImage
						source={require('../../assest/logo.png')}
						resizeMode="contain"
						style={{ width: 200, height: 100 }}
					/>
				</View>
				<KeyboardAvoidingView
					behavior="padding"
					enabled={Platform.OS == 'android' ? false : true}
					style={{ width: '100%' }}
				>
					<View style={{ alignItems: 'center', padding: 20 }}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
								width: '85%',
								borderRadius: 17,
								borderWidth: 0.5,
								height: 40,
								borderColor: 'gray'
							}}
						>
							<TextInput
								keyboardType="number-pad"
								value={this.state.OTP}
								onChangeText={OTP => this.setState({ OTP })}
								placeholder={t('code')}
								style={{
									...styles.TextLight,
									flex: 1,
									paddingHorizontal: 10,
									textAlign: 'right'
								}}
							/>
						</View>
						{this.state.disabledSendAgain?<Counter counterGone={()=>this.setState({disabledSendAgain:false})} />:null}
						{!this.state.disabledSendAgain?<TouchableWithoutFeedback onPress = {this._onCodeRequest}>
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
										{t('resend-code')}
									</Text>
								</View>
							</TouchableWithoutFeedback>
							:null}

						<TouchableWithoutFeedback onPress = {this._onSend}>
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
									{t('send')}
								</Text>
							</View>
						</TouchableWithoutFeedback>

					</View>
				</KeyboardAvoidingView>
			</View>
		)
	}
}
export default withTranslation()(App);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'center',
		backgroundColor: '$BackgroundColor'
	},
	Text: {
		// fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold',
		//color: 'white',
		textAlign: 'center'
	},
	TextBold: {
		// fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold'
	},
	TextLight: {
		// fontFamily: '$IRANYekanLight',
		fontWeight: '$WeightLight'
	},
	TextRegular: {
		// fontFamily: '$IRANYekanRegular',
		fontWeight: '$WeightRegular'
	},
	TextInput: {
		// fontFamily: '$IRANYekanLight',
		fontWeight: '$WeightLight',
		height: 50,
		textAlign: 'right'
	},
	button: {
		borderRadius: 17,
		width: '50%',
		height: 40,
		backgroundColor: '$MainColor',
		marginTop: 10,
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center'
	}
})
