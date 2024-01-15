import React, { Component } from 'react'
import { View, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, TextInput,AsyncStorage } from 'react-native'

import { Text, Content, Input, Form, Button, Item, Label, Spinner, Toast, Icon } from 'native-base'
import Axios from 'axios'
import StyleSheet from 'react-native-extended-stylesheet'
import FastImage from 'react-native-fast-image'
import Counter from '../../component/Counter'
import { NavigationActions, StackActions } from "react-navigation";
import { state as store } from "react-beep";
import { config } from "../../App";
import { withTranslation } from 'react-i18next';
 class Forgotpassword extends Component {
	constructor(props) {
        super(props);
	this.state = {
		step: 1,
		pin: '',
		disabledSendAgain: true,
		phone: '',
		userId: 0,
		password: '',
		repeatpassword: '',
		loading: false
	}
}

	_onSend() {
		this.setState({ loading: true })
		Axios.get(`/users/otp/${this.state.phone}`).then(({ data }) => {
			Toast.show({
				text: 'کد ارسالی با موفقیت ارسال شد!'
			})
			console.warn(data)
			this.setState({ loading: false, step: 2, userId: data.ID })
		}).catch((err) => {
			console.log(err)
			this.setState({ loading: false })
			Toast.show({
				text: 'خطای سرور'
			})
		})
	}
	_SetCode() {
		Axios.put('/users/verify/', { 'USER_NAME': this.state.phone, 'OTP': this.state.otp }).then((data) => {
			Toast.show({
				text: 'The validation code has been successfully verified, please enter a new password.',
				type: 'success'
			})
			this.setState({ step: this.state.step + 1 })
		}).catch(err => {
			console.log(err)
		})
	}
	

	loginWithPassword = async () => {
		const { navigation } = this.props;
		console.log(navigation.state.params.pushId,navigation.state.params.deviceId,
			this.enNumbers(this.state.password),this.state.phone,'pushId')
        try {
            // this.setState({ loading: true })
            let { data } = await Axios.post('auth/local', {
                USER_NAME: this.state.phone,
                PASSWORD: this.enNumbers(this.state.password),
                PUSH_ID: navigation.state.params.pushId,
                VERSION: navigation.state.params.deviceId ,
                VERSION_TYPE: "1"
            })
			console.log(data,'ddd')
             
			
            if (data.ROLE_ID === 1) {

                if (navigation.state.params?.isGuest) {
                    ///
                    AsyncStorage.setItem('PhoneNumber', this.state.phoneNumber)
                    ///
                    let guest = await AsyncStorage.getItem('profile')
                    guest = JSON.parse(guest);
                    Axios.defaults.headers = {
                        Authorization: 'Bearer ' + data.TOKEN.toString()
                    }
                    console.log('guest.USER_ROLE_ID:', guest.USER_ROLE_ID, 'data.USER_ROLE_ID:', data.USER_ROLE_ID)
                    await Axios.put('order/CustomerOrder', { UR_ID: guest.USER_ROLE_ID, CUSTOMER_ID: data.USER_ROLE_ID })
                    await Axios.put('order/CustomerAddress', {
                        UR_ID: guest.USER_ROLE_ID,
                        CUSTOMER_ID: data.USER_ROLE_ID
                    })
                    await AsyncStorage.setItem('profile', JSON.stringify(data))
                    await AsyncStorage.setItem('token', data.TOKEN.toString())
                    await AsyncStorage.setItem('isGuest', '0')

                    // this.props.navigation.navigate('Home');
                    const resetAction = StackActions.reset({
                        index: 0,
                        key:null,
                        actions: [NavigationActions.navigate({ routeName: 'Tab' })],
                    })
                    this.props.navigation.dispatch(resetAction)
                    this.updateCartCount()
                    Toast.show({
                        text: 'شما با موفقیت وارد شدید!',
                        type: 'success',
                        position: 'top'
                    })
                } else {
                    ////
                    AsyncStorage.setItem('PhoneNumber', this.state.phoneNumber)

                    ////
                    AsyncStorage.setItem('profile', JSON.stringify(data))
                    AsyncStorage.setItem('token', data.TOKEN.toString())
                    AsyncStorage.setItem('isGuest', '0')
                    Axios.defaults.headers = {
                        Authorization: 'Bearer ' + data.TOKEN.toString()
                    }
                    const resetAction = StackActions.reset({
                        index: 0,
                        actions: [NavigationActions.navigate({ routeName: 'Landing' })],
                    })
                    this.props.navigation.dispatch(resetAction)
                    this.updateCartCount()
                    Toast.show({
                        text: 'شما با موفقیت وارد شدید!',
                        type: 'success',
                        position: 'top'
                    })
                }

            } else {
                Toast.show({
                    text: `شماره شما با عنوان ${data.ROLE} در سیستم موجود است!`,
                    type: 'warning'
                })
            }
            this.setState({ err: '', loading: false })
        } catch (error) {
            console.warn(error.response , 'erorr taeid')
            error.response ?
                Toast.show({
                    text: error.response.data.message,
                    type: 'danger',
                    buttonText: 'Ok',
                    buttonStyle: {
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 7
                    }
                }) :
                Toast.show({
                    text: 'خطا در اتصال، لطفاً اتصال خود را بررسی کنید!',
                    type: 'danger',
                    buttonText: 'Ok',
                    buttonStyle: {
                        borderColor: 'white',
                        borderWidth: 1,
                        margin: 5,
                        borderRadius: 7
                    }
                })
            this.setState({ loading: false })
        }
    };

	enNumbers(value) {
        var persianNumbers = {
            '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
            '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
            // in case you type with arabic keyboard:
            '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
            '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
        };

        return value.split("").reduce(function (result, char) {
            if (char in persianNumbers) {
                return result + persianNumbers[char]
            }
            return result + char;
        }, "");
    }

	async updateCartCount() {
        let note = await Axios.get('order/notes')

        let finalCountNote = 0
        for (let item of note.data) {
            for (let sub of item.order_products) {
                if (sub.product_store.product.PRODUCT_UNIT_ID === 1) {
                    finalCountNote += 1;
                } else {
                    finalCountNote += sub.COUNT;
                }
            }
        }
        store.note_count = finalCountNote;


        let cart = await Axios.get('order/cart')
        let finalCount = 0
        for (let item of cart.data) {
            for (let sub of item.order_products) {
                if (sub.product_store.product.PRODUCT_UNIT_ID === 1) {
                    finalCount += 1;
                } else {
                    finalCount += sub.COUNT;
                }
            }
        }
        store.cart_count = finalCount;
    }
	_SetPassword() {
		this.setState({
			loading: true
		})
		if (this.state.password.length < 4) {
			Toast.show({
				text: 'رمز انتخابی کمتر از کارکتر است ',
				type: 'warning',
			})
		}
		if ((this.state.password === this.state.repeatpassword)) {
			
			Axios.put('/users/resetPassword',
			 { 'USER_NAME': this.state.phone, 'OTP': this.state.otp, 'PASSWORD': this.state.password, 'USER_ID': this.state.userId }).then(({ data }) => {
				Toast.show({
					text: 'پسورد با موفقیت تغییر کرد!',
					type: 'success'
				})
			
			this.loginWithPassword()

				// this.setState({ loading: false })
				// // this.props.navigation.navigate('Tab')
				// const resetAction = StackActions.reset({
				// 	index: 0,
				// 	actions: [NavigationActions.navigate({routeName: 'Tab'})],
				// })
				// this.props.navigation.dispatch(resetAction)
			}).catch(err => {
				console.log(err, err.response)
				Toast.show({
					text: err.response.data.message
				})
				this.setState({ loading: false })
			})
		 }
		else {
			this.setState({ loading: false })
			Toast.show({
				text: 'The password and its repetition do not match!',
				type: 'warning',
			})
		}
	}
	render() {
		const { t } = this.props
		return (
			<View style={styles.container}>
				<View
					style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
				>
					<View style={{ alignItems: 'center', marginBottom: 10 }}>
						<FastImage
							source={store.setting ? { uri: config.BaseUrl + '/assets/img/settings/' + store.setting.LOGO } : require('../../assest/logo.png')}
							// source={require('../../assest/logo.png')}
							resizeMode="contain"
							style={{ width: 200, height: 100 }}
						/>
						<Text style={[styles.TextLight]}>
							{store.setting.NAME}
						</Text>
					</View>
					{
						this.state.step === 1 ?
							<View
								style={{ alignItems: 'center', justifyContent: 'center' }}
							>
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
									<Icon
										type='MaterialIcons'
										name='call'
										size={16}
										style={{ marginLeft: 10, color: 'gray' }}
									/>
									<TextInput
										keyboardType="number-pad"
										value={this.state.phone}
										onChangeText={phone => this.setState({ phone })}
										placeholder="شماره تلفن"
										style={{
											...styles.TextLight,
											flex: 1,
											paddingHorizontal: 10,
											textAlign: 'right'
										}}
									/>
								</View>



								<TouchableWithoutFeedback
									disabled={this.state.loading}
									onPress={() => this._onSend()}
								>
									{this.state.loading ? (
										<Spinner />
									) : (
										<View style={styles.button}>
											<Icon
												type='MaterialIcons'
												name="exit-to-app"

												size={20}
												style={{ color: '#fff', marginLeft: 10, position: 'absolute', left: 0 }}
											/>
											<Text
												style={[
													styles.TextBold,
													{ color: 'white', textAlign: 'center', fontSize: 12 }
												]}
											>
												
                                        ارسال کد تایید            
											</Text>
										</View>
									)}
								</TouchableWithoutFeedback>


							</View> :

							<View
								style={{ alignItems: 'center', justifyContent: 'center' }}
							>
								<View
									style={{
										margin: 10,
										flexDirection: 'row-reverse',
										alignItems: 'center',
										width: '85%',
										borderRadius: 17,
										borderWidth: 0.5,
										height: 40,
										borderColor: 'gray'
									}}
								>
									<Icon
										type='MaterialIcons'
										name='lock'
										size={16}
										style={{ marginLeft: 10, color: 'gray' }}
									/>
									<TextInput
										keyboardType="number-pad"
										value={this.state.otp}
										onChangeText={otp => this.setState({ otp })}
										placeholder="Verification code"
										style={{
											...styles.TextLight,
											flex: 1,
											paddingHorizontal: 10,
											textAlign: 'right'
										}}
									/>
								</View>
								<View
									style={{
										margin: 10,

										flexDirection: 'row-reverse',
										alignItems: 'center',
										width: '85%',
										borderRadius: 17,
										borderWidth: 0.5,
										height: 40,
										borderColor: 'gray'
									}}
								>
									<Icon
										type='MaterialIcons'
										name='lock'
										size={16}
										style={{ marginLeft: 10, color: 'gray' }}
									/>
									<TextInput
										secureTextEntry
										keyboardType="default"
										value={this.state.password}
										onChangeText={password => this.setState({ password })}
										placeholder="Password"
										style={{
											...styles.TextLight,
											flex: 1,
											paddingHorizontal: 10,
											textAlign: 'right'
										}}
									/>
								</View>

								<View
									style={{
										margin: 10,
										flexDirection: 'row-reverse',
										alignItems: 'center',
										width: '85%',
										borderRadius: 17,
										borderWidth: 0.5,
										height: 40,
										borderColor: 'gray'
									}}
								>
									<Icon
										type='MaterialIcons'
										name='lock'
										size={16}
										style={{ marginLeft: 10, color: 'gray' }}
									/>
									<TextInput
										secureTextEntry
										keyboardType="default"
										value={this.state.repeatpassword}
										onChangeText={repeatpassword => this.setState({ repeatpassword })}
										placeholder="Repeat password"
										style={{
											...styles.TextLight,
											flex: 1,
											paddingHorizontal: 10,
											textAlign: 'right'
										}}
									/>
								</View>

								<View>
									<Text style={{ ...styles.TextLight, fontSize: 12 }}>رمز انتخابی باید حداقل ۴ کاراکتر باشد   .</Text>
								</View>
								{this.state.disabledSendAgain ? <Counter counterGone={() => this.setState({ disabledSendAgain: false })} /> : null}

								{!this.state.disabledSendAgain ? <TouchableWithoutFeedback
									disabled={this.state.loading}
									onPress={() => this._onSend()}
								>
									{this.state.loading ? (
										<Spinner />
									) : (
										<View style={styles.button}>
											<Text
												style={[
													styles.TextBold,
													{ color: 'white', textAlign: 'center', fontSize: 12 }
												]}
											>
												ارسال  مجدد
											</Text>
										</View>
									)}
								</TouchableWithoutFeedback> : null}


								<TouchableWithoutFeedback
									disabled={this.state.loading}
									onPress={() => this._SetPassword()}
								>
									{this.state.loading ? (
										<Spinner />
									) : (
										<View style={styles.button}>
											<Icon
												type='MaterialIcons'
												name="exit-to-app"

												size={20}
												style={{ color: '#fff', marginLeft: 10, position: 'absolute', left: 0 }}
											/>
											<Text
												style={[
													styles.TextBold,
													{ color: 'white', textAlign: 'center', fontSize: 12 }
												]}
											>
												ثبت پسورد جدید!
											</Text>
										</View>
									)}
								</TouchableWithoutFeedback>
							</View>

					}

				</View>


			</View>
		)
	}
}

export default withTranslation()(Forgotpassword)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#eee',
		alignItems: 'center'
	},
	TextLight: {
		// fontFamily: '$IRANYekanLight',
		fontWeight: '$WeightLight'
	},
	TextBold: {
		// fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold'
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
		padding: 20,
		height: 40,
		backgroundColor: '$MainColor',
		marginTop: 10,
		flexDirection: 'row-reverse',
		alignItems: 'center',
		justifyContent: 'center'
	}
})
