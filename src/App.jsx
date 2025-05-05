import { useState, useEffect } from 'react'
import Guitar from "./components/Guitar"
import Header from "./components/Header"
import Footer  from './components/Footer'
import { db } from './data/db'

function App() {

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

  return (
    <>
      <Header
        cart={cart}
        removeFromCart={removeFromCart}
        changeQuantity={changeQuantity}
        cleanCart={cleanCart}
      />

      <main className="container-xl mt-5">
          <h2 className="text-center">Nuestra Colección</h2>

          <div className="row mt-5">
            {data.map((guitar) => (
                <Guitar
                    key={guitar.id} 
                    guitar={guitar}
                    setCart={setCart}
                    addToCart={addToCart}
                />
            ))}
          </div>
      </main>

      <Footer />
    </>
  )
}

export default App
