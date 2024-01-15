import { StyleSheet, Text, View,TouchableWithoutFeedback ,TouchableOpacity} from 'react-native'
import React from 'react'
import Material from 'react-native-vector-icons/MaterialIcons'
const RenderAddCount = (props) => {
  return (
    <View>
         <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}>
                <TouchableOpacity style={{
                    width: 30,
                    height: 30,
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderColor: 'black',
                    borderRadius: 5,
                    borderWidth: 0.5
                }} onPress={async () => {
                    props.onPress()

                            //   let n =parseInt(this.state.count) + 1
                            //   this.setState({count: n.toString() })
                        
                }}>
                    <Material name='add' size={18} />
                </TouchableOpacity>
            </TouchableWithoutFeedback>
    </View>
  )
}

export default RenderAddCount

const styles = StyleSheet.create({})