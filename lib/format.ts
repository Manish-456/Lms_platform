export const formatPrice = (price : number) => {
    return new Intl.NumberFormat('en-us', {
        currency : 'USD',
        style: 'currency'
    }).format(price)
}