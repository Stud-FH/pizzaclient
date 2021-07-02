import React from 'react';
import {API} from '../../api/API';
import decrementIcon from "../../img/icons/decrement.png";
import incrementIcon from "../../img/icons/increment.png";

class IngredientDesigner extends React.Component {
    constructor(param) {
        super(param);
        this.state = {
            templates: [this.templateIngredient()],
        }
    }

    templateIngredient() {
        let template = {};
        template.id = '?';
        template.name = null;
        template.desc = null;
        template.available = true;
        return template;
    }

    async createIngredient(entity) {
        try {
            entity.id = null;
            let headers = {
                accountId: this.props.account.id,
                token: this.props.account.token,
            }
            const response = await API.post('ingredients/create', JSON.stringify(entity), {headers: headers});
            console.log(response);
            entity.id = response.data.id;
            window.location.reload();
            return response.data;
        } catch (error) {
            console.log(error)
            alert(`Something went wrong creating the ingredient: \n
            ${error.message}\n
            ${error.response?.data.message}
            `);
        }
    }

    async updateIngredient(updateEntity) {
        try {
            let headers = {
                accountId: this.props.account.id,
                token: this.props.account.token,
                ingredientId: updateEntity.id,
            }
            const response = await API.put('ingredients/update', JSON.stringify(updateEntity), {headers: headers});
            console.log(response);
            return response.data;
        } catch (error) {
            console.log(error)
            alert(`Something went wrong updating the ingredient: \n
            ${error.message}\n
            ${error.response?.data.message}
            `);
        }
    }

    render() {
        if (!this.props.ingredients) return null;

        return <table>
            <tr>
                <th><p className="DefaultLabel" >{`id`}</p></th>
                <th><p className="DefaultLabel" >{`name`}</p></th>
                <th><p className="DefaultLabel" >{`desc`}</p></th>
                <th><p className="DefaultLabel" >{`available`}</p></th>
                <th><p className="DefaultLabel" >{`confirm`}</p></th>
            </tr>
            {this.state.templates.reverse().map(ingredient => this.ingredientItem(ingredient))}
            {this.props.ingredients.map(ingredient => this.ingredientItem(ingredient))}
        </table>
    }

    ingredientItem(ingredient) {
        return <tr>
            <td><p className="DefaultLabel" >{`#${ingredient.id}`}</p></td>

            <td><input
                className="InputField"
                defaultValue={ingredient.name}
                style={{width: '100px'}}
                onChange={e => {ingredient.name = e.target.value;}}
            /></td>

            <td><input
                className="InputField"
                defaultValue={ingredient.desc}
                style={{width: '300px'}}
                onChange={e => {ingredient.desc = e.target.value;}}
            /></td>

            <td><input
                className="InputField"
                defaultChecked={ingredient.available}
                type="checkbox"
                onChange={e => {ingredient.available = e.target.checked;}}
            /></td>

            <td><button
                className="Button"
                onClick={ingredient.id == '?'? () => this.createIngredient(ingredient) : () => this.updateIngredient(ingredient)}
            >{ingredient.id == '?'? 'create' : 'update'}</button></td>
        </tr>
    }
}

export default IngredientDesigner;