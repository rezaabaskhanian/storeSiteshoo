import React from 'react'
import { View, Linking ,TouchableWithoutFeedback} from 'react-native'
import {
	Container,
	Button,
	Icon,
	Content,
	Spinner,
	Text,	
} from 'native-base'

import StyleSheet from 'react-native-extended-stylesheet'

import Material from 'react-native-vector-icons/MaterialIcons'

import Axios from 'axios'
// import styles from './index.style'
// import { Colors } from '../../configs'

class SupportPage extends React.Component {
state = {
	supports: null
}
componentDidMount() {
	Axios.get('/setting')
		.then(({data}) => {
			this.setState({ supports: data })
		})
		.catch(err => console.log('[error] error get settings', err.response))
}
render() {
	const { supports } = this.state
	if (!supports) return <Spinner />
	return (
		<Container>
			<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
				<TouchableWithoutFeedback
					onPress={() => this.props.navigation.goBack()}
					hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
				>
					<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15, color: StyleSheet.value('$MainColor') }} size={30} />
				</TouchableWithoutFeedback>
				<Text style={{ ...styles.TextBold, color: 'black', fontSize: 18, textAlign: 'center', alignSelf: 'center', position: 'absolute' }} >پشتیبانی</Text>
			</View>
			<Content padder scrollEnabled contentContainerStyle={{ flexGrow: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
				<View style={{ marginBottom: 30, marginHorizontal: 10, }}>
					<Text style={{ fontSize: 17, textAlign: 'center', lineHeight: 35, ...styles.TextRegular}}>در صورت بروز مشکل می توانید با پشتیبانی تماس برقرار کنید</Text>
				</View>

				{
					supports.map(item => (
						<View key={'support' + item.ID} style={styles.supporter}>
							<View style={styles.supporterName}>
								<Text fontWeight="Bold" style={{...styles.TextRegular}}>{item.NAME_FA}</Text>
							</View>
							<Button style={{...styles.callBtn , ...styles.TextRegular}} onPress={() => this.call(item.VALUE)}>
								{
									item.NAME === 'TELEGRAM_CHANAL_LINK' ? 
										<Icon name='telegram' type='FontAwesome5' />
										:
										item.NAME === 'INSTAGRAM_ID' ? 
											<Icon name='instagram' type='FontAwesome5' />
											:
											<Text style={styles.btnText}>تماس</Text>
								}
							</Button>
						</View>
					))
				}

			</Content>
		</Container>
	)
}
call = (link) => {
	if (link) Linking.openURL(link)
}
}

export default SupportPage

const styles= StyleSheet.create({
	supporter: {
		flexDirection: 'row-reverse',
		backgroundColor: '#eee',
		borderRadius: 1000,
		padding: 4,
		marginBottom: 10,
	},
	supporterName: {
		alignItems: 'center',
		fontFamily: 'IRANYekanRegular',
		justifyContent: 'center',
		paddingHorizontal: 15,
	},
	callBtn: {
		backgroundColor: '$MainColor',
		fontFamily: '$IRANYekanBold',
		borderRadius: 1000,
		// width:  70,
	},
	btnText: {
		color: '#fff',
		fontFamily: '$IRANYekanBold',
		paddingHorizontal: 30,
	},
	TextBold: {
		fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold'
	},
	TextRegular: {
		fontFamily: 'IRANYekanRegular',
		fontWeight: '$WeightRegular'
	},
})
