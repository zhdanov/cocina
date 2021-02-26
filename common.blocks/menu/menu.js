/**
 * Меню
 *
 * @author Yuriy Zhdanov <yuriy.zhdanov@gmail.com>
 *
 */
window.bem.menu = function(el, data) {


if (!data.hasOwnProperty('action')) {
  return false;
}

const element = document.querySelector('.topbar__menu-mobile-icon');
if (!(element.offsetWidth > 0 && element.offsetHeight > 0)) {
  return false;
}


switch (data.action) {
  /* открыть/закрыть меню */
  case 'toggle':

    const elMenu = document.querySelector('.topbar__menu');

    if (elMenu.style.display === "none" || elMenu.style.display === "") {
      elMenu.style.display = "block";
    } else {
      elMenu.style.display = "none";
    }

  break;
}


}
