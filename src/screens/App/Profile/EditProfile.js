import React, { Component } from 'react'
import { Text, View, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, ScrollView, Platform, AsyncStorage } from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'
import Material from 'react-native-vector-icons/MaterialIcons'
import { Button, Appbar, ActivityIndicator } from 'react-native-paper'
import color from 'color'
import MapView, { Marker } from 'react-native-maps'
import Axios from 'axios'

import { StackActions, NavigationActions } from 'react-navigation'
// import ImagePicker from 'react-native-image-picker'
import FastImage from 'react-native-fast-image'
import { config } from '../../../App'
import { Toast, Spinner } from 'native-base'
import BackHeader from '../component/BackHeader'
import { withTranslation } from 'react-i18next';

 class App extends Component {
	state = {
		image: null,
		data: {},
		name: '',
		email: '',
		username: '',
		password: '',
		repassword: '',
		loading: false,
		pastTime: '',
		theme: ''
	}
	componentDidMount() {
		AsyncStorage.getItem('theme').then(theme => {
			this.setState({ theme: theme })
		})


		// const { item } = this.props.navigation.state.params
		Axios.get('users/me').then(({ data }) => {
			this.setState({
				data: data,
				name: data.NAME,
				username: data.USER_NAME,
				email: data.user_additional.EMAIL,
				image: config.BaseUrl + data.avatar,
				pastTime: data.PASTIME
			})
		}).catch((error) => { console.log('EDIT PROFILE: ', error.response) })
	}
	render() {
		const {t} =this.props
		return (
			<View style={{ flex: 1, backgroundColor: StyleSheet.value('$MainColor') }}>
				<BackHeader headerText={t('edit-profile')}/>
				{console.log(this.state.theme, 'testTheme')}
				<KeyboardAvoidingView style={{ flex: 1 }} behavior='padding' enabled={false}>
					<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
						<ScrollView style={{ backgroundColor: 'white', flexShrink: 0, flexGrow: 0, width: '80%', paddingVertical: 10, elevation: 5, shadowColor: 'black', shadowOffset: { height: 2, width: 0 }, shadowOpacity: 0.2, shadowRadius: 10, borderRadius: 10 }}>
							<View style={{ elevation: 5, backgroundColor: 'white', borderRadius: 90, alignSelf: 'center', width: 90, height: 90 }}>
								<View style={{ width: 90, height: 90, alignSelf: 'center', justifyContent: 'flex-end', borderRadius: 90, overflow: 'hidden' }}>
									{/* <TouchableWithoutFeedback
										onPress={() => {
											const options = {
												title: 'انتخاب عکس',
												// customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
												storageOptions: {
													skipBackup: true,
													path: 'images',
												},
											}
											ImagePicker.showImagePicker(options, (response) => {
												if (response.didCancel) {
													console.log('User cancelled image picker')
												} else if (response.error) {
													console.log('ImagePicker Error: ', response.error)
												} else if (response.customButton) {
													console.log('User tapped custom button: ', response.customButton)
												} else {
													// You can also display the image using data:
													// const source = { uri: 'data:image/jpeg;base64,' + response.data };
													console.log(response)
													this.setState({
														image: response.uri,
													})
													let formData = new FormData()
													console.log(formData)
													// formData.append('name' , 'AVATAR')
													formData.append('AVATAR', {
														// uri: response.uri,
														uri: 'file://' + response.path,
														name: response.fileName,
														type: response.type
													})
													Axios.put('/users/avatar', formData).then(({ data }) => {
														console.log('data:', data)
													}).catch(err => {
														console.log('err', err)
													})
												}
											})
										}}
									>
										<View style={{ width: 90, position: 'absolute', backgroundColor: 'white', height: 25, opacity: 0.4, alignItems: 'center', justifyContent: 'center' }}>
											<Material name='camera' size={15} color='black' />
										</View>
									</TouchableWithoutFeedback> */}
									<FastImage source={{ uri: this.state.image }} style={{ height: 90, width: 90, zIndex: -1 }} />
								</View>
							</View>
							<TextInput value={this.state.name}
								onChangeText={(name) => { this.setState({ name }) }}
								placeholder='نام و نام خانوادگی' style={{ alignSelf: 'center', width: '85%', ...styles.TextBold, marginTop: 10 }} underlineColorAndroid='rgb(200,200,200)' />
							<TextInput value={this.state.username} editable={false} style={{ alignSelf: 'center', width: '85%', ...styles.TextBold, marginTop: 10, textAlign: 'right' }} underlineColorAndroid='rgb(200,200,200)' />

							{

								this.state.theme == 6 ?
									< TextInput
										value={this.state.pastTime}
										onChangeText={pastTime => this.setState({ pastTime })}
										placeholder='تفریح'

										style={{ width: '85%', alignSelf: 'center', ...styles.TextBold, textAlign: 'right' }}
										underlineColorAndroid='rgb(200,200,200)'
									/>
									: null

							}

							<TextInput
								value={this.state.email}
								onChangeText={email => this.setState({ email })}
								placeholder='ایمیل'
								keyboardType='email-address'
								style={{ width: '85%', alignSelf: 'center', ...styles.TextBold, textAlign: 'right' }}
								underlineColorAndroid='rgb(200,200,200)'
							/>
							{/* <TextInput placeholder='پسورد' keyboardType='email-address' style={{ width: '85%', alignSelf: 'center', ...styles.TextBold }} underlineColorAndroid='rgb(200,200,200)' />
							<TextInput placeholder='تکرار پسورد' keyboardType='email-address' style={{ width: '85%', alignSelf: 'center', ...styles.TextBold }} underlineColorAndroid='rgb(200,200,200)' /> */}
						</ScrollView>
					</View>
				</KeyboardAvoidingView>
				{this.state.loading ?
					<View>
						<Spinner color={'#fff'} />

					</View>
					:
					<TouchableWithoutFeedback
						disabled={this.state.loading}
						onPress={() => {
							this.setState({ loading: true })
							Axios.put('/users', {
								NAME: this.state.name,
								EMAIL: this.state.email
							}).then(({ data }) => {
								console.log(data)
								Toast.show({
									text: 'پروفایل شما با موفقیت بروز شد!',
									type: 'success'
								})
								this.setState({ loading: false })

							}).catch(err => {
								console.log(err)
								Toast.show({
									type: 'danger',
									text: 'خطا در بروزرسانی پروفایل'
								})
								this.setState({ loading: false })

							})
						}}
					>
						<View style={{ ...styles.button, position: 'absolute', alignSelf: 'center', bottom: 20, width: 120, justifyContent: 'center' }} >
							<Text style={[styles.TextBold, { color: StyleSheet.value('$MainColor'), textAlign: 'center' }]} >تایید</Text>
						</View>
					</TouchableWithoutFeedback>}
			</View>
		)
	}
}

 export default withTranslation()(App)

const styles = StyleSheet.create({
	// container: {
	// 	flex: 1,
		//backgroundColor: '$BackgroundColor',
	// 	backgroundColor: 'white',
	// },
	// TextLight: {
	// 	fontFamily: '$IRANYekanLight',
	// 	fontWeight: '$WeightLight',
	// },
	TextBold: {
		fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold',
	},
	// TextRegular: {
	// 	fontFamily: '$IRANYekanRegular',
	// 	fontWeight: '$WeightRegular',
	// },
	button: {
		borderRadius: 17,
		width: '50%',
		height: 40,
		backgroundColor: 'white',
		marginTop: 10,
		flexDirection: 'row-reverse',
		alignItems: 'center',
		justifyContent: 'center'
	}
})
