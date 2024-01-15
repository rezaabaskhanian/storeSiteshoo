import React, { Component } from 'react';
import { Text, View, TextInput as RNTextInput, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import Material from 'react-native-vector-icons/MaterialIcons';
import { Button, TextInput, Appbar } from 'react-native-paper'
import color from 'color';
import MapView, { Marker } from "react-native-maps";
import BackHeader from '../App/component/BackHeader';
import Geolocation from '@react-native-community/geolocation';
import { withTranslation } from 'react-i18next';
const mapstyle = [
	{
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#f5f5f5"
			}
		]
	},
	{
		"elementType": "labels.icon",
		"stylers": [
			{
				"visibility": "off"
			}
		]
	},
	{
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#616161"
			}
		]
	},
	{
		"elementType": "labels.text.stroke",
		"stylers": [
			{
				"color": "#f5f5f5"
			}
		]
	},
	{
		"featureType": "administrative.land_parcel",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#bdbdbd"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#eeeeee"
			}
		]
	},
	{
		"featureType": "poi",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#757575"
			}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#e5e5e5"
			}
		]
	},
	{
		"featureType": "poi.park",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#9e9e9e"
			}
		]
	},
	{
		"featureType": "road",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#ffffff"
			}
		]
	},
	{
		"featureType": "road.arterial",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#757575"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#dadada"
			}
		]
	},
	{
		"featureType": "road.highway",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#616161"
			}
		]
	},
	{
		"featureType": "road.local",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#9e9e9e"
			}
		]
	},
	{
		"featureType": "transit.line",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#e5e5e5"
			}
		]
	},
	{
		"featureType": "transit.station",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#eeeeee"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "geometry",
		"stylers": [
			{
				"color": "#c9c9c9"
			}
		]
	},
	{
		"featureType": "water",
		"elementType": "labels.text.fill",
		"stylers": [
			{
				"color": "#9e9e9e"
			}
		]
	}
]

 class App extends Component {

	state = {
		loading: true,
		data: [],
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
	};
	async requestLocationPermission() {
		try {
			const granted = await PermissionsAndroid.request(
				PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
				{
					title: "Location Permission",
					message:
						"MrChe App needs access to your location " +
						"so you can take awesome locations."
				}
			);
			if (granted === PermissionsAndroid.RESULTS.GRANTED) {
			} else {
			}
		} catch (err) { }
	}

	onRegionChange(region) {
		this.setState({ region });
	}

	async componentDidMount() {
		await this.requestLocationPermission();
		await Geolocation.getCurrentPosition(
			pos => {
				this.setState({
					loading: false,
					region: {
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421
					},
					center: {
						latitude: pos.coords.latitude,
						longitude: pos.coords.longitude,
						latitudeDelta: 0.0922,
						longitudeDelta: 0.0421
					}
				});
			},
			error => {
				this.setState({
					loading: false,
					lat: 36.3149423,
					long: 59.543788
				});
			},
			{ enableHighAccuracy: Platform.OS != "android", timeout: 2000 }
		);
	}
	render() {
		const {t}=this.props
		return (
			<View style={styles.container}>
				<BackHeader />
				<View style={{ backgroundColor: color('white').darken(0.1), width: '100%', height: 20 }} >
					<Text style={[styles.TextLight, { textAlign: 'center', fontSize: 11, color: 'black' }]} >{t('put-marker-confirm')}</Text>
				</View>
				<View style={{ flex: 1, justifyContent: 'center' }} >
					<MapView
						style={{ flex: 1 }}
						//customMapStyle={mapstyle}
						showsMyLocationButton={true}
						cacheEnabled
						onRegionChangeComplete={reg => this.onRegionChange(reg)}
						initialRegion={this.state.region}
					/>
					<Material name='location-on' size={40} color='red' style={{ position: 'absolute', alignSelf: 'center' }} />
					<View style={{ ...styles.button, position: 'absolute', alignSelf: 'center', bottom: 20 }} >
						<Material name='location-on' color='white' size={20} style={{ marginLeft: 10, position: 'absolute', left: 0 }} />
						<Text style={[styles.TextBold, { color: 'white', textAlign: 'center' }]} >{t('address-confirm')}</Text>
					</View>
				</View>
			</View>
		);
	}
}

export default withTranslation()(App);

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '$BackgroundColor',
	},
	TextLight: {
		// fontFamily: '$IRANYekanLight',
		fontWeight: '$WeightLight',
	},
	TextBold: {
		// fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold',
	},
	TextRegular: {
		// fontFamily: '$IRANYekanRegular',
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
