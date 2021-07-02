import React from 'react';
import {API} from '../../api/API';
import decrementIcon from "../../img/icons/decrement.png";
import incrementIcon from "../../img/icons/increment.png";

class OrderManager extends React.Component {
    constructor(param) {
        super(param);
        this.state = {
            orders: null,
        }
    }

    async componentDidMount() {
        if (!this.props.account || this.props.account.clearanceLevel < 1) return;
        try {
            let url = `/orders/all`;
            let headers = {
                accountId: this.props.account.id,
                token: this.props.account.token
            }
            const response = await API.get(url, {headers: headers});
            console.log(response);
            this.setState({orders: response.data})
        } catch (error) {
            console.log(error)
            alert(`Something went wrong fetching data: \n
            ${error.message}\n
            ${error.response?.data.message}
            `);
        }
    }

    async update(updateEntity) {
        try {
            let headers = {
                accountId: this.props.account.id,
                token: this.props.account.token,
                orderId: updateEntity.id,
            }
            const response = await API.put('orders/update', JSON.stringify(updateEntity), {headers: headers});
            console.log(response);
        } catch (error) {
            console.log(error)
            alert(`Something went wrong updating the order: \n
            ${error.message}\n
            ${error.response?.data.message}
            `);
        }
    }

    render() {
        if (!this.state.orders || !this.props.pizzaMap) return null;

        return <table>
            <tr>
                <th><p className="DefaultLabel" >{`id`}</p></th>
                <th><p className="DefaultLabel" >{`address`}</p></th>
                <th><p className="DefaultLabel" >{`phone number`}</p></th>
                <th><p className="DefaultLabel" >{`pizzas`}</p></th>
                <th><p className="DefaultLabel" >{`comment`}</p></th>
                <th><p className="DefaultLabel" >{`price`}</p></th>
                <th><p className="DefaultLabel" >{`status`}</p></th>
                <th><p className="DefaultLabel" >{`confirm`}</p></th>
            </tr>
            {this.state.orders.map(order => this.orderItem(order))}
        </table>
    }

    orderItem(order) {
        return <tr>
            <td><p className="DefaultLabel" >{`#${order.id}`}</p></td>
            <td><p className="DefaultLabel" >{order.address}</p></td>
            <td><p className="DefaultLabel" >{order.phoneNumber}</p></td>


            <td>{this.pizzaInfo(order)}</td>

            <td><input
                className="InputField"
                defaultValue={order.comment}
                style={{width: '100px'}}
                onChange={e => {order.comment = e.target.value;}}
            /></td>

            <td><p className="DefaultLabel" >{`${order.price}.-`}</p></td>

            <td><select
                className="InputField"
                defaultValue={order.status}
                onChange={e => {order.status = e.target.value}}
            >
                <option value="CREATED">created</option>
                <option value="CONFIRMED">confirmed</option>
                <option value="READY">ready</option>
                <option value="DELIVERED">delivered</option>
            </select></td>

            <td><button
                className="Button"
                onClick={() => this.update(order)}
            >update</button></td>
        </tr>
    }

    pizzaInfo(order) {
        let amountMap = {};
        for (let id of order.pizzaIds) {
            amountMap[id] = amountMap[id]? amountMap[id] +1 : 1;
        }
        return Object.keys(amountMap).map(id => <button className="Box">{`${this.props.pizzaMap[id].name} × ${amountMap[id]}`}</button>)
    }
}

export default OrderManager;