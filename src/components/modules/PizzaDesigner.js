import React from 'react';
import {API} from '../../api/API';
import decrementIcon from "../../img/icons/decrement.png";
import incrementIcon from "../../img/icons/increment.png";

class PizzaDesigner extends React.Component {
    constructor(param) {
        super(param);
        this.state = {
            templates: [this.templatePizza()],
        }
    }

    templatePizza() {
        let template = {};
        template.id = '?';
        template.name = null;
        template.desc = null;
        template.available = true;
        template.price = 15;
        template.ingredients = [];
        template.ingredientIds = [];
        return template;
    }

    async create(entity) {
        entity.ingredientIds = entity.ingredients.map(ingredient => ingredient.id);
        try {
            entity.id = null;
            let headers = {
                accountId: this.props.account.id,
                token: this.props.account.token,
            }
            const response = await API.post('pizzas/create', JSON.stringify(entity), {headers: headers});
            console.log(response);
            entity.id = response.data.id;
            window.location.reload();
        } catch (error) {
            console.log(error)
            alert(`Something went wrong creating the pizza: \n
            ${error.message}\n
            ${error.response?.data.message}
            `);
        }
    }

    async update(updateEntity) {
        updateEntity.ingredientIds = updateEntity.ingredients.map(ingredient => ingredient.id);
        try {
            let headers = {
                accountId: this.props.account.id,
                token: this.props.account.token,
                pizzaId: updateEntity.id,
            }
            const response = await API.put('pizzas/update', JSON.stringify(updateEntity), {headers: headers});
            console.log(response);
        } catch (error) {
            console.log(error)
            alert(`Something went wrong updating the pizza: \n
            ${error.message}\n
            ${error.response?.data.message}
            `);
        }
    }

    render() {
        if (!this.props.pizzas || !this.props.ingredientMap) return null;

        return <table>
            <tr>
                <th><p className="DefaultLabel" >{`id`}</p></th>
                <th><p className="DefaultLabel" >{`name`}</p></th>
                <th><p className="DefaultLabel" >{`desc`}</p></th>
                <th><p className="DefaultLabel" >{`available`}</p></th>
                <th><p className="DefaultLabel" >{`ingredients`}</p></th>
                <th><p className="DefaultLabel" >{`add`}</p></th>
                <th><p className="DefaultLabel" >{`price`}</p></th>
                <th><p className="DefaultLabel" >{`confirm`}</p></th>
            </tr>
            {this.state.templates.reverse().map(pizza => this.pizzaItem(pizza))}
            {this.props.pizzas.map(pizza => this.pizzaItem(pizza))}
        </table>
    }

    pizzaItem(pizza) {
        return <tr>
            <td><p className="DefaultLabel" >{`#${pizza.id}`}</p></td>

            <td><input
                className="InputField"
                defaultValue={pizza.name}
                style={{width: '100px'}}
                onChange={e => {pizza.name = e.target.value;}}
            /></td>

            <td><input
                className="InputField"
                defaultValue={pizza.desc}
                style={{width: '300px'}}
                onChange={e => {pizza.desc = e.target.value;}}
            /></td>

            <td><input
                className="InputField"
                defaultChecked={pizza.available}
                type="checkbox"
                onChange={e => {pizza.available = e.target.checked;}}
            /></td>

            <td>
                {
                    pizza.ingredients.map(ingredient => <button
                        className="Button Ingredient"
                        onClick={() => pizza.ingredients.splice(pizza.ingredients.indexOf(ingredient), 1)}
                    >{ingredient.name}</button>)
                }
            </td>

            <td><select
                className="InputField"
                defaultValue='select'
                onChange={e => {this.addIngredient(pizza, e.target.value)}}
            >
                <option value={0}>select</option>
                {Object.values(this.props.ingredientMap)
                    .filter(ingredient => !pizza.ingredients.includes(ingredient))
                    .map(ingredient => <option value={ingredient.id}>{ingredient.name}</option>)}
            </select></td>

            <td><input
                className="InputField"
                defaultValue={pizza.price}
                style={{width: '30px'}}
                onChange={e => {pizza.price = e.target.value;}}
            /></td>

            <td><button
                className="Button"
                onClick={pizza.id == '?'? () => this.create(pizza) : () => this.update(pizza)}
            >{pizza.id == '?'? 'create' : 'update'}</button></td>
        </tr>
    }

    addIngredient(pizza, ingredientId) {
        if (!ingredientId) return;
        pizza.ingredients.push(this.props.ingredientMap[ingredientId])
    }
}

export default PizzaDesigner;