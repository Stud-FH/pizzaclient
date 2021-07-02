import React from 'react';
import {API} from '../../api/API';
import decrementIcon from "../../img/icons/decrement.png";
import incrementIcon from "../../img/icons/increment.png";

class RemoteAccountEditor extends React.Component {
    constructor(param) {
        super(param);
        this.state = {
            remote: null,
        }
    }

    componentDidMount() {
        let remote = sessionStorage.getItem('remote');
        remote = remote? JSON.parse(remote) : {};
        this.setState({
            remote: remote,
        });
    }

    async fetch() {
        if (!this.state.remote.id) return;
        try {
            let headers = {
                id: this.props.account.id,
                token: this.props.account.token,
            }
            const response = await API.get(`account/get?remote=${this.state.remote.id}`, {headers: headers});
            console.log(response);
            sessionStorage.setItem('remote', JSON.stringify(response.data));
            window.location.reload();
        } catch (error) {
            console.log(error)
            alert(`Something went wrong fetching data: \n
            ${error.message}\n
            ${error.response?.data.message}
            `);
        }
    }

    async update() {
        if (!this.state.remote.id) return;
        try {
            let headers = {
                id: this.props.account.id,
                token: this.props.account.token,
            }
            const response = await API.put(`account/update?remote=${this.state.remote.id}`, JSON.stringify(this.state.remote), {headers: headers});
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
        if (!this.state.remote.id) return;
        try {
            let headers = {
                id: this.props.account.id,
                token: this.props.account.token,
            }
            const response = await API.delete(`account/delete?remote=${this.state.remote.id}`, {headers: headers});
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
        return this.state.remote?.password == this.state.remote?.confirmPassword;
    }

    render() {
        if (!this.props.account) return null;

        return <table>
            <tr>
                <td><p className="DefaultLabel" >{`id`}</p></td>
                <td><input
                    className="InputField"
                    defaultValue={this.state.remote?.id}
                    onChange={e => {this.state.remote.id = e.target.value;}}
                /></td>
            </tr>
            <tr>
                <td></td>
                <td><button className="Button Wide" onClick={() => this.fetch()} disabled={!this.ready()}>fetch</button></td>
            </tr>
            <tr>
                <td><p className="DefaultLabel" >{`clearance level`}</p></td>
                <td><input
                    className="InputField"
                    defaultValue={this.state.remote?.clearanceLevel}
                    onChange={e => {this.state.remote.clearanceLevel = e.target.value;}}
                /></td>
            </tr>
            <tr>
                <td><p className="DefaultLabel" >{`token`}</p></td>
                <td><input
                    className="InputField"
                    defaultValue={this.state.remote?.token}
                    onChange={e => {this.state.remote.token = e.target.value;}}
                /></td>
            </tr>
            <tr>
                <td><p className="DefaultLabel" >{`email`}</p></td>
                <td><input
                    className="InputField"
                    type="email"
                    defaultValue={this.state.remote?.email}
                    onChange={e => {this.state.remote.email = e.target.value;}}
                /></td>
            </tr>
            <tr>
                <td><p className="DefaultLabel" >{`password`}</p></td>
                <td><input
                    className="InputField"
                    type="password"
                    defaultValue={this.state.remote?.password}
                    onChange={e => {this.state.remote.password = e.target.value;}}
                /></td>
            </tr>
            <tr>
                <td><p className="DefaultLabel" >{`confirm password`}</p></td>
                <td><input
                    className="InputField"
                    type="password"
                    defaultValue={this.state.remote?.confirmPassword}
                    onChange={e => {this.state.remote.confirmPassword = e.target.value;}}
                /></td>
            </tr>
            <tr>
                <td><p className="DefaultLabel" >{`address`}</p></td>
                <td><input
                    className="InputField"
                    type="address"
                    defaultValue={this.state.remote?.address}
                    onChange={e => {this.state.remote.address = e.target.value;}}
                /></td>
            </tr>
            <tr>
                <td><p className="DefaultLabel" >{`phone number`}</p></td>
                <td><input
                    className="InputField"
                    type="phone"
                    defaultValue={this.state.remote?.phoneNumber}
                    onChange={e => {this.state.remote.phoneNumber = e.target.value;}}
                /></td>
            </tr>
            <tr>
                <td><button className="Button Wide Delete" onClick={() => this.delete()}>delete account</button></td>
                <td><button className="Button Wide" onClick={() => this.update()} disabled={!this.ready()}>update</button></td>
            </tr>
        </table>
    }
}

export default RemoteAccountEditor;