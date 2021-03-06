import React, { Component } from 'react';
import { Image, View, StyleSheet, Text, ToastAndroid } from 'react-native';
import { Container, Content, Header, Left, Button, Icon, Body, Title } from 'native-base';
import PosterModel from '../Model/PosterModel';
import AccountKit, { LoginButton } from 'react-native-facebook-account-kit';
import NativeBaseAccountKitLoginButton from './NativeBaseAccountKitLoginButton'

export default class CheckoutScreen extends React.Component {

  static propTypes = {
    poster: React.PropTypes.instanceOf(PosterModel).isRequired,
  };

  static defaultProps = {
    poster: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      poster: this.props.poster,
      authToken: null,
      loggedAccount: null
    };
  }

  componentWillMount () {
    AccountKit.configure({
      countryWhitelist: ['ID', 'US', 'CA'],
      defaultCountry: 'ID',
      title: 'My Posterific App'
    })
    AccountKit.getCurrentAccessToken()
    .then((token) => {
      if (token) {
        AccountKit.getCurrentAccount()
        .then((account) => {
          this.setState({
            authToken: token,
            loggedAccount: account
          })
        })
      } else {
        console.log('N account logged in')
      }
    })
    .catch((e) => console.log('Access token request failed', e))
  }

  render() {
    return (
      <Image
        resizeMode="cover"
        source={require('./../assets/images/login-splash-bg.jpg')}
        style={styles.splashContainer}
      >
        <Container>
          <Header style={{ backgroundColor: '#3770CC' }}>
            <Left>
              <Button transparent onPress={
                () => {
                  this.props.navigator.pop()
                }
              }>
                <Icon name='md-arrow-round-back' />
              </Button>
            </Left>
            <Body>
              <Title style={{ fontSize: 15 }}>Checkout</Title>
            </Body>
          </Header>
          <Content contentContainerStyle={styles.contentContainer}>
            <View style={styles.imageTextWrapper}>
              <View style={styles.congratsWrapper}>
                <Text style={[styles.congrats]}>Thank You!</Text>
              </View>
              <View style={styles.imgWrapper}>
                <Image
                  resizeMode="contain"
                  style={styles.img}
                  source={{ uri: this.state.poster.thumbnailUri }}
                />
              </View>
            </View>

            {
              this.state.loggedAccount ? this.renderUserDetails() : this.renderLoginUi()
            }

          </Content>
        </Container>
      </Image>
    )
  }

  renderLoginUi () {
    return (
      <View>
        <Button
          info
          iconRight
          block
          rounded
          style={{ margin: 10 }}
          onPress={() => {
            this.loginWithEmail();
          }}
        >
          <Text style={[styles.btnText]}>Login with Email</Text>
          <Icon name='md-mail' />
        </Button>
        <NativeBaseAccountKitLoginButton
          style={{ margin: 10 }}
          type='phone'
          onLogin={(token) => this.onLoginSuccess(token)}
          onError={(e) => this.onLoginError(e)}
          >
          <Text>Login with SMS</Text>
          <Icon name='md-phone-potrait' />
        </NativeBaseAccountKitLoginButton>
      </View>
    )
  }

  renderUserDetails () {
    const { id, email, phoneNumber } = this.state.loggedAccount
    return (
      <View>
        <Text style={[styles.btnText]}>Account Kit User : { id }</Text>
        <Text style={[styles.btnText]}>Account Kit Email : { email }</Text>
        { (phoneNumber)
          ? <Text style={[styles.btnText]}>Account Kit Email : { phoneNumber.countryCode } { phoneNumber.number }</Text>
          : null
        }
        <Button
          onPress={() => {
            this.logout();
          }}
        >
          <Text style={[styles.btnText]}>Logout</Text>
        </Button>
      </View>
    )
  }

  logout () {
    AccountKit.logout()
    .then(() => {
      this.setState({
        authToken: null,
        loggedAccount: null
      })
    })
    .catch((e) => console.log('logout failed'))
  }

  logUserPurchase() {
    // assume that the "transaction" succeeded and the purchase was made
    ToastAndroid.showWithGravity("Your purchase was successful", ToastAndroid.LONG, ToastAndroid.CENTER);
  }

  loginWithEmail() {
    AccountKit.loginWithEmail()
    .then((token) => {
      this.onLoginSuccess(token)
    })
    .catch((e) => {
      this.onLoginError(e)
    })
  }

  onLoginSuccess (token) {
    if (!token) {
      console.warn('User canceled login')
      this.setState({
        authToken: null,
        loggedAccount: null
      })
    } else {
      AccountKit.getCurrentAccount()
      .then((account) => {
        this.setState({
          authToken: token,
          loggedAccount: account
        })
        console.log('user already logged in, completing purchase')
        this.logUserPurchase()
      })
    }
  }

  onLoginError (e) {
    console.log('Failed to login', e)
  }

}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  contentContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    padding: 10,
  },

  congratsWrapper: {
    margin: 10,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  congrats: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 20,
  },
  imgWrapper: {
    flex: 1,
    alignItems: 'center'
  },
  img: {
    width: 300,
    height: 300,
  },
  btnText: {
    color: '#FFF',
    fontWeight: 'bold',
  },

});
