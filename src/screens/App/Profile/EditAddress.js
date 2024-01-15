import React, { Component, PureComponent } from 'react';
import { Platform, Text, View, FlatList, Dimensions, TouchableWithoutFeedback, Alert, PermissionsAndroid } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet'
import { Appbar, TouchableRipple } from 'react-native-paper'
import FastImage from 'react-native-fast-image'
import MapView, { Marker } from "react-native-maps";
import Geolocation from '@react-native-community/geolocation';

const { width } = Dimensions.get('window')

import Material from 'react-native-vector-icons/MaterialIcons';
import Axios from 'axios';
import { config } from '../../../App';
import BackHeader from '../component/BackHeader';

export default class App extends Component {

	state = {
		item: {},
		region: {
			latitude: 37.78825,
			longitude: -122.4324,
			latitudeDelta: 0.0922,
			longitudeDelta: 0.0421
		},
		center: {
			latitude: 37.78825,
			longitude: -122.4324,
			latitudeDelta: 0.0922,
			longitudeDelta: 0.0421
		}
	}
	async requestLocationPermission() {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
				{
					title: "Location Permission",
					message:
						"App needs access to your location " +
						"so you can take awesome locations."
				}
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			} else {
			}
		} catch (err) { }
	}
	onRegionChange(region) {
		this.setState({ region })
	}
	async componentDidMount() {
		try {
			this.requestLocationPermission()
			this.setState({
				item: this.props.navigation.state.params.item,
				region: {
					latitude: this.props.navigation.state.params.item.LOCATION ? this.props.navigation.state.params.item.LOCATION[0] : this.state.region.latitude,
					longitude: this.props.navigation.state.params.item.LOCATION ? this.props.navigation.state.params.item.LOCATION[1] : this.state.region.longitude,
					latitudeDelta: 0.0422,
					longitudeDelta: 0.0321
				}
			}, () => console.log(this.state))
		} catch (error) {

		}
	}

	getCurrent() {
		Geolocation.getCurrentPosition(
			position => {
				const location = JSON.stringify(position)
				// alert(JSON.stringify(';'+location))
				const currentLocation = {
					latitude: parseFloat(position.coords.latitude),
					longitude: parseFloat(position.coords.longitude),
					latitudeDelta: parseFloat(this.state.region.latitudeDelta),
					longitudeDelta: parseFloat(this.state.region.longitudeDelta)
				}
				// this.setState({region : currentLocation})
				this.map.animateToRegion(currentLocation)
			},
			error => console.warn('err', error.message),
			{ enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
		)
	}

	render() {
		return (
			<View style={styles.container}>
				<BackHeader headerText='ویرایش آدرس' />
				<View style={{ flex: 1, justifyContent: 'center' }} >
					<MapView
						style={{ flex: 1 }}
						//customMapStyle={mapstyle}
						ref={ref => this.map = ref}
						showsMyLocationButton
						cacheEnabled
						showsUserLocation
						onRegionChangeComplete={reg => this.onRegionChange(reg)}
						initialRegion={this.state.region}
					/>
					<Material name='location-on' size={40} color='red' style={{ position: 'absolute', alignSelf: 'center' }} />

					<TouchableWithoutFeedback
						onPress={() => {
							console.log('onpress', this.state.item)
							this.props.navigation.navigate('DetailAddress', {
								item: this.state.item,
								region: this.state.region
							})
						}}
					>

						<View style={{ ...styles.button, position: 'absolute', alignSelf: 'center', bottom: 20, width: 170, justifyContent: 'center' }} >
							<Material name='location-on' color='white' size={20} style={{ marginLeft: 10, position: 'absolute', left: 0 }} />
							<Text style={[styles.TextBold, { color: 'white', textAlign: 'center' }]} >تایید مکان</Text>
						</View>
					</TouchableWithoutFeedback>

					<TouchableWithoutFeedback
						onPress={() => this.getCurrent()}
					>
						<View style={{ position: 'absolute', bottom: 50, alignItems: 'center', justifyContent: 'center', right: 20, padding: 10, height: 50, width: 50, backgroundColor: 'white', borderRadius: 25, elevation: 3 }} >
							<Material size={25} name='location-on' color={StyleSheet.value('$MainColor')} />
						</View>
					</TouchableWithoutFeedback>
				</View>

			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '$BackgroundColor'
	},
	TextBold: {
		fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold'
	},
	TextRegular: {
		fontFamily: 'IRANYekanRegular',
		fontWeight: '$WeightRegular'
	},
	button: {
		borderRadius: 17,
		width: 80,
		height: 30,
		backgroundColor: '$MainColor',
		flexDirection: 'row-reverse',
		alignItems: 'center',
		justifyContent: 'center'
	}
});
