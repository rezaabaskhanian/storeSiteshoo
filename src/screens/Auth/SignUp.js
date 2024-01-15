import React, { Component } from 'react'
import {
	Text,
	View,
	TextInput,
	TouchableWithoutFeedback,
	KeyboardAvoidingView,
	Platform,
	Dimensions,
	ActivityIndicator,
	AsyncStorage
} from 'react-native'
// import PushPole from 'pushpole-react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import Material from 'react-native-vector-icons/MaterialIcons'
import FastImage from 'react-native-fast-image'
import Axios from 'axios'
import {CheckBox, Toast } from 'native-base'
import { StackActions, NavigationActions } from 'react-navigation'
const { width } = Dimensions.get('window')
import DeviceInfo from 'react-native-device-info';
import { state as store } from "react-beep";

import { withTranslation } from 'react-i18next';
 class App extends Component {
	state = {
		PASSWORD: '',
		REPASSWORD: '',
		passwordSec: true,
		rePasswordSec: true,
		NAME: '',
		REFERRAL_CODE: '',
		NATIONAL_CODE: '',
		USER_NAME: '',
		lazy: false,
		authChecked:false,
		codeOtp:'',
		validate:false,
		step:'',
		pusheId: '',
	};
	
	componentDidMount (){
		// PushPole.getId(pusheId => {
        //     this.setState({
        //         pusheId
        //     })
        // })
	}

signUpWithOtp= async () => {
	

	let guest = await AsyncStorage.getItem('profile')
	guest =JSON.parse(guest)
	 console.log(this.state.USER_NAME,guest,'JSONssssss')
	this.state.validate && this.state.NAME!=='' ?
	Axios.put('users/usercreateotp', {
		USER_NAME: this.state.USER_NAME,
		USER_ID: guest.ID ?guest.ID :guest.USER_ID ,
		// USER_ID:guest.USER_NAME

	}).then(result => {
		console.log(result.data,'ressss')
		  this.setState({ step: 'codeOtp', lazy: false })
		// ////
		 AsyncStorage.setItem('PhoneNumber', this.state.USER_NAME)
		// console.log(this.state.phoneNumber, 'this.state.phoneNumber')
		////////////////
	}).catch(e=>{
		console.warn(e,'warnss')
		this.setState({  lazy: false })
	})
	:
	Toast.show({
		text:'Please enter the information correctly',
		type:'danger'
	})
	
	this.setState({  lazy: false })

}
checkedOtp=async()=>{
	try{
		let guest = await AsyncStorage.getItem('profile')
		guest =JSON.parse(guest)
		console.log(guest,'profile')
	
		Axios.put('users/verify', {
			OTP :this.state.codeOtp,
			USER_ID: guest.ID,
			USER_NAME: this.state.USER_NAME,
			
		}).then(result => {
			console.log(result.data,'ressss')
			  
			   this.singUpAccept()
	
		}).catch(e=>{
			Toast.show({
				text:'The code is invalid.',
			type:'danger'
			})
			this.setState({  lazy: false })
		})
	}
	catch(error){
		console.warn(error.response,'erorr taeid')
	}
	
	
}

singUpAccept=async()=>{
	let guest = await AsyncStorage.getItem('profile')
	guest =JSON.parse(guest)

	Axios.put('users/guest', {
		USER_ID: guest.ID,
		NAME:this.state.NAME,
		NATIONAL_CODE:'',
		PASSWORD:this.state.authChecked ?  this.state.codeOtp :this.state.PASSWORD,
		PASTIME:'',
		REFERRAL_CODE:null,
		 isGuest:this.state.authChecked ?null  : 1,
		 passwordConfirm:this.state.authChecked ? null:  this.state.REPASSWORD,
		 wantPassword:this.state.authChecked ?  false: true,
		OTP :this.state.authChecked ? 1 : 0,
		USER_NAME: this.state.USER_NAME,
		
		// USER_ID:guest.USER_NAME

	}).then(result => {
		console.log(result.data,'ressss333')
		
this.loginWithOtp()
	})
	
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


loginWithOtp =async()=>{
	let guest = await AsyncStorage.getItem('profile')
	guest =JSON.parse(guest)

	Axios.post('auth/local', {

		USER_NAME: this.state.USER_NAME,
		PASSWORD:this.state.authChecked ?   this.state.USER_NAME + this.state.codeOtp : this.state.PASSWORD,
		PUSH_ID: this.state.pusheId,
		VERSION: DeviceInfo.getBuildNumber(),
		VERSION_TYPE: "1"
	}).then((data)=>{
		console.log(data.data,'authLocal')
		
		AsyncStorage.setItem('profile', JSON.stringify(data.data))
		AsyncStorage.setItem('token', data.data.TOKEN.toString())
		AsyncStorage.setItem('isGuest', '0')
		Axios.defaults.headers = {
			Authorization: 'Bearer ' + data.data.TOKEN.toString()
		}
		const resetAction = StackActions.reset({
			index: 0,
			key:null,
			actions: [NavigationActions.navigate({ routeName: 'Tab' })],
		})
		this.props.navigation.dispatch(resetAction)
		this.updateCartCount()
		Toast.show({
			text: 'ثبت نام با موفقیت انجام شد',
			type: 'success',
			position: 'top'
		})
	})




}

	async signUp(){

		try {
			this.setState({
				lazy: true
			})
			let data={
				NAME: this.state.NAME,
				USER_NAME: this.state.USER_NAME,
				PASSWORD: this.state.PASSWORD
			}
			if(this.state.REFERRAL_CODE){
				data['REFERRAL_CODE']=this.state.REFERRAL_CODE
			}
			let register = await Axios.post('users', data);
			console.log(register,'registerregister')
			Toast.show({
				text: 'ثبت نام با موفقیت انجام شد!',
				type: 'success',
				duration: 3000,
				buttonText: 'Ok',
				buttonStyle: {
					borderColor: 'white',
					borderWidth: 1,
					margin: 5,
					borderRadius: 7
				}
			})
			this.setState({
				lazy: false
			})
			this.props.navigation.navigate('SignInVerify', {USER_NAME: this.state.USER_NAME, PASSWORD: this.state.PASSWORD,userId:register.data.ID})
		} catch (error) {
			Toast.show({
				text: error.response.data.message,
				type: 'danger',
				duration: 3000,
				buttonText: 'Ok',
				buttonStyle: {
					borderColor: 'white',
					borderWidth: 1,
					margin: 5,
					borderRadius: 7
				}
			})
			this.setState({
				lazy: false
			})
		}
	}
	componentDidCatch(e){
	}
	checkRefferalCode() {

	}
	render() {
		const {t}=this.props
		return (
			<View style={styles.container}>
				<View
					behavior="padding"
					enabled={Platform.OS === 'android' ? false : true}
					style={{ width: '100%', justifyContent: 'center', flex: 1 }}
				>
					<View
						style={{ alignItems: 'center', flex: 1, justifyContent: 'center' }}
					>
						<Text
							style={[
								styles.TextBold,
								{
									color: 'black',
									alignSelf: 'center',
									paddingRight: 20,
									paddingVertical: 20,
									fontSize: 23
								}
							]}
						>
							{t('singup')}
						</Text>

						{this.state.step=='codeOtp' ?
						<View
						style={{
							marginTop: 10,
							flexDirection: 'row-reverse',
							alignItems: 'center',
							width: '85%',
							borderRadius: 7,
							borderWidth: 0.5,
							height: 40,
							borderColor: 'gray'
						}}
					>
						<TextInput
							placeholder={t('code')}
							value={this.state.codeOtp}
							maxLength={4}
							keyboardType={'numeric'}
							// selectTextOnFocus
							onChangeText={(e) => {this.setState({codeOtp:e})}}
							style={{ ...styles.TextLight, flex: 1, paddingHorizontal: 10 }}
							onEndEditing={(e)=>{
								// console.log(this.state.codeOtp,'otppppp')
								
							}}
						/>
					</View>
					
					:
					<>
					
						<View
							style={{
								marginTop: 10,
								flexDirection: 'row-reverse',
								alignItems: 'center',
								width: '85%',
								borderRadius: 7,
								borderWidth: 0.5,
								height: 40,
								borderColor: 'gray'
							}}
						>
							<TextInput
								placeholder={t('firstname-lastname')}
								value={this.state.NAME}
								// selectTextOnFocus
								onChangeText={NAME => this.setState({ NAME })}
								style={{ ...styles.TextLight, flex: 1, paddingHorizontal: 10 }}
							/>
						</View>
						
						<View
							style={{
								marginTop: 10,
								flexDirection: 'row-reverse',
								alignItems: 'center',
								width: '85%',
								borderRadius: 7,
								borderWidth: 0.5,
								height: 40,
								borderColor: 'gray'
							}}
						>
							<TextInput
								placeholder={t('phone-number')}
								value={this.state.USER_NAME}
								 maxLength={11}
								// selectTextOnFocus
								 keyboardType='phone-pad'
								onChangeText={USER_NAME => this.setState({ USER_NAME })}
								style={{ ...styles.TextLight, flex: 1, paddingHorizontal: 10 }}
								onEndEditing={(e)=>{
									// console.log(e.nativeEvent.text,'eeee')
									 if (e.nativeEvent.text.length==11 && e.nativeEvent.text.startsWith('09') )
									// if (e.nativeEvent.text.includes('@') )
									{
									this.setState({validate:true})
									}
									else{
										Toast.show({
											text:'شماره اشتباه است',
											type:'danger'
										})
									}
								}}
							/>
						</View>

						

					{
               this.state.authChecked ?
			   null
:
				<>	
						<View
							style={{
								marginTop: 10,
								flexDirection: 'row-reverse',
								alignItems: 'center',
								width: '85%',
								borderRadius: 7,
								borderWidth: 0.5,
								height: 40,
								borderColor: 'gray'
							}}
						>
							<TextInput
								onChangeText={PASSWORD => this.setState({ PASSWORD })}
								value={this.state.PASSWORD}
								selectTextOnFocus

								secureTextEntry={this.state.passwordSec}
								placeholder={t('password')}
								style={{
									...styles.TextLight,
									flex: 1,
									paddingHorizontal: 10,
									textAlign: 'right'
								}}
							/>
							<TouchableWithoutFeedback
								onPressOut={() => this.setState({ passwordSec: true })}
								onPressIn={() => this.setState({ passwordSec: false })}
							>
								<Material
									name="remove-red-eye"
									size={16}
									style={{ marginRight: 10, color: 'gray' }}
								/>
							</TouchableWithoutFeedback>
						</View>
						<View
							style={{
								marginTop: 10,
								flexDirection: 'row-reverse',
								alignItems: 'center',
								width: '85%',
								borderRadius: 7,
								borderWidth: 0.5,
								height: 40,
								borderColor: 'gray'
							}}
						>
							<TextInput
								onChangeText={REPASSWORD => this.setState({ REPASSWORD })}
								value={this.state.REPASSWORD}
								secureTextEntry={this.state.rePasswordSec}
								placeholder={t('password')}
								selectTextOnFocus

								style={{
									...styles.TextLight,
									flex: 1,
									paddingHorizontal: 10,
									textAlign: 'right'
								}}
							/>

							
							<TouchableWithoutFeedback
								onPressOut={() => this.setState({ rePasswordSec: true })}
								onPressIn={() => this.setState({ rePasswordSec: false })}
							>
								<Material
									name="remove-red-eye"
									size={16}
									style={{ marginRight: 10, color: 'gray' }}
								/>
							</TouchableWithoutFeedback>
						</View>
						</>
}
						
						<View
							style={{
								marginTop: 10,
								flexDirection: 'row-reverse',
								alignItems: 'center',
								width: '85%',
								borderRadius: 7,
								borderWidth: 0.5,
								height: 40,
								borderColor: 'gray'
							}}
						>
							<TextInput
								placeholder={t('identifier-code')}
								value={this.state.REFERRAL_CODE}
								// selectTextOnFocus
								onChangeText={REFERRAL_CODE => this.setState({ REFERRAL_CODE })}
								style={{ ...styles.TextLight, flex: 1, paddingHorizontal: 10 }}
							/>
						</View>

						<View style={{flexDirection:'row',justifyContent:'flex-start',marginTop:10}}>
                        <Text>
							{t('log-temporary-password')}

                        </Text>
                    <CheckBox  checked={this.state.authChecked} onPress={() =>
                                               this.setState({authChecked:!this.state.authChecked})
                                            } color={StyleSheet.value('$MainColor')} />
                    </View> 


</>
}
						<TouchableWithoutFeedback
							disabled={this.state.lazy}
							onPress={async () => {
								
								if(this.state.PASSWORD === this.state.REPASSWORD){
									this.setState({lazy:true});
									if(this.state.REFERRAL_CODE&&this.state.REFERRAL_CODE.length>0){
										Axios.post('users/ReferralCode', {
											REFERRAL_CODE: this.state.REFERRAL_CODE
										}).then(({data})=>{
											this.signUp()
										}).catch(err=>{
											this.setState({lazy:false});

											Toast.show({
												text:'identification-code-invalid',
												type:'danger'
											})
										});
									}else{
										if (this.state.step=='codeOtp'){
											this.checkedOtp()
										}
										else if (this.state.authChecked){
											this.signUpWithOtp()
										}
										else{
											// this.signUp()
											this.singUpAccept()
										}
									}

								}else{
									Toast.show({
										text:'Password and repetition do not match.',
										type:'danger'
									})
								}
							}}
						>
							{this.state.lazy ? (
								<View style={{ ...styles.button, width: 'auto', padding: 5 }}>
									<ActivityIndicator color="white" />
								</View>
							) : (
								<View style={styles.button}>
									<Text
										style={[
											styles.TextBold,
											{ color: 'white', textAlign: 'center' }
										]}
									>
										{t('signup')}
									</Text>
								</View>
							)}
						</TouchableWithoutFeedback>
						<Text
							style={[
								styles.TextLight,
								{
									color: 'black',
									textAlign: 'center',
									fontSize: 12,
									marginTop: 10
								}
							]}
						>
							{t('member-before')}
							<TouchableWithoutFeedback
								hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
								onPress={() => this.props.navigation.navigate('SignIn')}
							>
								<Text style={{ color: StyleSheet.value('$MainColor') }}>
								{t('log-in')}
								</Text>
							</TouchableWithoutFeedback>{' '}
							{/* شوید */}
						</Text>

					</View>
				</View>
			</View>
		)
	}


}

export default withTranslation()(App);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '$BackgroundColor',
		alignItems: 'center'
	},
	TextLight: {
		 fontFamily: '$IRANYekanLight',
		fontWeight: '$WeightLight'
	},
	TextBold: {
		 fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold'
	},
	// TextRegular: {
	// 	fontFamily: '$IRANYekanRegular',
	// 	fontWeight: '$WeightRegular'
	// },
	// TextInput: {
	// 	fontFamily: '$IRANYekanLight',
	// 	fontWeight: '$WeightLight',
	// 	height: 50,
	// 	textAlign: 'right'
	// },
	button: {
		borderRadius: 7,
		width: '50%',
		height: 40,
		backgroundColor: '$MainColor',
		marginTop: 10,
		flexDirection: 'row-reverse',
		alignItems: 'center',
		justifyContent: 'center'
	}
})
