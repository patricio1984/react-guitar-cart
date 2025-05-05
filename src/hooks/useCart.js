import { useState, useEffect, useMemo } from 'react'
import { db } from '../data/db'

const useCart = () => {
  const initialCart = () => {
    const localStorageCart = localStorage.getItem('cart')

    return localStorageCart ? JSON.parse(localStorageCart) : []
  }
  
  const [data] = useState(db)
  const [cart, setCart] = useState(initialCart)

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart))
  }, [cart])
  
  const addToCart = (item) => {
    const itemExists = cart.findIndex(guitar => guitar.id === item.id)
  
    if (itemExists >= 0) {
      const updatedCart = [...cart]
      const currentQuantity = updatedCart[itemExists].quantity
  
      if (currentQuantity < item.stock) {
        updatedCart[itemExists].quantity++
        setCart(updatedCart)
      }
    } else {
      setCart([...cart, { ...item, quantity: 1 }])
    }
  }

  const removeFromCart = (id) => {
    setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
  }

  const changeQuantity = (id, up) => {
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === id
          ? {
              ...item,
              quantity: up
                ? Math.min(item.quantity + 1, item.stock)
                : Math.max(item.quantity - 1, 1),       
            }
          : item
      )
    )
  }

  const cleanCart = () => {
    setCart([])
  }

  const isEmpty = useMemo(() => cart.length === 0, [cart])
  const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart])
  const totalItems = useMemo(() => cart.reduce((total, item) => total + item.quantity, 0), [cart])
    
  return {
    data,
    cart,
    addToCart,
    removeFromCart,
    changeQuantity,
    cleanCart,
    isEmpty,
    cartTotal,
    totalItems
  }
}

export default useCart