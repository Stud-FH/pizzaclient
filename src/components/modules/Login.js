import React from 'react';
import {API} from '../../api/API';

class Login extends React.Component {
    constructor(param) {
        super(param);
        this.state = {
            registerMode: false,
            email: null,
            password: null,
            passwordConfirmation: null,
            address: null,
            phoneNumber: null,
        }
    }

    async login() {
        try {
            const headers = {
                email: this.state.email,
                password: this.state.password
            };
            const response = await API.get('/account/login', {headers:headers});
            console.log(response);
            sessionStorage.setItem('account', JSON.stringify(response.data))
            if (this.props.onLogin) this.props.onLogin(response.data);
        } catch (error) {
            console.log(error)
            alert(`Something went wrong during the login: \n
            ${error.message}\n
            ${error.response?.data.message}
            `);
        }
    }

    async register() {
        try {
            const requestBody = JSON.stringify({
                email: this.state.email,
                password: this.state.password,
                address: this.state.address,
                phoneNumber: this.state.phoneNumber,
            });
            const response = await API.post('/account/create', requestBody);
            console.log(response);
            sessionStorage.setItem('account', JSON.stringify(response.data))
            if (this.props.onLogin) this.props.onLogin(response.data);
        } catch (error) {
            alert(`Something went wrong during the registration: \n
            ${error.message}\n
            ${error.response?.data.message}
            `);
        }
    }

    ready() {
        return (this.state.email && this.state.password &&
            (!this.state.registerMode ||
                (this.state.address && this.state.phoneNumber &&
                    this.state.password == this.state.passwordConfirmation)))
    }

    render() {
        return <div style={{margin: '20px'}}>
            <div style={{display:'flex'}}>
                <button className='Button'
                    style={{
                        width: '50%',
                        background: !this.state.registerMode?'#74b72e' : '#00000010',
                    }}
                    onClick={() => {this.setState({registerMode: false})}}
                >
                    login
                </button>
                <button
                    className="Button"
                    style={{
                        width: '50%',
                        background: this.state.registerMode?'#74b72e' : '#00000010',
                    }}
                    onClick={() => {this.setState({registerMode: true})}}
                >
                    register
                </button>
            </div>
            {this.state.registerMode? this.registerForm() : this.loginForm()}
            <div
                style={{ width:'inherit', display: 'flex', flexDirection: 'row', justifyContent: 'center'}}
            >
                <button
                    className='Button'
                    onClick={() => {this.state.registerMode? this.register() : this.login()}}
                    disabled={!this.ready()}
                >
                    {this.state.registerMode? 'register' : 'log in'}
                </button>
            </div>
        </div>
    }

    loginForm() {
        return <div>
            <p className="Label">
                email:
            </p>
            <input className="InputField"
                   type="email"
                   placeholder="Enter here..."
                   onChange={e => this.setState({email: e.target.value})}
            />
            <p className="Label">
                password:
            </p>
            <input className="InputField"
                   type="password"
                   placeholder="Enter here..."
                   onChange={e => this.setState({password: e.target.value})}
            />
        </div>
    }

    registerForm() {
        return <div>
            <p className="Label">email:
            </p>
            <input className="InputField"
                   type="email"
                   placeholder="Enter here..."
                   onChange={e => this.setState({email: e.target.value})}
            />
            <p className="Label">
                password:
            </p>
            <input className="InputField"
                   type="password"
                   placeholder="Enter here..."
                   onChange={e => this.setState({password: e.target.value})}
            />
            <p className="Label">
                confirm password:
            </p>
            <input className="InputField"
                   type="password"
                   placeholder="Enter here..."
                   onChange={e => this.setState({passwordConfirmation: e.target.value})}
            />
            <p className="Label">
                address:
            </p>
            <input className="InputField"
                   type="address"
                   placeholder="Enter here..."
                   onChange={e => this.setState({address: e.target.value})}
            />
            <p className="Label">
                phone number:
            </p>
            <input className="InputField"
                   type="phone"
                   placeholder="Enter here..."
                   onChange={e => this.setState({phoneNumber: e.target.value})}
            />
        </div>
    }
}

export default Login;