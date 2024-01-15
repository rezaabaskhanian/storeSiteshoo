import { StyleSheet, Text, View } from 'react-native'
import React,{memo} from 'react'
import { Colors } from '../../../../styles'

const HeaderRoot = (props) => {
  return (
    <View style={styles.container}> 
    <Text style={styles.txt}>
        {`${props.route}  ${props.name}`}
    </Text>
     
    </View>
  )
}

export default HeaderRoot

const styles = StyleSheet.create({

container :{
  flex:1,
  padding:10
  
},
txt:{
  fontWeight: '300',
  fontFamily: '$IRANYekanBold',
  color :Colors.GREEN,
  fontSize:16
  
}
})