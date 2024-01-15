import React, { Component } from 'react';
import { Text, View, TextInput, TouchableWithoutFeedback, KeyboardAvoidingView, Platform } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import Material from 'react-native-vector-icons/MaterialIcons';
import { Button, Appbar } from 'react-native-paper'
import color from 'color';
import MapView, { Marker } from "react-native-maps";
import BackHeader from '../App/component/BackHeader';
import { withTranslation } from 'react-i18next';

 class App extends Component {

	state = {
		loading: true,
		address: ''
	};


	render() {
		const { t } = this.props
		return (
			<View style={styles.container}>
				<BackHeader/>
				<View style={{ backgroundColor: color('white').darken(0.1), width: '100%', height: 20 }} >
					<Text style={[styles.TextLight, { textAlign: 'center', fontSize: 11, color: 'black' }]} >{t('please-enter-your-address')}</Text>
				</View>
				<View style={{ flex: 1, padding: 10, alignItems: 'center' }} >
					<View style={{ height: '60%', width: '90%', borderRadius: 17, borderWidth: 0.5, borderColor: 'gray' }} >
						<TextInput
							placeholder={t('complete-address')}
							multiline
							style={[styles.TextLight, { flex: 1, padding: 10, textAlignVertical: 'top' }]}
						/>
					</View>
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
