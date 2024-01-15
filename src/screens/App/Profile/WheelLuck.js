import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Button,
  TouchableOpacity,Modal
} from 'react-native';

import WheelOfFortune from 'react-native-wheel-of-fortune';

import {getGifts,sendGift} from './WheelLuckServices'

import ModalWheel from './modalWheel'


class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      winnerValue: null,
      winnerIndex: null,
      started: false,
      gifts:['10','20'],
      show:false,

      modalVisible:false,
     permission :false,

     titleWheel:'کلیک کنید',
     userPhone:null,
     orgGifts:[]


    };
    this.child = null;
  }


  buttonPress = () => {
    this.setState({
      started: true,
      modalVisible:true
    });
 

  };
  setModalVisible=()=>{
    this.setState({modalVisible:!this.state.modalVisible})
  }
  setPermission=(userName)=>{
    this.child._onPress() 
    this.setState({userPhone:userName})
  }

  componentDidMount(){
    getGifts().then((data)=>{
      this.setState({orgGifts:data})
       let newData = [];
      for (let property in data) {
        newData.push(data[property].GIFT) 
      }
      this.setState({gifts:newData,show:true})
    })
  }

  changeGifts=(value)=>{
    const IdLuck= this.state.orgGifts.filter((data)=>data.GIFT==value)
      sendGift(this.state.userPhone,IdLuck[0].ID) 
  }
 
  render() {
    
    const wheelOptions = {
      rewards:this.state.gifts,
      knobSize: 30,
      borderWidth: 5,
      borderColor: '#fff',
      innerRadius: 30,
      duration: 6000,
      backgroundColor: 'transparent',
      textAngle: 'horizontal',
      knobSource: require('../../../assest/knob.png'),
      onRef: ref => (this.child = ref),
    };
    return (
      <View style={styles.container}>
        {/* {console.log(this.state.gifts,'this.state.gifts')} */}
      
        <StatusBar barStyle={'light-content'} />
        <ModalWheel isModalVisible={this.state.modalVisible} setModalVisible={()=>this.setModalVisible()} setPermission={(userName)=>this.setPermission(userName) } />
        {
         this.state.show && <WheelOfFortune
            options={wheelOptions}  
          // options={{rewards:this.state.gifts, onRef: ref => (this.child = ref),}}
           getWinner={(value, index) => {
             this.setState({winnerValue: value, winnerIndex: index});
            //  console.log(value, index,'value, index')
             this.changeGifts(value)
           }}
         />
        }
         
        {!this.state.started && (
          <View style={styles.startButtonView}>
            <TouchableOpacity
              onPress={() => this.buttonPress()}
              style={styles.startButton}>
              <Text style={styles.startButtonText}>{`${this.state.titleWheel}`}</Text>
            </TouchableOpacity>
          </View>
        )}
        {this.state.winnerIndex != null && (
          <View style={styles.winnerView}>
            <Text style={styles.winnerText}>
             شما برنده شدید{this.state.gifts[this.state.winnerIndex]}
            </Text>
            {/* <TouchableOpacity
              onPress={() => {
                this.setState({winnerIndex: null});
                this.child._tryAgain();
              }}
              style={styles.tryAgainButton}>
              <Text style={styles.tryAgainText}>دوباره امتحان کنید</Text>
            </TouchableOpacity> */}
          </View>
        )}
      </View>
    );
  }
}
export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E74C3C'
  },
  startButtonView: {
    position: 'absolute',
  },
  startButton: {
    backgroundColor: 'rgba(0,0,0,.5)',
    marginTop: 50,
    padding: 5,
  },
  startButtonText: {
    fontSize: 50,
    color: '#fff',
    fontWeight: 'bold',
  },
  winnerView: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  tryAgainButton: {
    padding: 10,
  },
  winnerText: {
    fontSize: 30,
  },
  tryAgainButton: {
    padding: 5,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  tryAgainText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
});