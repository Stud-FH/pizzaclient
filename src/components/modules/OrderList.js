import React from 'react';
import {API} from '../../api/API';
import decrementIcon from "../../img/icons/decrement.png";
import incrementIcon from "../../img/icons/increment.png";

class OrderList extends React.Component {
    constructor(param) {
        super(param);
        this.state = {
            orders: null,
        }
    }

    async componentDidMount() {
        if (!this.props.account || this.props.account.clearanceLevel < 0) return;
        try {
            let url = `/orders/all${this.props.account.clearanceLevel? '' : `?customerId=${this.props.account.id}`}`;
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

    render() {
        if (!this.props.account) return this.plainInfo('this feature requires to be logged in');
        if (!this.state.orders?.length) return this.plainInfo('no orders');

        return <div className="MenuContainer">
            {this.state.orders.map(order => this.orderItem(order))}
        </div>
    }

    plainInfo(text) {
        return <div className="MenuContainer"><p className="DefaultLabel">{text}</p></div>
    }

    orderItem(order) {
        let amountMap = {};
        for (let id of order.pizzaIds) {
            amountMap[id] = amountMap[id]? amountMap[id] +1 : 1;
        }

        return <div style={{
            display: 'flex',
            flexDirection: 'column',
            padding: '5px',
            marginBottom: '30px',
            border: '1px solid white',
            borderRadius: '5px',

        }}>
            <p className="DefaultLabel" style={{borderBottom: '1px dotted white', fontWeight: 'bold'}}>{`order #${order.id}`}</p>
            {this.orderStatus(order.status)}
            <p className="DefaultLabel" style={{borderTop: '1px dotted white'}}>{order.phoneNumber}</p>
            <p className="DefaultLabel" style={{borderBottom: '1px dotted white'}}>{order.address}</p>

            {Object.keys(amountMap).map(id =>
                <p className="DefaultLabel">{`${this.props.pizzaMap[id].name} × ${amountMap[id]}`}</p>)}
            <p className="DefaultLabel" style={{borderTop: '1px dotted white'}}>{`${order.price}.-`}</p>
            {order.comment? <p className="DefaultLabel" style={{borderTop: '1px dotted white'}}>{order.comment}</p> : null}
        </div>
    }

    orderStatus(status) {
        switch (status) {
            case 'CREATED': return <p className="DefaultLabel" style={{color: '#00ffee'}}>{'awaiting confirmation'}</p>
            case 'CONFIRMED': return <p className="DefaultLabel" style={{color: '#44ff00'}}>{'in the kitchen'}</p>
            case 'READY': return <p className="DefaultLabel" style={{color: '#ff0000'}}>{'in delivery'}</p>
            case 'DELIVERED': return <p className="DefaultLabel" style={{color: '#666666'}}>{'delivered'}</p>
        }
    }
}

export default OrderList;