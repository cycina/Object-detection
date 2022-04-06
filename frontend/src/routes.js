import React from 'react'

const Home = React.lazy(() => import('./views/home/home'))
const Results = React.lazy(() => import('./views/results/results'))
const Test = React.lazy(() => import('./views/test/test'))
const Orders = React.lazy(() => import('./views/orders/orders'))
const Settings = React.lazy(() => import('./views/settings/settings'))
const Products = React.lazy(() => import('./views/products/products'))
const ResultOverview = React.lazy(() => import('./views/results/resultOverview'))

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/home', name: 'Home', component: Home },
  { path: '/results', name: 'Results', component: Results },
  { path: '/test', name: 'Test', component: Test },
  { path: '/orders', name: 'Orders', component: Orders },
  { path: '/products', name: 'Products', component: Products },
  { path: '/settings', name: 'Settings', component: Settings },
  { path: '/result', name: 'ResultsOverview', component: ResultOverview },

]

export default routes
