import { StyleSheet, Text, View,TouchableWithoutFeedback,TouchableOpacity } from 'react-native'
import React,{memo} from 'react'
import Material from 'react-native-vector-icons/MaterialIcons'
const RenderRemoveCount = (props) => {
  return (
    <View>
       <TouchableWithoutFeedback hitSlop={{ top: 10, left: 10, right: 10, bottom: 10 }}
            >
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
            //         let n=parseInt(this.state.count) ;
            //         this.state.count ==0 ? null 
            //       :

            //    n=  parseInt(this.state.count) - 1

            //       this.setState({count: n.toString() })
                    //  this.setState({count: parseInt(this.state.count) - 1})
                    
                }}>
                  
                        <Material name='remove' size={15} />
                </TouchableOpacity>
            </TouchableWithoutFeedback>
    </View>
  )
}

export default  RenderRemoveCount

const styles = StyleSheet.create({})