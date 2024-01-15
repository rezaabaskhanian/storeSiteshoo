import React, { Component } from 'react';
import { Text, View, TextInput } from 'react-native';
import StyleSheet from 'react-native-extended-stylesheet';
import Material from 'react-native-vector-icons/MaterialIcons';
import { Button } from 'react-native-paper'
import { withTranslation } from 'react-i18next';
 class App extends Component {
	state = {
		actice: 1,
		value_1: '',
		value_2: '',
		value_3: '',
		value_4: '',
		value_5: '',
		time: 45

	}
	componentDidMount() {
		this.timer = setInterval(() => {
			if (this.state.time > 0)
				this.setState({ time: this.state.time - 1 })
			else {
				clearInterval(this.timer)
			}
		}, 1000);
	}
	componentWillUnmount() {
		clearInterval(this.timer)
	}
	_OnChance(text, id) {
		if (text == '') {
			return this.setState({ ['value' + '_' + id.toString()]: text })
		}
		this.setState({ ['value' + '_' + id.toString()]: text }, () => {
			if (id < 5)
				this.refs[`TextInput_${(id + 1).toString()}`].focus()
			else {
				this.refs[`TextInput_${(id).toString()}`].blur()
			}
		})
	}
	render() {
		const {t}=this.props
		return (
			<View style={styles.container}>
				<View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'space-between', width: '70%' , marginTop:50 }} >
					<View>
						<TextInput autoFocus ref={'TextInput_1'} onBlur={() => this.refs['Underline_1'].setNativeProps({ style: { backgroundColor: 'gray' } })} onFocus={() => this.refs['Underline_1'].setNativeProps({ style: { backgroundColor: StyleSheet.value('$MainColor') } })} keyboardType='number-pad' value={this.state.value_1} maxLength={1} onChangeText={text => this._OnChance(text, 1)} style={{ width: 40, textAlign: 'center', ...styles.TextBold }} />
						<View ref={'Underline_1'} style={{ height: 1, width: '100%', backgroundColor: 'gray' }} />
					</View>
					<View>
						<TextInput ref={'TextInput_2'} onBlur={() => this.refs['Underline_2'].setNativeProps({ style: { backgroundColor: 'gray' } })} onFocus={() => this.refs['Underline_2'].setNativeProps({ style: { backgroundColor: StyleSheet.value('$MainColor') } })} keyboardType='number-pad' value={this.state.value_2} maxLength={1} onChangeText={text => this._OnChance(text, 2)} style={{ width: 40, textAlign: 'center', ...styles.TextBold }} />
						<View ref={'Underline_2'} style={{ height: 1, width: '100%', backgroundColor: 'gray' }} />
					</View>
					<View>
						<TextInput ref={'TextInput_3'} onBlur={() => this.refs['Underline_3'].setNativeProps({ style: { backgroundColor: 'gray' } })} onFocus={() => this.refs['Underline_3'].setNativeProps({ style: { backgroundColor: StyleSheet.value('$MainColor') } })} keyboardType='number-pad' value={this.state.value_3} maxLength={1} onChangeText={text => this._OnChance(text, 3)} style={{ width: 40, textAlign: 'center', ...styles.TextBold }} />
						<View ref={'Underline_3'} style={{ height: 1, width: '100%', backgroundColor: 'gray' }} />
					</View>
					<View>
						<TextInput ref={'TextInput_4'} onBlur={() => this.refs['Underline_4'].setNativeProps({ style: { backgroundColor: 'gray' } })} onFocus={() => this.refs['Underline_4'].setNativeProps({ style: { backgroundColor: StyleSheet.value('$MainColor') } })} keyboardType='number-pad' value={this.state.value_4} maxLength={1} onChangeText={text => this._OnChance(text, 4)} style={{ width: 40, textAlign: 'center', ...styles.TextBold }} />
						<View ref={'Underline_4'} style={{ height: 1, width: '100%', backgroundColor: 'gray' }} />
					</View>
					<View>
						<TextInput ref={'TextInput_5'} onBlur={() => this.refs['Underline_5'].setNativeProps({ style: { backgroundColor: 'gray' } })} onFocus={() => this.refs['Underline_5'].setNativeProps({ style: { backgroundColor: StyleSheet.value('$MainColor') } })} keyboardType='number-pad' value={this.state.value_5} maxLength={1} onChangeText={text => this._OnChance(text, 5)} style={{ width: 40, textAlign: 'center', ...styles.TextBold }} />
						<View ref={'Underline_5'} style={{ height: 1, width: '100%', backgroundColor: 'gray' }} />
					</View>
				</View>
				<View>
					<Text style={{ ...styles.TextBold, maxWidth: '70%' }} >{t('activation-code-number')}</Text>
					<Text style={{ ...styles.TextBold, maxWidth: '70%', color: 'black', fontSize: 20 }} >0915-736-0900</Text>
					<Text style={{ ...styles.TextLight, maxWidth: '70%', opacity: 0.7 }} >{this.state.time} seconds to resend</Text>
				</View>
				<View style={{alignItems:'center'}} >

					<Text style={{ ...styles.TextRegular, maxWidth: '70%', color: StyleSheet.value('$MainColor') , margin:10 }} >You entered the wrong number!</Text>
					<View style={styles.button} >
						<Text style={{ ...styles.TextRegular, maxWidth: '70%', color: 'white' }} >{t('send')}</Text>
					</View>
				</View>
				<View style={{ flexDirection: 'row-reverse', alignItems: 'center', justifyContent: 'center' }} >
					<Material name='headset-mic' style={{ marginHorizontal: 10 }} />
					<Text style={{ ...styles.TextRegular, maxWidth: '70%', color: 'black' }} > {t('support')}</Text>
				</View>
			</View>
		);
	}
}
export default withTranslation()(App);
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent: 'space-around',
		alignItems: 'center',
		backgroundColor: '$BackgroundColor',
	},
	TextBold: {
		// fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold',
		textAlign: 'center'
	},
	TextLight: {
		// fontFamily: '$IRANYekanLight',
		fontWeight: '$WeightLight',
		textAlign: 'center'
	},
	TextRegular: {
		// fontFamily: '$IRANYekanRegular',
		fontWeight: '$WeightRegular',
		textAlign: 'center'
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
