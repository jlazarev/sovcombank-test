const menuItems = document.querySelectorAll('.js-item')
const menuBtn = document.querySelector('.header__menu-btn')
const menuWrapper = document.querySelector('.header__menu')
const menu = menuWrapper.querySelector('.header__menu-list')

let menuParents = []
let mobileTouchHandler = new WeakMap()
let desktopTouchHandler = new WeakMap()

widthCheck()
window.addEventListener('resize', () => {
  menu.style.transition = 'none'
  widthCheck()
  setTimeout(()=> {
    menu.removeAttribute('style')
  }, 10)
})

function widthCheck () {
  if (document.documentElement.clientWidth >= 769) {
    removeAllLogic()

    // touchscreen on desktop
    menuItems.forEach((menuItem) => {
      desktopTouchHandler.set(menuItem, desktopTouchMenuItem.bind(null, menuItem))

      menuItem.addEventListener('touchstart', desktopTouchHandler.get(menuItem)) 
    })

    document.addEventListener('touchstart', touchOverlay)
  } else {
    removeAllLogic()

    // vertical menu 
    menuBtn.addEventListener('touchstart', toggleMenu)
    menuWrapper.addEventListener('touchstart', touchMenuOverlay)
    menu.addEventListener('touchstart', (e) => {
      e.stopPropagation()
    })

    // accordions
    menuItems.forEach((menuItem) => {
      const menuLink = menuItem.querySelector('.js-link')

      mobileTouchHandler.set(menuItem, mobileTouchMenuItem.bind(null, menuItem))

      menuLink.addEventListener('touchstart', mobileTouchHandler.get(menuItem)) 
    })
  }
}

function removeAllLogic () {
  // remove logic for desktop
  menuItems.forEach((menuItem) => {
    if (desktopTouchHandler) {
      menuItem.removeEventListener('touchstart', desktopTouchHandler.get(menuItem)) 
      desktopTouchHandler.delete(menuItem)
    }
  })
  
  touchOverlay()
  document.removeEventListener('touchstart', touchOverlay)

  // remove logic for mobile/tablet
  touchMenuOverlay()
  const subMenus = document.querySelectorAll('.js-sub-menu')
  subMenus.forEach(subMenu => subMenu.removeAttribute('style'))

  menuItems.forEach((menuItem) => {
    const menuLink = menuItem.querySelector('.js-link')

    menuLink.removeEventListener('touchstart', mobileTouchHandler.get(menuItem))
    mobileTouchHandler.delete(menuItem)
  })
}

function touchMenuOverlay () {
  menuWrapper.classList.remove('open-menu')
  const innerSubItemMenus = document.querySelectorAll('.js-item')
  innerSubItemMenus.forEach((innerSubItemMenu) => {
    innerSubItemMenu.querySelector('.js-link').classList.remove('active-link')
    innerSubItemMenu.querySelector('.js-sub-menu').style.maxHeight = '0'
  })
}

function toggleMenu () {
  if (menuWrapper.classList.contains('open-menu')) {
    touchMenuOverlay()
  } else {
    menuWrapper.classList.add('open-menu')
  }
}

function desktopTouchMenuItem (menuItem, e) {
  e.preventDefault()
  e.stopPropagation()

  const closeMenus = menuItem.parentElement.querySelectorAll('.js-item')
  closeMenus.forEach((closeMenu) => {
    closeMenu.classList.remove('open')
  })

  menuItem.classList.add('open')
}

function mobileTouchMenuItem (menuItem, e) {
  e.preventDefault()
  const menuLink = menuItem.querySelector('.js-link')
  const subMenu = menuItem.querySelector('.js-sub-menu')

  menuParents = []
  searchMenuParents(menuItem)

  menuLink.classList.toggle('active-link')

  const scrollHeightSubMenu = subMenu.scrollHeight

  if (menuLink.classList.contains('active-link')) {
    subMenu.style.maxHeight = scrollHeightSubMenu + 'px'
    menuParents.forEach((menuParent) => {
      menuParent.style.maxHeight = (menuParent.scrollHeight + scrollHeightSubMenu) + 'px'
    })
  } else {
    menuParents.reverse().forEach((menuParent) => {
        menuParent.style.maxHeight = (menuParent.scrollHeight - scrollHeightSubMenu) + 'px'
    })
    const innerSubItemMenus = menuItem.querySelectorAll('.js-item')
    innerSubItemMenus.forEach((innerSubItemMenu) => {
      innerSubItemMenu.querySelector('.js-link').classList.remove('active-link')
      innerSubItemMenu.querySelector('.js-sub-menu').style.maxHeight = '0'
    })

    subMenu.style.maxHeight = '0'
  }
}

function touchOverlay () {
  menuItems.forEach((items) => {
    items.classList.remove('open')
  })
}

function searchMenuParents (item) {
  const menuParent = item.parentElement.closest('.js-sub-menu')

  if (menuParent) {
    menuParents.push(menuParent)

    searchMenuParents(menuParent)
  }
}