import { StyleSheet, Text, View,TouchableOpacity  } from 'react-native'
import React from 'react'
import Material from 'react-native-vector-icons/MaterialIcons'



const AddToCart = (props) => {


      return (
            <TouchableOpacity style={{
                width: 20,
                height: 20,
                justifyContent: 'center',
                alignItems: 'center',
                borderColor: 'black',
                borderRadius: 5,
                borderWidth: 0.5
            }} onPress={ props.addAction}>
                <Material name='add' size={15} />
            </TouchableOpacity>
        )
  
}

export default AddToCart

const styles = StyleSheet.create({})