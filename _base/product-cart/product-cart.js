/**
 * Карточка товара
 *
 * @author Yuriy Zhdanov <yuriy.zhdanov@gmail.com>
 *
 */
window.bem.product_cart = function(el, data) {

if (!data.hasOwnProperty('action')) {
  return false;
}

const eventsOff = (old_element) => {
  const new_element = old_element.cloneNode(true);
  old_element.parentNode.replaceChild(new_element, old_element);
  return new_element;
};

const elModal = document.querySelector('.product-cart');
const elOverlay = document.querySelector('.product-cart__overlay');

switch (data.action) {
  /* отобразить карточку */
  case 'show':
    const elItem = el.parentElement.parentElement;
    const dataBem = JSON.parse(elItem.getAttribute('data-bem'));
    const countValue = elModal.querySelector('.product-cart__count-value');
    const countWeightUnit = elModal.querySelector('.product-cart__count-weight');

    elModal.querySelector('.product-cart__image').src = dataBem.image;
    elModal.querySelector('.product-cart__title').innerHTML = dataBem.title;
    elModal.querySelector('.product-cart__desc').innerHTML = dataBem.description;
    elModal.querySelector('.product-cart__price').innerHTML = '<span class="product-cart__price-num">' + parseFloat(parseFloat(parseFloat(dataBem.price_num) * parseFloat(dataBem.weight)).toFixed(1)) + '</span>' + "\n";
    elModal.querySelector('.product-cart__price').innerHTML += '<span>' + dataBem.price_curr + '</span>';

    /* количество */
    countValue.innerHTML = dataBem.weight;
    countWeightUnit.innerHTML = dataBem.weight_unit;

    let elPlus = elModal.querySelector('.product-cart__count-plus');
    elPlus = eventsOff(elPlus);
    elPlus.addEventListener('click', (e) => {
      countValue.innerHTML = parseInt(countValue.innerHTML) + parseFloat(dataBem.weight);

      let sum = parseFloat(parseFloat(parseFloat(dataBem.price_num) * parseFloat(countValue.innerHTML)).toFixed(1));

      const optionList = document.querySelectorAll('.product-cart__option-item-area');
      if (optionList.length && !(optionList[0].offsetParent === null)) {
        sum += parseFloat(parseFloat(parseFloat(countValue.innerHTML) * parseFloat(dataBem.weight)).toFixed(1));
      }

      elModal.querySelector('.product-cart__price-num').innerHTML = sum;
    });

    let elMinus = elModal.querySelector('.product-cart__count-minus');
    elMinus = eventsOff(elMinus);
    elMinus.addEventListener('click', (e) => {
      if (parseInt(countValue.innerHTML) > parseFloat(dataBem.weight)) {
        countValue.innerHTML = parseInt(countValue.innerHTML) - parseFloat(dataBem.weight);

        let sum = parseFloat(parseFloat(parseFloat(dataBem.price_num) * parseFloat(countValue.innerHTML)).toFixed(1));

        const optionList = document.querySelectorAll('.product-cart__option-item-area');
        if (optionList.length && !(optionList[0].offsetParent === null)) {
          sum += parseFloat(parseFloat(parseFloat(countValue.innerHTML) * parseFloat(dataBem.weight)).toFixed(1));
        }

        elModal.querySelector('.product-cart__price-num').innerHTML = sum;
      }
    });

    /* краситель */
    if (dataBem.hasOwnProperty('options') && dataBem.options.length) {
      elModal.querySelector('.product-cart__option').style.display = 'block';

      let options = dataBem.options[0].product_option_value;

      options.sort((a, b) => a.product_option_value_id.localeCompare(b.product_option_value_id));

      const area = elModal.querySelector('.product-cart__option-items');

      area.innerHTML = `<span class="product-cart__option-item-area product-cart__option-item-active">
      <img class="product-cart__option-item" src="/image/catalog/krasitel/default.png" />
      <img class="product-cart__option-item-on" src="/image/catalog/krasitel/default_on.png" />
      </span>`;

      options.forEach((o)=>{
        const imageOn = o.image.substring(0, o.image.length-4) + '_on.png';

        area.innerHTML += `<span class="product-cart__option-item-area" data-option_id="${dataBem.options[0].product_option_id}" data-value="${o.product_option_value_id}">
        <img class="product-cart__option-item" src="/image/${o.image}" alt="${o.name}" title="${o.name}" />
        <img class="product-cart__option-item-on" src="/image/${imageOn}" alt="${o.name}" title="${o.name}" />
        </span>`;
      });

      area.querySelectorAll('.product-cart__option-item').forEach(o=>{
        o = eventsOff(o);
        o.addEventListener('click', (e) => {
          area.querySelectorAll('.product-cart__option-item').forEach(oi=>{
            if (e.target.src === oi.src) {
              oi.parentElement.classList.add('product-cart__option-item-active');
            } else {
              oi.parentElement.classList.remove('product-cart__option-item-active');
            }
          });

          const optionList = document.querySelectorAll('.product-cart__option-item-area');
          if (optionList.length && !optionList[0].classList.contains('product-cart__option-item-active')) {
            let sum = (parseFloat(dataBem.price_num) * parseFloat(countValue.innerHTML));
            sum += parseFloat(countValue.innerHTML) * 1;
            elModal.querySelector('.product-cart__price-num').innerHTML = sum;
          } else if (optionList.length) {
            let sum = (parseFloat(dataBem.price_num) * parseFloat(countValue.innerHTML));
            elModal.querySelector('.product-cart__price-num').innerHTML = sum;
          }

        });
      });
    } else {
      elModal.querySelector('.product-cart__option').style.display = 'none';
    }

    /* в корзину */
    let toCartButton = elModal.querySelector('.product-cart__incart');
    toCartButton = eventsOff(toCartButton);
    toCartButton.addEventListener('click', (e) => {
      let optionId = '';
      let optionValue = '';
      const activeOption = elModal.querySelector('.product-cart__option-item-active');
      if (activeOption) {
        optionId = activeOption.getAttribute('data-option_id');
        optionValue = activeOption.getAttribute('data-value');
      }
      window.bem.cart(null, {
        'action': 'add',
        'product_id': dataBem.product_id,
        'quantity': parseInt(countValue.innerHTML),
        'price_sum': elModal.querySelector('.product-cart__price-num').innerHTML,
        'option_id': optionId,
        'option_value': optionValue
      });
      elModal.style.display = 'none';
      elOverlay.style.display = 'none';
    });

    /* отобразить модальное окно */
    elModal.style.display = 'block';
    elOverlay.style.display = 'block';
  break;

  /* закрыть карточку */
  case 'close':
    elModal.style.display = 'none';
    elOverlay.style.display = 'none';
  break;
}

}
