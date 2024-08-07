export type Menu = {
  id: number
  title: string
  path?: string
  newTab: boolean
  submenu?: Menu[]
  onClick?: any
}

export type SubMenu = {
  id: number
  title: string
  fatherPath?: string
  path?: string
  newTab: boolean
  submenu?: Menu[]
  onClick?: any
}