import React, { Component } from 'react'
import { View } from 'react-native'
import StyleSheet from 'react-native-extended-stylesheet'

export default class App extends Component {

  state = {
  	loading: true,
  	address: ''
  };


  render() {
  	return (
  		<View style={styles.container}>

  		</View>
  	)
  }
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '$BackgroundColor',
	},
})
