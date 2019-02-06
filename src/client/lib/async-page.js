import dayjs from 'dayjs'
import path from 'path'

import { SET_I18N_SLUGS } from '~/store/mutation-types'

export default async function asyncPage ({ route, store, error, app } ) {
  try {
    const data = await fetchPage({ route, i18n: app.i18n })
    store.commit(SET_I18N_SLUGS, data.page.i18nSlugs)
    return data
  } catch (e) {
    return error({
      statusCode: 404,
    })
  }
}

export function fetchPage({ route, i18n }) {
  if (process.env.NODE_ENV !== 'production') {
    return fetchPageDev({ route, i18n })
  } else {
    return fetchPageProduction({ route })
  }
}

function fetchPageProduction ({ route }) {
  const filepath = path.join('/data', route.path, 'index.json')
  if (process.client) {
    // On client load over http
    return fetch(filepath).then(res => res.json())
  } else {
    // On server load from file system
    const data = JSON.parse(require('fs').readFileSync(`src/client/static${filepath}`, 'utf8'))
    return Promise.resolve(data)
  }
}

/*
 * Fetch page data directly from graphql api
 */
function fetchPageDev ({ route, i18n }) {
  let queryPath

  const slug = route.params.slug
  const routeName = route.name.match(`.*(?=${i18n.routesNameSeparator})`)[0]
  const variables = {
    locale: i18n.locale,
    currentDate: dayjs().format('YYYY-MM-DD')
  }

  if (slug) {
    const slugRouteName = routeName.split('-slug')[0]
    queryPath = `${slugRouteName}/_slug`
    variables.slug = slug
  } else if (routeName === 'index') {
    queryPath = `${routeName}`
  } else {
    queryPath  = `${routeName}/index`
  }

  let query
  if (process.client) {
    query = require(`../pages/${queryPath}.query.graphql`)
  } else {
    query = require('fs').readFileSync(`src/client/pages/${queryPath}.query.graphql`, 'utf8')
  }

  const { doQuery } = require('./query-api')
  const addClassesToHeadings = require('./add-classes-to-headings')
  const prismifyCodeBlocks = require('./prismify-code-blocks')

  return doQuery({ query, variables })
    .then(data => {
      if (data.page && Array.isArray(data.page.items)) {
        addClassesToHeadings(data.page.items)
        prismifyCodeBlocks(data.page.items)
      }
      return data
    })
}
