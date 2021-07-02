import React from 'react';
import addToCartIcon from '../../img/icons/add-to-cart.png'
import unavailableIcon from '../../img/icons/unavailable.png'
import Tooltip from "../design/Tooltip";

const PizzaInfo = ({pizza}) => {
    let rowLength = 40;
    let ingredientRows = [[]];
    if (pizza.ingredients) {
        for (let i = 0; i < pizza.ingredients.length; i++) {
            pizza.ingredients[i].label = pizza.ingredients[i].name.concat((i < pizza.ingredients.length -1)? ', ' : '');
        }
        let index = 0;
        let counter = 0;
        for (let i = 0; i < pizza.ingredients.length; i++) {
            counter += pizza.ingredients[i].label.length;
            if (counter > rowLength) {
                counter = pizza.ingredients[i].label.length;
                index++;
                ingredientRows[index] = [];
            }
            ingredientRows[index].push(pizza.ingredients[i]);
        }
    }

    return <div
        style={{
            display: 'flex',
            flexDirection:'row',
            justifyContent: 'center',
            height: '100px',
            width: 'inherit',
            padding: '10px',
        }}
    >

        <img
            src="https://m.bettybossi.ch/static/rezepte/x/bb_itku120801_0243a_x.jpg"
            style={{
                width: '100px',
                height: '100px',
                marginLeft: '30px',
                marginRight: '20px',
            }}
        />

        <div style={{display: 'flex', flexDirection:'column', width: '350px' }}>
            <Tooltip tooltip={<p className="TooltipText">{pizza.desc}</p>}>
                <p className="PizzaLabel">{pizza.name}</p>
            </Tooltip>
            <div style={{display: 'flex', flexDirection:'column', height: '100%', justifyContent: 'center', alignItems: 'stretch', width: '100%' }}>
                {ingredientRows.map(row =>
                    <div style={{display: 'flex', flexDirection:'row', justifyContent: 'initial', textAlign:'left', width: '100%' }}>
                        {row.map(ingredient =>
                            <Tooltip tooltip={<p className="TooltipText">{ingredient.desc}</p>}>
                                <p className="IngredientLabel">{ingredient.label}</p>
                            </Tooltip>
                        )}
                    </div>
                )}
            </div>
        </div>
        <div
            style={{
                display: 'flex',
                flexDirection:'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: 'inherit'
            }}
        >
            <p className="PriceLabel">{`${pizza.price}.-`}</p>
            <button className="ImageButton"
                    style={{backgroundImage:`url(${pizza.available? addToCartIcon : unavailableIcon})`}}
                    disabled={!pizza.available || !sessionStorage.getItem('account')}
                    onClick={() => {
                        let cart = JSON.parse(sessionStorage.getItem('cart'));
                        if (!cart) cart = {};
                        if (!cart[pizza.id]) cart[pizza.id] = 1
                        else cart[pizza.id]++;
                        sessionStorage.setItem('cart', JSON.stringify(cart));
                    }}
            />
        </div>
    </div>
}

export default PizzaInfo;