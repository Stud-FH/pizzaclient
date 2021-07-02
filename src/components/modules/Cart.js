import React from 'react';
import {API} from '../../api/API';
import decrementIcon from "../../img/icons/decrement.png";
import incrementIcon from "../../img/icons/increment.png";

class Cart extends React.Component {
    constructor(param) {
        super(param);
        this.state = {
        }
    }

    async createOrder() {
        let cart = JSON.parse(sessionStorage.getItem('cart'))
        let account = JSON.parse(sessionStorage.getItem('account'))
        let pizzaIds = [];
        for (let key in cart) {
            for (let i = 0; i < cart[key]; i++) {
                pizzaIds.push(key)
            }
        }
        try {
            const requestBody = JSON.stringify({pizzaIds: pizzaIds, comment: sessionStorage.getItem('orderComment')});
            const headers = {
                id: account.id,
                token: account.token,
            };
            const response = await API.post('/orders/create', requestBody,{headers:headers});
            console.log(response);
        } catch (error) {
            console.log(error)
            alert(`Something went wrong during the order creation: \n
            ${error.message}\n
            ${error.response?.data.message}
            `);
        }
        sessionStorage.setItem('cart', '{}')
        this.setState({cart: null, pizza: null})
    }

    render() {
        if (!this.props.pizzaMap) return null;

        let cart = JSON.parse(sessionStorage.getItem('cart'))
        if (!cart) cart = {};
        let total = 0;
        for (let id in cart) {
            total += cart[id] * this.props.pizzaMap[id].price;
        }
        let delivery = total < 40? 5 : 0;
        total += delivery;

        return <div
            style={{
                margin: '20px',
                display: 'flex',
                flexDirection: 'column'
            }}
        >
            {(cart && Object.keys(cart).length)?
                <div style={{display: 'grid', alignItems: 'center', justifyContent: 'center', gridGap: '15px'}}>
                    <table>
                        {Object.keys(cart).map(id => this.pizzaItem(this.props.pizzaMap[id], cart[id])).concat([

                            <tr>
                                <td></td>
                                <td><p className="DefaultLabel">{`delivery:`}</p></td>
                                <td></td>
                                <td><p className="DefaultLabel">{`${delivery}.-`}</p></td>
                            </tr>,
                            <tr>
                                <td></td>
                                <td><p className="DefaultLabel">{`total:`}</p></td>
                                <td></td>
                                <td><p className="DefaultLabel" style={{fontWeight: 'bold'}}>{`${total}.-`}</p></td>
                            </tr>
                        ])}
                    </table>


                    <input className="InputField"
                           placeholder="Enter a comment..."
                           style={{display: 'inline'}}
                           defaultValue={sessionStorage.getItem('orderComment')}
                           onChange={e => sessionStorage.setItem('orderComment', e.target.value)}
                    />

                    <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
                        <button className="Button" onClick={() => this.createOrder()}>
                            place order
                        </button>
                    </div>
                </div>
                :
                <p className="DefaultLabel"> shopping cart is empty </p>
            }


        </div>
    }

    pizzaItem(pizza, amount) {
        return <tr style={{alignItems: 'center'}}>

            <td>
                <img
                    src="https://m.bettybossi.ch/static/rezepte/x/bb_itku120801_0243a_x.jpg"
                    style={{
                        width: '50px',
                        height: '50px',
                        marginRight: '10px',
                    }}
                />
            </td>

            <td>
                <p className="DefaultLabel">{pizza.name}</p>
            </td>


            <td>
                <div style={{width: '120px', display: 'flex', flexDirection:'row', alignItems: 'center', justifyContent: 'space-evenly'}}>

                    <button className="ImageButton"
                            style={{width: '35px', height: '35px', backgroundImage:`url(${decrementIcon})`}}
                            onClick={() => {
                                let cartCopy = JSON.parse(sessionStorage.getItem('cart'));
                                cartCopy[pizza.id]--;
                                cartCopy[pizza.id] = cartCopy[pizza.id]? cartCopy[pizza.id] : undefined;
                                sessionStorage.setItem('cart', JSON.stringify(cartCopy));
                                this.setState({
                                    cart: cartCopy
                                })
                            }}
                    />

                    <p className="DefaultLabel">{amount}</p>

                    <button className="ImageButton"
                            style={{width: '35px', height: '35px', backgroundImage:`url(${incrementIcon})`}}
                            onClick={() => {
                                let cartCopy = JSON.parse(sessionStorage.getItem('cart'));
                                cartCopy[pizza.id]++;
                                cartCopy[pizza.id] = cartCopy[pizza.id]? cartCopy[pizza.id] : undefined;
                                sessionStorage.setItem('cart', JSON.stringify(cartCopy));
                                this.setState({
                                    cart: cartCopy
                                })
                            }}
                    />
                </div>
            </td>


            <td><p className="DefaultLabel">{`${pizza.price * amount}.-`}</p></td>
        </tr>
    }
}

export default Cart;