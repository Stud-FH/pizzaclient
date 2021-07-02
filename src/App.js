import React from 'react';
import './App.css';
import Sidebar from "./components/modules/Sidebar";
import Login from "./components/modules/Login";
import Cart from "./components/modules/Cart";
import Shop from "./components/modules/Shop";
import pizzaStackIcon from "./img/icons/pizza-stack.png";
import menuIcon from "./img/icons/menu.png";
import ordersIcon from "./img/icons/orders.png";
import {API} from "./api/API";
import OrderList from "./components/modules/OrderList";
import PizzaDesigner from "./components/modules/PizzaDesigner";
import IngredientDesigner from "./components/modules/IngredientDesigner";
import AccountEditor from "./components/modules/AccountEditor";
import OrderManager from "./components/modules/OrderManager";
import RemoteAccountEditor from "./components/modules/RemoteAccountEditor";

class App extends React.Component {
  constructor(param) {
    super(param);
    this.state = {
      menu: null,
      screen: 'shop',
      pizzaList: null,
      pizzaMap: null,
      ingredientList: null,
      ingredients: null,
      account: null,
      orders: null,
    };
  }

  async componentDidMount() {
    let account = sessionStorage.getItem('account');
    account = account? JSON.parse(account) : null;
    let screen = sessionStorage.getItem('screen');

    let pizzaList = await this.fetchData('/pizzas/all');

    this.fetchData('/ingredients/all').then(ingredientList => {
      let ingredientMap = {};
      let pizzaMap = {};
      for (let ingredient of ingredientList) {
        ingredientMap[ingredient.id] = ingredient;
      }
      for (let pizza of pizzaList) {
        pizza.ingredients = pizza.ingredientIds.map(id => ingredientMap[id]);
        pizzaMap[pizza.id] = pizza;
      }
      this.setState({
        screen: screen,
        account: account,
        pizzaList: pizzaList,
        pizzaMap: pizzaMap,
        ingredientList: ingredientList,
        ingredientMap: ingredientMap,
      });
      localStorage.setItem('pizzas', JSON.stringify(pizzaMap))
      localStorage.setItem('ingredients', JSON.stringify(ingredientMap))
    });
  }

  async fetchData(url, headers) {
    try {
      const response = await API.get(url, {headers: headers});
      console.log(response);
      return response.data;
    } catch (error) {
      console.log(error)
      alert(`Something went wrong fetching data: \n
            ${error.message}\n
            ${error.response?.data.message}
            `);
    }
  }

  login(data) {
    this.setState({account: data});
    this.fetchData(`/orders/all${data.clearanceLevel? '' : `?customerId=${data.id}`}`).then(data => this.setState({orders: data}));
  }

  logout() {
    this.setState({account: null});
    sessionStorage.removeItem('account');
  }

