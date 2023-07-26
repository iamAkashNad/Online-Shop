const Product = require("./product.model");

class Cart {
    constructor(items = [], totalQuentity = 0, totalPrice = 0) {
        this.items = items;
        this.totalQuentity = totalQuentity;
        this.totalPrice = totalPrice;
    }
    async modifyCart() {
        let modifiedPrice = 0;
        for(let i=0 ;i<this.items.length ;i++) {
            const product = await Product.fetchProductById(this.items[i].product._id.toString(), { title: 1, price: 1 });
            if(product) {
                this.items[i].product = product;
                this.items[i].totPrice = product.price * this.items[i].totalQty;
            } else {
                this.items[i].totPrice = 0;
                this.items[i].status = "Out Of Stock";
            }
            modifiedPrice += this.items[i].totPrice;
        }
        this.totalPrice = modifiedPrice;
    }
    addToCart(product) {
        const cartItem = {
            product: product,
            totalQty: 1,
            totPrice: product.price
        };
        let isThere = false;
        for(let i=0 ;i<this.items.length ;i++) {
            const item = this.items[i];
            if(item.product._id.toString() === product._id.toString()) {
                isThere = true;
                this.items[i].totalQty++;
                this.items[i].totPrice += product.price;
                break;
            }
        }
        if(!isThere) this.items.push(cartItem);
        this.totalQuentity++;
        this.totalPrice += product.price;
    }
    updateCart(productId, newQty) {
        const cartItemIdx = this.items.findIndex(item => item.product._id.toString() === productId);
        if(cartItemIdx === -1) return;
        const oldQty = this.items[cartItemIdx].totalQty;
        if(newQty === 0) {
            this.totalQuentity -= oldQty;
            this.totalPrice -= this.items[cartItemIdx].totPrice;
            this.items.splice(cartItemIdx, 1);
            return { numberOfItems: this.items.length };
        }
        if(this.items[cartItemIdx].status) {
            return { totalQty: oldQty, outOfStock: true };
        }
        if(this.totalQuentity + newQty - oldQty > 20) 
            return { itemLimitExceed: true, totalQty: oldQty, totPrice: this.items[cartItemIdx].totPrice };
        this.totalQuentity += (newQty - oldQty);
        this.totalPrice += (this.items[cartItemIdx].product.price * newQty - this.items[cartItemIdx].totPrice);
        this.items[cartItemIdx].totalQty = newQty;
        this.items[cartItemIdx].totPrice = this.items[cartItemIdx].product.price * newQty;
        return { totalQty: newQty, totPrice: this.items[cartItemIdx].totPrice };
    }
}

module.exports = Cart;
