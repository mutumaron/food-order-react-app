import Modal from "../UI/Modal";
import classes from "./Cart.module.css"
import React,{useContext,useState} from "react";
import CartContext from "../../store/cart-context";
import CartItem from "./CartItem";
import CheckOut from "./CheckOut";


const Cart = (props) => {

    const [isSubmitting,setIsSubmitting] = useState(false);
    const [didSubmit,setDidSubmit] = useState(false);


    const cartCtx =useContext(CartContext);
    const [isCheckout,setCheckout] = useState(false);

    const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`
    const hasItems = cartCtx.items.length > 0;
    const cartItemRemoveHandler = (id) => {
        cartCtx.removeItem(id)

    };
    const cartItemAddHandler = (item) => {
        cartCtx.addItem(item);
    };

    const cartItems = (
        <ul className={classes['cart-items']}>
            {cartCtx.items.map((item) => (
                <CartItem 
                key ={item.id}
                name={item.name}
                amount = {item.amount} 
                price = {item.price} 
                onRemove={cartItemRemoveHandler.bind(null,item.id)} 
                onAdd = {cartItemAddHandler.bind(null,item)}/>
            ))}
        </ul>
    );
    const orderHandler = () => {
        setCheckout(true)
    };
    const submitOrderHandler = async (userData) => {
        setIsSubmitting(true);
        await fetch('https://http-react-88e4f-default-rtdb.firebaseio.com/orders.json',{
            method:'POST',
            body:JSON.stringify({
                user:userData,
                orderedItems:cartCtx.items
            })
        });
        setIsSubmitting(false);
        setDidSubmit(true);
        cartCtx.clearCart()
    };     
    const modalActions =<div className={classes.actions}>
                            <button className={classes['button--alt']} onClick={props.onClose}>Close</button>
                            {hasItems && <button className={classes.button} onClick={orderHandler}>Order</button>}
                        </div>

    const cartModalContent = (<React.Fragment>
               {cartItems}
            <div className={classes.total}>
                <span>Total Amount</span>
                <span>{totalAmount}</span>
            </div>
            {isCheckout && <CheckOut onCancel={props.onClose} onConfirm = {submitOrderHandler}/>}
            {!isCheckout && modalActions}
    </React.Fragment> );
    const isSubmittingModalContent = <p>Sending order.Please wait...</p>;
    const didSubmitModalContent =(<React.Fragment>
         <p>Successfully sent your order!</p>
         <div className={classes.actions}>
            <button className={classes.button} onClick={props.onClose}>Close</button>
         </div>
    </React.Fragment>);

   

    return(
        <Modal onClose = {props.onClose}>
        {!isSubmitting && !didSubmit && cartModalContent}
        {isSubmitting && isSubmittingModalContent}
        {!isSubmitting && didSubmit && didSubmitModalContent}

        </Modal>
      
        
    );
};

export default Cart;