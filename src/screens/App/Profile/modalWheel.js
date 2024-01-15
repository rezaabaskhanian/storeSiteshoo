import React, { useEffect, useState } from 'react'

import StyleSheet, { flatten } from 'react-native-extended-stylesheet'
import {
    Text,
    View,
    Dimensions,
    ActivityIndicator,
    TouchableWithoutFeedback,
    TextInput,
    ScrollView,
    Modal,
    Alert,TouchableOpacity
} from 'react-native'
import {setUser,getOtp}from './WheelLuckServices'

const ModalWheel =(props)=>{

    const [userName, setUserName] = useState('');
    const [otp, setOtp] = useState('');
    const [step, setStep] = useState(1);
   


    const setOtps= ()=>{
        getOtp(userName,otp).then((data)=>{
            props.setModalVisible(!props.isModalVisible)
            props.setPermission(userName)
            
        }) 
    }

    const getOtps= ()=>{
        getOtp(userName).then((data)=>{
            setStep(step+1)
        }) 
    }


    return(
       
         <Modal
        animationType="slide"
        transparent={true}
        visible={props.isModalVisible}
        onRequestClose={() => {
            props.setModalVisible(!props.isModalVisible)
            
        }}
      >
        <View style={styles.centeredView}>
        <View style={styles.modalView}>
          
         { step==1 ?  <View style={styles.viewInput}>
                              <TextInput
                                    placeholder='شماره تلفن'
                                    value={userName}
                                    keyboardType={'numeric'}
                                    onChangeText={(USER) => setUserName(USER)}
                                    style={[styles.TextLight, {
                                        padding: 10,
                                        textAlignVertical: 'top',
                                         ...styles.TextRegular
                                    }]}
                                />
                            </View>
                              :
                              <View style={styles.viewInput}>
                              <TextInput
                                    placeholder='کد تایید'
                                    value={otp}
                                    keyboardType={'numeric'}
                                    onChangeText={(OTP) => setOtp(OTP)}
                                    style={[styles.TextLight, {
                                        padding: 10,
                                        textAlignVertical: 'top',
                                         ...styles.TextRegular
                                    }]}
                                />
        
                            </View> 
                             }
          
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => step==1 ?getOtps() :setOtps() }
            >
              <Text style={styles.textStyle}>ارسال</Text>
            </TouchableOpacity>
          </View>
          </View>
      </Modal>

    

    )
}

const styles = StyleSheet.create({
    centeredView: {
      flex: 1,
      justifyContent: "center",
      marginTop: 22,
      alignItems: "center",
      

    },
    modalView: {
        justifyContent:'space-around',
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
     padding: 15,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      width:'80%',
      
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    },
    viewInput:{
      
        marginVertical: 5,
        borderRadius: 17,
        borderWidth: 0.5,
        borderColor: 'gray',
        width:'100%',
        height:'30%'
        
    },
    button: {
      borderRadius: 20,
      padding: 10,
      elevation: 2
    },
    buttonOpen: {
      backgroundColor: "#F194FF",
    },
    buttonClose: {
      backgroundColor: "#2196F3",
    },
    textStyle: {
      color: "white",
      fontWeight: "bold",
      textAlign: "center"
    },
    modalText: {
      marginBottom: 15,
      textAlign: "center"
    },
   
    TextRegular: {
        fontFamily: 'IRANYekanRegular',
        fontWeight: '$WeightRegular'
    },
  });

export default ModalWheel