  render() {
    let iconSize = '40px';
    let toolbarWidth = '200px';

    return <div style={{display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh'}}>

      <div className="NavbarContainer">

        <div/>

        <p className="AppTitle">404 Pizza</p>

        <div style={{width: toolbarWidth, display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly'}}>
          <button
              className="ImageButton"
              style={{backgroundImage:`url(${menuIcon})`, width: iconSize, height: iconSize}}
              onClick={() => this.setMenu('navigation')}
          />
          <button
              className="ImageButton"
              style={{backgroundImage:`url(${pizzaStackIcon})`, width: iconSize, height: iconSize}}
              onClick={() => this.setMenu('cart')}
          />
          <button
              className="ImageButton"
              style={{backgroundImage:`url(${ordersIcon})`, width: iconSize, height: iconSize}}
              onClick={() => this.setMenu('orders')}
          />
        </div>
      </div>

      <div className="BaseContainer">

        <div
            style={{
              height: '100%',
              paddingTop: '75px',
            }}
            onClick={() => this.setMenu(null)}
        >

          {this.getScreen()}
        </div>

        <Sidebar enabled={this.state.menu == 'navigation'}>
          {this.getNavigation()}
        </Sidebar>

        <Sidebar enabled={this.state.menu == 'login'}>
          <Login onLogin={data => this.setState({account: data})}/>
        </Sidebar>

        <Sidebar enabled={this.state.menu == 'cart'}>
          <Cart pizzaMap={this.state.pizzaMap} />
        </Sidebar>

        <Sidebar enabled={this.state.menu == 'orders'}>
          <OrderList account={this.state.account} pizzaMap={this.state.pizzaMap}/>
        </Sidebar>

      </div>

    </div>
  }

  setMenu(param) {
    if (this.state.menu == param) param = null;
    if (!this.state.account && ['cart', 'orders'].includes(param)) param = 'login'
    this.setState({menu: param})

  }

  setScreen(param) {
    this.setState({screen: param})
    sessionStorage.setItem('screen', param)
  }

  getScreen() {
    switch(this.state.screen) {
      case 'shop': return Shop(this.state.pizzaList);
      case 'accountEditor': return <AccountEditor account={this.state.account} />
      case 'orderManager': return <OrderManager pizzaMap={this.state.pizzaMap} account={this.state.account} />
      case 'ingredientDesigner': return <IngredientDesigner ingredients={this.state.ingredientList} account={this.state.account} />
      case 'pizzaDesigner': return <PizzaDesigner pizzas={this.state.pizzaList} ingredientMap={this.state.ingredientMap} account={this.state.account}/>
      case 'remoteAccountEditor': return <RemoteAccountEditor account={this.state.account} />
    }
    return null;
  }

  getNavigation() {
    return <div style={{
      display: 'flex',
      flexDirection: 'column'
    }}>
      {
        this.state.account?
            <table style={{margin: '10px', border: '1px solid white', borderRadius: '5px'}}>
              <tr>
                <td><p className="NavigationInfo">logged in as:</p></td>
                <td><p className="NavigationInfo">{this.state.account.email}</p></td>
              </tr>
              <tr>
                <td><p className="NavigationInfo">address:</p></td>
                <td><p className="NavigationInfo">{this.state.account.address}</p></td>
              </tr>
              <tr>
                <td><p className="NavigationInfo">phone number:</p></td>
                <td><p className="NavigationInfo">{this.state.account.phoneNumber}</p></td>
              </tr>
              <tr>
                <td><button className="Button" onClick={() => this.setState({screen: 'accountEditor'})}>edit</button></td>
                <td><button className="Button" onClick={() => this.logout()}>log out</button></td>
              </tr>
            </table> :
            <Login onLogin={data => this.setState({account: data})}/>
      }
      <button className="Button LinkLabel" onClick={() => this.setScreen('shop')}>
        ► pizza shop {this.state.screen === 'shop'? ' (you are here)' : ''}
      </button>
      <button className="Button LinkLabel" onClick={() => this.setScreen('about')}>
        ► about us {this.state.screen === 'about'? ' (you are here)' : ''}
      </button>
      <button className="Button LinkLabel" onClick={() => this.setScreen('imprint')}>
        ► imprint {this.state.screen === 'imprint'? ' (you are here)' : ''}
      </button>
      {
        this.state.account? [
          <p className="NavigationSubtitle">customer tools</p>,
          <button className="Button LinkLabel" onClick={() => this.setScreen('accountEditor')}>
            ► account editor {this.state.screen === 'accountEditor'? ' (you are here)' : ''}
          </button>
        ] : null
      }
      {
        this.state.account?.clearanceLevel >= 1? [
          <p className="NavigationSubtitle">employee tools</p>,
          <button className="Button LinkLabel" onClick={() => this.setScreen('orderManager')}>
            ► order manager {this.state.screen === 'orderManager'? ' (you are here)' : ''}
          </button>
        ] : null
      }
      {
        this.state.account?.clearanceLevel >= 2? [
            <p className="NavigationSubtitle">supervisor tools</p>,
            <button className="Button LinkLabel" onClick={() => this.setScreen('ingredientDesigner')}>
              ► ingredient designer {this.state.screen === 'ingredientDesigner'? ' (you are here)' : ''}
            </button>,
            <button className="Button LinkLabel" onClick={() => this.setScreen('pizzaDesigner')}>
              ► pizza designer {this.state.screen === 'pizzaDesigner'? ' (you are here)' : ''}
            </button>
        ] : null
      }
      {
        this.state.account?.clearanceLevel >= 3? [
          <p className="NavigationSubtitle">admin tools</p>,
          <button className="Button LinkLabel" onClick={() => this.setScreen('remoteAccountEditor')}>
            ► remote account editor {this.state.screen === 'remoteAccountEditor'? ' (you are here)' : ''}
          </button>
        ] : null
      }
    </div>
  }

}

export default App;
