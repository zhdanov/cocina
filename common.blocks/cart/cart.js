/**
 * Корзина
 *
 * @author Yuriy Zhdanov <yuriy.zhdanov@gmail.com>
 *
 * @example window.bem.cart(null, {action: 'add', 'product_id': 50});
 */
window.bem.cart = function(el, data) {

if (!data.hasOwnProperty('action')) {
  return false;
}

const cartCount = document.querySelector('.cart__count');
const currNum = document.querySelector('.cart__currency-num');

switch (data.action) {
  /* добавить в корзину */
  case 'add':

    let hData = {};

    let quantity = 1;
    if (data.hasOwnProperty('quantity')) {
      quantity = parseInt(data.quantity);
    }

    hData = {
      'product_id': data.product_id,
      'quantity': quantity,
    };

    if (data.hasOwnProperty('option_id') && data.hasOwnProperty('option_value')) {
      if (data.option_id !== null && data.option_value !== null) {
        hData['option'] = {
          [data.option_id]: data.option_value
        };
      }
    }

    jQuery.ajax({
      url: '/index.php?route=checkout/cart/add',
      data: {h_data: JSON.stringify(hData)},
      cache: false,
      type: 'POST',
      success: function(data) {
        cartCount.innerHTML = parseInt(cartCount.innerHTML) + 1;

        if (data.hasOwnProperty('price_sum')) {
          currNum.innerHTML = parseFloat(data.price_sum);
        }
      }
    });


  break;

  /* обновить количество в корзине */
  case 'update_quantity':

    const itemCount = el.parentNode.parentNode;
    const dataName = itemCount.querySelector('.cart__list-item-count-value').getAttribute('data-name');
    const dataMinimum = parseInt(itemCount.getAttribute('data-minimum'));

    const cartList = document.querySelectorAll('.cart__list-item-count-value');

    const formDataQuantity = new FormData();

    itemCount.style.opacity = '0.5';

    let quantityTotal = 0;

    cartList.forEach((elItem)=>{
      let value = parseInt(elItem.innerText.trim());
      if (dataName == elItem.getAttribute('data-name')) {
        if (el.classList.contains('cart__list-item-count-plus')) {
          value += dataMinimum;
        } else if (el.classList.contains('cart__list-item-count-minus')) {
          if (value > dataMinimum) {
            value -= dataMinimum;
          }
        }
      }
      quantityTotal += value;
      formDataQuantity.append(elItem.getAttribute('data-name').trim(), value);
    });


    jQuery.ajax({
      url: '/index.php?route=checkout/cart/edit',
      data: formDataQuantity,
      cache: false,
      contentType: false,
      processData: false,
      method: 'POST',
      type: 'POST',
      success: function(data) {
        var parser = new DOMParser();
        var doc = parser.parseFromString(data, 'text/html');

        currNum.innerHTML = doc.querySelector('.cart__total').innerText.replace(/[^0-9\.]+/g, "");

        const oldElement = document.querySelector('.cart__list');
        const newElement = doc.querySelector('.cart__list');
        oldElement.parentNode.replaceChild(newElement, oldElement);
      }
    });

  break;
}


}
