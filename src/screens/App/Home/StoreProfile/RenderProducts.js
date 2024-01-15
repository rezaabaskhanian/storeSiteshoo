import React, { Component, PureComponent } from 'react'
import {
	Text,
	View,
	TouchableWithoutFeedback,
	FlatList
} from 'react-native'
import FastImage from 'react-native-fast-image'
import { config } from '../../../../App'
import StyleSheet from 'react-native-extended-stylesheet'
import { TextTicker } from '../../component'
import Material from 'react-native-vector-icons/MaterialIcons';
import Axios from 'axios';
import ProductItem from '../ProductItem/ProductItem';

export class RenderProduct extends Component {
	state = {
		loading: true,
	};

	render() {
		const { item } = this.props
		return (
			<View style={{ width: '100%', padding: 10 }}>
				<View style={{ alignItems: 'flex-end', paddingHorizontal: 5 }}>
					<Text
						style={[
							styles.TextBold,
							{ color: 'black', textAlign: 'center', fontSize: 16 }
						]}
					>
						{item.CATEGORYNAME}
					</Text>

					<FlatList
						horizontal
						inverted
						data={item.data}
						keyExtractor={(_, index) => item.CATEGORYNAME + index}
						showsHorizontalScrollIndicator={false}
						renderItem={({ item }) =>
							<ProductItem item={item} navigation={this.props.navigation} routes={[this.props.storeName]} />
						}
					/>
				</View>
			</View>
		)
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
		padding: 10,
		backgroundColor: '$MainColor',
		flexDirection: 'row-reverse',
		alignItems: 'center',
		justifyContent: 'center'
	},
	header: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		overflow: 'hidden',
		elevation: 2
	},
	triangle: {
		width: 0,
		height: 0,
		backgroundColor: 'transparent',
		borderStyle: 'solid',
		borderLeftWidth: 30,
		borderTopWidth: 30,
		borderLeftColor: 'transparent',
		borderTopColor: 'purple',
		transform: [{ rotate: '0deg' }]
	}
})
