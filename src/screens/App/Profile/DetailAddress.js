import React, { Component } from 'react';
import { Text, View, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, AsyncStorage } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import Material from 'react-native-vector-icons/MaterialIcons';
import { Button, Appbar, ActivityIndicator } from 'react-native-paper'
import color from 'color';
import Axios from 'axios';

import { Item, Picker, Content } from 'native-base';
import SearchInput from '../component/SearchInput';
import BackHeader from '../component/BackHeader';
import { BeepProp } from '../../../store/BeepProp'
import { state as store, Beep } from 'react-beep'
import { withTranslation } from 'react-i18next';
 class App extends Beep(BeepProp, Component) {

	state = {
		loading: true,
		ADDRESS: '',
		NAME: '',
		lazy: false,
		// region: this.props.navigation.getParam('region', ['', '']),
		provinces: [],
		cities: [],
		areas: [],
		selectedProvince: -1,
		selectedCity: -1,
		selectedArea: -1,
	};

	componentDidMount() {
		const { item, region } = this.props.navigation.state.params;
		console.log('item', item)
		this.setState({
			ADDRESS: item.ADDRESS,
			NAME: item.NAME,

		})
		Axios.get('/provinces').then(({ data }) => {
			console.warn(data)
			this.setState({
				provinces: data
			})
		}).catch(err => {
			console.warn(err.config)
		})
	}

	getCities(id) {
		Axios.get(`/provinces/${id}/cities`).then(({ data }) => {
			console.warn(data)
			this.setState({ cities: data })
		}).catch(err => {
			console.warn(err)
		})
	}

	getAreas(id) {
		Axios.get(`/provinces/${this.state.selectedValue}/cities/${id}/areas`).then(({ data }) => {
			console.warn(data)
			this.setState({ areas: data })
		}).catch(err => {
			console.warn(err)
		})
	}
	render() {
		const {t} =this.props
		return (
			<View style={styles.container}>
				<BackHeader headerText = {t('edit-detail-address')}/>
				<View style={{ backgroundColor: color('white').darken(0.1), width: '100%', height: 20 }} >
					<Text style={[styles.TextLight, { textAlign: 'center', fontSize: 11, color: 'black' }]} >{t('enter-addrss-complete')}  </Text>
				</View>

				<Content style={{ padding: 10, flex: 1 }} >
					<View style={styles.views} >
						<Picker
							onValueChange={val => {
								this.setState({
									selectedProvince: val,
								})
								val >= 0 && this.getCities(val)

							}}
							selectedValue={this.state.selectedProvince}
						>
							<Picker.Item key={String(-1)} value={-1} label={t('state')} />

							{
								this.state.provinces.map(item => (
									<Picker.Item key={String(item.ID)} value={item.ID} label={item.PROVINCE_NAME} />
								))
							}
						</Picker>
					</View>
					<View style={styles.views} >
						<Picker
							onValueChange={val => {
								this.setState({
									selectedCity: val,
								})
								val >= 0 && this.getAreas(val)

							}}
							selectedValue={this.state.selectedCity}
						>
							<Picker.Item key={String(-1)} value={-1} label={t('city')} />

							{
								this.state.cities.map(item => (
									<Picker.Item key={String(item.ID)} value={item.ID} label={item.TOWNSHIP_NAME} />
								))
							}
						</Picker>
					</View>
					<SearchInput
						data = {this.state.areas}
						onValueChange={val => {
							console.warn(val)
							this.setState({
								selectedArea: val,
							})
						}}
						selectedValue={this.state.selectedArea}
					/>
					<View style={styles.views} >
						<View style={{ height: 50, marginVertical: 5, width: '90%', borderColor: 'gray', justifyContent: 'center' }} >
							<TextInput
								placeholder={t('name-address')}
								value={this.state.NAME}
								onChangeText={(NAME) => this.setState({ NAME })}
								style={[styles.TextLight, { padding: 10, textAlignVertical: 'top' }]}
							/>
						</View>
					</View>

					<View style={[styles.views, {height: 200, borderRadius: 30}]} >
						<View style={{ width: '90%' }} >
							<TextInput
								placeholder={t('complete-address')}
								value={this.state.ADDRESS}
								onChangeText={(ADDRESS) => this.setState({ ADDRESS })}
								multiline
								style={[styles.TextLight, { flex: 1, padding: 10, textAlignVertical: 'top' }]}
							/>
						</View>
					</View>

				</Content>
				<TouchableWithoutFeedback
					disabled={this.state.lazy}
					onPress={async () => {
						const { item, region } = this.props.navigation.state.params;
						try {
							await this.setState({ lazy: true })
							let data = await AsyncStorage.getItem('profile')
							let response = await Axios.put('users/address/' + item.ID, {
								UR_ID: data.ROLE_ID,
								COUNTRY_DIVISION_ID: this.state.selectedArea.COUNTRY_DIVISION_ID,
								NAME: this.state.NAME,
								ADDRESS: this.state.ADDRESS,
								AREA: this.state.selectedArea.AREA,
								LOCATION: [region.latitude, region.longitude]
							})
							await this.setState({ lazy: false })
							this.props.navigation.navigate('Address',{update:true})
						} catch (error) {
							await this.setState({ lazy: false })
						}
					}}
				>
					<View style={{ ...styles.button, position: 'absolute', alignSelf: 'center', bottom: 20 }} >
						<Material name='location-on' color='white' size={20} style={{ marginLeft: 10, position: 'absolute', left: 0 }} />
						{
							this.state.lazy ?
								<ActivityIndicator color='white' />
								:
								<Text style={[styles.TextBold, { color: 'white', textAlign: 'center' }]} >{t('confirm')}</Text>
						}
					</View>
				</TouchableWithoutFeedback>
			</View>
		);
	}
}
export default withTranslation()(App)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		//backgroundColor: '$BackgroundColor',
		backgroundColor: 'white',
	},
	views: {
		height: 50,
		margin: 10,
		borderWidth: 0.5,
		borderColor: 'gray',
		borderRadius: 50,
		flexDirection: 'row-reverse',
		alignItems: 'center'
	},
	TextLight: {
		fontFamily: '$IRANYekanLight',
		fontWeight: '$WeightLight',
	},
	TextBold: {
		fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold',
	},
	TextRegular: {
		fontFamily: '$IRANYekanRegular',
		fontWeight: '$WeightRegular',
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
});
