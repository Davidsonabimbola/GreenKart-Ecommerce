const { expect } = require("@playwright/test")
const multiOrders =(page)=> ({  
    
async goToLoginPage (){
    await page.goto("https://rahulshettyacademy.com/seleniumPractise/#/");
},

async makeOrders(items,products,Price_total)
{
    for (const item of items) {
        const productCount = await products.count();
        for (let i = 0; i < productCount; i++) {
            const orderInfo = products.nth(i);        
            const productDetails = await orderInfo.locator('h4[class="product-name"]').textContent()
            const nameOfProduct = productDetails.split('-')[0].trim();

            if (nameOfProduct.includes(item)) {
                const buttonSection = await orderInfo.locator('[class="product-action"]');
                const button = buttonSection.locator('button').first();
                await button.click();
                const product_Price = orderInfo.locator('[class="product-price"]').textContent()           
           Price_total.push( await product_Price)
           Price_total = Price_total.map(value=>parseInt(value))
               
                  console.log(`Price Total:- ${Price_total}`)
                  //using reducer function
               const finalPrice =  Price_total.reduce((accumulator,currentValue)=>{
                    return accumulator + currentValue;
                }, 0)
                console.log(finalPrice)              
                 break;
                
            }
        }
        
    }
},

async cartCount(items){
    const summary = page.locator('[class="cart-count"]').textContent()
    console.log(await summary)
    console.log(`Product count: ${items.length}`)
     expect(await page.locator('[class="cart-count"]').textContent())=== items.length
},

async totalAmount(Price_total){
    const cart = page.locator('[class="cart-info"]')
    const cartDetails = cart.locator('tr').nth(1)
    const cartInfo = cartDetails.locator('td').nth(2)
     const cartAmount = await (cartInfo.textContent())
     console.log(`Cart Amount is: ${cartAmount}`)
     expect(cartAmount)=== (Price_total)
},

async checkOut (){
    const icon =  page.locator('[class="cart-icon"]')
      await icon.getByAltText('Cart').click()
       const checkout =  page.locator('[class="action-block"]')
      const checkoutButton = checkout.getByRole("button",{name: 'PROCEED TO CHECKOUT'})
      const cart_items = page.locator('[class="cart-items"]')
       expect(cart_items).toBeTruthy()
      await page.waitForLoadState()
      await checkoutButton.click()
      await page.waitForLoadState()
       await page.locator('[class="products-wrapper"]').waitFor()
      await page.locator('[class="promoBtn"]').click()
},

async placeOrder(){
    const table1 = await page.locator('[class="products"] tbody')
    const table_item1 = await table1.locator('tr').nth(0)
    const table_itemName1 = await table_item1.locator('[class="product-name"]')
    const table_itemContent1 = await table_itemName1.textContent()
    console.log(table_itemContent1)
    const place_Order = page.locator('div [style="text-align: right; width: 100%; margin-top: 20px; margin-right: 10px;"]')
    await place_Order.getByRole('button', {name: 'Place Order'}).click()
},

async completeOrder(Selected_Country){
    const countryList = page.locator('div [style="width: 360px; margin: 10px auto;"]')
    const dropDown = countryList.locator('select')
    dropDown.isDisabled = false
    await dropDown.selectOption(Selected_Country)
    await page.locator('[class="chkAgree"]').click()
    const wrapper = page.locator('[class="wrapperTwo"]')
    await wrapper.getByRole('button',{name: 'Proceed'}).click()
    //       await page.emulateMedia({ media: 'screen' });
// await page.pdf({ path: 'page.pdf' });
}

})
module.exports = multiOrders