import React from 'react';
import PizzaInfo from "./PizzaInfo";

const Shop = (pizzas) => {

    return <div>
        {pizzas?.map(pizza => PizzaInfo({pizza}))}
    </div>
}

export default Shop;