import React from 'react';
import {API} from '../../api/API';
import decrementIcon from "../../img/icons/decrement.png";
import incrementIcon from "../../img/icons/increment.png";

class AccountEditor extends React.Component {
    constructor(param) {
        super(param);
    }

    async update() {
        try {
            let headers = {
                id: this.props.account.id,
                token: this.props.account.token,
            }
            const response = await API.put('account/update', JSON.stringify(this.props.account), {headers: headers});
            console.log(response);
            sessionStorage.setItem('account', JSON.stringify(response.data))
        } catch (error) {
            console.log(error)
            alert(`Something went wrong updating your account: \n
            ${error.message}\n
            ${error.response?.data.message}
            `);
        }
    }

    async delete() {
        try {
            let headers = {
                id: this.props.account.id,
                token: this.props.account.token,
            }
            const response = await API.delete('account/delete', {headers: headers});
            console.log(response);
        } catch (error) {
            console.log(error)
            alert(`Something went wrong deleting your account: \n
            ${error.message}\n
            ${error.response?.data.message}
            `);
        }
    }

    ready() {
        return this.props.account.password == this.props.account.confirmPassword;
    }

    render() {
        if (!this.props.account) return null;

        return <table>
            <tr>
                <td><p className="DefaultLabel" >{`id`}</p></td>
                <td><p className="DefaultLabel" >{`#${this.props.account.id}`}</p></td>
            </tr>
            <tr>
                <td><p className="DefaultLabel" >{`email`}</p></td>
                <td><input
                    className="InputField"
                    type="email"
                    defaultValue={this.props.account.email}
                    onChange={e => {this.props.account.email = e.target.value;}}
                /></td>
            </tr>
            <tr>
                <td><p className="DefaultLabel" >{`password`}</p></td>
                <td><input
                    className="InputField"
                    type="password"
                    defaultValue={this.props.account.password}
                    onChange={e => {this.props.account.password = e.target.value;}}
                /></td>
            </tr>
            <tr>
                <td><p className="DefaultLabel" >{`confirm password`}</p></td>
                <td><input
                    className="InputField"
                    type="password"
                    defaultValue={this.props.account.confirmPassword}
                    onChange={e => {this.props.account.confirmPassword = e.target.value;}}
                /></td>
            </tr>
            <tr>
                <td><p className="DefaultLabel" >{`address`}</p></td>
                <td><input
                    className="InputField"
                    type="address"
                    defaultValue={this.props.account.address}
                    onChange={e => {this.props.account.address = e.target.value;}}
                /></td>
            </tr>
            <tr>
                <td><p className="DefaultLabel" >{`phone number`}</p></td>
                <td><input
                    className="InputField"
                    type="phone"
                    defaultValue={this.props.account.phoneNumber}
                    onChange={e => {this.props.account.phoneNumber = e.target.value;}}
                /></td>
            </tr>
            <tr>
                <td><button className="Button Wide Delete" onClick={() => this.delete()}>delete account</button></td>
                <td><button className="Button Wide" onClick={() => this.update()} disabled={!this.ready()}>update</button></td>
            </tr>
        </table>
    }
}

export default AccountEditor;