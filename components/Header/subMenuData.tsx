import { SubMenu } from '@/types/menu'

const menuData: SubMenu[] = [
  {
    id: 1,
    title: 'Dashboard',
    path: '/feats/depin',
    fatherPath: '/feats/depin',
    newTab: false,
    onClick: (e) => {
      e.preventDefault()
      const section = document.getElementById('features')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    },
  },
  {
    id: 2,
    title: 'Builder',
    path: '/feats/depin/builder',
    fatherPath: '/feats/depin',
    newTab: false,
  },
  {
    id: 1,
    title: 'Assets',
    path: '/feats/real-state',
    fatherPath: '/feats/real-state',
    newTab: false,
    onClick: (e) => {
      e.preventDefault()
      const section = document.getElementById('features')
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' })
      }
    },
  },
]
export default menuData
