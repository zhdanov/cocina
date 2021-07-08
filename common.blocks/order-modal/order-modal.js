/**
 * Модальное окно офоромленного заказа
 *
 * @author Yuriy Zhdanov <yuriy.zhdanov@gmail.com>
 *
 */
window.bem.order_modal = function(el, data) {

if (!data.hasOwnProperty('action')) {
  return false;
}

const elModal = document.querySelector('.order-modal');
const elOverlay = document.querySelector('.order-modal__overlay');

switch (data.action) {
  /* отобразить */
  case 'show':

    const productList = document.querySelector('.order-modal__product-list');

    document.querySelectorAll('.cart__list-item').forEach(i=>{
      let title = i.querySelector('.cart__list-item-title').innerText.trim(); 

      let option = null;
      if (i.querySelector('.cart__list-item-option')) {
        option = i.querySelector('.cart__list-item-option').innerText.trim();
      }

      let count = i.querySelector('.cart__list-item-count-value').innerText.trim();

      let weight = i.querySelector('.cart__list-item-count-weight').innerText.trim();

      let productListItem = title;
      if (option) {
        productListItem += ', ' + option;
      }
      productListItem += ', ' + count + weight;

      productList.insertAdjacentHTML('beforeend', `<div>${productListItem}</div>`);
    });

    let sumOrder = document.querySelector('.cart__total').innerText.trim();
    productList.insertAdjacentHTML('beforeend', `<div style="margin-top: 6px;font-weight: bold;">${sumOrder}</div>`);

    document.querySelector('.order-modal__phone').innerText = document.querySelector('.order__phone').value;

    elModal.style.display = 'block';
    elOverlay.style.display = 'block';
  break;

  /* закрыть */
  case 'close':
    elModal.style.display = 'none';
    elOverlay.style.display = 'none';

    if (data.hasOwnProperty('redirect') && data.redirect) {
      window.location.href = data.redirect;
    }
  break;
}

}
