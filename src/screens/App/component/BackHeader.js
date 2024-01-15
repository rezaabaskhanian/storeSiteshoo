import React from 'react'
import { Text, View ,TouchableWithoutFeedback ,Dimensions , ScrollView,FlatList} from 'react-native'
import Material from 'react-native-vector-icons/MaterialIcons'
import StyleSheet from 'react-native-extended-stylesheet'
import { withNavigation } from 'react-navigation'

class BackHeader extends React.PureComponent{
	render(){
		const {
			headerText = ''
		} = this.props

		const maxlimit =15
		return(
			<View style={[{ height: 60, justifyContent: 'center', backgroundColor: 'white', elevation: 2 }]} >
				<Text style={styles.TextBold} >{((headerText).length > maxlimit) ? 
    (((headerText).substring(0,maxlimit-3)) + ' ... ') : 
    headerText}</Text>
				<TouchableWithoutFeedback
					onPress={() => this.props.navigation.goBack()}
					hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
				>
					<Material name='arrow-forward' style={{ alignSelf: 'flex-end', margin: 15 }} size={25} />
				</TouchableWithoutFeedback>
			</View>
		)
	}
}

export default withNavigation(BackHeader)


const styles = StyleSheet.create({
	TextBold: {
		fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold',
		color: 'black', 
		fontSize: 18, 
		textAlign: 'center', 
		alignSelf: 'center',
		position: 'absolute' 
	},
	TextRegular: {
		fontFamily: '$IRANYekanBold',
		fontWeight: '$WeightBold'
	},
	header: {
		top: 0,
		left: 0,
		right: 0,
		overflow: 'hidden',
		elevation: 2
	},
})