/**
 * Форма заказа
 *
 * @author Yuriy Zhdanov <yuriy.zhdanov@gmail.com>
 *
 */
window.bem.order = function(el, data) {

if (!data.hasOwnProperty('action')) {
  return false;
}

switch (data.action) {
  /* сменить доставку */
  case 'change_delivery':
    if (el.classList.contains('order__delivery-title')) {
      el.classList.remove('order__delivery-gray');
      document.querySelector('.order__delivery-radio').checked = true;
      document.querySelector('.order_delivery-area').style.display = 'block';
      document.querySelector('.order__notice').style.display = 'block';

      document.querySelector('.order__delivery-pickup-title').classList.add('order__delivery-gray');
      document.querySelector('.order__delivery-pickup-radio').checked = false;
      document.querySelector('.order_delivery-pickup-area').style.display = 'none';

    } else if (el.classList.contains('order__delivery-pickup-title')) {
      el.classList.remove('order__delivery-gray');
      document.querySelector('.order__delivery-pickup-radio').checked = true;
      document.querySelector('.order_delivery-pickup-area').style.display = 'block';

      document.querySelector('.order__delivery-title').classList.add('order__delivery-gray');
      document.querySelector('.order__delivery-radio').checked = false;
      document.querySelector('.order_delivery-area').style.display = 'none';
      document.querySelector('.order__notice').style.display = 'none';
    }

  break;

  /* оформить заказ */
  case 'do':
    let hasErrors = false;

    let delivery = document.querySelector('.order__delivery').value;

    if (document.querySelector('.order__delivery-pickup-title').classList.contains('order__delivery-gray') === false) {
      delivery = 'pickup.pickup';
    }

    let fieldList = [
      'order__name',
      'order__phone',
    ];

    if (document.querySelector('.order__delivery-title').classList.contains('order__delivery-gray') === false) {
      fieldList = fieldList.concat([
        'order__house',
        'order__flat'
      ]);

      ['order__city', 'order__street', 'order__province'].forEach(f=>{
        const field = document.querySelector('.' + f);
        if (field.value.trim().length < 3) {
          hasErrors = true;
          field.classList.add('order__field-error');
          field.addEventListener('focus', e => {
            e.target.classList.remove('order__field-error');
            document.querySelector('.order__error').style.display = 'none';
          });
        }
      });
    }

    fieldList.forEach((fieldName) => {
      const field = document.querySelector('.' + fieldName);
      if (field.value.trim() === '') {
        hasErrors = true;
        field.classList.add('order__field-error');
        field.addEventListener('focus', e => {
          e.target.classList.remove('order__field-error');
          document.querySelector('.order__error').style.display = 'none';
        });
      }
    });

    const fieldPhone = document.querySelector('.order__phone');
    const cleanPhone = fieldPhone.value.replace(/[^0-9]+/g, "");
    if (cleanPhone.length < 4 || cleanPhone.length > 32) {
      hasErrors = true;
      fieldPhone.classList.add('order__field-error');
      fieldPhone.addEventListener('focus', e => {
        e.target.classList.remove('order__field-error');
      });
    }

    const fieldEmail = document.querySelector('.order__email');
    let emailValue = fieldEmail.value.trim();
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (emailValue === '') {
      emailValue = 'kulturno@ya.ru'
    } else if (!re.test(String(fieldEmail.value).toLowerCase())) {
      hasErrors = true;
      fieldEmail.classList.add('order__field-error');
      fieldEmail.addEventListener('focus', e => {
        e.target.classList.remove('order__field-error');
      });
    }

    if (hasErrors) {
      document.querySelector('.order__error').style.display = 'inline';
      return false;
    } else {
      document.querySelector('.order__error').style.display = 'none';
    }

    const opacity = '0.5';
    if (document.querySelector('.order__do').style.opacity === opacity) {
      return false;
    } else {
      document.querySelector('.order__do').style.opacity = opacity;
    }

    fetch('/index.php?route=checkout/guest')
    .then(response=>response.text())
    .then(html=>{
      fetch('/index.php?route=checkout/checkout/customfield&customer_group_id=1')
      .then(response=>response.text())
      .then(html=>{
        fetch('/index.php?route=checkout/checkout/country&country_id=195')
        .then(response=>response.text())
        .then(html=>{
          let formData = new FormData();
          formData.append('customer_group_id', '1');
          formData.append('firstname', document.querySelector('.order__name').value);
          formData.append('lastname', '.');
          formData.append('email', emailValue);
          formData.append('telephone', cleanPhone);
          formData.append('custom_field[address][1]', 'гетеро');
          formData.append('company', '');
          formData.append('address_1', delivery == 'pickup.pickup' ? '---' : document.querySelector('.order__house').value + ' ' + document.querySelector('.order__street').value);
          formData.append('address_2', delivery == 'pickup.pickup' ? '---' : document.querySelector('.order__flat').value);
          formData.append('city', delivery == 'pickup.pickup' ? '---' : document.querySelector('.order__city').value + ' (' + document.querySelector('.order__province').value + ')');
          formData.append('postcode', '');
          formData.append('country_id', '195');
          formData.append('zone_id', '3001');
          formData.append('shipping_address', '1');
          fetch('/index.php?route=checkout/guest/save', {
            method: 'POST',
            body: formData
          })
          .then(response=>response.text())
          .then(html=>{
            fetch('/index.php?route=checkout/shipping_method')
            .then(response=>response.text())
            .then(html=>{
              fetch('/index.php?route=checkout/guest_shipping')
              .then(response=>response.text())
              .then(html=>{
                fetch('/index.php?route=checkout/checkout/country&country_id=195')
                .then(response=>response.text())
                .then(html=>{
                  let formData = new FormData();
                  formData.append('shipping_method', delivery);
                  formData.append('comment', '');

                  fetch('/index.php?route=checkout/shipping_method/save', {
                    method: 'POST',
                    body: formData
                  })
                  .then(response=>response.text())
                  .then(html=>{
                    fetch('/index.php?route=checkout/payment_method')
                    .then(response=>response.text())
                    .then(html=>{
                      let formData = new FormData();
                      formData.append('payment_method', 'cod');
                      formData.append('comment', document.querySelector('.order__comment').value);
                      formData.append('agree', '1');

                      fetch('/index.php?route=checkout/payment_method/save', {
                        method: 'POST',
                        body: formData
                      })
                      .then(response=>response.text())
                      .then(html=>{
                        fetch('/index.php?route=checkout/confirm')
                        .then(response=>response.text())
                        .then(html=>{
                          fetch('/index.php?route=extension/payment/cod/confirm')
                          .then(response=>response.text())
                          .then(html=>{
                            fetch('/index.php?route=checkout/success')
                            .then(response=>response.text())
                            .then(html=>{
                              document.querySelector('.order__do').style.opacity = 1;

                              window.bem.order_modal(null, {"action": "show"});
                            });
                          })
                        });
                      });
                    });
                  })
                });
              });
            });
          });
        })
      });
    });
  break;
}

}
