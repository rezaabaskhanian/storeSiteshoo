
import React from 'react'
import { StyleSheet, Text, View,TouchableOpacity  } from 'react-native'
import Material from 'react-native-vector-icons/MaterialIcons'

const RemoveToCart = (props) => {
  const count =props.count
  return (
    <TouchableOpacity style={{
      width: 20,
      height: 20,
      justifyContent: 'center',
      alignItems: 'center',
      borderColor: 'black',
      borderRadius: 5,
      borderWidth: 0.5
  }} onPress={props.removeAction}>
      {count === 1 ? <Material name='delete' size={15} /> :
          <Material name='remove' size={15} />}
  </TouchableOpacity>
  )
}

export default RemoveToCart

const styles = StyleSheet.create({})